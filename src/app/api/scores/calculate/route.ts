import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { domainId } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent probe results
    const { data: results } = await supabase
      .from('probe_results')
      .select('*')
      .eq('domain_id', domainId)
      .gte('probed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'No probe results found' }, { status: 400 })
    }

    // Calculate scores by engine
    const engines = ['chatgpt', 'perplexity', 'google_aio', 'claude'] as const
    const scores: Record<string, number> = {}
    
    engines.forEach(engine => {
      const engineResults = results.filter(r => r.engine === engine)
      if (engineResults.length === 0) {
        scores[engine] = 0
        return
      }
      
      const mentions = engineResults.filter(r => r.brand_mentioned).length
      const mentionRate = (mentions / engineResults.length) * 100
      
      // Position bonus (average of 1/position)
      const positions = engineResults
        .filter(r => r.mention_position)
        .map(r => 1 / (r.mention_position || 1))
      const positionBonus = positions.length > 0 
        ? (positions.reduce((a, b) => a + b, 0) / positions.length) * 20 
        : 0
      
      scores[engine] = Math.min(100, mentionRate + positionBonus)
    })

    // Overall weighted score
    const overallScore = (
      (scores.chatgpt || 0) * 0.35 +
      (scores.perplexity || 0) * 0.30 +
      (scores.google_aio || 0) * 0.25 +
      (scores.claude || 0) * 0.10
    )

    // Save to database
    const { error } = await supabase
      .from('visibility_scores')
      .insert({
        domain_id: domainId,
        score_date: new Date().toISOString().split('T')[0],
        overall_score: Math.round(overallScore),
        chatgpt_score: Math.round(scores.chatgpt || 0),
        perplexity_score: Math.round(scores.perplexity || 0),
        google_aio_score: scores.google_aio ? Math.round(scores.google_aio) : null,
        claude_score: Math.round(scores.claude || 0),
        total_queries_run: results.length,
        queries_with_mention: results.filter(r => r.brand_mentioned).length,
      })

    if (error) throw error

    return NextResponse.json({
      success: true,
      scores: {
        overall: Math.round(overallScore),
        ...scores
      }
    })
  } catch (error) {
    console.error('Score calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}