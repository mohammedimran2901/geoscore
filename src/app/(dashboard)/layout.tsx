import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-slate-900">GEOscore</Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
              <Link href="/dashboard/domain" className="text-slate-600 hover:text-slate-900">Domains</Link>
              <Link href="/dashboard/competitors" className="text-slate-600 hover:text-slate-900">Competitors</Link>
              <Link href="/dashboard/reports" className="text-slate-600 hover:text-slate-900">Reports</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/settings" className="text-slate-600 hover:text-slate-900">Settings</Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-slate-600 hover:text-slate-900">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
