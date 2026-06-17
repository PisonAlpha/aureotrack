import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { tradeId, exitPrice } = await request.json();

    if (!tradeId || !exitPrice) {
      return NextResponse.json({ error: 'Trade ID and exit price required' }, { status: 400 });
    }

    const { data: trade, error: tradeError } = await supabaseAdmin
      .from('demo_trades')
      .select('*')
      .eq('id', tradeId)
      .single();

    if (tradeError || !trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    if (trade.status !== 'open') {
      return NextResponse.json({ error: 'Trade is already closed' }, { status: 400 });
    }

    const priceDiff = trade.side === 'long'
      ? exitPrice - trade.entry_price
      : trade.entry_price - exitPrice;

    const pnl = priceDiff * trade.quantity * trade.leverage;
    const positionValue = trade.entry_price * trade.quantity;
    const marginUsed = positionValue / trade.leverage;
    const pnlPercent = (pnl / marginUsed) * 100;

    const { error: updateError } = await supabaseAdmin
      .from('demo_trades')
      .update({
        exit_price: exitPrice,
        status: 'closed',
        pnl,
        pnl_percent: pnlPercent,
        closed_at: new Date().toISOString(),
      })
      .eq('id', tradeId);

    if (updateError) throw updateError;

    const { data: account } = await supabaseAdmin
      .from('demo_accounts')
      .select('*')
      .eq('id', trade.account_id)
      .single();

    if (account) {
      const newBalance = account.balance + marginUsed + pnl;
      await supabaseAdmin
        .from('demo_accounts')
        .update({ balance: newBalance })
        .eq('id', account.id);
    }

    return NextResponse.json({
      success: true,
      pnl,
      pnlPercent,
      marginReturned: marginUsed,
    });
  } catch (error) {
    console.error('Trade close error:', error);
    return NextResponse.json({ error: 'Failed to close trade' }, { status: 500 });
  }
}