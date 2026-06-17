import { NextRequest, NextResponse } from 'next/server';
import { EVM_CHAINS, getEvmNativeBalance, getSolanaBalance } from '@/lib/portfolio';
import { getMacroAssetPrices } from '@/lib/coingecko';

export async function POST(request: NextRequest) {
  try {
    const { evmAddress, solanaAddress } = await request.json();

    if (!evmAddress && !solanaAddress) {
      return NextResponse.json({ error: 'At least one wallet address required' }, { status: 400 });
    }

    const prices = await getMacroAssetPrices();
    const bnbPrice = prices.find(p => p.symbol === 'BNB')?.current_price || 0;
    const ethPrice = prices.find(p => p.symbol === 'ETH')?.current_price || 0;
    const solPrice = prices.find(p => p.symbol === 'SOL')?.current_price || 0;

    let maticPrice = 0;
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
      const data = await res.json();
      maticPrice = data['matic-network']?.usd || 0;
    } catch {}

    const holdings: any[] = [];

    if (evmAddress) {
      for (const chain of EVM_CHAINS) {
        const balance = await getEvmNativeBalance(chain, evmAddress);
        let usdValue = 0;
        if (chain.symbol === 'BNB') usdValue = balance * bnbPrice;
        else if (chain.symbol === 'ETH') usdValue = balance * ethPrice;
        else if (chain.symbol === 'MATIC') usdValue = balance * maticPrice;

        holdings.push({
          chain: chain.name,
          symbol: chain.symbol,
          balance,
          usdValue,
        });
      }
    }

    if (solanaAddress) {
      const solBalance = await getSolanaBalance(solanaAddress);
      holdings.push({
        chain: 'Solana',
        symbol: 'SOL',
        balance: solBalance,
        usdValue: solBalance * solPrice,
      });
    }

    const totalValue = holdings.reduce((sum, h) => sum + h.usdValue, 0);

    const allocation = holdings
      .filter(h => h.usdValue > 0)
      .map(h => ({
        chain: h.chain,
        symbol: h.symbol,
        percent: totalValue > 0 ? (h.usdValue / totalValue) * 100 : 0,
      }));

    let riskScore = 50;
    const nonZeroHoldings = holdings.filter(h => h.usdValue > 0).length;
    if (nonZeroHoldings >= 3) riskScore += 20;
    else if (nonZeroHoldings === 1) riskScore -= 15;

    const maxConcentration = allocation.length > 0 ? Math.max(...allocation.map(a => a.percent)) : 0;
    if (maxConcentration > 80) riskScore -= 20;
    else if (maxConcentration < 50) riskScore += 10;

    riskScore = Math.max(0, Math.min(100, riskScore));

    return NextResponse.json({
      success: true,
      holdings,
      totalValue,
      allocation,
      diversificationScore: riskScore,
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}