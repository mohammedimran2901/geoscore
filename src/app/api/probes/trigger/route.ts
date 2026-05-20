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

    // Verify domain belongs to user
    const { data: domain } = await supabase
      .from('domains')
      .select('*')
      .eq('id', domainId)
      .eq('user_id', user.id)
      .single()

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    // Get active queries for domain
    const { data: queries } = await supabase
      .from('probe_queries')
      .select('*')
      .eq('domain_id', domainId)
      .eq('is_active', true)

    if (!queries || queries.length === 0) {
      return NextResponse.json({ error: 'No active queries found' }, { status: 400 })
    }

    // In production, this would queue jobs with QStash
    // For now, return success with count
    return NextResponse.json({
      success: true,
      message: `${queries.length} queries queued for probing`,
      domain: domain.domain,
      queryCount: queries.length
    })
  } catch (error) {
    console.error('Probe trigger error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}