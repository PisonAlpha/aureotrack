import { NextRequest, NextResponse } from 'next/server';
import { searchToken, getTokenByAddress, calculateRiskScore } from '@/lib/dexscreener';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const chain = searchParams.get('chain');

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    let pairs;
    const isAddress = query.startsWith('0x') && query.length === 42;

    if (isAddress) {
      pairs = await getTokenByAddress(chain || '', query);
    } else {
      pairs = await searchToken(query);
    }

    if (!pairs || pairs.length === 0) {
      return NextResponse.json({ success: true, found: false, message: 'No token found matching this query' });
    }

    pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
    const topPairs = pairs.slice(0, 5);

    const enriched = topPairs.map(pair => {
      const risk = calculateRiskScore(pair);
      return {
        chainId: pair.chainId,
        dexId: pair.dexId,
        pairAddress: pair.pairAddress,
        tokenName: pair.baseToken.name,
        tokenSymbol: pair.baseToken.symbol,
        tokenAddress: pair.baseToken.address,
        quoteSymbol: pair.quoteToken.symbol,
        priceUsd: pair.priceUsd,
        priceChange24h: pair.priceChange?.h24 || 0,
        liquidityUsd: pair.liquidity?.usd || 0,
        volume24h: pair.volume?.h24 || 0,
        marketCap: pair.marketCap || pair.fdv || 0,
        pairCreatedAt: pair.pairCreatedAt,
        riskScore: risk.score,
        riskFactors: risk.factors,
      };
    });

    return NextResponse.json({ success: true, found: true, results: enriched });
  } catch (error) {
    console.error('Token scan error:', error);
    return NextResponse.json({ error: 'Failed to scan token' }, { status: 500 });
  }
}