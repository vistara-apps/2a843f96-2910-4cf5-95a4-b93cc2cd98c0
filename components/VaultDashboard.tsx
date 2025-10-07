'use client';

import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export function VaultDashboard() {
  // Mock data
  const vaultBalance = 250.00;
  const monthlyBudget = 300.00;
  const upcomingCommitments = 75.00;
  const totalSpent = 1250.00;

  const transactions = [
    { id: '1', type: 'deposit', amount: 100, recipient: 'Vault Deposit', date: 'Jan 15', status: 'completed' },
    { id: '2', type: 'gift', amount: -25, recipient: 'Clarice Birdseye', date: 'Jan 10', status: 'completed' },
    { id: '3', type: 'gift', amount: -50, recipient: 'Duke of Vlad Moon', date: 'Jan 5', status: 'completed' },
    { id: '4', type: 'deposit', amount: 200, recipient: 'Vault Deposit', date: 'Jan 1', status: 'completed' },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Balance Card */}
      <section aria-labelledby="vault-balance-heading">
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="vault-balance-heading" className="text-sm text-muted mb-1">Gift Vault Balance</h2>
              <p className="text-3xl sm:text-4xl font-bold text-fg">${vaultBalance.toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 bg-accent bg-opacity-20 rounded-full flex items-center justify-center" aria-hidden="true">
              <Wallet className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-sm text-muted mb-1">Monthly Budget</p>
              <p className="text-lg sm:text-xl font-bold text-fg">${monthlyBudget.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-sm text-muted mb-1">Committed</p>
              <p className="text-lg sm:text-xl font-bold text-warning">${upcomingCommitments.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" aria-hidden="true" />
              Add Funds
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
              Auto-Replenish
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-fg">${totalSpent.toFixed(2)}</p>
          <p className="text-xs text-success mt-1">All time</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted mb-2">Avg Gift</p>
          <p className="text-2xl font-bold text-fg">$35.00</p>
          <p className="text-xs text-muted mt-1">Per occasion</p>
        </div>
      </div>

      {/* Transaction History */}
      <section aria-labelledby="transactions-heading">
        <div className="glass-card p-4 sm:p-6">
          <h3 id="transactions-heading" className="text-lg font-bold text-fg mb-4">Recent Transactions</h3>
          <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-slate-700 transition-all duration-200"
                role="listitem"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-success bg-opacity-20' : 'bg-accent bg-opacity-20'
                  }`} aria-hidden="true">
                    {tx.type === 'deposit' ? (
                      <ArrowDownRight className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-fg truncate">{tx.recipient}</p>
                    <p className="text-sm text-muted">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold ${
                    tx.type === 'deposit' ? 'text-success' : 'text-fg'
                  }`}>
                    {tx.type === 'deposit' ? '+' : ''}{tx.amount > 0 ? '$' : '-$'}{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted capitalize">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
