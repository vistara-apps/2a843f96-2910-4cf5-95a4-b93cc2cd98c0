'use client';

import { formatCurrency } from '@/lib/utils';
import { Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface VaultBalanceProps {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  upcomingCommitments: number;
}

export function VaultBalance({ 
  balance, 
  totalDeposited, 
  totalSpent,
  upcomingCommitments 
}: VaultBalanceProps) {
  const availableBalance = balance - upcomingCommitments;

  return (
    <Card className="bg-gradient-to-br from-accent to-warning">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="text-bg" size={24} />
            <span className="text-bg text-sm font-medium">Gift Vault Balance</span>
          </div>
          <h2 className="text-4xl font-bold text-bg mb-1">
            {formatCurrency(balance)}
          </h2>
          <p className="text-bg text-sm opacity-90">
            {formatCurrency(availableBalance)} available
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-bg border-opacity-20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="text-bg" size={16} />
              <span className="text-bg text-xs opacity-80">Total Deposited</span>
            </div>
            <p className="text-bg font-semibold">{formatCurrency(totalDeposited)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="text-bg" size={16} />
              <span className="text-bg text-xs opacity-80">Total Spent</span>
            </div>
            <p className="text-bg font-semibold">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
