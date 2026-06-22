export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  percent_change_24h: number;
}

// Gold via CoinGecko XAUT (Tether Gold) - tracks real gold price 1:1, no rate limits
async function getGoldPrice(): Promise<CommodityPrice | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether-gold&price_change_percentage=24h',
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data[0]) return null;
    return {
      symbol: 'XAU',
      name: 'Gold',
      price: data[0].current_price,
      change_24h: data[0].price_change_24h || 0,
      percent_change_24h: data[0].price_change_percentage_24h || 0,
    };
  } catch { return null; }
}

// Forex via Frankfurter API - European Central Bank data, completely free, no key, no rate limits
async function getForexRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,AUD,CAD,CHF,NZD,CNY',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    return data.rates || {};
  } catch { return {}; }
}

const FOREX_META: Record<string, { symbol: string; name: string; invert: boolean }> = {
  'EUR': { symbol: 'EUR/USD', name: 'Euro / US Dollar', invert: true },
  'GBP': { symbol: 'GBP/USD', name: 'British Pound / US Dollar', invert: true },
  'JPY': { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', invert: false },
  'AUD': { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', invert: true },
  'CAD': { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', invert: false },
  'CHF': { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', invert: false },
  'NZD': { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', invert: true },
  'CNY': { symbol: 'USD/CNY', name: 'US Dollar / Chinese Yuan', invert: false },
};

export async function getCommodityPrices(): Promise<CommodityPrice[]> {
  const gold = await getGoldPrice();
  return gold ? [gold] : [];
}

export async function getAllForexPrices(): Promise<CommodityPrice[]> {
  try {
    const rates = await getForexRates();
    const results: CommodityPrice[] = [];
    for (const [currencyCode, meta] of Object.entries(FOREX_META)) {
      const rate = rates[currencyCode];
      if (!rate) continue;
      const price = meta.invert ? 1 / rate : rate;
      results.push({
        symbol: meta.symbol,
        name: meta.name,
        price: parseFloat(price.toFixed(meta.invert ? 5 : 4)),
        change_24h: 0,
        percent_change_24h: 0,
      });
    }
    return results;
  } catch { return []; }
}

export async function getForexPrice(pair: string): Promise<CommodityPrice | null> {
  try {
    const rates = await getForexRates();
    const entry = Object.entries(FOREX_META).find(([, meta]) => meta.symbol === pair);
    if (!entry) return null;
    const [currencyCode, meta] = entry;
    const rate = rates[currencyCode];
    if (!rate) return null;
    const price = meta.invert ? 1 / rate : rate;
    return {
      symbol: pair,
      name: meta.name,
      price: parseFloat(price.toFixed(meta.invert ? 5 : 4)),
      change_24h: 0,
      percent_change_24h: 0,
    };
  } catch { return null; }
}

// TwelveData kept only for Gold chart time series (single infrequent call)
export async function getGoldTimeSeries(interval: string, outputsize: string) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}