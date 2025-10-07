'use client';

import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { useAccount } from 'wagmi';
import { usePayments } from '@/lib/hooks/usePayments';
import { useEffect } from 'react';
import { Wallet as WalletIcon, ExternalLink } from 'lucide-react';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { balance, isLoadingBalance, refreshBalance } = usePayments();

  // Refresh balance when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      refreshBalance();
    }
  }, [isConnected, address, refreshBalance]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 glass-card">
        <div className="w-16 h-16 bg-accent bg-opacity-20 rounded-full flex items-center justify-center">
          <WalletIcon className="w-8 h-8 text-accent" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-fg mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-muted mb-4">
            Connect your wallet to start sending crypto gifts
          </p>
        </div>
        <ConnectWallet
          text="Connect Wallet"
          className="btn-primary"
        />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-fg">Wallet</h3>
        <Wallet>
          <ConnectWallet
            text="Connect Wallet"
            className="btn-secondary"
          />
          <WalletDropdown>
            <Identity 
              address={address} 
              schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            >
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownLink 
              icon="wallet" 
              href="https://wallet.coinbase.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Wallet Dashboard
            </WalletDropdownLink>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>

      {/* Wallet Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
          <div>
            <p className="text-sm text-muted mb-1">Wallet Address</p>
            <Identity address={address} schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9">
              <Address className="text-fg font-mono text-sm" />
            </Identity>
          </div>
          <a
            href={`https://basescan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 text-muted" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface rounded-lg">
            <p className="text-sm text-muted mb-1">ETH Balance</p>
            <Identity address={address} schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9">
              <EthBalance className="text-lg font-bold text-fg" />
            </Identity>
          </div>
          <div className="p-4 bg-surface rounded-lg">
            <p className="text-sm text-muted mb-1">USDC Balance</p>
            <div className="text-lg font-bold text-fg">
              {isLoadingBalance ? (
                <div className="animate-pulse bg-slate-600 h-6 w-16 rounded"></div>
              ) : (
                `${balance || '0.00'} USDC`
              )}
            </div>
          </div>
        </div>

        <button
          onClick={refreshBalance}
          disabled={isLoadingBalance}
          className="w-full btn-secondary"
        >
          {isLoadingBalance ? 'Refreshing...' : 'Refresh Balances'}
        </button>
      </div>
    </div>
  );
}