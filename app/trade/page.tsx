'use client';

import { useState, useEffect, useCallback } from 'react';

const TRADABLE_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
  { symbol: 'BNB', name: 'BNB', type: 'crypto' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto' },
  { symbol: 'XRP', name: 'XRP', type: 'crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto' },
 { symbol: 'GOLD', name: 'Gold', type: 'commodity' },
];

export default function Trade() {
  const [user, setUser] = useState<any>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(TRADABLE_ASSETS[0]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [tradeMode, setTradeMode] = useState<'spot' | 'futures'>('spot');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [quantity, setQuantity] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [account, setAccount] = useState<any>(null);
  const [openTrades, setOpenTrades] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [toppingUp, setToppingUp] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    setCheckedAuth(true);
  }, []);

  useEffect(() => {
    if (user) fetchAccount();
  }, [user]);

  useEffect(() => {
    fetchPrice(selectedAsset.symbol);
    const interval = setInterval(() => fetchPrice(selectedAsset.symbol), 15000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  useEffect(() => {
    if (openTrades.length > 0) {
      const interval = setInterval(updateLivePrices, 15000);
      updateLivePrices();
      return () => clearInterval(interval);
    }
  }, [openTrades]);

  const fetchPrice = async (symbol: string) => {
    try {
      const res = await fetch('/api/assets/price?symbol=' + symbol);
      const data = await res.json();
      if (data.success) {
        setCurrentPrice(data.price);
        setPriceChange(data.change_24h);
      }
    } catch {}
  };

  const updateLivePrices = async () => {
    const uniqueSymbols = Array.from(new Set(openTrades.map(t => t.asset_symbol)));
    const prices: Record<string, number> = {};
    for (const symbol of uniqueSymbols) {
      try {
        const res = await fetch('/api/assets/price?symbol=' + symbol);
        const data = await res.json();
        if (data.success) prices[symbol] = data.price;
      } catch {}
    }
    setLivePrices(prices);
  };

  const fetchAccount = async () => {
    try {
      const res = await fetch('/api/trade/account?userId=' + user.id);
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        setOpenTrades(data.openTrades);
        setStats(data.stats);
      }
    } catch {}
  };

  const calculatePnl = (trade: any) => {
    const livePrice = livePrices[trade.asset_symbol];
    if (!livePrice) return null;
    const priceDiff = trade.side === 'long'
      ? livePrice - trade.entry_price
      : trade.entry_price - livePrice;
    return priceDiff * trade.quantity * trade.leverage;
  };

  const handlePlaceTrade = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Enter a valid quantity');
      return;
    }
    if (!currentPrice) {
      setError('Price not loaded yet, please wait');
      return;
    }

    setPlacing(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/trade/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          assetSymbol: selectedAsset.symbol,
          assetType: selectedAsset.type,
          side: tradeMode === 'spot' ? 'long' : side,
          orderType: 'market',
          entryPrice: currentPrice,
          quantity: parseFloat(quantity),
          leverage: tradeMode === 'futures' ? leverage : 1,
          stopLoss: stopLoss ? parseFloat(stopLoss) : null,
          takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('Position opened successfully!');
      setQuantity('');
      setStopLoss('');
      setTakeProfit('');
      fetchAccount();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };
  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setToppingUp(true);
    setError(null);

    try {
      const res = await fetch('/api/trade/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount: parseFloat(topUpAmount) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('Added $' + topUpAmount + ' to your demo account!');
      setTopUpAmount('');
      setShowTopUp(false);
      fetchAccount();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setToppingUp(false);
    }
  };

 const handleClosePosition = async (trade: any) => {
    const livePrice = livePrices[trade.asset_symbol];
    if (!livePrice) {
      await fetchPrice(trade.asset_symbol);
    }

    try {
      const priceRes = await fetch('/api/assets/price?symbol=' + trade.asset_symbol);
      const priceData = await priceRes.json();
      if (!priceData.success) throw new Error('Could not fetch current price');

      const res = await fetch('/api/trade/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId: trade.id, exitPrice: priceData.price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('Position closed. P&L: ' + (data.pnl >= 0 ? '+' : '') + data.pnl.toFixed(2));
      fetchAccount();
    } catch (err: any) {
      setError(err.message);
    }
  };
  if (!checkedAuth) return null;

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Login Required</h3>
          <p className="text-gray-500 text-sm mb-6">Create a free account to access the demo trading terminal with $10,000 in virtual funds.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Login</button>
            <button onClick={() => window.location.href = '/register'} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Sign up free</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Demo Balance</p>
              <p className="font-bold text-gray-900">${account?.balance?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '...'}</p>
            </div>
            <button
              onClick={() => setShowTopUp(true)}
              className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              + Top Up
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Return</p>
              <p className={"text-xl font-bold " + (stats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
                {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Win Rate</p>
              <p className="text-xl font-bold text-gray-900">{stats.winRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Trades</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalTrades}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total P&L</p>
              <p className={"text-xl font-bold " + (stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{selectedAsset.symbol}/USD</h2>
                  <p className="text-sm text-gray-400">{selectedAsset.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {currentPrice ? '$' + currentPrice.toLocaleString(undefined, { maximumFractionDigits: currentPrice > 100 ? 0 : 2 }) : '...'}
                  </p>
                  <p className={priceChange >= 0 ? 'text-green-600 text-sm font-medium' : 'text-red-600 text-sm font-medium'}>
                    {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)}% 24h
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {TRADABLE_ASSETS.map(asset => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={"px-3 py-2 rounded-xl text-xs font-medium transition-colors " + (
                      selectedAsset.symbol === asset.symbol ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center border border-gray-100">
                <p className="text-gray-400 text-sm">📈 Live chart coming soon — TradingView integration</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Open Positions ({openTrades.length})</h3>
              {openTrades.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No open positions</p>
              ) : (
                <div className="space-y-3">
                  {openTrades.map(trade => {
                    const pnl = calculatePnl(trade);
                    return (
                      <div key={trade.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{trade.asset_symbol}</span>
                            <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (trade.side === 'long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                              {trade.side === 'long' ? 'LONG' : 'SHORT'} {trade.leverage}x
                            </span>
                          </div>
                          <button
                            onClick={() => handleClosePosition(trade)}
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs">Entry</p>
                            <p className="font-medium text-gray-900">${trade.entry_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Quantity</p>
                            <p className="font-medium text-gray-900">{trade.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Unrealized P&L</p>
                            <p className={"font-bold " + (pnl === null ? 'text-gray-400' : pnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                              {pnl === null ? '...' : (pnl >= 0 ? '+' : '') + '$' + pnl.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setTradeMode('spot')}
                  className={"flex-1 py-2 rounded-xl text-sm font-medium transition-colors " + (tradeMode === 'spot' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600')}
                >
                  Spot
                </button>
                <button
                  onClick={() => setTradeMode('futures')}
                  className={"flex-1 py-2 rounded-xl text-sm font-medium transition-colors " + (tradeMode === 'futures' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600')}
                >
                  Futures
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">{success}</div>
              )}

              {tradeMode === 'futures' && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setSide('long')}
                    className={"py-2.5 rounded-xl text-sm font-semibold transition-colors " + (side === 'long' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600')}
                  >
                    Long
                  </button>
                  <button
                    onClick={() => setSide('short')}
                    className={"py-2.5 rounded-xl text-sm font-semibold transition-colors " + (side === 'short' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600')}
                  >
                    Short
                  </button>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                {currentPrice && quantity && (
                  <p className="text-xs text-gray-400 mt-1">
                    ≈ ${(parseFloat(quantity) * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              {tradeMode === 'futures' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leverage: {leverage}x</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={leverage}
                    onChange={e => setLeverage(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={e => setStopLoss(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Take Profit</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={e => setTakeProfit(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <button
                onClick={handlePlaceTrade}
                disabled={placing}
                className={"w-full py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 " + (
                  tradeMode === 'futures' && side === 'short' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
                )}
              >
                {placing ? 'Placing order...' : tradeMode === 'spot' ? 'Buy ' + selectedAsset.symbol : (side === 'long' ? 'Open Long' : 'Open Short')}
              </button>
            </div>
          </div>
        </div>
      </div>
   {showTopUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Top Up Demo Balance</h3>
            <p className="text-sm text-gray-500 mb-4">Add virtual funds to your demo trading account. This is not real money.</p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">{error}</div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1000', '10000', '50000'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={"py-2 rounded-xl text-sm font-medium transition-colors " + (
                    topUpAmount === amt ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  +${parseInt(amt).toLocaleString()}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={topUpAmount}
              onChange={e => setTopUpAmount(e.target.value)}
              placeholder="Or enter custom amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowTopUp(false); setError(null); }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={toppingUp}
                className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {toppingUp ? 'Adding...' : 'Add Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
