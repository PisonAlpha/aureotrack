const DEXSCREENER_BASE = 'https://api.dexscreener.com/latest/dex';

export interface TokenInfo {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h1?: number;
    h24?: number;
  };
  liquidity?: {
    usd?: number;
  };
  volume?: {
    h24?: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
}

export async function searchToken(query: string): Promise<TokenInfo[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('DexScreener search failed');
    const data = await res.json();
    return data.pairs || [];
  } catch (error) {
    console.error('DexScreener search error:', error);
    return [];
  }
}

export async function getTokenByAddress(chainId: string, address: string): Promise<TokenInfo[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/tokens/${address}`);
    if (!res.ok) throw new Error('DexScreener token fetch failed');
    const data = await res.json();
    return data.pairs || [];
  } catch (error) {
    console.error('DexScreener token error:', error);
    return [];
  }
}

export function calculateRiskScore(token: TokenInfo): { score: number; factors: string[] } {
  let score = 50;
  const factors: string[] = [];

  const liquidity = token.liquidity?.usd || 0;
  if (liquidity < 5000) {
    score -= 25;
    factors.push('Very low liquidity (under $5,000)');
  } else if (liquidity < 20000) {
    score -= 10;
    factors.push('Low liquidity (under $20,000)');
  } else if (liquidity > 100000) {
    score += 15;
    factors.push('Healthy liquidity pool');
  }

  const volume24h = token.volume?.h24 || 0;
  if (liquidity > 0 && volume24h / liquidity > 5) {
    score -= 15;
    factors.push('Unusually high volume-to-liquidity ratio');
  }

  const ageMs = token.pairCreatedAt ? Date.now() - token.pairCreatedAt : 0;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays < 1) {
    score -= 20;
    factors.push('Pair created less than 24 hours ago');
  } else if (ageDays < 7) {
    score -= 10;
    factors.push('Pair created less than 7 days ago');
  } else if (ageDays > 90) {
    score += 15;
    factors.push('Established pair (90+ days old)');
  }

  const priceChange24h = token.priceChange?.h24 || 0;
  if (Math.abs(priceChange24h) > 50) {
    score -= 10;
    factors.push('Extreme price volatility in 24h');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, factors };
}