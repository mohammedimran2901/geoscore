import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import OpenAI from 'openai'

// Types for probe execution
type Engine = 'chatgpt' | 'perplexity' | 'google_aio' | 'claude'

interface ProbeJob {
  probe_query_id: string
  domain_id: string
  engine: Engine
  query_text: string
  brand_name: string
  domain: string
  competitors: string[]
}

// Lazy-loaded OpenAI client
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Generate cache key for deduplication
function generateCacheKey(engine: Engine, queryText: string): string {
  const normalized = `${engine}|${queryText.toLowerCase().trim()}`
  return createHash('sha256').update(normalized).digest('hex')
}

// Check for cached result (within last 12 hours)
async function checkCache(supabase: any, cacheKey: string) {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  
  const { data } = await supabase
    .from('probe_results')
    .select('*')
    .eq('cache_key', cacheKey)
    .gte('probed_at', twelveHoursAgo)
    .order('probed_at', { ascending: false })
    .limit(1)
    .single()
  
  return data
}

// Probe ChatGPT
async function probeChatGPT(queryText: string): Promise<string> {
  const openai = getOpenAI()
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: queryText }],
    max_tokens: 500,
    temperature: 0.7,
  })
  
  return response.choices[0]?.message?.content || ''
}

// Probe Perplexity
async function probePerplexity(queryText: string): Promise<string> {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY is not set')
  }
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: queryText }],
      max_tokens: 500,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Probe Google AI Overview via SerpAPI
async function probeGoogleAIO(queryText: string): Promise<string | null> {
  if (!process.env.SERPAPI_KEY) {
    throw new Error('SERPAPI_KEY is not set')
  }
  
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(queryText)}&api_key=${process.env.SERPAPI_KEY}&num=5`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`SerpAPI error: ${response.status}`)
  }
  
  const data = await response.json()
  
  // Extract AI overview if available
  if (data.ai_overview?.text) {
    return data.ai_overview.text
  }
  
  // Return null if no AI overview (this is expected for many queries)
  return null
}

// Analyze probe response with GPT-4o-mini
async function analyzeResponse(
  rawResponse: string,
  brandName: string,
  domain: string,
  competitors: string[]
): Promise<{
  brand_mentioned: boolean
  mention_position: number | null
  mention_context: string | null
  response_sentiment: 'positive' | 'neutral' | 'negative' | 'not_mentioned'
  competitor_mentions: Record<string, number>
  response_summary: string
}> {
  const openai = getOpenAI()
  
  const systemPrompt = `You are analyzing an AI response to determine brand visibility.
Given:

Brand name: ${brandName}
Domain: ${domain}
Competitor brands: ${competitors.join(', ')}
AI Response: ${rawResponse}

Return JSON:
{
  "brand_mentioned": boolean,
  "mention_position": number | null (1 = mentioned first, 2 = second, etc. null if not mentioned),
  "mention_context": string | null (the exact sentence mentioning the brand),
  "response_sentiment": "positive" | "neutral" | "negative" | "not_mentioned",
  "competitor_mentions": { "competitor_name": mention_position_or_0 },
  "response_summary": string (one sentence summary of what the AI recommended)
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })
  
  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Execute a single probe
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const job: ProbeJob = await request.json()
    
    const { probe_query_id, domain_id, engine, query_text, brand_name, domain, competitors } = job
    
    // Generate cache key
    const cacheKey = generateCacheKey(engine, query_text)
    
    // Check for cached result
    const cachedResult = await checkCache(supabase, cacheKey)
    
    let rawResponse: string | null
    let status: string = 'success'
    let errorMessage: string | null = null
    
    if (cachedResult) {
      // Use cached result
      rawResponse = cachedResult.raw_response
      status = 'cached'
    } else {
      // Execute probe based on engine
      try {
        switch (engine) {
          case 'chatgpt':
            rawResponse = await probeChatGPT(query_text)
            break
          case 'perplexity':
            rawResponse = await probePerplexity(query_text)
            break
          case 'google_aio':
            rawResponse = await probeGoogleAIO(query_text)
            if (rawResponse === null) {
              status = 'no_ai_overview'
            }
            break
          case 'claude':
            // Claude not implemented yet
            rawResponse = ''
            status = 'not_implemented'
            break
          default:
            throw new Error(`Unknown engine: ${engine}`)
        }
      } catch (error: any) {
        status = 'error'
        errorMessage = error.message
        rawResponse = ''
      }
    }
    
    // If no response or error, still save the result with error status
    if (status === 'error' || status === 'not_implemented') {
      await supabase.from('probe_results').insert({
        probe_query_id,
        domain_id,
        engine,
        raw_response: rawResponse || '',
        brand_mentioned: false,
        mention_position: null,
        mention_context: null,
        response_sentiment: 'not_mentioned',
        competitor_mentions: {},
        probed_at: new Date().toISOString(),
        cache_key: cacheKey,
        status,
        error_message: errorMessage,
      })
      
      return NextResponse.json({ success: false, status, error: errorMessage })
    }
    
    // For Google AI Overview, if no overview available, save with empty values
    if (status === 'no_ai_overview') {
      await supabase.from('probe_results').insert({
        probe_query_id,
        domain_id,
        engine,
        raw_response: '',
        brand_mentioned: false,
        mention_position: null,
        mention_context: '',
        response_sentiment: 'not_mentioned',
        competitor_mentions: {},
        probed_at: new Date().toISOString(),
        cache_key: cacheKey,
        status: 'no_ai_overview',
      })
      
      return NextResponse.json({ success: true, status: 'no_ai_overview' })
    }
    
    // Analyze the response
    const analysis = await analyzeResponse(
      rawResponse || '',
      brand_name,
      domain,
      competitors
    )
    
    // Save the result
    await supabase.from('probe_results').insert({
      probe_query_id,
      domain_id,
      engine,
      raw_response: rawResponse,
      brand_mentioned: analysis.brand_mentioned,
      mention_position: analysis.mention_position,
      mention_context: analysis.mention_context,
      response_sentiment: analysis.response_sentiment,
      competitor_mentions: analysis.competitor_mentions,
      probed_at: new Date().toISOString(),
      cache_key: cacheKey,
      status: 'success',
    })
    
    return NextResponse.json({
      success: true,
      brand_mentioned: analysis.brand_mentioned,
      mention_position: analysis.mention_position,
    })
    
  } catch (error: any) {
    console.error('Probe execution error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}