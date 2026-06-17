import { ethers } from 'ethers';

export interface ChainConfig {
  id: string;
  name: string;
  rpc: string;
  symbol: string;
  chainId: number;
}

export const EVM_CHAINS: ChainConfig[] = [
  { id: 'bnb', name: 'BNB Chain', rpc: 'https://bsc-dataseed.binance.org', symbol: 'BNB', chainId: 56 },
  { id: 'ethereum', name: 'Ethereum', rpc: 'https://eth.llamarpc.com', symbol: 'ETH', chainId: 1 },
  { id: 'polygon', name: 'Polygon', rpc: 'https://polygon-rpc.com', symbol: 'MATIC', chainId: 137 },
  { id: 'base', name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH', chainId: 8453 },
];

export async function getEvmNativeBalance(chain: ChainConfig, address: string): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(chain.rpc);
    const balance = await provider.getBalance(address);
    return parseFloat(ethers.formatEther(balance));
  } catch (error) {
    console.error('Balance fetch error for ' + chain.name + ':', error);
    return 0;
  }
}

export async function getSolanaBalance(address: string): Promise<number> {
  try {
    const res = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address],
      }),
    });
    const data = await res.json();
    const lamports = data.result?.value || 0;
    return lamports / 1e9;
  } catch (error) {
    console.error('Solana balance fetch error:', error);
    return 0;
  }
}