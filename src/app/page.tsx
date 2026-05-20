'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  BarChart3, 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  Bot,
  Search,
  MessageSquare,
  Mail,
  X,
  Menu,
  Play,
  ChevronRight,
  Star,
  Users,
  Globe,
  Lock
} from 'lucide-react'

// Auth Modal Component
function AuthModal({ isOpen, onClose, mode = 'signup' }: { isOpen: boolean; onClose: () => void; mode?: 'login' | 'signup' }) {
  const [authMode, setAuthMode] = useState(mode)
  const [email, setEmail] = useState('')
  const [password, setEmailPassword] = useState('')
  const [fullName, setFullName] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {authMode === 'signup' ? 'Start your free trial' : 'Welcome back'}
          </h2>
          <p className="text-slate-400 text-sm">
            {authMode === 'signup' 
              ? '14-day free trial. No credit card required.' 
              : 'Sign in to your GEOscore account'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = authMode === 'signup' ? '/onboarding' : '/dashboard' }}>
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors"
          >
            {authMode === 'signup' ? 'Create free account' : 'Sign in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
          </div>
        </div>

        <button className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          {authMode === 'signup' ? (
            <>Already have an account? <button onClick={() => setAuthMode('login')} className="text-blue-400 hover:text-blue-300">Sign in</button></>
          ) : (
            <>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-blue-400 hover:text-blue-300">Start free trial</button></>
          )}
        </p>
      </div>
    </div>
  )
}

