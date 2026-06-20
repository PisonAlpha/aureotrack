export interface ExchangePrice {
  exchange: string;
  price: number;
  type: 'CEX' | 'DEX';
}

async function getBinancePrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.price);
  } catch { return null; }
}
export async function getBinanceLivePrice(symbol: string): Promise<{ price: number; change24h: number } | null> {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`, { next: { revalidate: 5 } });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
    };
  } catch {
    return null;
  }
}

async function getBybitPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.result?.list?.[0]?.lastPrice) || null;
  } catch { return null; }
}

async function getOkxPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}-USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.data?.[0]?.last) || null;
  } catch { return null; }
}

async function getKucoinPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}-USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.data?.price) || null;
  } catch { return null; }
}

async function getGateioPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.gateio.ws/api/v4/spot/tickers?currency_pair=${symbol}_USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data?.[0]?.last) || null;
  } catch { return null; }
}

async function getMexcPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.mexc.com/api/v3/ticker/price?symbol=${symbol}USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.price) || null;
  } catch { return null; }
}

async function getBitgetPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.bitget.com/api/v2/spot/market/tickers?symbol=${symbol}USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.data?.[0]?.lastPr) || null;
  } catch { return null; }
}

async function getHtxPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.huobi.pro/market/detail/merged?symbol=${symbol.toLowerCase()}usdt`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.tick?.close) || null;
  } catch { return null; }
}

async function getCoinbasePrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.data?.amount) || null;
  } catch { return null; }
}

async function getDexScreenerPrice(symbol: string): Promise<{ price: number; exchange: string } | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${symbol}/USDT`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = await res.json();
    const pairs = (data.pairs || [])
      .filter((p: any) => p.quoteToken?.symbol === 'USDT' || p.quoteToken?.symbol === 'USDC')
      .sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
    if (!pairs[0]) return null;
    return {
      price: parseFloat(pairs[0].priceUsd),
      exchange: pairs[0].dexId + ' (' + pairs[0].chainId + ')',
    };
  } catch { return null; }
}

export async function getArbitrageData(symbol: string): Promise<ExchangePrice[]> {
  const [binance, bybit, okx, kucoin, gateio, mexc, bitget, htx, coinbase, dex] = await Promise.all([
    getBinancePrice(symbol),
    getBybitPrice(symbol),
    getOkxPrice(symbol),
    getKucoinPrice(symbol),
    getGateioPrice(symbol),
    getMexcPrice(symbol),
    getBitgetPrice(symbol),
    getHtxPrice(symbol),
    getCoinbasePrice(symbol),
    getDexScreenerPrice(symbol),
  ]);

  const results: ExchangePrice[] = [];
  if (binance) results.push({ exchange: 'Binance', price: binance, type: 'CEX' });
  if (bybit) results.push({ exchange: 'Bybit', price: bybit, type: 'CEX' });
  if (okx) results.push({ exchange: 'OKX', price: okx, type: 'CEX' });
  if (kucoin) results.push({ exchange: 'KuCoin', price: kucoin, type: 'CEX' });
  if (gateio) results.push({ exchange: 'Gate.io', price: gateio, type: 'CEX' });
  if (mexc) results.push({ exchange: 'MEXC', price: mexc, type: 'CEX' });
  if (bitget) results.push({ exchange: 'Bitget', price: bitget, type: 'CEX' });
  if (htx) results.push({ exchange: 'HTX (Huobi)', price: htx, type: 'CEX' });
  if (coinbase) results.push({ exchange: 'Coinbase', price: coinbase, type: 'CEX' });
  if (dex) results.push({ exchange: dex.exchange, price: dex.price, type: 'DEX' });

  return results.sort((a, b) => a.price - b.price);
}

export const TRADABLE_SYMBOLS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'TRX', 'AVAX', 'LINK',
  'DOT', 'MATIC', 'UNI', 'ATOM', 'LTC', 'ETC', 'BCH', 'APT', 'OP', 'ARB',
  'PEPE', 'SHIB', 'FTM', 'NEAR', 'ICP', 'FIL', 'SAND', 'MANA', 'AXS', 'GALA',
];