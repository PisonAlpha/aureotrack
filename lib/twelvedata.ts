const TWELVE_DATA_BASE = 'https://api.twelvedata.com';

export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  percent_change_24h: number;
}

const COMMODITY_SYMBOLS: Record<string, string> = {
  'XAU/USD': 'Gold',

};

export async function getCommodityPrices(): Promise<CommodityPrice[]> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return [];

  try {
    const symbols = Object.keys(COMMODITY_SYMBOLS).join(',');
    const res = await fetch(
      `${TWELVE_DATA_BASE}/quote?symbol=${encodeURIComponent(symbols)}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('TwelveData fetch failed');
    const data = await res.json();

    const results: CommodityPrice[] = [];

    if (Object.keys(COMMODITY_SYMBOLS).length === 1) {
      const sym = Object.keys(COMMODITY_SYMBOLS)[0];
      results.push(parseQuote(sym, data));
    } else {
      for (const sym of Object.keys(COMMODITY_SYMBOLS)) {
        if (data[sym]) {
          results.push(parseQuote(sym, data[sym]));
        }
      }
    }

    return results;
  } catch (error) {
    console.error('TwelveData error:', error);
    return [];
  }
}

function parseQuote(symbol: string, quote: any): CommodityPrice {
  return {
    symbol: symbol.replace('/USD', ''),
    name: COMMODITY_SYMBOLS[symbol],
    price: parseFloat(quote.close) || 0,
    change_24h: parseFloat(quote.change) || 0,
    percent_change_24h: parseFloat(quote.percent_change) || 0,
  };
}

const FOREX_NAMES: Record<string, string> = {
  'EUR/USD': 'Euro / US Dollar',
  'GBP/USD': 'British Pound / US Dollar',
  'USD/JPY': 'US Dollar / Japanese Yen',
  'AUD/USD': 'Australian Dollar / US Dollar',
  'USD/CAD': 'US Dollar / Canadian Dollar',
  'USD/CHF': 'US Dollar / Swiss Franc',
  'NZD/USD': 'New Zealand Dollar / US Dollar',
  'USD/CNY': 'US Dollar / Chinese Yuan',
};

export async function getForexPrice(pair: string) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `${TWELVE_DATA_BASE}/quote?symbol=${encodeURIComponent(pair)}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Forex fetch failed');
    const data = await res.json();
    return {
      symbol: pair,
      name: FOREX_NAMES[pair] || pair,
      price: parseFloat(data.close) || 0,
      change_24h: parseFloat(data.change) || 0,
      percent_change_24h: parseFloat(data.percent_change) || 0,
    };
  } catch (error) {
    console.error('Forex error:', error);
    return null;
  }
}