'use client';

import { useState, useEffect } from 'react';
import { Calendar, Gift, Wallet as WalletIcon, Settings2, Bell } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { OccasionCalendar } from './OccasionCalendar';
import { UpcomingOccasions } from './UpcomingOccasions';
import { VaultDashboard } from './VaultDashboard';
import { ScheduleGiftModal } from './ScheduleGiftModal';

type Tab = 'home' | 'vault' | 'settings';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<any>(null);

  const handleScheduleGift = (occasion: any) => {
    setSelectedOccasion(occasion);
    setShowScheduleModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-card border-b sticky top-0 z-50 backdrop-blur-lg" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center" aria-hidden="true">
                <Gift className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-fg">GiftChain</h1>
                <p className="text-xs text-muted">Never miss a birthday</p>
              </div>
            </div>

            <Wallet>
              <ConnectWallet>
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
                  aria-label="Connect wallet"
                >
                  <Avatar className="w-6 h-6" />
                  <Name className="text-sm font-medium" />
                </button>
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24" role="main">
        {activeTab === 'home' && (
          <div className="space-y-8 fade-in">
            {/* Stats Overview */}
            <section aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Gift Statistics Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="metric-card" role="region" aria-label="Upcoming occasions">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-accent" aria-hidden="true" />
                    <span className="text-sm text-muted">Upcoming</span>
                  </div>
                  <p className="text-2xl font-bold text-fg">3</p>
                  <p className="text-xs text-muted">Next 30 days</p>
                </div>

                <div className="metric-card" role="region" aria-label="Scheduled gifts">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-success" aria-hidden="true" />
                    <span className="text-sm text-muted">Scheduled</span>
                  </div>
                  <p className="text-2xl font-bold text-fg">5</p>
                  <p className="text-xs text-muted">Auto-gifts</p>
                </div>

                <div className="metric-card" role="region" aria-label="Vault balance">
                  <div className="flex items-center gap-2 mb-2">
                    <WalletIcon className="w-5 h-5 text-accent" aria-hidden="true" />
                    <span className="text-sm text-muted">Vault</span>
                  </div>
                  <p className="text-2xl font-bold text-fg">$250</p>
                  <p className="text-xs text-muted">Available</p>
                </div>

                <div className="metric-card" role="region" aria-label="Gift giving streak">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5 text-warning" aria-hidden="true" />
                    <span className="text-sm text-muted">Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-fg">12</p>
                  <p className="text-xs text-muted">Months</p>
                </div>
              </div>
            </section>

            {/* Calendar */}
            <OccasionCalendar onDateSelect={(date) => console.log(date)} />

            {/* Upcoming Occasions */}
            <UpcomingOccasions onScheduleGift={handleScheduleGift} />
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="fade-in">
            <VaultDashboard />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="fade-in">
            <div className="glass-card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-fg mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-lg gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-fg">Notifications</p>
                    <p className="text-sm text-muted">Reminder frequency</p>
                  </div>
                  <button className="btn-primary w-full sm:w-auto px-4 py-2 text-sm">
                    Configure
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-lg gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-fg">Auto-Replenish</p>
                    <p className="text-sm text-muted">Monthly vault funding</p>
                  </div>
                  <button className="btn-secondary w-full sm:w-auto px-4 py-2 text-sm">
                    Enable
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-lg gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-fg">Premium</p>
                    <p className="text-sm text-muted">Unlock AI suggestions</p>
                  </div>
                  <button className="btn-primary w-full sm:w-auto px-4 py-2 text-sm">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t backdrop-blur-lg" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg ${
                activeTab === 'home' ? 'bg-accent text-slate-900' : 'text-muted hover:text-fg'
              }`}
              aria-current={activeTab === 'home' ? 'page' : undefined}
              aria-label="Home tab"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg ${
                activeTab === 'vault' ? 'bg-accent text-slate-900' : 'text-muted hover:text-fg'
              }`}
              aria-current={activeTab === 'vault' ? 'page' : undefined}
              aria-label="Vault tab"
            >
              <WalletIcon className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-medium">Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg ${
                activeTab === 'settings' ? 'bg-accent text-slate-900' : 'text-muted hover:text-fg'
              }`}
              aria-current={activeTab === 'settings' ? 'page' : undefined}
              aria-label="Settings tab"
            >
              <Settings2 className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Schedule Gift Modal */}
      {showScheduleModal && (
        <ScheduleGiftModal
          occasion={selectedOccasion}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}
