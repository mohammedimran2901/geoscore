import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('*, domains(*)')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <p className="text-slate-600">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <p className="text-slate-600">{userData?.full_name || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium capitalize">{userData?.subscription_tier || 'Free'} Plan</p>
              <p className="text-sm text-slate-500">Status: {userData?.subscription_status || 'active'}</p>
            </div>
            <Link 
              href="/settings/subscription"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Manage
            </Link>
          </div>
        </div>

        {/* Domains Section */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Your Domains ({userData?.domains?.length || 0})</h2>
          <div className="space-y-3">
            {userData?.domains?.map((domain: { id: string; domain: string; brand_name: string }) => (
              <div key={domain.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">{domain.brand_name}</p>
                  <p className="text-sm text-slate-500">{domain.domain}</p>
                </div>
                <Link 
                  href={`/dashboard/domain/${domain.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}