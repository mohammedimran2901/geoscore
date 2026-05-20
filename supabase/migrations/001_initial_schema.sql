-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'growth', 'agency');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled');
CREATE TYPE query_category AS ENUM ('problem_aware', 'solution_aware', 'product_aware', 'comparison', 'best_of', 'how_to', 'alternative');
CREATE TYPE engine AS ENUM ('chatgpt', 'perplexity', 'google_aio', 'claude');
CREATE TYPE sentiment AS ENUM ('positive', 'neutral', 'negative', 'not_mentioned');
CREATE TYPE recommendation_type AS ENUM ('create_content', 'update_existing', 'build_citations', 'improve_entity');
CREATE TYPE priority AS ENUM ('high', 'medium', 'low');

-- Users table (extends auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    stripe_customer_id TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'trialing',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domains table
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    business_description TEXT,
    target_keywords TEXT[],
    competitor_domains TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Probe queries table
CREATE TABLE probe_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    query_category query_category NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Probe results table
CREATE TABLE probe_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    probe_query_id UUID NOT NULL REFERENCES probe_queries(id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    engine engine NOT NULL,
    raw_response TEXT NOT NULL,
    brand_mentioned BOOLEAN NOT NULL,
    mention_position INTEGER,
    mention_context TEXT,
    competitor_mentions JSONB,
    response_sentiment sentiment NOT NULL DEFAULT 'not_mentioned',
    probed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cache_key TEXT,
    status TEXT DEFAULT 'success',
    error_message TEXT
);

-- Visibility scores table
CREATE TABLE visibility_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    score_date DATE NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    chatgpt_score DECIMAL(5,2) NOT NULL,
    perplexity_score DECIMAL(5,2) NOT NULL,
    google_aio_score DECIMAL(5,2),
    claude_score DECIMAL(5,2) NOT NULL,
    total_queries_run INTEGER NOT NULL,
    queries_with_mention INTEGER NOT NULL,
    avg_mention_position DECIMAL(5,2),
    top_mentioned_topics TEXT[],
    competitor_scores JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content recommendations table
CREATE TABLE content_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    recommendation_type recommendation_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority priority NOT NULL DEFAULT 'medium',
    ai_query_gap TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_dismissed BOOLEAN DEFAULT false
);

-- Weekly reports table
CREATE TABLE weekly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    score_change DECIMAL(5,2) NOT NULL,
    summary_text TEXT NOT NULL,
    top_win TEXT,
    top_opportunity TEXT,
    email_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_domains_is_active ON domains(is_active);
CREATE INDEX idx_probe_queries_domain_id ON probe_queries(domain_id);
CREATE INDEX idx_probe_queries_category ON probe_queries(query_category);
CREATE INDEX idx_probe_results_domain_id ON probe_results(domain_id);
CREATE INDEX idx_probe_results_engine ON probe_results(engine);
CREATE INDEX idx_probe_results_probed_at ON probe_results(probed_at);
CREATE INDEX idx_probe_results_cache_key ON probe_results(cache_key);
CREATE INDEX idx_visibility_scores_domain_id ON visibility_scores(domain_id);
CREATE INDEX idx_visibility_scores_date ON visibility_scores(score_date);
CREATE INDEX idx_content_recommendations_domain_id ON content_recommendations(domain_id);
CREATE INDEX idx_weekly_reports_domain_id ON weekly_reports(domain_id);

-- Create unique constraint for daily scores
CREATE UNIQUE INDEX idx_visibility_scores_domain_date ON visibility_scores(domain_id, score_date);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE probe_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE probe_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE visibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for domains table
CREATE POLICY "Users can read own domains" ON domains
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own domains" ON domains
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domains" ON domains
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own domains" ON domains
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for probe_queries table
CREATE POLICY "Users can read own probe queries" ON probe_queries
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = probe_queries.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own probe queries" ON probe_queries
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = probe_queries.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Users can update own probe queries" ON probe_queries
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = probe_queries.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own probe queries" ON probe_queries
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = probe_queries.domain_id AND domains.user_id = auth.uid()
    ));

-- RLS Policies for probe_results table
CREATE POLICY "Users can read own probe results" ON probe_results
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = probe_results.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Service role can insert probe results" ON probe_results
    FOR INSERT WITH CHECK (true);

-- RLS Policies for visibility_scores table
CREATE POLICY "Users can read own visibility scores" ON visibility_scores
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = visibility_scores.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Service role can insert visibility scores" ON visibility_scores
    FOR INSERT WITH CHECK (true);

-- RLS Policies for content_recommendations table
CREATE POLICY "Users can read own recommendations" ON content_recommendations
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = content_recommendations.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Users can update own recommendations" ON content_recommendations
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = content_recommendations.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Service role can insert recommendations" ON content_recommendations
    FOR INSERT WITH CHECK (true);

-- RLS Policies for weekly_reports table
CREATE POLICY "Users can read own weekly reports" ON weekly_reports
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM domains WHERE domains.id = weekly_reports.domain_id AND domains.user_id = auth.uid()
    ));

CREATE POLICY "Service role can insert weekly reports" ON weekly_reports
    FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, trial_ends_at)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NOW() + INTERVAL '7 days'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();