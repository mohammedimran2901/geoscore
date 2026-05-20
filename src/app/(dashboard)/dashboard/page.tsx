import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('*, domains(*)')
    .eq('id', user.id)
    .single()

  const hasDomains = userData?.domains && userData.domains.length > 0

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {!hasDomains ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome to GEOscore!</h2>
          <p className="text-slate-600 mb-4">Start by adding your first domain to track.</p>
          <a href="/onboarding" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Your Domain
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-sm font-medium text-slate-500">Overall Score</h3>
            <p className="text-4xl font-bold mt-2">--</p>
            <p className="text-sm text-slate-400 mt-1">Add queries to see your score</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-sm font-medium text-slate-500">Domains</h3>
            <p className="text-4xl font-bold mt-2">{userData.domains.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-sm font-medium text-slate-500">Plan</h3>
            <p className="text-2xl font-bold mt-2 capitalize">{userData.subscription_tier}</p>
          </div>
        </div>
      )}
    </div>
  )
}