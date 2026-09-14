import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

// ------------------------------------------------------------------
// Instant Scan — the no-signup viral loop.
// Takes a brand + category, runs 3 buying-intent questions across
// ChatGPT and Perplexity, scores mention visibility, and generates
// a punchy "GEO Roast" verdict built for LinkedIn sharing.
// ------------------------------------------------------------------

type Engine = 'chatgpt' | 'perplexity'

interface AnswerAnalysis {
  brand_mentioned: boolean
  mention_position: number | null
  sentiment: 'positive' | 'neutral' | 'negative' | 'not_mentioned'
  competitors: string[]
}

// Naive in-memory rate limit: 5 scans per IP per hour (per server instance).
const rateBuckets = new Map<string, number[]>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) return true
  hits.push(now)
  rateBuckets.set(ip, hits)
  return false
}

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function buildQueries(brand: string, category: string): string[] {
  const c = category.toLowerCase().replace(/\.$/, '')
  return [
    `Who are the top ${c} companies?`,
    `What are the best ${c} options and why?`,
    `Recommend a good ${c} for a small business.`,
  ]
}

async function probeChatGPT(query: string): Promise<string> {
  const openai = getOpenAI()
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: query }],
    max_tokens: 400,
    temperature: 0.7,
  })
  return res.choices[0]?.message?.content || ''
}

