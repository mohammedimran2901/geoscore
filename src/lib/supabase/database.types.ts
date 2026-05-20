export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      domains: {
        Row: {
          brand_name: string
          business_description: string | null
          competitor_domains: string[] | null
          created_at: string
          domain: string
          id: string
          is_active: boolean
          last_scanned_at: string | null
          target_keywords: string[] | null
          user_id: string
        }
        Insert: {
          brand_name: string
          business_description?: string | null
          competitor_domains?: string[] | null
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          last_scanned_at?: string | null
          target_keywords?: string[] | null
          user_id: string
        }
        Update: {
          brand_name?: string
          business_description?: string | null
          competitor_domains?: string[] | null
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          last_scanned_at?: string | null
          target_keywords?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      probe_queries: {
        Row: {
          created_at: string
          domain_id: string
          id: string
          is_active: boolean
          query_category: string
          query_text: string
        }
        Insert: {
          created_at?: string
          domain_id: string
          id?: string
          is_active?: boolean
          query_category: string
          query_text: string
        }
        Update: {
          created_at?: string
          domain_id?: string
          id?: string
          is_active?: boolean
          query_category?: string
          query_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "probe_queries_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      probe_results: {
        Row: {
          brand_mentioned: boolean
          cache_key: string | null
          competitor_mentions: Json | null
          domain_id: string
          engine: string
          error_message: string | null
          id: string
          mention_context: string | null
          mention_position: number | null
          probe_query_id: string
          probed_at: string
          raw_response: string
          response_sentiment: string
          status: string | null
        }
        Insert: {
          brand_mentioned: boolean
          cache_key?: string | null
          competitor_mentions?: Json | null
          domain_id: string
          engine: string
          error_message?: string | null
          id?: string
          mention_context?: string | null
          mention_position?: number | null
          probe_query_id: string
          probed_at?: string
          raw_response: string
          response_sentiment: string
          status?: string | null
        }
        Update: {
          brand_mentioned?: boolean
          cache_key?: string | null
          competitor_mentions?: Json | null
          domain_id?: string
          engine?: string
          error_message?: string | null
          id?: string
          mention_context?: string | null
          mention_position?: number | null
          probe_query_id?: string
          probed_at?: string
          raw_response?: string
          response_sentiment?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "probe_results_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "probe_results_probe_query_id_fkey"
            columns: ["probe_query_id"]
            isOneToOne: false
            referencedRelation: "probe_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          subscription_status: string
          subscription_tier: string
          trial_ends_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          trial_ends_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      visibility_scores: {
        Row: {
          avg_mention_position: number | null
          calculated_at: string
          chatgpt_score: number
          claude_score: number
          competitor_scores: Json | null
          domain_id: string
          google_aio_score: number | null
          id: string
          overall_score: number
          perplexity_score: number
          queries_with_mention: number
          score_date: string
          top_mentioned_topics: string[] | null
          total_queries_run: number
        }
        Insert: {
          avg_mention_position?: number | null
          calculated_at?: string
          chatgpt_score: number
          claude_score: number
          competitor_scores?: Json | null
          domain_id: string
          google_aio_score?: number | null
          id?: string
          overall_score: number
          perplexity_score: number
          queries_with_mention: number
          score_date: string
          top_mentioned_topics?: string[] | null
          total_queries_run: number
        }
        Update: {
          avg_mention_position?: number | null
          calculated_at?: string
          chatgpt_score?: number
          claude_score?: number
          competitor_scores?: Json | null
          domain_id?: string
          google_aio_score?: number | null
          id?: string
          overall_score?: number
          perplexity_score?: number
          queries_with_mention?: number
          score_date?: string
          top_mentioned_topics?: string[] | null
          total_queries_run?: number
        }
        Relationships: [
          {
            foreignKeyName: "visibility_scores_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      content_recommendations: {
        Row: {
          id: string
          domain_id: string
          recommendation_type: string
          title: string
          description: string
          priority: string
          ai_query_gap: string | null
          generated_at: string
          is_dismissed: boolean
        }
        Insert: {
          id?: string
          domain_id: string
          recommendation_type: string
          title: string
          description: string
          priority: string
          ai_query_gap?: string | null
          generated_at?: string
          is_dismissed?: boolean
        }
        Update: {
          id?: string
          domain_id?: string
          recommendation_type?: string
          title?: string
          description?: string
          priority?: string
          ai_query_gap?: string | null
          generated_at?: string
          is_dismissed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "content_recommendations_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          id: string
          domain_id: string
          week_start: string
          score_change: number
          summary_text: string
          top_win: string | null
          top_opportunity: string | null
          email_sent_at: string | null
        }
        Insert: {
          id?: string
          domain_id: string
          week_start: string
          score_change: number
          summary_text: string
          top_win?: string | null
          top_opportunity?: string | null
          email_sent_at?: string | null
        }
        Update: {
          id?: string
          domain_id?: string
          week_start?: string
          score_change?: number
          summary_text?: string
          top_win?: string | null
          top_opportunity?: string | null
          email_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}