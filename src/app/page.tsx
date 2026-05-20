'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  ChevronRight,
  Star,
  Users,
  Globe
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'perplexity' | 'claude'>('chatgpt')

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      window.location.href = `/signup?email=${encodeURIComponent(email)}`
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              GEOscore
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-white text-slate-950 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-300">Now tracking ChatGPT, Claude, Perplexity & Google AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Does AI recommend
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              your business?
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Track your brand visibility across AI assistants. See what ChatGPT, Perplexity, and Claude say about you — and beat your competitors.
          </p>

          {/* Email CTA - Low Friction */}
          <form onSubmit={handleGetStarted} className="max-w-md mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {isSubmitting ? 'Creating account...' : 'Start Free Trial'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              ✓ 14-day free trial • No credit card required • Cancel anytime
            </p>
          </form>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">Trusted by marketing teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {['HubSpot', 'Zendesk', 'Notion', 'Figma', 'Linear'].map((company) => (
                <span key={company} className="text-lg font-semibold text-slate-400">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">See what AI says about any brand</h2>
            <p className="text-slate-400">Real-time visibility across all major AI assistants</p>
          </div>

          {/* AI Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(['chatgpt', 'perplexity', 'claude'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'chatgpt' && 'ChatGPT'}
                {tab === 'perplexity' && 'Perplexity'}
                {tab === 'claude' && 'Claude'}
              </button>
            ))}
          </div>

          {/* Demo Card */}
          <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold">
                  G
                </div>
                <div>
                  <div className="font-medium">GEOscore Demo</div>
                  <div className="text-sm text-slate-500">AI Visibility Report</div>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                    Score: 78/100
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm">Brand mentions</span>
                    </div>
                    <span className="text-emerald-400 font-bold">84%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">Avg position</span>
                    </div>
                    <span className="text-blue-400 font-bold">#2.3</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">Query: &ldquo;Best CRM software for startups&rdquo;</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      &ldquo;HubSpot is frequently recommended as the top choice for startups due to its generous free tier and scalability...&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">#1 Position</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Positive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '200M+', label: 'AI queries tracked' },
              { value: '4', label: 'AI engines monitored' },
              { value: '10K+', label: 'Brands tracked' },
              { value: '47%', label: 'Avg visibility boost' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to win in AI search</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Complete visibility into how AI assistants represent your brand — with actionable insights to improve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Multi-Engine Tracking',
                description: 'Monitor ChatGPT, Perplexity, Claude, and Google AI Overviews from one dashboard.',
                color: 'blue'
              },
              {
                icon: BarChart3,
                title: 'Visibility Scoring',
                description: 'Get a clear 0-100 score based on mentions, position, and sentiment across all AI platforms.',
                color: 'purple'
              },
              {
                icon: Zap,
                title: 'Daily Probing',
                description: 'We ask 200+ relevant questions daily and track how often AI recommends your brand.',
                color: 'yellow'
              },
              {
                icon: Shield,
                title: 'Competitor Intel',
                description: 'See exactly when competitors are mentioned instead of you — and why.',
                color: 'red'
              },
              {
                icon: MessageSquare,
                title: 'Content Recommendations',
                description: 'AI-powered suggestions to improve your visibility based on what the models prioritize.',
                color: 'green'
              },
              {
                icon: Mail,
                title: 'Weekly Reports',
                description: 'Automated Monday morning emails with score changes, wins, and opportunities.',
                color: 'pink'
              },
            ].map((feature) => (
              <div 
                key={feature.title}
                className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get your score in 3 minutes</h2>
            <p className="text-slate-400">No credit card required. Start tracking immediately.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect your domain',
                description: 'Enter your website and describe what you do. Our AI generates 200+ relevant questions.',
                time: '30 seconds'
              },
              {
                step: '02',
                title: 'We probe AI engines',
                description: 'Our system queries ChatGPT, Perplexity, Claude, and Google AI daily with your questions.',
                time: 'Automated'
              },
              {
                step: '03',
                title: 'Get your score',
                description: 'See your visibility score, competitor comparisons, and actionable recommendations.',
                time: 'Instant'
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                <div className="relative -mt-12">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="px-2 py-0.5 bg-white/10 text-xs rounded text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by marketing teams</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "GEOscore showed us we were invisible on Perplexity. After 3 months of optimization, we're mentioned in 67% of queries.",
                author: "Sarah Chen",
                role: "Head of SEO, Notion",
                score: "+47 points"
              },
              {
                quote: "Finally, visibility into the black box of AI recommendations. The content suggestions alone are worth the subscription.",
                author: "Marcus Johnson",
                role: "CMO, Linear",
                score: "#1 ranking"
              },
              {
                quote: "We discovered our competitor was being recommended 3x more often. GEOscore helped us close that gap completely.",
                author: "Emily Rodriguez",
                role: "VP Marketing, Vercel",
                score: "3x visibility"
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
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
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free. Scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-slate-500">/month</span>
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
              <Link 
                href="/signup?plan=starter"
                className="block w-full py-2 text-center border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                Start free trial
              </Link>
            </div>

            {/* Growth - Popular */}
            <div className="relative p-6 bg-gradient-to-b from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-blue-600 text-xs font-medium rounded-full">Most Popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Growth</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$249</span>
                  <span className="text-slate-500">/month</span>
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
              <Link 
                href="/signup?plan=growth"
                className="block w-full py-2 text-center bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Start free trial
              </Link>
            </div>

            {/* Agency */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Agency</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$599</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {['15 domains', '1,000 queries/day', 'White-label reports', 'API access', 'Dedicated success manager', 'Custom integrations'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?plan=agency"
                className="block w-full py-2 text-center border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently asked questions</h2>
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
              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 bg-gradient-to-b from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to see your AI visibility score?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join 10,000+ brands tracking their AI presence. Start your free trial today — no credit card required.
            </p>
            
            <form onSubmit={handleGetStarted} className="max-w-md mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No credit card
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GEOscore</span>
              </div>
              <p className="text-sm text-slate-500">
                Track your brand visibility across AI assistants. Beat your competitors in the age of AI search.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">© 2025 GEOscore. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}