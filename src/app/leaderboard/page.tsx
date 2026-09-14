import Link from 'next/link'
import { Sparkles, Trophy, ArrowRight, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface ScanRow {
  id: string
  brand: string
  category: string
  score: number
  chatgpt_mention_rate: number | null
  perplexity_mention_rate: number | null
  roast: string | null
  created_at: string
}

export default async function LeaderboardPage() {
  let scans: ScanRow[] = []
  let tableMissing = false

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('instant_scans')
      .select('id, brand, category, score, chatgpt_mention_rate, perplexity_mention_rate, roast, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('score', { ascending: false })
      .limit(50)

    if (error) {
      tableMissing = true
    } else {
      scans = (data || []) as ScanRow[]
    }
  } catch {
    tableMissing = true
  }

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
          <Link
            href="/scan"
            className="px-4 py-2 bg-blue-600 text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            Scan your brand free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">Live data from real AI probes — updated as brands scan</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            The <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Visibility</span> Leaderboard
          </h1>
          <p className="text-slate-400 text-lg">
            Real brands, asked the same questions as their customers. Who do the machines actually recommend?
          </p>
        </div>

        {tableMissing || scans.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {tableMissing
                ? 'The leaderboard is warming up.'
                : 'No scans yet this month. The top spot is unclaimed.'}{' '}
              Run the first scan and claim it.
            </p>
            <Link
              href="/scan"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 rounded-xl font-medium hover:bg-blue-500 transition-colors"
            >
              Be #1 — scan free
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                  i === 0
                    ? 'border-amber-500/30 bg-amber-500/[0.06]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                }`}
              >
                <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' : i < 3 ? 'bg-white/10 text-slate-200' : 'bg-white/5 text-slate-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold truncate">{s.brand}</span>
                    <span className="text-xs text-slate-500 truncate">{s.category}</span>
                  </div>
                  {s.roast && <p className="text-sm text-slate-500 truncate italic mt-0.5">“{s.roast}”</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-2xl font-bold ${s.score >= 60 ? 'text-emerald-400' : s.score >= 30 ? 'text-blue-400' : 'text-red-400'}`}>
                    {s.score}
                  </div>
                  <div className="text-xs text-slate-600">/100</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 text-center">
          <h2 className="text-2xl font-bold mb-2">Think you can rank higher?</h2>
          <p className="text-slate-300 mb-6">Free instant scan. ~60 seconds. No signup.</p>
          <Link
            href="/scan"
            className="inline-block px-8 py-3 bg-white text-slate-950 rounded-xl font-semibold hover:bg-slate-200 transition-all"
          >
            Scan your brand
          </Link>
        </div>

      </main>
    </div>
  )
}
