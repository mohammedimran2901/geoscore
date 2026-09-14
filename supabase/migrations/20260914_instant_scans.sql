-- Instant Scan leaderboard table
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.instant_scans (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  category text not null,
  score integer not null check (score between 0 and 100),
  chatgpt_score integer,
  chatgpt_mention_rate integer,
  perplexity_score integer,
  perplexity_mention_rate integer,
  competitors jsonb default '[]'::jsonb,
  roast text,
  created_at timestamptz not null default now()
);

-- Anyone can read the public leaderboard; only the service role writes.
alter table public.instant_scans enable row level security;

drop policy if exists "Public read access" on public.instant_scans;
create policy "Public read access"
  on public.instant_scans for select
  to anon, authenticated
  using (true);

create index if not exists instant_scans_score_idx
  on public.instant_scans (score desc, created_at desc);
