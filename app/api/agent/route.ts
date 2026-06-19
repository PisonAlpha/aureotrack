import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || message.trim().length < 1) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const conversationHistory = (history || []).slice(-8).map((h: any) => ({
      role: h.role,
      content: h.content,
    }));

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: `You are AureoAI, the intelligent assistant for AureoTrack — a macro and crypto trading intelligence platform. You help users navigate the platform and answer trading/finance questions.

AureoTrack features:
- Markets Dashboard (/) — live crypto and commodity prices, market overview
- Intelligence (/markets) — BTC/Gold correlation chart, live crypto and global economy news
- Demo Trading Terminal (/trade) — spot and futures trading with $100,000 virtual funds, leverage up to 20x
- Crypto Intelligence (/crypto) — token scanner, liquidity analysis, rug pull risk detection
- AI Market Intelligence (/ai) — AI analysis for crypto, gold, forex pairs, event impact simulator
- Portfolio Intelligence (/portfolio) — multi-chain wallet tracking (BNB, ETH, Polygon, Base, Solana)
- Exchange Intelligence (/exchanges) — arbitrage scanner across OKX, KuCoin, Gate.io, MEXC
- AureoAcademy (/academy) — 6 trading schools, 60+ lessons, certifications, AI mentor, community
- Leaderboard (/leaderboard) — top demo traders by return and win rate
- Trading Challenges (/challenges) — structured challenges with badges

Keep answers concise (2-4 sentences max). Use plain text, no markdown. If a user asks about a feature, tell them where to find it. If they ask a trading or finance question, answer clearly and simply. Always be helpful, friendly, and professional.`,
      messages: [...conversationHistory, { role: 'user', content: message }],
    });

    const textBlock = msg.content.find(c => c.type === 'text');
    const answer = textBlock && 'text' in textBlock ? textBlock.text : 'Sorry, I could not generate a response.';

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}