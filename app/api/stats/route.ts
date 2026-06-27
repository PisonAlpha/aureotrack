import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      userCount: count || 0,
      displayCount: count && count >= 600 ? '600+' : count + '+',
    });
  } catch (error) {
    return NextResponse.json({ success: false, userCount: 0, displayCount: '600+' });
  }
}