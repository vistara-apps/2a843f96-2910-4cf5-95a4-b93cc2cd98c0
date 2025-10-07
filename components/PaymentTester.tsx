'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePayments } from '../lib/hooks/usePayments';
import { Address } from 'viem';
import { 
  Wallet, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react';

export function PaymentTester() {
  const [testAddress, setTestAddress] = useState('0x742d35Cc6634C0532925a3b8D5c9E4b6C9b5c1C0'); // Test address
  const [testAmount, setTestAmount] = useState('1.00');
  const [useX402, setUseX402] = useState(true);
  const [copied, setCopied] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { 
    state: paymentState, 
    sendPayment, 
    getBalance, 
    estimateCost, 
    waitForConfirmation, 
    clearError,
    reset 
  } = usePayments();

  const handleSendTest = async () => {
    if (!testAddress || !testAmount) return;

    clearError();
    
    try {
      const result = await sendPayment(testAddress as Address, testAmount, {
        useX402,
      });

      if (result.success && result.txHash) {
        console.log('Payment sent successfully:', result.txHash);
        // Wait for confirmation
        await waitForConfirmation(result.txHash, 1);
      }
    } catch (error) {
      console.error('Test payment failed:', error);
    }
  };

  const handleEstimate = async () => {
    if (!testAddress || !testAmount) return;
    await estimateCost(testAddress as Address, testAmount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBaseExplorerUrl = (txHash: string) => {
    return `https://basescan.org/tx/${txHash}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-fg mb-2">Payment Flow Tester</h1>
        <p className="text-muted">Test USDC payments on Base with x402 protocol</p>
      </div>

      {/* Wallet Connection */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-fg mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Connection
        </h2>
        
        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-muted">Connect your wallet to test payments</p>
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
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold text-fg">Connected</p>
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
            
            <button
              onClick={getBalance}
              disabled={paymentState.isLoading}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${paymentState.isLoading ? 'animate-spin' : ''}`} />
              Refresh Balance
            </button>
          </div>
        )}
      </div>

      {/* Payment Testing */}
      {isConnected && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Payment Testing
          </h2>

          <div className="space-y-4">
            {/* Test Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Test Address</label>
                <input
                  type="text"
                  value={testAddress}
                  onChange={(e) => setTestAddress(e.target.value)}
                  className="input-field"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Amount (USDC)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="input-field pl-10"
                    placeholder="1.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* x402 Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useX402"
                checked={useX402}
                onChange={(e) => setUseX402(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useX402" className="text-sm font-medium text-fg">
                Use x402 Protocol (with fallback to direct transfer)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleEstimate}
                disabled={!testAddress || !testAmount || paymentState.isLoading}
                className="btn-secondary flex-1"
              >
                Estimate Gas
              </button>
              <button
                onClick={handleSendTest}
                disabled={!testAddress || !testAmount || paymentState.isLoading}
                className="btn-primary flex-1"
              >
                {paymentState.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {paymentState.txHash ? 'Confirming...' : 'Sending...'}
                  </div>
                ) : (
                  'Send Test Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Display */}
      {(paymentState.error || paymentState.txHash || paymentState.estimatedCost) && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Status</h2>
          
          <div className="space-y-4">
            {/* Error */}
            {paymentState.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-400">Error</h3>
                    <p className="text-sm text-red-300">{paymentState.error}</p>
                    <button
                      onClick={clearError}
                      className="text-xs text-red-400 hover:text-red-300 mt-2"
                    >
                      Clear Error
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gas Estimate */}
            {paymentState.estimatedCost && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-blue-400">Gas Estimate</h3>
                    <p className="text-sm text-blue-300">
                      ~{parseFloat(paymentState.estimatedCost).toFixed(6)} ETH
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction */}
            {paymentState.txHash && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-400">Transaction Sent</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-green-300 font-mono">
                        {paymentState.txHash.slice(0, 10)}...{paymentState.txHash.slice(-8)}
                      </p>
                      <button
                        onClick={() => copyToClipboard(paymentState.txHash!)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={getBaseExplorerUrl(paymentState.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {paymentState.isConfirmed ? (
                      <p className="text-sm text-green-400 mt-1">✓ Confirmed</p>
                    ) : (
                      <p className="text-sm text-yellow-400 mt-1">⏳ Waiting for confirmation...</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={reset}
              className="btn-secondary w-full"
            >
              Reset Test State
            </button>
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}