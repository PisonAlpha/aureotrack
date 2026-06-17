import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getMacroAssetPrices } from '@/lib/coingecko';
import { getCommodityPrices, getForexPrice } from '@/lib/twelvedata';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FOREX_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const asset = searchParams.get('asset') || 'bitcoin';

    const prices = await getMacroAssetPrices();
    const commodities = await getCommodityPrices();

    let marketContext: any;
    let displaySymbol: string;
    let displayPrice: number;

    if (FOREX_PAIRS.includes(asset)) {
      const forex = await getForexPrice(asset);
      if (!forex) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      displaySymbol = forex.symbol;
      displayPrice = forex.price;
      marketContext = {
        asset: forex.symbol,
        assetType: 'forex',
        price: forex.price,
        change24h: forex.percent_change_24h,
        cryptoMarket: prices.map(p => ({ symbol: p.symbol, change24h: p.price_change_percentage_24h })),
        gold: commodities.find(c => c.symbol === 'XAU'),
      };
    } else if (asset === 'XAU' || asset === 'gold') {
      const gold = commodities.find(c => c.symbol === 'XAU');
      if (!gold) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      displaySymbol = gold.symbol;
      displayPrice = gold.price;
      marketContext = {
        asset: gold.symbol,
        assetType: 'commodity',
        price: gold.price,
        change24h: gold.percent_change_24h,
        cryptoMarket: prices.map(p => ({ symbol: p.symbol, change24h: p.price_change_percentage_24h })),
      };
    } else {
      const target = prices.find(p => p.id === asset || p.symbol.toLowerCase() === asset.toLowerCase());
      if (!target) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      displaySymbol = target.symbol;
      displayPrice = target.current_price;
      marketContext = {
        asset: target.symbol,
        assetType: 'crypto',
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
    }

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
      asset: displaySymbol,
      currentPrice: displayPrice,
      analysis,
    });
  } catch (error) {
    console.error('AI market analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}