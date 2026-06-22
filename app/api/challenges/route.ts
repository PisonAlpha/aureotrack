import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const { data: challenges, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    let participations: any[] = [];
    if (userId) {
      const { data } = await supabaseAdmin
        .from('challenge_participants')
        .select('*')
        .eq('user_id', userId);
      participations = data || [];
    }

    let currentBalance = 0;
    if (userId) {
      const { data: account } = await supabaseAdmin
        .from('demo_accounts')
        .select('balance')
        .eq('user_id', userId)
        .single();
      currentBalance = account?.balance || 0;
    }

    const { data: closedTrades } = userId ? await supabaseAdmin
      .from('demo_trades')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'closed') : { data: [] };

    const enriched = challenges.map(challenge => {
      const participation = participations.find(p => p.challenge_id === challenge.id);
      let progress = 0;
      let isComplete = false;

      if (participation) {
        if (challenge.challenge_type === 'growth_target') {
          const gainPercent = ((currentBalance - participation.starting_balance) / participation.starting_balance) * 100;
          progress = Math.min(100, Math.max(0, (gainPercent / challenge.target_value) * 100));
          isComplete = gainPercent >= challenge.target_value;
        } else if (challenge.challenge_type === 'risk_discipline') {
          const tradesSinceJoin = (closedTrades || []).filter((t: any) => new Date(t.opened_at) >= new Date(participation.joined_at));
          progress = Math.min(100, (tradesSinceJoin.length / challenge.target_value) * 100);
          isComplete = tradesSinceJoin.length >= challenge.target_value;
        } else {
          progress = 0;
        }
      }

      return {
        ...challenge,
        joined: !!participation,
        progress,
        isComplete,
        status: participation?.status || null,
      };
    });

    return NextResponse.json({ success: true, challenges: enriched });
  } catch (error) {
    console.error('Challenges fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, challengeId } = await request.json();

    if (!userId || !challengeId) {
      return NextResponse.json({ error: 'User ID and Challenge ID required' }, { status: 400 });
    }

    const { data: account } = await supabaseAdmin
      .from('demo_accounts')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (!account) {
      return NextResponse.json({ error: 'Demo account not found' }, { status: 404 });
    }

    const { data: existing } = await supabaseAdmin
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'You have already joined this challenge' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        starting_balance: account.balance,
      });

    if (error) throw error;

    // Auto-whitelist user for TGE airdrop when they join any challenge
    try {
      const { data: alreadyWhitelisted } = await supabaseAdmin
        .from('airdrop_whitelist')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!alreadyWhitelisted) {
        await supabaseAdmin
          .from('airdrop_whitelist')
          .insert({
            user_id: userId,
            challenge_id: challengeId,
            qualified_via: 'challenge',
            tier: 'standard',
          });
      }
    } catch (whitelistError) {
      // Don't fail the challenge join if whitelist insertion fails
      console.error('Whitelist insert error:', whitelistError);
    }

    return NextResponse.json({ success: true, whitelisted: true });
  } catch (error) {
    console.error('Challenge join error:', error);
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 });
  }
}