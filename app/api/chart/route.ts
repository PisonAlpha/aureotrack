import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';

    const [btcRes, goldRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    const btcData = btcRes.ok ? await btcRes.json() : null;

    const btcPrices = (btcData?.prices || []).map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp,
      btc: Math.round(price),
    }));

    const goldApiRes = await fetch(
      `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=1day&outputsize=${days}&apikey=${process.env.TWELVE_DATA_API_KEY}`,
      { next: { revalidate: 3600 } }
    ).catch(() => null);

    const goldData = goldApiRes?.ok ? await goldApiRes.json() : null;
    const goldPrices: Record<string, number> = {};

    if (goldData?.values) {
      goldData.values.forEach((item: any) => {
        const date = new Date(item.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        goldPrices[date] = parseFloat(item.close);
      });
    }

    const combined = btcPrices.map((point: any) => ({
      date: point.date,
      btc: point.btc,
      gold: goldPrices[point.date] || null,
    })).filter((p: any) => p.gold !== null);

    const btcMin = Math.min(...combined.map((p: any) => p.btc));
    const btcMax = Math.max(...combined.map((p: any) => p.btc));
    const goldMin = Math.min(...combined.map((p: any) => p.gold));
    const goldMax = Math.max(...combined.map((p: any) => p.gold));

    const normalized = combined.map((p: any) => ({
      ...p,
      btcNorm: btcMax !== btcMin ? ((p.btc - btcMin) / (btcMax - btcMin)) * 100 : 50,
      goldNorm: goldMax !== goldMin ? ((p.gold - goldMin) / (goldMax - goldMin)) * 100 : 50,
    }));

    const correlation = calculateCorrelation(
      combined.map((p: any) => p.btc),
      combined.map((p: any) => p.gold)
    );

    return NextResponse.json({
      success: true,
      data: normalized,
      correlation: Math.round(correlation * 100) / 100,
      days: parseInt(days),
    });
  } catch (error) {
    console.error('Chart data error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);
  const xMean = xSlice.reduce((a, b) => a + b, 0) / n;
  const yMean = ySlice.reduce((a, b) => a + b, 0) / n;
  const numerator = xSlice.reduce((sum, xi, i) => sum + (xi - xMean) * (ySlice[i] - yMean), 0);
  const denominator = Math.sqrt(
    xSlice.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0) *
    ySlice.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
  );
  return denominator === 0 ? 0 : numerator / denominator;
}