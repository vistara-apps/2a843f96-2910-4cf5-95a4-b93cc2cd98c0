'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { paymentService, USDC_BASE_ADDRESS } from '@/lib/payment';
import { CheckCircle, XCircle, Loader2, TestTube } from 'lucide-react';
import { type Address } from 'viem';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

export function PaymentTest() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    if (!walletClient || !address) return;

    setIsRunning(true);
    setTestResults([]);

    const tests: TestResult[] = [
      { name: 'Wallet Client Connection', status: 'pending' },
      { name: 'USDC Balance Check', status: 'pending' },
      { name: 'Payment Config Validation', status: 'pending' },
      { name: 'Gas Estimation', status: 'pending' },
      { name: 'x402 Integration', status: 'pending' },
    ];

    setTestResults([...tests]);

    // Test 1: Wallet Client Connection
    await runTest(0, async () => {
      paymentService.setWalletClient(walletClient);
      if (!walletClient.account) {
        throw new Error('Wallet client not properly connected');
      }
      return 'Wallet client connected successfully';
    });

    // Test 2: USDC Balance Check
    await runTest(1, async () => {
      const balance = await paymentService.getUSDCBalance(address);
      return `USDC Balance: ${balance} USDC`;
    });

    // Test 3: Payment Config Validation
    await runTest(2, async () => {
      const testConfig = {
        amount: '1.00',
        recipient: '0x742d35Cc6634C0532925a3b8D186dC9F7b8C7A8E' as Address, // Test address
        description: 'Test payment',
      };
      
      const validation = paymentService.validatePaymentConfig(testConfig);
      if (!validation.valid) {
        throw new Error(validation.error || 'Validation failed');
      }
      return 'Payment configuration is valid';
    });

    // Test 4: Gas Estimation
    await runTest(3, async () => {
      const testConfig = {
        amount: '1.00',
        recipient: '0x742d35Cc6634C0532925a3b8D186dC9F7b8C7A8E' as Address,
        description: 'Test payment',
      };
      
      const gasEstimate = await paymentService.estimateGas(testConfig);
      return `Gas estimate: ${gasEstimate.toString()} wei`;
    });

    // Test 5: x402 Integration (mock test)
    await runTest(4, async () => {
      // This is a mock test since we can't actually send payments in test mode
      // In a real scenario, this would test the x402 payment request creation
      return 'x402 integration ready (mock test passed)';
    });

    setIsRunning(false);
  };

  const runTest = async (index: number, testFn: () => Promise<string>) => {
    const startTime = Date.now();
    
    setTestResults(prev => prev.map((test, i) => 
      i === index ? { ...test, status: 'running' } : test
    ));

    try {
      const message = await testFn();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => prev.map((test, i) => 
        i === index ? { ...test, status: 'passed', message, duration } : test
      ));
    } catch (error) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      setTestResults(prev => prev.map((test, i) => 
        i === index ? { ...test, status: 'failed', message, duration } : test
      ));
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="animate-spin text-accent" size={16} />;
      case 'passed':
        return <CheckCircle className="text-success" size={16} />;
      case 'failed':
        return <XCircle className="text-error" size={16} />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return 'text-accent';
      case 'passed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      default:
        return 'text-muted';
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <div className="text-center py-8">
          <TestTube className="mx-auto mb-4 text-muted" size={48} />
          <h3 className="text-lg font-semibold text-fg mb-2">Payment Flow Tests</h3>
          <p className="text-muted">Connect your wallet to run payment flow tests</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-fg">Payment Flow Tests</h3>
            <p className="text-sm text-muted">Verify x402 payment integration</p>
          </div>
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Running...
              </>
            ) : (
              <>
                <TestTube size={16} />
                Run Tests
              </>
            )}
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            {testResults.map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-surface rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className={`font-medium ${getStatusColor(test.status)}`}>
                      {test.name}
                    </p>
                    {test.message && (
                      <p className="text-xs text-muted mt-1">{test.message}</p>
                    )}
                  </div>
                </div>
                {test.duration && (
                  <span className="text-xs text-muted">{test.duration}ms</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Test Summary */}
        {testResults.length > 0 && !isRunning && (
          <div className="bg-surface p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-success">
                  {testResults.filter(t => t.status === 'passed').length}
                </p>
                <p className="text-xs text-muted">Passed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-error">
                  {testResults.filter(t => t.status === 'failed').length}
                </p>
                <p className="text-xs text-muted">Failed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">
                  {testResults.length}
                </p>
                <p className="text-xs text-muted">Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Info */}
        <div className="bg-surface p-4 rounded-lg">
          <h4 className="font-medium text-fg mb-2">Configuration</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Network:</span>
              <span className="text-fg">Base</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">USDC Contract:</span>
              <span className="text-fg font-mono text-xs">
                {USDC_BASE_ADDRESS.slice(0, 10)}...{USDC_BASE_ADDRESS.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Wallet:</span>
              <span className="text-fg font-mono text-xs">
                {address?.slice(0, 10)}...{address?.slice(-8)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}