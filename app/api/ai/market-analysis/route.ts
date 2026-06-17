import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getMacroAssetPrices } from '@/lib/coingecko';
import { getCommodityPrices } from '@/lib/twelvedata';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const asset = searchParams.get('asset') || 'bitcoin';

    const prices = await getMacroAssetPrices();
    const commodities = await getCommodityPrices();

    const target = prices.find(p => p.id === asset || p.symbol.toLowerCase() === asset.toLowerCase());

    if (!target) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const marketContext = {
      asset: target.symbol,
      price: target.current_price,
      change24h: target.price_change_percentage_24h,
      change7d: target.price_change_percentage_7d_in_currency,
      volume: target.total_volume,
      marketCap: target.market_cap,
      otherAssets: prices.filter(p => p.id !== target.id).map(p => ({
        symbol: p.symbol,
        change24h: p.price_change_percentage_24h,
      })),
      gold: commodities.find(c => c.symbol === 'XAU'),
    };

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: 'You are a market analyst for AureoTrack, a trading intelligence platform. Analyze the following real-time market data and provide a structured outlook.\n\n' +
          'Market Data:\n' + JSON.stringify(marketContext, null, 2) + '\n\n' +
          'Respond ONLY with valid JSON, no markdown, no preamble, in this exact format:\n' +
          '{ "outlook": "Bullish" | "Neutral" | "Bearish", "bullishProbability": number (0-100), "neutralProbability": number (0-100), "bearishProbability": number (0-100), "summary": "2-3 sentence analysis", "keyFactors": ["factor1", "factor2", "factor3"] }\n\n' +
          'The three probabilities must sum to 100. Base your analysis on the actual price action, momentum, and cross-asset correlation shown in the data. Be specific and reference actual numbers from the data provided.',
      }],
    });

    const textBlock = message.content.find(c => c.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);

    return NextResponse.json({
      success: true,
      asset: target.symbol,
      currentPrice: target.current_price,
      analysis,
    });
  } catch (error) {
    console.error('AI market analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}