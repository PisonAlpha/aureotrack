import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      assetSymbol,
      assetType,
      side,
      orderType,
      entryPrice,
      quantity,
      leverage,
      stopLoss,
      takeProfit,
    } = await request.json();

    if (!userId || !assetSymbol || !side || !entryPrice || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: account, error: accountError } = await supabaseAdmin
      .from('demo_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: 'Demo account not found' }, { status: 404 });
    }

    const positionValue = entryPrice * quantity;
    const marginRequired = positionValue / (leverage || 1);

    if (marginRequired > account.balance) {
      return NextResponse.json({ error: 'Insufficient demo balance for this position' }, { status: 400 });
    }

    const { data: trade, error: tradeError } = await supabaseAdmin
      .from('demo_trades')
      .insert({
        account_id: account.id,
        user_id: userId,
        asset_symbol: assetSymbol.toUpperCase(),
        asset_type: assetType || 'crypto',
        side,
        order_type: orderType || 'market',
        entry_price: entryPrice,
        quantity,
        leverage: leverage || 1,
        stop_loss: stopLoss || null,
        take_profit: takeProfit || null,
        status: 'open',
      })
      .select()
      .single();

    if (tradeError) throw tradeError;

    const newBalance = account.balance - marginRequired;
    await supabaseAdmin
      .from('demo_accounts')
      .update({ balance: newBalance })
      .eq('id', account.id);

    return NextResponse.json({ success: true, trade, newBalance });
  } catch (error) {
    console.error('Trade open error:', error);
    return NextResponse.json({ error: 'Failed to open trade' }, { status: 500 });
  }
}