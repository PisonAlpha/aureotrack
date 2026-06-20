import { NextRequest, NextResponse } from 'next/server';
import { getTokenData } from '@/lib/coingecko';
import { getCommodityPrices, getForexPrice } from '@/lib/twelvedata';

const FOREX_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY'];
const FOREX_SYMBOL_MAP: Record<string, string> = {
  'EURUSD': 'EUR/USD',
  'GBPUSD': 'GBP/USD',
  'USDJPY': 'USD/JPY',
};

const CRYPTO_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  TRX: 'tron',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LTC: 'litecoin',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  NEAR: 'near',
  OP: 'optimism',
  ARB: 'arbitrum',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    const upperSymbol = symbol.toUpperCase();

    if (CRYPTO_MAP[upperSymbol]) {
      const data = await getTokenData(CRYPTO_MAP[upperSymbol]);
      if (data.length === 0) {
        return NextResponse.json({ error: 'Price not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        symbol: upperSymbol,
        type: 'crypto',
        price: data[0].current_price,
        change_24h: data[0].price_change_percentage_24h,
      });
    }

    if (['XAU', 'XAG', 'WTI', 'GOLD', 'SILVER', 'OIL'].includes(upperSymbol)) {
      const commodities = await getCommodityPrices();
      const match = commodities.find(c =>
        c.symbol === upperSymbol ||
        (upperSymbol === 'GOLD' && c.symbol === 'XAU') ||
        (upperSymbol === 'SILVER' && c.symbol === 'XAG') ||
        (upperSymbol === 'OIL' && c.symbol === 'WTI')
      );
      if (!match) {
        return NextResponse.json({ error: 'Price not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        symbol: match.symbol,
        type: 'commodity',
        price: match.price,
        change_24h: match.percent_change_24h,
      });
    }

if (FOREX_PAIRS.includes(symbol) || FOREX_SYMBOL_MAP[symbol]) {
      const lookupSymbol = FOREX_SYMBOL_MAP[symbol] || symbol;
      const forex = await getForexPrice(lookupSymbol);
      if (!forex) {
        return NextResponse.json({ error: 'Price not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        symbol: symbol,
        type: 'forex',
        price: forex.price,
        change_24h: forex.percent_change_24h,
      });
    }

    return NextResponse.json({ error: 'Unsupported asset' }, { status: 400 });
  } catch (error) {
    console.error('Asset price error:', error);
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 });
  }
}