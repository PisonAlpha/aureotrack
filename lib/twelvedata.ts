const TWELVE_DATA_BASE = 'https://api.twelvedata.com';

export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  percent_change_24h: number;
}

const SYMBOL_NAMES: Record<string, string> = {
  'XAU/USD': 'Gold',
  'EUR/USD': 'Euro / US Dollar',
  'GBP/USD': 'British Pound / US Dollar',
  'USD/JPY': 'US Dollar / Japanese Yen',
  'AUD/USD': 'Australian Dollar / US Dollar',
  'USD/CAD': 'US Dollar / Canadian Dollar',
  'USD/CHF': 'US Dollar / Swiss Franc',
  'NZD/USD': 'New Zealand Dollar / US Dollar',
  'USD/CNY': 'US Dollar / Chinese Yuan',
};

const COMMODITY_SYMBOLS = ['XAU/USD'];
const FOREX_SYMBOLS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD', 'USD/CNY'];

// Single batched call for ALL symbols - avoids rate limiting
async function fetchAllPrices(): Promise<Record<string, any>> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return {};

  try {
    const allSymbols = [...COMMODITY_SYMBOLS, ...FOREX_SYMBOLS];
    const symbolsParam = allSymbols.join(',');
    const res = await fetch(
      `${TWELVE_DATA_BASE}/quote?symbol=${encodeURIComponent(symbolsParam)}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    console.log('TwelveData batch URL:', `${TWELVE_DATA_BASE}/quote?symbol=${symbolsParam}&apikey=***`);
   if (!res.ok) {
      console.error('TwelveData batch failed:', res.status, res.statusText);
      throw new Error('TwelveData batch fetch failed');
    }
    const data = await res.json();
    console.log('TwelveData batch response keys:', Object.keys(data));
    return data;;
  } catch (error) {
    console.error('TwelveData batch error:', error);
    return {};
  }
}

function parseQuote(symbol: string, quote: any): CommodityPrice {
  return {
    symbol: symbol.replace('/USD', '').replace('USD/', 'USD/'),
    name: SYMBOL_NAMES[symbol] || symbol,
    price: parseFloat(quote?.close) || 0,
    change_24h: parseFloat(quote?.change) || 0,
    percent_change_24h: parseFloat(quote?.percent_change) || 0,
  };
}

let cachedPrices: Record<string, any> = {};
let lastFetch = 0;

async function getPricesWithCache(): Promise<Record<string, any>> {
  const now = Date.now();
  if (now - lastFetch > 55000 || Object.keys(cachedPrices).length === 0) {
    cachedPrices = await fetchAllPrices();
    lastFetch = now;
  }
  return cachedPrices;
}

export async function getCommodityPrices(): Promise<CommodityPrice[]> {
  try {
    const data = await getPricesWithCache();
    const results: CommodityPrice[] = [];

    for (const sym of COMMODITY_SYMBOLS) {
      const quote = data[sym] || data;
      if (quote && (quote.close || quote.last)) {
        const parsed = parseQuote(sym, quote);
        if (parsed.price > 0) results.push(parsed);
      }
    }
    return results;
  } catch (error) {
    console.error('Commodity prices error:', error);
    return [];
  }
}

export async function getForexPrice(pair: string): Promise<CommodityPrice | null> {
  try {
    const data = await getPricesWithCache();
    const quote = data[pair] || (Object.keys(data).length === 1 ? data : null);
    if (!quote || !quote.close) return null;
    const parsed = parseQuote(pair, quote);
    return parsed.price > 0 ? { ...parsed, symbol: pair, name: SYMBOL_NAMES[pair] || pair } : null;
  } catch (error) {
    console.error('Forex price error:', error);
    return null;
  }
}

const FOREX_NAMES: Record<string, string> = SYMBOL_NAMES;