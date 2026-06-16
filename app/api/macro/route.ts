import { NextResponse } from 'next/server';
import { getMacroAssetPrices } from '@/lib/coingecko';

export async function GET() {
  try {
    const prices = await getMacroAssetPrices();

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
      assets: prices,
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