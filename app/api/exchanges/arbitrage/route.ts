import { NextRequest, NextResponse } from 'next/server';
import { getArbitrageData } from '@/lib/exchanges';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = (searchParams.get('symbol') || 'BTC').toUpperCase();

    const prices = await getArbitrageData(symbol);

    if (prices.length === 0) {
      return NextResponse.json({ error: 'Could not fetch prices from any exchange' }, { status: 404 });
    }

    const sorted = [...prices].sort((a, b) => a.price - b.price);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const spreadAmount = highest.price - lowest.price;
    const spreadPercent = (spreadAmount / lowest.price) * 100;

    return NextResponse.json({
      success: true,
      symbol,
      prices: sorted,
      lowest,
      highest,
      spreadAmount,
      spreadPercent,
    });
  } catch (error) {
    console.error('Arbitrage scan error:', error);
    return NextResponse.json({ error: 'Failed to fetch arbitrage data' }, { status: 500 });
  }
}