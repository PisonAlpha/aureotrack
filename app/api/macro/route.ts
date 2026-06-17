import { NextResponse } from 'next/server';
import { getMacroAssetPrices } from '@/lib/coingecko';
import { getCommodityPrices } from '@/lib/twelvedata';

export async function GET() {
  try {
    const prices = await getMacroAssetPrices();
    const commodities = await getCommodityPrices();

    const commodityAssets = commodities.map(c => ({
      id: c.symbol.toLowerCase(),
      symbol: c.symbol,
      name: c.name,
      current_price: c.price,
      price_change_percentage_24h: c.percent_change_24h,
      price_change_percentage_7d_in_currency: undefined,
      market_cap: 0,
      total_volume: 0,
    }));

    const allAssets = [...prices, ...commodityAssets];

    let riskScore = 50;
    const btc = prices.find(p => p.id === 'bitcoin');
    if (btc) {
      if (btc.price_change_percentage_24h > 3) riskScore += 20;
      else if (btc.price_change_percentage_24h > 0) riskScore += 10;
      else if (btc.price_change_percentage_24h < -3) riskScore -= 20;
      else if (btc.price_change_percentage_24h < 0) riskScore -= 10;
    }
    riskScore = Math.max(0, Math.min(100, riskScore));

    let sentiment = 'Neutral';
    if (riskScore >= 65) sentiment = 'Risk On';
    else if (riskScore <= 35) sentiment = 'Risk Off';

    return NextResponse.json({
      success: true,
      assets: allAssets,
      riskSentiment: {
        score: riskScore,
        label: sentiment,
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Macro API error:', error);
    return NextResponse.json({ error: 'Failed to fetch macro data' }, { status: 500 });
  }
}