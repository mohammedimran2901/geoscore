'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type OnboardingStep = 'domain' | 'queries' | 'plan'

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('domain')
  const [domain, setDomain] = useState('')
  const [brandName, setBrandName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [generatedQueries, setGeneratedQueries] = useState<Array<{query_text: string, query_category: string}>>([])
  const [loading, setLoading] = useState(false)
  const [domainId, setDomainId] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const extractBrandName = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      return hostname.replace(/^www\./, '').split('.')[0]
    } catch {
      return ''
    }
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setDomain(url)
    setBrandName(extractBrandName(url))
  }

  const handleDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const competitorList = competitors.split(',').map(c => c.trim()).filter(Boolean)

    const { data, error } = await supabase
      .from('domains')
      .insert({
        user_id: user.id,
        domain,
        brand_name: brandName,
        business_description: businessDescription,
        competitor_domains: competitorList,
      })
      .select()
      .single()

    if (data) {
      setDomainId(data.id)
      await generateQueries(data.id, businessDescription, brandName, competitorList)
      setStep('queries')
    }
    setLoading(false)
  }

  const generateQueries = async (domainId: string, description: string, brand: string, competitors: string[]) => {
    // In production, this would call OpenAI API
    // For now, create sample queries
    const sampleQueries = [
      { query_text: `What is ${brand} and what does it do?`, query_category: 'product_aware' },
      { query_text: `How to solve ${description.slice(0, 30)}...`, query_category: 'problem_aware' },
      { query_text: `Best alternatives to ${brand}`, query_category: 'alternative' },
      { query_text: `${brand} vs competitors`, query_category: 'comparison' },
      { query_text: `How to get started with ${brand}`, query_category: 'how_to' },
    ]
    
    const { data } = await supabase
      .from('probe_queries')
      .insert(sampleQueries.map(q => ({
        domain_id: domainId,
        query_text: q.query_text,
        query_category: q.query_category,
      })))
      .select()

    if (data) {
      setGeneratedQueries(data)
    }
  }

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      router.push('/dashboard')
    } else {
      // Redirect to Stripe checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/onboarding`,
        }),
      })
      
      const { url } = await response.json()
      if (url) window.location.href = url
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {step === 'domain' ? '1' : step === 'queries' ? '2' : '3'} of 3</span>
            <span className="text-sm text-slate-400">
              {step === 'domain' ? 'Domain Setup' : step === 'queries' ? 'Query Review' : 'Select Plan'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: step === 'domain' ? '33%' : step === 'queries' ? '66%' : '100%' }}
            />
          </div>
        </div>

        {step === 'domain' && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-2">Add Your Domain</h1>
            <p className="text-slate-600 mb-6">Tell us about your business so we can track your AI visibility.</p>
            
            <form onSubmit={handleDomainSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Domain URL</label>
                <input
                  type="url"
                  value={domain}
                  onChange={handleDomainChange}
                  placeholder="https://example.com"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Description</label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="What does your business do? Who do you serve?"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Competitors (optional)</label>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="competitor1.com, competitor2.com"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generating queries...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {step === 'queries' && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-2">Review Your Queries</h1>
            <p className="text-slate-600 mb-6">We'll check these questions daily across AI engines.</p>
            
            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              {generatedQueries.map((query, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border">
                  <p className="font-medium">{query.query_text}</p>
                  <span className="text-xs text-slate-500 uppercase">{query.query_category}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('plan')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue to Plans
              </button>
            </div>
          </div>
        )}

        {step === 'plan' && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-2">Select Your Plan</h1>
            <p className="text-slate-600 mb-6">Start with a 7-day free trial.</p>
            
            <div className="grid gap-4">
              <button
                onClick={() => handlePlanSelect('free')}
                className="p-6 border-2 rounded-xl hover:border-blue-600 text-left"
              >
                <h3 className="text-xl font-bold">Free</h3>
                <p className="text-slate-600 mt-1">5 queries/day, 1 domain</p>
              </button>
              
              <button
                onClick={() => handlePlanSelect('starter')}
                className="p-6 border-2 border-blue-600 bg-blue-50 rounded-xl text-left"
              >
                <h3 className="text-xl font-bold">Starter</h3>
                <p className="text-slate-600 mt-1">50 queries/day, 1 domain - $99/mo</p>
              </button>
              
              <button
                onClick={() => handlePlanSelect('growth')}
                className="p-6 border-2 rounded-xl hover:border-blue-600 text-left"
              >
                <h3 className="text-xl font-bold">Growth</h3>
                <p className="text-slate-600 mt-1">200 queries/day, 3 domains - $249/mo</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}