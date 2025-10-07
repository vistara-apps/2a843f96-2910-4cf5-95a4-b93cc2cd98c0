'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OccasionCard } from '@/components/occasions/OccasionCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockRecipients, mockOccasions, mockScheduledGifts } from '@/lib/mock-data';
import { Gift, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

export default function HomePage() {
  const [occasions] = useState(mockOccasions);
  const [recipients] = useState(mockRecipients);

  // Sort occasions by date
  const upcomingOccasions = occasions
    .sort((a, b) => {
      const [aMonth, aDay] = a.date.split('-').map(Number);
      const [bMonth, bDay] = b.date.split('-').map(Number);
      return aMonth - bMonth || aDay - bDay;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-surface border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">GiftChain</h1>
              <p className="text-sm text-muted">Never miss a birthday</p>
            </div>
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-10 w-10" />
                <Name className="text-sm font-medium" />
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="metric-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center">
                <Gift className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">12</p>
                <p className="text-xs text-muted">Gifts Scheduled</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success bg-opacity-10 flex items-center justify-center">
                <TrendingUp className="text-success" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">8</p>
                <p className="text-xs text-muted">Streak Days</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-fg">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" className="flex items-center justify-center gap-2">
              <Plus size={20} />
              <span>Add Recipient</span>
            </Button>
            <Button variant="secondary" className="flex items-center justify-center gap-2">
              <Sparkles size={20} />
              <span>AI Suggestions</span>
            </Button>
          </div>
        </Card>

        {/* Upcoming Occasions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-fg">Upcoming Occasions</h2>
            <button className="text-accent text-sm font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {upcomingOccasions.map((occasion) => {
              const recipient = recipients.find(r => r.id === occasion.recipientId);
              if (!recipient) return null;

              return (
                <OccasionCard
                  key={occasion.id}
                  occasion={occasion}
                  recipient={recipient}
                  onClick={() => {
                    // Navigate to occasion detail
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Premium Upsell */}
        <Card className="bg-gradient-to-br from-accent to-warning">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-accent" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-bg mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-bg opacity-90 mb-4">
                Unlock unlimited contacts, AI gift suggestions, and physical gift autopilot
              </p>
              <Button variant="secondary" className="bg-bg text-accent hover:bg-opacity-90">
                Upgrade for $2.99/mo
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
