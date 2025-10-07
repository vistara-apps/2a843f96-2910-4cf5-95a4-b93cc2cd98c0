'use client';

import { useState, useEffect } from 'react';
import { useWalletClient, useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { paymentService, type PaymentConfig, type PaymentResult } from '@/lib/payment';
import { formatCurrency } from '@/lib/utils';
import { Wallet as WalletIcon, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { type Address } from 'viem';

interface PaymentFlowProps {
  onPaymentComplete?: (result: PaymentResult) => void;
  defaultAmount?: string;
  defaultRecipient?: Address;
}

export function PaymentFlow({ 
  onPaymentComplete, 
  defaultAmount = '',
  defaultRecipient 
}: PaymentFlowProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState(defaultAmount);
  const [recipient, setRecipient] = useState(defaultRecipient || '');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [gasEstimate, setGasEstimate] = useState<string>('0');

  // Update payment service when wallet client changes
  useEffect(() => {
    if (walletClient) {
      paymentService.setWalletClient(walletClient);
    }
  }, [walletClient]);

  // Load USDC balance when connected
  useEffect(() => {
    if (address && walletClient) {
      loadUSDCBalance();
    }
  }, [address, walletClient]);

  // Estimate gas when payment config changes
  useEffect(() => {
    if (amount && recipient && walletClient) {
      estimateGas();
    }
  }, [amount, recipient, walletClient]);

  const loadUSDCBalance = async () => {
    if (!address) return;
    
    try {
      const balance = await paymentService.getUSDCBalance(address);
      setUsdcBalance(balance);
    } catch (error) {
      console.error('Failed to load USDC balance:', error);
    }
  };

  const estimateGas = async () => {
    if (!amount || !recipient) return;

    try {
      const config: PaymentConfig = { amount, recipient: recipient as Address, description };
      const gas = await paymentService.estimateGas(config);
      // Convert gas to ETH estimate (approximate)
      const gasInEth = Number(gas) * 0.000000001; // Rough estimate
      setGasEstimate(gasInEth.toFixed(6));
    } catch (error) {
      console.error('Gas estimation failed:', error);
      setGasEstimate('0.001'); // Default estimate
    }
  };

  const handlePayment = async () => {
    if (!amount || !recipient) return;

    const config: PaymentConfig = {
      amount,
      recipient: recipient as Address,
      description: description || 'GiftChain Payment',
    };

    // Validate payment config
    const validation = paymentService.validatePaymentConfig(config);
    if (!validation.valid) {
      setPaymentResult({
        success: false,
        error: validation.error,
      });
      return;
    }

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const result = await paymentService.initializePayment(config);
      setPaymentResult(result);
      
      if (result.success) {
        // Refresh balance after successful payment
        await loadUSDCBalance();
        // Clear form
        setAmount('');
        setRecipient('');
        setDescription('');
      }

      onPaymentComplete?.(result);
    } catch (error) {
      const errorResult: PaymentResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
      setPaymentResult(errorResult);
      onPaymentComplete?.(errorResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = amount && recipient && parseFloat(amount) > 0;
  const hasInsufficientBalance = parseFloat(amount || '0') > parseFloat(usdcBalance);

  if (!isConnected) {
    return (
      <Card>
        <div className="text-center py-8">
          <WalletIcon className="mx-auto mb-4 text-muted" size={48} />
          <h3 className="text-lg font-semibold text-fg mb-2">Connect Your Wallet</h3>
          <p className="text-muted mb-6">Connect your wallet to start making payments</p>
          <ConnectWallet />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-fg">Send Payment</h3>
            <p className="text-sm text-muted">Send USDC on Base network</p>
          </div>
          <Wallet>
            <WalletDropdown />
          </Wallet>
        </div>

        {/* Balance Display */}
        <div className="bg-surface p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">USDC Balance</span>
            <span className="font-semibold text-fg">{formatCurrency(parseFloat(usdcBalance))}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-2">
              Amount (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
              step="0.01"
              min="0"
            />
            {hasInsufficientBalance && (
              <p className="text-error text-sm mt-1">Insufficient USDC balance</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Gift payment"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Gas Estimate */}
        {gasEstimate !== '0' && (
          <div className="bg-surface p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Estimated Gas Fee</span>
              <span className="text-fg">~{gasEstimate} ETH</span>
            </div>
          </div>
        )}

        {/* Payment Result */}
        {paymentResult && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            paymentResult.success 
              ? 'bg-success bg-opacity-10 border border-success border-opacity-20' 
              : 'bg-error bg-opacity-10 border border-error border-opacity-20'
          }`}>
            {paymentResult.success ? (
              <CheckCircle className="text-success" size={20} />
            ) : (
              <XCircle className="text-error" size={20} />
            )}
            <div className="flex-1">
              <p className={`font-medium ${paymentResult.success ? 'text-success' : 'text-error'}`}>
                {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
              </p>
              {paymentResult.success && paymentResult.txHash && (
                <p className="text-sm text-muted">
                  Transaction: {paymentResult.txHash.slice(0, 10)}...{paymentResult.txHash.slice(-8)}
                </p>
              )}
              {!paymentResult.success && paymentResult.error && (
                <p className="text-sm text-error">{paymentResult.error}</p>
              )}
            </div>
          </div>
        )}

        {/* Send Button */}
        <Button
          variant="primary"
          onClick={handlePayment}
          disabled={!isFormValid || hasInsufficientBalance || isProcessing}
          className="w-full flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Payment
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}