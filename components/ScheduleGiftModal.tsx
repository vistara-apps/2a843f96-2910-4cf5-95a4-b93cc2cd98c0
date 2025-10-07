'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Video, Image as ImageIcon, Package, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePayments } from '../lib/hooks/usePayments';
import { Address } from 'viem';

interface ScheduleGiftModalProps {
  occasion: any;
  onClose: () => void;
}

type GiftType = 'crypto' | 'physical' | 'both';

export function ScheduleGiftModal({ occasion, onClose }: ScheduleGiftModalProps) {
  const [giftType, setGiftType] = useState<GiftType>('crypto');
  const [amount, setAmount] = useState('25');
  const [token, setToken] = useState('USDC');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { state: paymentState, sendPayment, getBalance, estimateCost, waitForConfirmation, clearError } = usePayments();

  // Update estimated cost when amount changes
  useEffect(() => {
    if (recipientAddress && amount && parseFloat(amount) > 0) {
      estimateCost(recipientAddress as Address, amount);
    }
  }, [amount, recipientAddress, estimateCost]);

  const handleSchedule = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!recipientAddress) {
      alert('Please enter recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      // Send the payment
      const result = await sendPayment(recipientAddress as Address, amount, {
        useX402: true, // Enable x402 by default
      });

      if (result.success && result.txHash) {
        // Wait for confirmation
        await waitForConfirmation(result.txHash, 1);
        
        if (paymentState.isConfirmed) {
          alert(`Gift sent successfully! Transaction: ${result.txHash}`);
          onClose();
        }
      } else {
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
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
          {/* Wallet Connection */}
          {!isConnected ? (
            <div className="p-4 bg-surface rounded-lg border border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-fg">Connect Wallet</h3>
              </div>
              <p className="text-sm text-muted mb-4">Connect your wallet to send gifts</p>
              <div className="space-y-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="w-full p-3 bg-accent/10 hover:bg-accent/20 rounded-lg text-left transition-all duration-200"
                  >
                    <span className="font-medium text-fg">{connector.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-surface rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-fg">Wallet Connected</h3>
                    <p className="text-sm text-muted">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-fg">
                    {paymentState.balance ? `${parseFloat(paymentState.balance).toFixed(2)} USDC` : 'Loading...'}
                  </p>
                  <button
                    onClick={() => disconnect()}
                    className="text-xs text-muted hover:text-fg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recipient Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
              <div className="w-12 h-12 bg-accent bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                {occasion?.recipientAvatar || '🎁'}
              </div>
              <div>
                <h3 className="font-semibold text-fg">{occasion?.recipientName || 'Recipient'}</h3>
                <p className="text-sm text-muted">{occasion?.occasionType} • {occasion?.date}</p>
              </div>
            </div>

            {/* Recipient Address Input */}
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Recipient Wallet Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="input-field"
                placeholder="0x..."
                disabled={!isConnected}
              />
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

          {/* Error Display */}
          {paymentState.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-400">Payment Error</h3>
                  <p className="text-sm text-red-300">{paymentState.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Status */}
          {paymentState.txHash && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-blue-400">Transaction Sent</h3>
                  <p className="text-sm text-blue-300">
                    Hash: {paymentState.txHash.slice(0, 10)}...{paymentState.txHash.slice(-8)}
                  </p>
                  {paymentState.isConfirmed && (
                    <p className="text-sm text-green-400 mt-1">✓ Confirmed</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {isConnected && (
            <div className="p-4 bg-surface rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Gift Amount</span>
                <span className="text-fg font-medium">${amount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Est. Gas Fee</span>
                <span className="text-fg font-medium">
                  {paymentState.estimatedCost ? `${parseFloat(paymentState.estimatedCost).toFixed(6)} ETH` : 'Calculating...'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Payment Method</span>
                <span className="text-fg font-medium">x402 Protocol</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-fg">Total USDC</span>
                  <span className="font-bold text-accent">${amount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isProcessing || paymentState.isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="btn-primary flex-1"
              disabled={
                !isConnected || 
                !recipientAddress || 
                !amount || 
                parseFloat(amount) <= 0 || 
                isProcessing || 
                paymentState.isLoading
              }
            >
              {isProcessing || paymentState.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {paymentState.txHash ? 'Confirming...' : 'Sending...'}
                </div>
              ) : (
                'Send Gift'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
