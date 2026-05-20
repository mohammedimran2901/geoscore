import Stripe from 'stripe'

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-04-22.dahlia',
  })
}

// For backward compatibility - lazy loaded
let stripeInstance: Stripe | null = null
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      stripeInstance = getStripe()
    }
    return stripeInstance[prop as keyof Stripe]
  },
})

export const SUBSCRIPTION_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 99,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    description: 'Perfect for small businesses getting started with AI visibility tracking',
    features: [
      '1 domain',
      '50 probe queries per day',
      'ChatGPT + Perplexity engines',
      'Weekly email reports',
      '90-day history',
    ],
    limits: {
      domains: 1,
      queriesPerDay: 50,
      engines: ['chatgpt', 'perplexity'] as const,
      historyDays: 90,
      competitorTracking: 0,
    },
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 249,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    description: 'For growing businesses serious about AI search optimization',
    features: [
      '3 domains',
      '200 probe queries per day',
      'All 4 AI engines',
      'Weekly reports + real-time alerts',
      '1-year history',
      'Competitor tracking (3 per domain)',
    ],
    limits: {
      domains: 3,
      queriesPerDay: 200,
      engines: ['chatgpt', 'perplexity', 'google_aio', 'claude'] as const,
      historyDays: 365,
      competitorTracking: 3,
    },
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 599,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    description: 'For agencies managing multiple client accounts',
    features: [
      '15 domains',
      '1,000 probe queries per day',
      'All 4 AI engines',
      'White-label PDF reports',
      'Priority support',
      'Custom query library',
      'API access',
    ],
    limits: {
      domains: 15,
      queriesPerDay: 1000,
      engines: ['chatgpt', 'perplexity', 'google_aio', 'claude'] as const,
      historyDays: 365,
      competitorTracking: 5,
    },
  },
}

export type PlanId = keyof typeof SUBSCRIPTION_PLANS

export function getPlanByPriceId(priceId: string): PlanId | null {
  for (const [key, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (plan.priceId === priceId) {
      return key as PlanId
    }
  }
  return null
}

export function getPlanById(id: PlanId) {
  return SUBSCRIPTION_PLANS[id]
}