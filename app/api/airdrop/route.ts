import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const { count } = await supabase
      .from('airdrop_whitelist')
      .select('*', { count: 'exact', head: true });

    if (!userId) {
      return NextResponse.json({ success: true, totalWhitelisted: count || 0, isWhitelisted: false });
    }

    const { data: entry } = await supabase
      .from('airdrop_whitelist')
      .select('*')
      .eq('user_id', userId)
      .single();

    return NextResponse.json({
      success: true,
      totalWhitelisted: count || 0,
      isWhitelisted: !!entry,
      entry: entry || null,
    });
  } catch (error) {
    console.error('Airdrop GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch airdrop status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, walletAddress, challengeId, qualifiedVia, tier } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('airdrop_whitelist')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (walletAddress) {
        await supabase
          .from('airdrop_whitelist')
          .update({ wallet_address: walletAddress })
          .eq('user_id', userId);
      }
      return NextResponse.json({ success: true, alreadyWhitelisted: true });
    }

    const { error } = await supabase
      .from('airdrop_whitelist')
      .insert({
        user_id: userId,
        wallet_address: walletAddress || null,
        challenge_id: challengeId || null,
        qualified_via: qualifiedVia || 'challenge',
        tier: tier || 'standard',
      });

    if (error) throw error;

    return NextResponse.json({ success: true, whitelisted: true });
  } catch (error) {
    console.error('Airdrop POST error:', error);
    return NextResponse.json({ error: 'Failed to whitelist user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, walletAddress } = await request.json();
    if (!userId || !walletAddress) {
      return NextResponse.json({ error: 'User ID and wallet address required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('airdrop_whitelist')
      .update({ wallet_address: walletAddress })
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Airdrop PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update wallet address' }, { status: 500 });
  }
}