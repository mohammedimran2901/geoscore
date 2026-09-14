'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Copy, Check, ArrowRight, Bot, Search, Quote, Loader2, Trophy } from 'lucide-react'

interface ScanResult {
  brand: string
  category: string
  overall: number
  engines: { engine: string; score: number; mentionRate: number }[]
  topCompetitors: string[]
  roast: string
  tip: string
  shareLine: string
  answers: { engine: string; query: string; mentioned: boolean; quote: string }[]
  scanId: string | null
}

const STAGES = [
  'Generating buying-intent questions…',
  'Asking ChatGPT what it recommends…',
  'Asking Perplexity for its picks…',
  'Analyzing mentions, rank & sentiment…',
  'Writing your GEO Roast…',
]

export default function ScanPage() {
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [scanning, setScanning] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [copied, setCopied] = useState(false)

  const runScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brand.trim() || !category.trim()) return
    setScanning(true)
    setError(null)
    setResult(null)
    setStage(0)
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4500)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, category, competitors }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scan failed')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      clearInterval(timer)
      setScanning(false)
    }
  }

  const sharePost = result
    ? `${result.shareLine}\n\nI ran a free instant scan: AI assistants were asked the questions my customers actually ask. Score: ${result.overall}/100.${
        result.topCompetitors.length > 0
          ? `\n\nThe uncomfortable part: when AI didn't name me, it named ${result.topCompetitors.slice(0, 2).join(' and ')} instead.`
          : ''
      }\n\nScan your own brand (free, ~60 seconds, no signup): ${typeof window !== 'undefined' ? window.location.origin : ''}/scan`
    : ''

  const shareImageUrl = result
    ? `/api/og?brand=${encodeURIComponent(result.brand)}&category=${encodeURIComponent(result.category)}&score=${result.overall}&chatgpt=${result.engines.find((e) => e.engine === 'chatgpt')?.mentionRate ?? ''}&perplexity=${result.engines.find((e) => e.engine === 'perplexity')?.mentionRate ?? ''}`
    : ''

  const scoreColor =
    result && result.overall >= 60 ? 'text-emerald-400' : result && result.overall >= 30 ? 'text-blue-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              GEOscore
            </span>
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {!result && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Scan your brand across{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI search</span>
              </h1>
              <p className="text-slate-400 text-lg">
                We ask ChatGPT and Perplexity the questions your customers ask. Free, ~60 seconds, no signup.
              </p>
            </div>

            <form onSubmit={runScan} className="space-y-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your brand name *</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Acme Analytics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">What do you sell? *</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. product analytics tools"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Known competitors <span className="text-slate-500">(optional, sharpens the roast)</span>
                </label>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Mixpanel, Amplitude"
                />
              </div>
              <button
                type="submit"
                disabled={scanning}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {STAGES[stage]}
                  </>
                ) : (
                  <>
                    Scan my brand free
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </form>
          </>
        )}

        {result && (
          <div className="space-y-8">
            {/* Score card */}
            <div className="relative p-8 rounded-3xl border border-white/10 bg-white/[0.03] text-center">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">AI Visibility Score</p>
              <div className={`text-7xl font-bold ${scoreColor}`}>
                {result.overall}
                <span className="text-3xl text-slate-500">/100</span>
              </div>
              <p className="text-slate-400 mt-2">
                {result.brand} · {result.category}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {result.engines.map((e) => (
                  <div key={e.engine} className="p-4 bg-white/5 rounded-xl text-left">
                    <div className="flex items-center gap-2 mb-2">
                      {e.engine === 'chatgpt' ? (
                        <Bot className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Search className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-sm text-slate-400 capitalize">{e.engine}</span>
                    </div>
                    <div className="text-2xl font-bold">{e.mentionRate}%</div>
                    <div className="text-xs text-slate-500">mention rate · score {e.score}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roast */}
            <div className="relative p-8 rounded-3xl border border-amber-500/20 bg-amber-500/[0.04]">
              <div className="flex items-center gap-2 mb-4">
                <Quote className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-400">Your GEO Roast</span>
              </div>
              <p className="text-xl leading-relaxed text-slate-100">“{result.roast}”</p>
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <p className="text-sm font-medium text-emerald-400 mb-1">Do this next:</p>
                <p className="text-sm text-slate-300">{result.tip}</p>
              </div>
            </div>

            {/* Competitors named instead */}
            {result.topCompetitors.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h3 className="font-semibold mb-3">When AI didn&apos;t name you, it named:</h3>
                <div className="flex flex-wrap gap-2">
                  {result.topCompetitors.map((c) => (
                    <span key={c} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
              <h3 className="font-semibold">Made for LinkedIn. Take it. 📋</h3>
              <p className="text-sm text-slate-400 italic bg-slate-950/50 p-4 rounded-xl border border-white/5 whitespace-pre-line">
                {sharePost}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(sharePost)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2500)
                  }}
                  className="flex-1 py-3 bg-blue-600 rounded-xl font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied! Paste it on LinkedIn' : 'Copy LinkedIn post'}
                </button>
                <a
                  href={shareImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 border border-white/20 rounded-xl font-medium hover:bg-white/5 transition-colors text-center"
                >
                  Get share card image
                </a>
              </div>
              <button
                onClick={() => {
                  setResult(null)
                  setBrand('')
                  setCategory('')
                  setCompetitors('')
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Scan another brand
              </button>
            </div>

            {/* Raw answers */}
            <details className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
              <summary className="cursor-pointer font-medium text-slate-300">See the actual AI answers</summary>
              <div className="mt-4 space-y-4">
                {result.answers.map((a, i) => (
                  <div key={i} className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase text-slate-500">{a.engine}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.mentioned ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {a.mentioned ? '✓ mentioned you' : '✗ not mentioned'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Q: {a.query}</p>
                    <p className="text-sm text-slate-300 whitespace-pre-line">{a.quote}</p>
                  </div>
                ))}
              </div>
            </details>


          </div>
        )}

      </main>
    </div>
  )
}
