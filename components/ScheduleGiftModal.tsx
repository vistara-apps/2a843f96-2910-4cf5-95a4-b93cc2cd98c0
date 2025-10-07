'use client';

import { useState } from 'react';
import { X, DollarSign, Video, Image as ImageIcon, Package, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { usePayments } from '@/lib/hooks/usePayments';
import { useAccount } from 'wagmi';
import { type Address } from 'viem';

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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const { executePayment, waitForConfirmation, balance, error: paymentError } = usePayments();

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

    // Validate address format (basic check)
    if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const result = await executePayment({
        recipientAddress: recipientAddress as Address,
        amount,
        recipientName: occasion?.recipientName,
        occasionType: occasion?.occasionType,
        message: `Gift for ${occasion?.occasionType} from GiftChain`,
      });

      if (result.success && result.transactionHash) {
        setTransactionHash(result.transactionHash);
        setPaymentStatus('success');
        
        // Wait for confirmation
        const confirmation = await waitForConfirmation(result.transactionHash, 1);
        if (confirmation.confirmed) {
          console.log('Transaction confirmed:', {
            hash: result.transactionHash,
            blockNumber: confirmation.blockNumber,
            gasUsed: confirmation.gasUsed,
          });
        }
      } else {
        setPaymentStatus('error');
        console.error('Payment failed:', result.error);
      }
    } catch (error) {
      setPaymentStatus('error');
      console.error('Payment error:', error);
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
                <label className="block text-sm font-medium text-fg mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="input-field"
                  placeholder="0x..."
                  disabled={isProcessing}
                />
              </div>

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
                    disabled={isProcessing}
                  />
                </div>
                {balance && (
                  <p className="text-xs text-muted mt-1">Available: {balance} USDC</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">Token</label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="input-field"
                  disabled={isProcessing}
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH (Coming Soon)</option>
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

          {/* Payment Status */}
          {paymentStatus !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              paymentStatus === 'processing' ? 'bg-blue-900 bg-opacity-20' :
              paymentStatus === 'success' ? 'bg-green-900 bg-opacity-20' :
              'bg-red-900 bg-opacity-20'
            }`}>
              {paymentStatus === 'processing' && (
                <>
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-400">Processing Payment...</p>
                    <p className="text-sm text-blue-300">Please confirm the transaction in your wallet</p>
                  </div>
                </>
              )}
              {paymentStatus === 'success' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium text-green-400">Payment Successful!</p>
                    {transactionHash && (
                      <a
                        href={`https://basescan.org/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-300 hover:underline"
                      >
                        View on BaseScan →
                      </a>
                    )}
                  </div>
                </>
              )}
              {paymentStatus === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-red-400">Payment Failed</p>
                    <p className="text-sm text-red-300">
                      {paymentError || 'An error occurred during payment'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="p-4 bg-yellow-900 bg-opacity-20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-400">Wallet Not Connected</p>
                <p className="text-sm text-yellow-300">Please connect your wallet to send gifts</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isProcessing}
            >
              {paymentStatus === 'success' ? 'Close' : 'Cancel'}
            </button>
            <button
              onClick={handleSchedule}
              className="btn-primary flex-1"
              disabled={isProcessing || !isConnected || paymentStatus === 'success'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : paymentStatus === 'success' ? (
                'Gift Sent!'
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
