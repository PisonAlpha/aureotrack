import { NextResponse } from 'next/server';
import { getMacroAssetPrices } from '@/lib/coingecko';
import { getCommodityPrices } from '@/lib/twelvedata';

export async function GET() {
  try {
    const [prices, commodities] = await Promise.all([
      getMacroAssetPrices(),
      getCommodityPrices(),
    ]);

    const commodityAssets = commodities.map(c => ({
      id: c.symbol.toLowerCase(),
      symbol: c.symbol,
      name: c.name,
      current_price: c.price,
      price_change_percentage_24h: c.percent_change_24h,
      price_change_percentage_7d_in_currency: undefined,
      market_cap: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      type: 'commodity',
    }));

    const cryptoAssets = prices.map(p => ({ ...p, type: 'crypto' }));
    const allAssets = [...cryptoAssets, ...commodityAssets];

    const btc = prices.find(p => p.id === 'bitcoin');
    let riskScore = 50;
    if (btc) {
      if (btc.price_change_percentage_24h > 3) riskScore += 20;
      else if (btc.price_change_percentage_24h > 0) riskScore += 10;
      else if (btc.price_change_percentage_24h < -3) riskScore -= 20;
      else if (btc.price_change_percentage_24h < 0) riskScore -= 10;
    }
    riskScore = Math.max(0, Math.min(100, riskScore));
    const sentiment = riskScore >= 65 ? 'Risk On' : riskScore <= 35 ? 'Risk Off' : 'Neutral';

    const totalMarketCap = prices.reduce((sum, p) => sum + (p.market_cap || 0), 0);
    const totalVolume = prices.reduce((sum, p) => sum + (p.total_volume || 0), 0);
    const gainers = prices.filter(p => p.price_change_percentage_24h > 0).length;
    const losers = prices.filter(p => p.price_change_percentage_24h < 0).length;

    return NextResponse.json({
      success: true,
      assets: allAssets,
      marketStats: { totalMarketCap, totalVolume, gainers, losers },
      riskSentiment: { score: riskScore, label: sentiment },
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Macro API error:', error);
    return NextResponse.json({ error: 'Failed to fetch macro data' }, { status: 500 });
  }
}