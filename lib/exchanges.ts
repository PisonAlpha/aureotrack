export interface ExchangePrice {
  exchange: string;
  price: number;
}

async function getBinancePrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

async function getBybitPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`);
    if (!res.ok) return null;
    const data = await res.json();
    const price = data.result?.list?.[0]?.lastPrice;
    return price ? parseFloat(price) : null;
  } catch {
    return null;
  }
}

async function getOkxPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}-USDT`);
    if (!res.ok) return null;
    const data = await res.json();
    const price = data.data?.[0]?.last;
    return price ? parseFloat(price) : null;
  } catch {
    return null;
  }
}

async function getKucoinPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}-USDT`);
    if (!res.ok) return null;
    const data = await res.json();
    const price = data.data?.price;
    return price ? parseFloat(price) : null;
  } catch {
    return null;
  }
}

export async function getArbitrageData(symbol: string): Promise<ExchangePrice[]> {
  const [binance, bybit, okx, kucoin] = await Promise.all([
    getBinancePrice(symbol),
    getBybitPrice(symbol),
    getOkxPrice(symbol),
    getKucoinPrice(symbol),
  ]);

  const results: ExchangePrice[] = [];
  if (binance !== null) results.push({ exchange: 'Binance', price: binance });
  if (bybit !== null) results.push({ exchange: 'Bybit', price: bybit });
  if (okx !== null) results.push({ exchange: 'OKX', price: okx });
  if (kucoin !== null) results.push({ exchange: 'KuCoin', price: kucoin });

  return results;
}