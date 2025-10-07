'use client';

import { Navigation } from '@/components/layout/Navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Bell, 
  Wallet as WalletIcon, 
  Users, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight 
} from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: WalletIcon, label: 'Connected Wallet', value: '0x1234...5678' },
        { icon: Users, label: 'Farcaster Profile', value: '@username' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'Enabled' },
        { icon: Shield, label: 'Privacy', value: 'Public Profile' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', value: null },
        { icon: LogOut, label: 'Sign Out', value: null },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-surface border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-fg">Settings</h1>
          <p className="text-sm text-muted">Manage your account</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-accent to-warning">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center text-accent font-bold text-2xl">
              U
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-bg">Username</h2>
              <p className="text-sm text-bg opacity-90">Premium Member</p>
            </div>
            <Button variant="secondary" className="bg-bg text-accent hover:bg-opacity-90">
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              {section.title}
            </h3>
            <Card className="divide-y border-border">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-accent" size={20} />
                      <span className="font-medium text-fg">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-sm text-muted">{item.value}</span>
                      )}
                      <ChevronRight className="text-muted" size={20} />
                    </div>
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* App Info */}
        <Card>
          <div className="text-center py-4">
            <p className="text-sm text-muted mb-1">GiftChain v1.0.0</p>
            <p className="text-xs text-muted">Built on Base</p>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