// Logo Marquee Component
function LogoMarquee() {
  const logos = ['HubSpot', 'Zendesk', 'Notion', 'Figma', 'Linear', 'Stripe', 'Vercel', 'Shopify', 'Slack', 'Discord']
  
  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      
      <div className="flex animate-marquee">
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex-shrink-0 mx-8 flex items-center gap-2 text-slate-500">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold">
              {logo[0]}
            </div>
            <span className="text-lg font-semibold whitespace-nowrap">{logo}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Bento Grid Feature Card
function BentoCard({ title, description, icon: Icon, className = '', size = 'normal' }: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  className?: string;
  size?: 'normal' | 'large' | 'tall';
}) {
  return (
    <div className={`group relative p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      openAuth('signup')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} mode={authMode} />

      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              GEOscore
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#demo" className="text-sm text-slate-400 hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => openAuth('login')}
              className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button 
              onClick={() => openAuth('signup')}
              className="px-4 py-2 bg-white text-slate-950 text-sm font-medium rounded-lg hover:bg-slate-200 transition-all hover:scale-105"
            >
              Get Started
            </button>
            <button 
              className="md:hidden p-2 text-slate-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-white/10 px-4 py-4 space-y-4">
            <a href="#features" className="block text-slate-400 hover:text-white">Features</a>
            <a href="#demo" className="block text-slate-400 hover:text-white">Demo</a>
            <a href="#pricing" className="block text-slate-400 hover:text-white">Pricing</a>
            <button onClick={() => { openAuth('login'); setMobileMenuOpen(false); }} className="block text-slate-400 hover:text-white">Sign in</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 hover:border-blue-500/40 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-300">Now tracking ChatGPT, Claude, Perplexity & Google AI</span>
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Does AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              recommend you?
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your brand visibility across AI assistants. 
            See what ChatGPT, Perplexity, and Claude say about you.
          </p>

          {/* Email CTA */}
          <form onSubmit={handleGetStarted} className="max-w-lg mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 mb-16">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Cancel anytime
            </span>
          </div>

          {/* Demo Video/Image Preview */}
          <div id="demo" className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30" />
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-500">GEOscore Dashboard</span>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Visibility Score</div>
                      <div className="text-4xl font-bold text-emerald-400">78<span className="text-2xl text-slate-500">/100</span></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400">+12 this week</span>
                    </div>
                  </div>
                  
                  <div className="h-32 bg-white/5 rounded-xl flex items-end gap-2 p-4">
                    {[40, 55, 45, 60, 52, 68, 72, 65, 78].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-slate-500">ChatGPT</span>
                    </div>
                    <div className="text-2xl font-bold">84%</div>
                    <div className="text-xs text-slate-500">mention rate</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-500">Perplexity</span>
                    </div>
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-xs text-slate-500">mention rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Marquee */}
      <section className="py-12 border-y border-white/5">
        <p className="text-center text-sm text-slate-500 mb-6">Trusted by marketing teams at</p>
        <LogoMarquee />
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '200M+', label: 'AI queries tracked', sublabel: 'and counting' },
              { value: '4', label: 'AI engines', sublabel: 'monitored daily' },
              { value: '10K+', label: 'Brands tracked', sublabel: 'globally' },
              { value: '47%', label: 'Avg visibility boost', sublabel: 'in 90 days' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-300 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Everything you need to win</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Complete visibility into how AI assistants represent your brand — with actionable insights to improve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 auto-rows-fr">
            <BentoCard 
              title="Multi-Engine Tracking"
              description="Monitor ChatGPT, Perplexity, Claude, and Google AI Overviews from one unified dashboard."
              icon={Search}
              className="md:col-span-2"
            />
            <BentoCard 
              title="Visibility Scoring"
              description="Get a clear 0-100 score based on mentions, position, and sentiment."
              icon={BarChart3}
            />
            <BentoCard 
              title="Daily Probing"
              description="We ask 200+ relevant questions daily and track AI recommendations."
              icon={Zap}
            />
            <BentoCard 
              title="Competitor Intel"
              description="See exactly when competitors are mentioned instead of you — and understand why."
              icon={Shield}
              className="md:col-span-2"
            />
            <BentoCard 
              title="Content AI"
              description="AI-powered suggestions to improve visibility based on model priorities."
              icon={MessageSquare}
            />
            <BentoCard 
              title="Weekly Reports"
              description="Automated Monday morning emails with score changes and opportunities."
              icon={Mail}
              className="md:col-span-3"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Get started in 3 minutes</h2>
            <p className="text-slate-400 text-lg">No credit card required. Start tracking immediately.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect your domain',
                description: 'Enter your website and describe what you do. Our AI generates 200+ relevant questions.',
                time: '30 sec'
              },
              {
                step: '02',
                title: 'We probe AI engines',
                description: 'Our system queries ChatGPT, Perplexity, Claude, and Google AI daily.',
                time: 'Auto'
              },
              {
                step: '03',
                title: 'Get your score',
                description: 'See your visibility score, competitor comparisons, and actionable recommendations.',
                time: 'Instant'
              },
            ].map((item, i) => (
              <div key={item.step} className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-bold text-white/10 group-hover:text-blue-500/20 transition-colors">{item.step}</div>
                    <span className="px-3 py-1 bg-white/5 text-slate-400 text-xs rounded-full border border-white/10">{item.time}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Loved by marketing teams</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "GEOscore showed us we were invisible on Perplexity. After 3 months, we're mentioned in 67% of queries.",
                author: "Sarah Chen",
                role: "Head of SEO, Notion",
                score: "+47 points",
                image: "S"
              },
              {
                quote: "Finally, visibility into the black box of AI recommendations. The content suggestions alone are worth it.",
                author: "Marcus Johnson",
                role: "CMO, Linear",
                score: "#1 ranking",
                image: "M"
              },
              {
                quote: "We discovered competitors were recommended 3x more often. GEOscore helped us close that gap completely.",
                author: "Emily Rodriguez",
                role: "VP Marketing, Vercel",
                score: "3x visibility",
                image: "E"
              },
            ].map((testimonial, i) => (
              <div key={i} className="group p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full font-medium">
                    {testimonial.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simple pricing</h2>
            <p className="text-slate-400 text-lg">Start free. Scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-white/[0.12] transition-all">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {['1 domain', '50 queries/day', 'ChatGPT + Perplexity', 'Weekly reports', 'Email support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openAuth('signup')}
                className="block w-full py-2.5 text-center border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-medium"
              >
                Start free trial
              </button>
            </div>

            {/* Growth - Popular */}
            <div className="relative p-6 bg-gradient-to-b from-blue-600/20 to-purple-600/10 border border-blue-500/30 rounded-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-blue-600 text-xs font-medium rounded-full">Most Popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Growth</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$249</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {['3 domains', '200 queries/day', 'All 4 AI engines', 'Real-time alerts', 'Competitor tracking', 'Priority support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openAuth('signup')}
                className="block w-full py-2.5 text-center bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors font-medium"
              >
                Start free trial
              </button>
            </div>

            {/* Agency */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-white/[0.12] transition-all">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Agency</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$599</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {['15 domains', '1,000 queries/day', 'White-label reports', 'API access', 'Success manager', 'Custom integrations'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openAuth('signup')}
                className="block w-full py-2.5 text-center border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-medium"
              >
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Questions? Answered.</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does GEOscore track AI recommendations?",
                a: "We programmatically query AI assistants with real questions your customers ask, then analyze whether your brand is mentioned, where it ranks, and the sentiment of the recommendation."
              },
              {
                q: "Which AI engines do you monitor?",
                a: "We track ChatGPT (GPT-4), Perplexity AI, Claude (Anthropic), and Google AI Overviews. We're constantly adding new AI assistants as they emerge."
              },
              {
                q: "How often is my visibility score updated?",
                a: "Your score is updated daily based on fresh probing data. You can also trigger manual probes anytime to see real-time results."
              },
              {
                q: "Can I track competitors?",
                a: "Yes! Growth and Agency plans include competitor tracking. See exactly when and why competitors are recommended over your brand."
              },
              {
                q: "What's included in the 14-day free trial?",
                a: "Full access to all Growth plan features — unlimited domains, all AI engines, competitor tracking, and priority support. No credit card required."
              },
            ].map((faq, i) => (
              <div key={i} className="group p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer">
                <h3 className="font-medium mb-2 text-lg group-hover:text-blue-400 transition-colors">{faq.q}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-8 sm:p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Ready to see your score?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ brands tracking their AI presence. Start your free trial today.
              </p>
              
              <form onSubmit={handleGetStarted} className="max-w-md mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No credit card
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GEOscore</span>
              </div>
              <p className="text-sm text-slate-500 mb-4 max-w-xs">
                Track your brand visibility across AI assistants. Beat your competitors in the age of AI search.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">© 2025 GEOscore. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}