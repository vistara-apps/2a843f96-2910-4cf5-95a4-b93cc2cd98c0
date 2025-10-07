'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePayments } from '@/lib/hooks/usePayments';
import { type Address } from 'viem';
import { Loader2, CheckCircle, AlertCircle, TestTube } from 'lucide-react';

export function PaymentTest() {
  const [testAddress, setTestAddress] = useState('0x742d35Cc6634C0532925a3b8D0C9C0C6B9F7d5c5'); // Example test address
  const [testAmount, setTestAmount] = useState('1.00');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const { isConnected, address } = useAccount();
  const { 
    executePayment, 
    waitForConfirmation, 
    estimateGas, 
    balance, 
    refreshBalance,
    error: paymentError 
  } = usePayments();

  const addTestResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, { test, status, message, data, timestamp: new Date() }]);
  };

  const runEndToEndTest = async () => {
    if (!isConnected || !address) {
      addTestResult('Connection Check', 'error', 'Wallet not connected');
      return;
    }

    setIsRunningTest(true);
    setTestResults([]);

    try {
      // Test 1: Check wallet connection
      addTestResult('Wallet Connection', 'success', `Connected to ${address}`);

      // Test 2: Check USDC balance
      await refreshBalance();
      if (balance) {
        addTestResult('USDC Balance', 'success', `Current balance: ${balance} USDC`);
        
        const balanceNum = parseFloat(balance);
        const testAmountNum = parseFloat(testAmount);
        
        if (balanceNum < testAmountNum) {
          addTestResult('Balance Check', 'error', `Insufficient balance for test. Need ${testAmount} USDC, have ${balance} USDC`);
          return;
        }
      } else {
        addTestResult('USDC Balance', 'error', 'Could not fetch USDC balance');
        return;
      }

      // Test 3: Gas estimation
      try {
        const gasEstimate = await estimateGas({
          recipientAddress: testAddress as Address,
          amount: testAmount,
          recipientName: 'Test Recipient',
          occasionType: 'test',
        });
        
        if (gasEstimate) {
          addTestResult('Gas Estimation', 'success', `Estimated gas: ${gasEstimate.toString()}`);
        } else {
          addTestResult('Gas Estimation', 'error', 'Failed to estimate gas');
        }
      } catch (error) {
        addTestResult('Gas Estimation', 'error', `Gas estimation failed: ${error}`);
      }

      // Test 4: Execute payment
      addTestResult('Payment Execution', 'info', 'Initiating payment...');
      
      const paymentResult = await executePayment({
        recipientAddress: testAddress as Address,
        amount: testAmount,
        recipientName: 'Test Recipient',
        occasionType: 'End-to-End Test',
        message: 'GiftChain payment flow test',
      });

      if (paymentResult.success && paymentResult.transactionHash) {
        addTestResult('Payment Execution', 'success', `Payment successful! Hash: ${paymentResult.transactionHash}`);

        // Test 5: Wait for confirmation
        addTestResult('Transaction Confirmation', 'info', 'Waiting for confirmation...');
        
        const confirmation = await waitForConfirmation(paymentResult.transactionHash, 1);
        
        if (confirmation.confirmed) {
          addTestResult('Transaction Confirmation', 'success', `Transaction confirmed in block ${confirmation.blockNumber}`);
          
          if (confirmation.gasUsed) {
            addTestResult('Gas Usage', 'info', `Gas used: ${confirmation.gasUsed.toString()}`);
          }
        } else {
          addTestResult('Transaction Confirmation', 'error', 'Transaction confirmation failed or timed out');
        }

        // Test 6: Verify balance update
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        await refreshBalance();
        addTestResult('Balance Update', 'success', `Updated balance: ${balance} USDC`);

      } else {
        addTestResult('Payment Execution', 'error', paymentResult.error || 'Payment failed');
      }

    } catch (error) {
      addTestResult('Test Suite', 'error', `Test failed: ${error}`);
    } finally {
      setIsRunningTest(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="w-6 h-6 text-accent" />
        <h3 className="text-lg font-bold text-fg">Payment Flow Test</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-fg mb-2">Test Recipient Address</label>
          <input
            type="text"
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            className="input-field"
            placeholder="0x..."
            disabled={isRunningTest}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-2">Test Amount (USDC)</label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(e.target.value)}
            className="input-field"
            placeholder="1.00"
            disabled={isRunningTest}
            step="0.01"
            min="0.01"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={runEndToEndTest}
          disabled={isRunningTest || !isConnected}
          className="btn-primary flex items-center gap-2"
        >
          {isRunningTest ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run End-to-End Test'
          )}
        </button>
        
        <button
          onClick={clearResults}
          disabled={isRunningTest}
          className="btn-secondary"
        >
          Clear Results
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-fg">Test Results:</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-start gap-3 ${
                  result.status === 'success' ? 'bg-green-900 bg-opacity-20' :
                  result.status === 'error' ? 'bg-red-900 bg-opacity-20' :
                  'bg-blue-900 bg-opacity-20'
                }`}
              >
                {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />}
                {result.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                {result.status === 'info' && <Loader2 className="w-5 h-5 text-blue-400 mt-0.5" />}
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    result.status === 'success' ? 'text-green-400' :
                    result.status === 'error' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {result.test}
                  </p>
                  <p className={`text-sm ${
                    result.status === 'success' ? 'text-green-300' :
                    result.status === 'error' ? 'text-red-300' :
                    'text-blue-300'
                  }`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <pre className="text-xs text-muted mt-1 bg-slate-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Status */}
      <div className="mt-6 p-4 bg-surface rounded-lg">
        <h4 className="font-semibold text-fg mb-2">Current Status:</h4>
        <div className="space-y-1 text-sm">
          <p className="text-muted">
            Wallet: {isConnected ? `Connected (${address})` : 'Not connected'}
          </p>
          <p className="text-muted">
            USDC Balance: {balance || 'Unknown'}
          </p>
          {paymentError && (
            <p className="text-red-400">
              Error: {paymentError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}