async function probePerplexity(query: string): Promise<string> {
  if (!process.env.PERPLEXITY_API_KEY) throw new Error('PERPLEXITY_API_KEY is not set')
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: query }],
      max_tokens: 400,
    }),
  })
  if (!res.ok) throw new Error(`Perplexity API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function analyzeResponse(
  rawResponse: string,
  brand: string,
  competitorsHint: string
): Promise<AnswerAnalysis> {
  const openai = getOpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You analyze AI assistant answers for brand visibility. Return ONLY valid JSON with keys: brand_mentioned (boolean), mention_position (integer rank position where brand first appears in recommendations, or null), sentiment (positive|neutral|negative|not_mentioned), competitors (array of other brand names recommended instead).',
      },
      {
        role: 'user',
        content: `Brand being tracked: "${brand}"${competitorsHint ? ` (known competitors: ${competitorsHint})` : ''}\n\nAI answer:\n"""${rawResponse.slice(0, 3000)}"""`,
      },
    ],
    max_tokens: 200,
    temperature: 0,
    response_format: { type: 'json_object' },
  })
  try {
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return {
      brand_mentioned: !!parsed.brand_mentioned,
      mention_position: typeof parsed.mention_position === 'number' ? parsed.mention_position : null,
      sentiment: parsed.sentiment || (parsed.brand_mentioned ? 'neutral' : 'not_mentioned'),
      competitors: Array.isArray(parsed.competitors) ? parsed.competitors.slice(0, 5) : [],
    }
  } catch {
    const mentioned = rawResponse.toLowerCase().includes(brand.toLowerCase())
    return {
      brand_mentioned: mentioned,
      mention_position: mentioned ? 1 : null,
      sentiment: mentioned ? 'neutral' : 'not_mentioned',
      competitors: [],
    }
  }
}

function engineScore(analysis: AnswerAnalysis[]): { score: number; mentionRate: number } {
  if (analysis.length === 0) return { score: 0, mentionRate: 0 }
  const mentions = analysis.filter((a) => a.brand_mentioned).length
  const mentionRate = (mentions / analysis.length) * 100
  const positions = analysis
    .filter((a) => a.mention_position && a.mention_position > 0)
    .map((a) => 1 / (a.mention_position || 1))
  const positionBonus =
    positions.length > 0
      ? (positions.reduce((a, b) => a + b, 0) / positions.length) * 20
      : 0
  return { score: Math.min(100, Math.round(mentionRate + positionBonus)), mentionRate: Math.round(mentionRate) }
}

async function generateRoast(
  brand: string,
  category: string,
  stats: {
    overall: number
    chatgpt: { score: number; mentionRate: number }
    perplexity: { score: number; mentionRate: number }
    topCompetitors: string[]
    sampleQuotes: string[]
  }
): Promise<{ roast: string; tip: string; shareLine: string }> {
  const openai = getOpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "You are a sharp, funny GEO (Generative Engine Optimization) analyst writing for a LinkedIn marketing audience. Return ONLY valid JSON with keys: roast (1-2 punchy sentences about the brand's AI visibility reality — witty but never cruel), tip (one concrete, specific action they can take this week to get mentioned more), shareLine (one first-person sentence the brand owner can post on LinkedIn announcing their score, ending with curiosity that invites others to check theirs). No hashtags in any field.",
      },
      {
        role: 'user',
        content: `Brand: "${brand}" (${category})
Overall AI visibility score: ${stats.overall}/100
ChatGPT: mentioned in ${stats.chatgpt.mentionRate}% of buying-intent questions (score ${stats.chatgpt.score})
Perplexity: mentioned in ${stats.perplexity.mentionRate}% (score ${stats.perplexity.score})
Competitors named instead: ${stats.topCompetitors.join(', ') || 'none detected'}
Quotes about brand: ${stats.sampleQuotes.join(' | ').slice(0, 600) || 'none'}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.9,
    response_format: { type: 'json_object' },
  })
  try {
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return {
      roast: parsed.roast || 'The machines have opinions. Yours is not among them — yet.',
      tip: parsed.tip || 'Get listed on the comparison and listicle pages AI models read most, and keep your product description consistent across the web.',
      shareLine: parsed.shareLine || `I just scored ${stats.overall}/100 on AI search visibility. Can you beat me?`,
    }
  } catch {
    return {
      roast: 'The machines have opinions. Yours is not among them — yet.',
      tip: 'Get listed on comparison pages AI models read, and keep your product description consistent across the web.',
      shareLine: `I just scored ${stats.overall}/100 on AI search visibility. Can you beat me?`,
    }
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many scans. Try again in an hour — or run a full probe from your dashboard.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const brand: string = (body.brand || '').trim().slice(0, 80)
    const category: string = (body.category || '').trim().slice(0, 80)
    const competitorsHint: string = (body.competitors || '').trim().slice(0, 200)

    if (!brand || !category) {
      return NextResponse.json({ error: 'brand and category are required' }, { status: 400 })
    }

    const queries = buildQueries(brand, category)
    const engines: Engine[] = process.env.PERPLEXITY_API_KEY ? ['chatgpt', 'perplexity'] : ['chatgpt']

    // Run every (engine, query) pair in parallel
    const jobs = engines.flatMap((engine) =>
      queries.map(async (q) => {
        try {
          const raw = engine === 'chatgpt' ? await probeChatGPT(q) : await probePerplexity(q)
          const analysis = await analyzeResponse(raw, brand, competitorsHint)
          return { engine, query: q, raw, analysis, error: null as string | null }
        } catch (e: any) {
          return { engine, query: q, raw: '', analysis: null, error: e.message }
        }
      })
    )
    const settled = await Promise.all(jobs)

    const byEngine: Record<string, AnswerAnalysis[]> = { chatgpt: [], perplexity: [] }
    const competitorCounts = new Map<string, number>()
    const sampleQuotes: string[] = []
    const answers: { engine: string; query: string; mentioned: boolean; quote: string }[] = []

    for (const r of settled) {
      if (!r.analysis) continue
      byEngine[r.engine].push(r.analysis)
      r.analysis.competitors.forEach((c) =>
        competitorCounts.set(c, (competitorCounts.get(c) || 0) + 1)
      )
      if (r.analysis.brand_mentioned && r.raw) {
        // Grab the sentence containing the brand as a quotable snippet
        const sentences = r.raw.split(/(?<=[.!?])\s+/)
        const hit = sentences.find((s) => s.toLowerCase().includes(brand.toLowerCase()))
        if (hit && sampleQuotes.length < 3) sampleQuotes.push(hit.trim().slice(0, 220))
      }
      answers.push({
        engine: r.engine,
        query: r.query,
        mentioned: r.analysis.brand_mentioned,
        quote: (r.raw || '').slice(0, 400),
      })
    }

    const chatgptStats = engineScore(byEngine.chatgpt)
    const perplexityStats = engineScore(byEngine.perplexity)

    const hasPerplexity = engines.includes('perplexity')
    const overall = Math.round(
      chatgptStats.score * (hasPerplexity ? 0.55 : 1) +
        perplexityStats.score * (hasPerplexity ? 0.45 : 0)
    )

    const topCompetitors = [...competitorCounts.entries()]
      .filter(([c]) => c.toLowerCase() !== brand.toLowerCase())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([c]) => c)

    const verdict = await generateRoast(brand, category, {
      overall,
      chatgpt: chatgptStats,
      perplexity: perplexityStats,
      topCompetitors,
      sampleQuotes,
    })

    // Best-effort persistence for the public leaderboard
    let scanId: string | null = null
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('instant_scans')
        .insert({
          brand,
          category,
          score: overall,
          chatgpt_score: chatgptStats.score,
          chatgpt_mention_rate: chatgptStats.mentionRate,
          perplexity_score: hasPerplexity ? perplexityStats.score : null,
          perplexity_mention_rate: hasPerplexity ? perplexityStats.mentionRate : null,
          competitors: topCompetitors,
          roast: verdict.roast,
        })
        .select('id')
        .single()
      if (!error && data) scanId = data.id
    } catch {
      // Leaderboard is optional — scan still works if table isn't migrated yet
    }

    return NextResponse.json({
      success: true,
      scanId,
      brand,
      category,
      engines: engines.map((e) => ({
        engine: e,
        score: e === 'chatgpt' ? chatgptStats.score : perplexityStats.score,
        mentionRate: e === 'chatgpt' ? chatgptStats.mentionRate : perplexityStats.mentionRate,
      })),
      overall,
      topCompetitors,
      answers,
      ...verdict,
    })
  } catch (error: any) {
    console.error('Instant scan error:', error)
    return NextResponse.json({ error: error.message || 'Scan failed' }, { status: 500 })
  }
}





