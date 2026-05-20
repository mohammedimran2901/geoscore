export type SubscriptionTier = 'free' | 'starter' | 'growth' | 'agency';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';
export type QueryCategory = 'problem_aware' | 'solution_aware' | 'product_aware' | 'comparison' | 'best_of' | 'how_to' | 'alternative';
export type Engine = 'chatgpt' | 'perplexity' | 'google_aio' | 'claude';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'not_mentioned';
export type RecommendationType = 'create_content' | 'update_existing' | 'build_citations' | 'improve_entity';
export type Priority = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  created_at: string;
}

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  brand_name: string;
  business_description: string | null;
  target_keywords: string[] | null;
  competitor_domains: string[] | null;
  created_at: string;
  last_scanned_at: string | null;
  is_active: boolean;
}

export interface ProbeQuery {
  id: string;
  domain_id: string;
  query_text: string;
  query_category: QueryCategory;
  is_active: boolean;
  created_at: string;
}

export interface ProbeResult {
  id: string;
  probe_query_id: string;
  domain_id: string;
  engine: Engine;
  raw_response: string;
  brand_mentioned: boolean;
  mention_position: number | null;
  mention_context: string | null;
  competitor_mentions: Record<string, number> | null;
  response_sentiment: Sentiment;
  probed_at: string;
  cache_key: string | null;
  status?: 'success' | 'error';
  error_message?: string | null;
}

export interface VisibilityScore {
  id: string;
  domain_id: string;
  score_date: string;
  overall_score: number;
  chatgpt_score: number;
  perplexity_score: number;
  google_aio_score: number | null;
  claude_score: number;
  total_queries_run: number;
  queries_with_mention: number;
  avg_mention_position: number | null;
  top_mentioned_topics: string[] | null;
  competitor_scores: Record<string, number> | null;
  calculated_at: string;
}

export interface ContentRecommendation {
  id: string;
  domain_id: string;
  recommendation_type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  ai_query_gap: string | null;
  generated_at: string;
  is_dismissed: boolean;
}

export interface WeeklyReport {
  id: string;
  domain_id: string;
  week_start: string;
  score_change: number;
  summary_text: string;
  top_win: string | null;
  top_opportunity: string | null;
  email_sent_at: string | null;
}

export interface GeneratedQuery {
  query_text: string;
  query_category: QueryCategory;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: {
    domains: number;
    queriesPerDay: number;
    engines: Engine[];
    historyDays: number;
    competitorTracking: number;
  };
}