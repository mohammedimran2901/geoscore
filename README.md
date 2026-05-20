# GEOscore - AI Search Visibility Tracker

A production-ready SaaS application that tracks whether AI assistants (ChatGPT, Perplexity, Google AI Overview, Claude) recommend a customer's business when users ask relevant questions.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes + Supabase Edge Functions
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Job Queue**: Upstash QStash for scheduled probe jobs
- **Payments**: Stripe (subscriptions with 3 tiers)
- **Email**: Resend with React Email templates
- **AI/LLM APIs**: OpenAI (GPT-4o-mini), Perplexity API, SerpAPI
- **Deployment**: Vercel

## Project Structure

```
geoscore/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── api/               # API routes
│   │   ├── onboarding/        # Onboarding wizard
│   │   ├── settings/          # Account settings
│   │   ├── admin/             # Admin panel
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   └── ui/                # UI components (shadcn)
│   ├── lib/                   # Utilities
│   │   ├── supabase/          # Supabase clients
│   │   └── stripe/            # Stripe configuration
│   ├── types/                 # TypeScript types
│   └── hooks/                 # Custom React hooks
├── supabase/
│   └── migrations/            # Database migrations
└── public/                    # Static assets
```

## Database Schema

### Tables

1. **users** - Extends auth.users with subscription info
2. **domains** - User's tracked domains with business info
3. **probe_queries** - AI-generated questions to probe
4. **probe_results** - Results from probing AI engines
5. **visibility_scores** - Calculated daily visibility scores
6. **content_recommendations** - AI-generated content suggestions
7. **weekly_reports** - Weekly summary reports

### RLS Policies

All tables have Row Level Security enabled with policies ensuring users can only access their own data.

## Setup Instructions

### 1. Clone and Install

```bash
cd geoscore/my-app
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- Supabase credentials
- Stripe API keys and price IDs
- OpenAI API key
- Perplexity API key
- SerpAPI key
- Resend API key
- Upstash credentials

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the migration file:
   ```bash
   # In Supabase SQL Editor or using CLI
   supabase db push
   ```
3. Enable Google OAuth (optional) in Authentication settings

### 4. Stripe Setup

1. Create products for each tier:
   - Starter ($99/month)
   - Growth ($249/month)
   - Agency ($599/month)

2. Add price IDs to environment variables
3. Configure webhook endpoint: `/api/stripe/webhook`

### 5. Upstash Setup

1. Create Redis database and QStash in Upstash
2. Add credentials to environment variables

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Features

### 1. Onboarding Flow
- 3-step wizard: Domain setup → Query generation → Plan selection
- AI-powered query generation (200+ questions)
- Stripe Checkout integration

### 2. Probe Engine
- Daily automated probing of AI engines
- Caching system for cost optimization
- Response analysis with GPT-4o-mini
- Retry logic with exponential backoff

### 3. Scoring Algorithm
```
score_for_engine = (queries_with_mention / total_queries_run) * 100
position_bonus = average(1 / mention_position) * 20
sentiment_adjustment = (positive_mentions - negative_mentions) / total_queries_run * 10
overall_score = weighted_average + position_bonus + sentiment_adjustment
```

### 4. Dashboard
- Real-time visibility scores
- Competitor comparisons
- Query performance analytics
- Content recommendations

### 5. Weekly Reports
- Automated Monday morning emails
- Score changes and trends
- Top wins and opportunities
- Content recommendations

## Deployment

### Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Supabase

Ensure RLS policies are active and migrations are applied.

## API Routes

- `POST /api/stripe/webhook` - Stripe webhooks
- `POST /api/probes/trigger` - Manual probe trigger
- `POST /api/scores/calculate` - Manual score calculation

## Next Steps

1. Implement UI components (shadcn/ui)
2. Build authentication pages
3. Create dashboard components
4. Implement probe engine with Upstash QStash
5. Add email templates with React Email
6. Build landing page
7. Add admin panel
8. Implement PDF report generation

## License

MIT