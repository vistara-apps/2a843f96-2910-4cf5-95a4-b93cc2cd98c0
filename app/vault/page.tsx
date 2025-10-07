'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { VaultBalance } from '@/components/vault/VaultBalance';
import { UpcomingCommitments } from '@/components/vault/UpcomingCommitments';
import { PaymentFlow } from '@/components/vault/PaymentFlow';
import { PaymentTest } from '@/components/vault/PaymentTest';
import { ErrorHandlingTest } from '@/components/vault/ErrorHandlingTest';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockScheduledGifts, mockOccasions, mockRecipients } from '@/lib/mock-data';
import { Plus, RefreshCw, ArrowUpRight, ArrowDownRight, Send } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type PaymentResult } from '@/lib/payment';

export default function VaultPage() {
  const [balance] = useState(500);
  const [totalDeposited] = useState(1200);
  const [totalSpent] = useState(700);
  const [upcomingCommitments] = useState(150);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([
    { id: '1', type: 'deposit', amount: 100, date: new Date('2024-03-15'), description: 'Vault Deposit' },
    { id: '2', type: 'gift', amount: -50, date: new Date('2024-03-10'), description: 'Gift to Marley' },
    { id: '3', type: 'deposit', amount: 200, date: new Date('2024-03-01'), description: 'Monthly Auto-Replenish' },
  ]);

  const handlePaymentComplete = (result: PaymentResult) => {
    if (result.success && result.txHash) {
      // Add new transaction to the list
      const newTransaction = {
        id: Date.now().toString(),
        type: 'gift' as const,
        amount: -parseFloat('10'), // This would come from the payment amount
        date: new Date(),
        description: 'USDC Payment via x402',
      };
      setRecentTransactions(prev => [newTransaction, ...prev]);
      setShowPaymentFlow(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-surface border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-fg">Gift Vault</h1>
          <p className="text-sm text-muted">Manage your gift budget</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <VaultBalance
          balance={balance}
          totalDeposited={totalDeposited}
          totalSpent={totalSpent}
          upcomingCommitments={upcomingCommitments}
        />

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="primary" className="flex items-center justify-center gap-2">
            <Plus size={20} />
            <span>Add Funds</span>
          </Button>
          <Button variant="secondary" className="flex items-center justify-center gap-2">
            <RefreshCw size={20} />
            <span>Auto-Replenish</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={() => setShowPaymentFlow(!showPaymentFlow)}
          >
            <Send size={20} />
            <span>Send Payment</span>
          </Button>
        </div>

        {/* Payment Flow */}
        {showPaymentFlow && (
          <PaymentFlow onPaymentComplete={handlePaymentComplete} />
        )}

        {/* Payment Tests */}
        <PaymentTest />

        {/* Error Handling Tests */}
        <ErrorHandlingTest />

        {/* Upcoming Commitments */}
        <UpcomingCommitments
          gifts={mockScheduledGifts}
          occasions={mockOccasions}
          recipients={mockRecipients}
        />

        {/* Transaction History */}
        <Card>
          <h3 className="text-lg font-semibold text-fg mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-success bg-opacity-10' : 'bg-error bg-opacity-10'
                  }`}>
                    {tx.type === 'deposit' ? (
                      <ArrowDownRight className="text-success" size={20} />
                    ) : (
                      <ArrowUpRight className="text-error" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-fg">{tx.description}</p>
                    <p className="text-xs text-muted">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  tx.type === 'deposit' ? 'text-success' : 'text-error'
                }`}>
                  {tx.type === 'deposit' ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget Insights */}
        <Card>
          <h3 className="text-lg font-semibold text-fg mb-4">Budget Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">Monthly Average</span>
                <span className="text-sm font-semibold text-fg">{formatCurrency(150)}</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">This Month</span>
                <span className="text-sm font-semibold text-fg">{formatCurrency(90)}</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
