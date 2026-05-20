import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DomainDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: domain } = await supabase
    .from('domains')
    .select('*, probe_queries(*), visibility_scores(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!domain) redirect('/dashboard')

  const latestScore = domain.visibility_scores?.[0]
  const activeQueries = domain.probe_queries?.filter((q: { is_active: boolean }) => q.is_active) || []

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{domain.brand_name}</h1>
          <p className="text-slate-600">{domain.domain}</p>
        </div>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Run Probe Now
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-medium text-slate-500">Overall Score</h3>
          <p className="text-4xl font-bold mt-2">{latestScore?.overall_score || '--'}</p>
          <p className="text-xs text-slate-400">out of 100</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-medium text-slate-500">ChatGPT</h3>
          <p className="text-3xl font-bold mt-2">{latestScore?.chatgpt_score || '--'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-medium text-slate-500">Perplexity</h3>
          <p className="text-3xl font-bold mt-2">{latestScore?.perplexity_score || '--'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-medium text-slate-500">Active Queries</h3>
          <p className="text-3xl font-bold mt-2">{activeQueries.length}</p>
        </div>
      </div>

      {/* Query List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Probe Queries</h2>
        </div>
        <div className="divide-y">
          {activeQueries.slice(0, 10).map((query: { id: string; query_text: string; query_category: string }) => (
            <div key={query.id} className="p-4 hover:bg-slate-50">
              <p className="font-medium">{query.query_text}</p>
              <span className="text-xs text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">
                {query.query_category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}