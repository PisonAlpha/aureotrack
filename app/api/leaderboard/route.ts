import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: accounts, error } = await supabaseAdmin
      .from('demo_accounts')
      .select('user_id, balance, starting_balance, users(full_name)')
      .order('balance', { ascending: false })
      .limit(50);

    if (error) throw error;

    const { data: allTrades } = await supabaseAdmin
      .from('demo_trades')
      .select('user_id, status, pnl')
      .eq('status', 'closed');

    const tradeStats: Record<string, { total: number; wins: number }> = {};
    (allTrades || []).forEach(t => {
      if (!tradeStats[t.user_id]) tradeStats[t.user_id] = { total: 0, wins: 0 };
      tradeStats[t.user_id].total += 1;
      if (t.pnl > 0) tradeStats[t.user_id].wins += 1;
    });

    const leaderboard = (accounts || [])
      .map((acc: any) => {
        const returnPercent = ((acc.balance - acc.starting_balance) / acc.starting_balance) * 100;
        const stats = tradeStats[acc.user_id] || { total: 0, wins: 0 };
        const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        return {
          name: acc.users?.full_name || 'Anonymous Trader',
          balance: acc.balance,
          returnPercent,
          totalTrades: stats.total,
          winRate,
        };
      })
      .filter(t => t.totalTrades > 0);

    const byReturn = [...leaderboard].sort((a, b) => b.returnPercent - a.returnPercent).slice(0, 20);
    const byWinRate = [...leaderboard].sort((a, b) => b.winRate - a.winRate).slice(0, 20);

    return NextResponse.json({
      success: true,
      topReturns: byReturn,
      topWinRates: byWinRate,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}