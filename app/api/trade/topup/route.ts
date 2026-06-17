import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid user ID and amount required' }, { status: 400 });
    }

    const { data: account, error: accountError } = await supabaseAdmin
      .from('demo_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const newBalance = account.balance + parseFloat(amount);

    const { error: updateError } = await supabaseAdmin
      .from('demo_accounts')
      .update({ balance: newBalance })
      .eq('id', account.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, newBalance });
  } catch (error) {
    console.error('Top up error:', error);
    return NextResponse.json({ error: 'Failed to top up account' }, { status: 500 });
  }
}
