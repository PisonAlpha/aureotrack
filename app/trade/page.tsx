'use client';

import { useState, useEffect, useCallback } from 'react';
import Nav from '../components/Nav';
import TradingViewChart from '../components/TradingViewChart';

const TRADABLE_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', tvSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', tvSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'BNB', name: 'BNB', type: 'crypto', tvSymbol: 'BINANCE:BNBUSDT' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', tvSymbol: 'BINANCE:SOLUSDT' },
  { symbol: 'XRP', name: 'XRP', type: 'crypto', tvSymbol: 'BINANCE:XRPUSDT' },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', tvSymbol: 'BINANCE:DOGEUSDT' },
  { symbol: 'ADA', name: 'Cardano', type: 'crypto', tvSymbol: 'BINANCE:ADAUSDT' },
  { symbol: 'TRX', name: 'TRON', type: 'crypto', tvSymbol: 'BINANCE:TRXUSDT' },
  { symbol: 'AVAX', name: 'Avalanche', type: 'crypto', tvSymbol: 'BINANCE:AVAXUSDT' },
  { symbol: 'LINK', name: 'Chainlink', type: 'crypto', tvSymbol: 'BINANCE:LINKUSDT' },
  { symbol: 'DOT', name: 'Polkadot', type: 'crypto', tvSymbol: 'BINANCE:DOTUSDT' },
  { symbol: 'MATIC', name: 'Polygon', type: 'crypto', tvSymbol: 'BINANCE:MATICUSDT' },
  { symbol: 'LTC', name: 'Litecoin', type: 'crypto', tvSymbol: 'BINANCE:LTCUSDT' },
  { symbol: 'UNI', name: 'Uniswap', type: 'crypto', tvSymbol: 'BINANCE:UNIUSDT' },
  { symbol: 'ATOM', name: 'Cosmos', type: 'crypto', tvSymbol: 'BINANCE:ATOMUSDT' },
  { symbol: 'NEAR', name: 'NEAR Protocol', type: 'crypto', tvSymbol: 'BINANCE:NEARUSDT' },
  { symbol: 'OP', name: 'Optimism', type: 'crypto', tvSymbol: 'BINANCE:OPUSDT' },
  { symbol: 'ARB', name: 'Arbitrum', type: 'crypto', tvSymbol: 'BINANCE:ARBUSDT' },
  { symbol: 'GOLD', name: 'Gold (XAUT)', type: 'commodity', tvSymbol: 'OANDA:XAUUSD' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'forex', tvSymbol: 'OANDA:EURUSD' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'forex', tvSymbol: 'OANDA:GBPUSD' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', type: 'forex', tvSymbol: 'OANDA:USDJPY' },
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
  const [assetSearch, setAssetSearch] = useState('');
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);

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
    const interval = setInterval(() => fetchPrice(selectedAsset.symbol), 2000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

 useEffect(() => {
    if (openTrades.length > 0) {
      const interval = setInterval(updateLivePrices, 2000);
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
      <main className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-md">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-semibold text-white text-lg mb-2">Login Required</h3>
          <p className="text-gray-400 text-sm mb-6">Create a free account to access the demo trading terminal with $100,000 in virtual funds.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">Login</button>
            <button onClick={() => window.location.href = '/register'} className="px-6 py-3 border border-white/20 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Sign up free</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoTrade" />
      <div className="bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-right ml-auto flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">Demo Balance</p>
              <p className="font-bold text-white">${account?.balance?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '...'}</p>
            </div>
            <button
              onClick={() => setShowTopUp(true)}
              className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors"
            >
              + Top Up
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Total Return</p>
              <p className={"text-xl font-bold " + (stats.totalReturn >= 0 ? 'text-green-400' : 'text-red-400')}>
                {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Win Rate</p>
              <p className="text-xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Total Trades</p>
              <p className="text-xl font-bold text-white">{stats.totalTrades}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Total P&L</p>
              <p className={"text-xl font-bold " + (stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400')}>
                {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-white text-lg">{selectedAsset.symbol}{selectedAsset.type === 'forex' ? '' : '/USD'}</h2>
                  <p className="text-sm text-gray-500">{selectedAsset.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {currentPrice ? '$' + currentPrice.toLocaleString(undefined, { maximumFractionDigits: currentPrice > 100 ? 0 : currentPrice < 1 ? 6 : 2 }) : '...'}
                  </p>
                  <p className={priceChange >= 0 ? 'text-green-400 text-sm font-medium' : 'text-red-400 text-sm font-medium'}>
                    {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)}% 24h
                  </p>
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={assetSearch}
                  onChange={e => setAssetSearch(e.target.value)}
                  onFocus={() => setShowAssetDropdown(true)}
                  placeholder="Search any trading pair (BTC, ETH, EURUSD...)"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                />
                {showAssetDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-20">
                    {TRADABLE_ASSETS.filter(a =>
                      !assetSearch || a.symbol.toLowerCase().includes(assetSearch.toLowerCase()) || a.name.toLowerCase().includes(assetSearch.toLowerCase())
                    ).map(asset => (
                      <button
                        key={asset.symbol}
                        onClick={() => { setSelectedAsset(asset); setShowAssetDropdown(false); setAssetSearch(''); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>{asset.symbol} <span className="text-gray-600 text-xs">— {asset.name}</span></span>
                        <span className="text-xs text-gray-600 uppercase">{asset.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {TRADABLE_ASSETS.slice(0, 10).map(asset => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={"px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors " + (
                      selectedAsset.symbol === asset.symbol ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    )}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>

              <div className="rounded-xl overflow-hidden border border-white/10">
                <TradingViewChart symbol={selectedAsset.symbol} tvSymbol={selectedAsset.tvSymbol} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Open Positions ({openTrades.length})</h3>
              {openTrades.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No open positions</p>
              ) : (
                <div className="space-y-3">
                  {openTrades.map(trade => {
                    const pnl = calculatePnl(trade);
                    return (
                      <div key={trade.id} className="border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{trade.asset_symbol}</span>
                            <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (trade.side === 'long' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400')}>
                              {trade.side === 'long' ? 'LONG' : 'SHORT'} {trade.leverage}x
                            </span>
                          </div>
                          <button
                            onClick={() => handleClosePosition(trade)}
                            className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Entry</p>
                            <p className="font-medium text-white">${trade.entry_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Quantity</p>
                            <p className="font-medium text-white">{trade.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Unrealized P&L</p>
                            <p className={"font-bold " + (pnl === null ? 'text-gray-500' : pnl >= 0 ? 'text-green-400' : 'text-red-400')}>
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
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:sticky lg:top-20">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setTradeMode('spot')}
                  className={"flex-1 py-2 rounded-xl text-sm font-medium transition-colors " + (tradeMode === 'spot' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 border border-white/10')}
                >
                  Spot
                </button>
                <button
                  onClick={() => setTradeMode('futures')}
                  className={"flex-1 py-2 rounded-xl text-sm font-medium transition-colors " + (tradeMode === 'futures' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 border border-white/10')}
                >
                  Futures
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-4">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-400/10 border border-green-400/20 rounded-xl text-green-400 text-sm mb-4">{success}</div>
              )}

              {tradeMode === 'futures' && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setSide('long')}
                    className={"py-2.5 rounded-xl text-sm font-semibold transition-colors " + (side === 'long' ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-400 border border-white/10')}
                  >
                    Long
                  </button>
                  <button
                    onClick={() => setSide('short')}
                    className={"py-2.5 rounded-xl text-sm font-semibold transition-colors " + (side === 'short' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 border border-white/10')}
                  >
                    Short
                  </button>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                />
                {currentPrice && quantity && (
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ ${(parseFloat(quantity) * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              {tradeMode === 'futures' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Leverage: {leverage}x</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={leverage}
                    onChange={e => setLeverage(parseInt(e.target.value))}
                    className="w-full accent-yellow-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Stop Loss</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={e => setStopLoss(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Take Profit</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={e => setTakeProfit(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
              </div>

              <button
                onClick={handlePlaceTrade}
                disabled={placing}
                className={"w-full py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 " + (
                  tradeMode === 'futures' && side === 'short' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-black hover:bg-green-400'
                )}
              >
                {placing ? 'Placing order...' : tradeMode === 'spot' ? 'Buy ' + selectedAsset.symbol : (side === 'long' ? 'Open Long' : 'Open Short')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTopUp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-white text-lg mb-4">Top Up Demo Balance</h3>
            <p className="text-sm text-gray-400 mb-4">Add virtual funds to your demo trading account. This is not real money.</p>

            {error && (
              <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-4">{error}</div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1000', '10000', '50000'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={"py-2 rounded-xl text-sm font-medium transition-colors " + (
                    topUpAmount === amt ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowTopUp(false); setError(null); }}
                className="flex-1 py-3 border border-white/20 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={toppingUp}
                className="flex-1 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
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