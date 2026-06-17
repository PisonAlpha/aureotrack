import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: account, error: accountError } = await supabaseAdmin
      .from('demo_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const { data: openTrades } = await supabaseAdmin
      .from('demo_trades')
      .select('*')
      .eq('account_id', account.id)
      .eq('status', 'open')
      .order('opened_at', { ascending: false });

    const { data: closedTrades } = await supabaseAdmin
      .from('demo_trades')
      .select('*')
      .eq('account_id', account.id)
      .eq('status', 'closed')
      .order('closed_at', { ascending: false })
      .limit(50);

    const totalTrades = closedTrades?.length || 0;
    const winningTrades = closedTrades?.filter(t => t.pnl > 0).length || 0;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalPnl = closedTrades?.reduce((sum, t) => sum + (t.pnl || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      account,
      openTrades: openTrades || [],
      closedTrades: closedTrades || [],
      stats: {
        totalTrades,
        winningTrades,
        winRate,
        totalPnl,
        totalReturn: ((account.balance - account.starting_balance) / account.starting_balance) * 100,
      },
    });
  } catch (error) {
    console.error('Account fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 });
  }
}