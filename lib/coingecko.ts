const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface AssetPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

const TRACKED_IDS = [
  // Top 10
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple',
  'dogecoin', 'cardano', 'tron', 'avalanche-2', 'chainlink',
  // DeFi & Layer 2
  'uniswap', 'polkadot', 'matic-network', 'litecoin', 'cosmos',
  'near', 'optimism', 'arbitrum', 'aptos', 'sui',
  // Meme coins
  'shiba-inu', 'pepe', 'floki', 'bonk',
  // Other majors
  'stellar', 'vechain', 'filecoin', 'internet-computer', 'hedera-hashgraph',
  'render-token', 'the-sandbox', 'decentraland', 'axie-infinity', 'gala',
];

export async function getMacroAssetPrices(): Promise<AssetPrice[]> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${TRACKED_IDS.join(',')}&price_change_percentage=24h,7d`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('CoinGecko fetch failed');
    const data = await res.json();
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
    }));
  } catch (error) {
    console.error('CoinGecko error:', error);
    return [];
  }
}

export async function getTokenData(query: string): Promise<AssetPrice[]> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${query}&price_change_percentage=24h,7d`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('CoinGecko fetch failed');
    const data = await res.json();
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
    }));
  } catch (error) {
    console.error('CoinGecko error:', error);
    return [];
  }
}

export async function searchTokens(query: string) {
  try {
    const res = await fetch(`${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('CoinGecko search error:', error);
    return [];
  }
}

export async function getCoinDetail(id: string) {
  try {
    const res = await fetch(`${COINGECKO_BASE}/coins/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Coin detail fetch failed');
    return await res.json();
  } catch (error) {
    console.error('CoinGecko detail error:', error);
    return null;
  }
}