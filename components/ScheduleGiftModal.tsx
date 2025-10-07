'use client';

import { useState } from 'react';
import { X, DollarSign, Video, Image as ImageIcon, Package } from 'lucide-react';

interface ScheduleGiftModalProps {
  occasion: any;
  onClose: () => void;
}

type GiftType = 'crypto' | 'physical' | 'both';

export function ScheduleGiftModal({ occasion, onClose }: ScheduleGiftModalProps) {
  const [giftType, setGiftType] = useState<GiftType>('crypto');
  const [amount, setAmount] = useState('25');
  const [token, setToken] = useState('USDC');

  const handleSchedule = () => {
    // Handle gift scheduling logic
    console.log('Scheduling gift:', { giftType, amount, token });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-fg">Schedule Gift</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Recipient Info */}
          <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
            <div className="w-12 h-12 bg-accent bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
              {occasion?.recipientAvatar || '🎁'}
            </div>
            <div>
              <h3 className="font-semibold text-fg">{occasion?.recipientName || 'Recipient'}</h3>
              <p className="text-sm text-muted">{occasion?.occasionType} • {occasion?.date}</p>
            </div>
          </div>

          {/* Gift Type Tabs */}
          <div className="flex gap-2 p-1 bg-surface rounded-lg">
            <button
              onClick={() => setGiftType('crypto')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                giftType === 'crypto' ? 'bg-accent text-slate-900' : 'text-muted hover:text-fg'
              }`}
            >
              Crypto
            </button>
            <button
              onClick={() => setGiftType('physical')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                giftType === 'physical' ? 'bg-accent text-slate-900' : 'text-muted hover:text-fg'
              }`}
            >
              Physical
            </button>
            <button
              onClick={() => setGiftType('both')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                giftType === 'both' ? 'bg-accent text-slate-900' : 'text-muted hover:text-fg'
              }`}
            >
              Both
            </button>
          </div>

          {/* Crypto Gift Form */}
          {(giftType === 'crypto' || giftType === 'both') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field pl-10"
                    placeholder="25.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">Token</label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="input-field"
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>

              <div className="space-y-3">
                <button className="w-full p-4 bg-surface rounded-lg flex items-center gap-3 hover:bg-slate-700 transition-all duration-200">
                  <Video className="w-5 h-5 text-accent" />
                  <div className="text-left">
                    <p className="font-medium text-fg">Add Video Message</p>
                    <p className="text-sm text-muted">Record a 15-second message</p>
                  </div>
                </button>

                <button className="w-full p-4 bg-surface rounded-lg flex items-center gap-3 hover:bg-slate-700 transition-all duration-200">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  <div className="text-left">
                    <p className="font-medium text-fg">Choose NFT Card</p>
                    <p className="text-sm text-muted">5 free templates available</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Physical Gift Form */}
          {(giftType === 'physical' || giftType === 'both') && (
            <div className="space-y-4">
              <button className="w-full p-4 bg-surface rounded-lg flex items-center gap-3 hover:bg-slate-700 transition-all duration-200">
                <Package className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium text-fg">Get AI Suggestions</p>
                  <p className="text-sm text-muted">Personalized gift ideas</p>
                </div>
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-surface rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Gift Amount</span>
              <span className="text-fg font-medium">${amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Transaction Fee (3%)</span>
              <span className="text-fg font-medium">${(parseFloat(amount) * 0.03).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Est. Gas</span>
              <span className="text-fg font-medium">$0.50</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium text-fg">Total</span>
                <span className="font-bold text-accent">${(parseFloat(amount) * 1.03 + 0.5).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="btn-primary flex-1"
            >
              Schedule Gift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
