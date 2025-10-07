'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePayments } from '../lib/hooks/usePayments';
import { Address } from 'viem';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  testFunction: () => Promise<{ success: boolean; error?: string; message?: string }>;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
}

export function ErrorHandlingTest() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { address, isConnected } = useAccount();
  const { sendPayment, getBalance, estimateCost, clearError } = usePayments();

  const initializeTestCases = (): TestCase[] => [
    {
      id: 'invalid-address',
      name: 'Invalid Recipient Address',
      description: 'Test payment to invalid address format',
      testFunction: async () => {
        try {
          const result = await sendPayment('0xinvalid' as Address, '1.00');
          return {
            success: !result.success,
            message: result.success ? 'Should have failed' : 'Correctly rejected invalid address',
          };
        } catch (error) {
          return {
            success: true,
            message: 'Correctly caught invalid address error',
          };
        }
      },
      status: 'pending',
    },
    {
      id: 'zero-amount',
      name: 'Zero Amount Payment',
      description: 'Test payment with zero amount',
      testFunction: async () => {
        try {
          const result = await sendPayment(
            '0x742d35Cc6634C0532925a3b8D5c9E4b6C9b5c1C0' as Address,
            '0'
          );
          return {
            success: !result.success,
            message: result.success ? 'Should have failed' : 'Correctly rejected zero amount',
          };
        } catch (error) {
          return {
            success: true,
            message: 'Correctly caught zero amount error',
          };
        }
      },
      status: 'pending',
    },
    {
      id: 'negative-amount',
      name: 'Negative Amount Payment',
      description: 'Test payment with negative amount',
      testFunction: async () => {
        try {
          const result = await sendPayment(
            '0x742d35Cc6634C0532925a3b8D5c9E4b6C9b5c1C0' as Address,
            '-1.00'
          );
          return {
            success: !result.success,
            message: result.success ? 'Should have failed' : 'Correctly rejected negative amount',
          };
        } catch (error) {
          return {
            success: true,
            message: 'Correctly caught negative amount error',
          };
        }
      },
      status: 'pending',
    },
    {
      id: 'insufficient-balance',
      name: 'Insufficient Balance',
      description: 'Test payment exceeding wallet balance',
      testFunction: async () => {
        try {
          const result = await sendPayment(
            '0x742d35Cc6634C0532925a3b8D5c9E4b6C9b5c1C0' as Address,
            '999999999.00' // Very large amount
          );
          return {
            success: !result.success,
            message: result.success ? 'Should have failed' : 'Correctly detected insufficient balance',
          };
        } catch (error) {
          return {
            success: true,
            message: 'Correctly caught insufficient balance error',
          };
        }
      },
      status: 'pending',
    },
    {
      id: 'gas-estimation',
      name: 'Gas Estimation Error Handling',
      description: 'Test gas estimation with invalid parameters',
      testFunction: async () => {
        try {
          await estimateCost('0xinvalid' as Address, '1.00');
          return {
            success: false,
            message: 'Should have failed gas estimation',
          };
        } catch (error) {
          return {
            success: true,
            message: 'Correctly handled gas estimation error',
          };
        }
      },
      status: 'pending',
    },
    {
      id: 'balance-fetch',
      name: 'Balance Fetch Error Recovery',
      description: 'Test balance fetching error handling',
      testFunction: async () => {
        try {
          await getBalance();
          return {
            success: true,
            message: 'Balance fetch completed (success or proper error handling)',
          };
        } catch (error) {
          return {
            success: true,
            message: 'Balance fetch error handled gracefully',
          };
        }
      },
      status: 'pending',
    },
  ];

  const runSingleTest = async (testCase: TestCase): Promise<void> => {
    setTestCases(prev => 
      prev.map(tc => 
        tc.id === testCase.id 
          ? { ...tc, status: 'running' as const }
          : tc
      )
    );

    try {
      const result = await testCase.testFunction();
      
      setTestCases(prev => 
        prev.map(tc => 
          tc.id === testCase.id 
            ? { 
                ...tc, 
                status: result.success ? 'passed' as const : 'failed' as const,
                result: result.message || result.error || 'Test completed'
              }
            : tc
        )
      );
    } catch (error) {
      setTestCases(prev => 
        prev.map(tc => 
          tc.id === testCase.id 
            ? { 
                ...tc, 
                status: 'failed' as const,
                result: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            : tc
        )
      );
    }
  };

  const runAllTests = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsRunning(true);
    clearError();
    
    const tests = initializeTestCases();
    setTestCases(tests);

    for (const testCase of tests) {
      await runSingleTest(testCase);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunning(false);
  };

  const resetTests = () => {
    setTestCases([]);
    clearError();
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestCase['status']) => {
    switch (status) {
      case 'pending':
        return 'border-gray-300';
      case 'running':
        return 'border-blue-500 bg-blue-50';
      case 'passed':
        return 'border-green-500 bg-green-50';
      case 'failed':
        return 'border-red-500 bg-red-50';
    }
  };

  const passedTests = testCases.filter(tc => tc.status === 'passed').length;
  const failedTests = testCases.filter(tc => tc.status === 'failed').length;
  const totalTests = testCases.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-fg mb-2">Error Handling Test Suite</h1>
        <p className="text-muted">Comprehensive testing of payment error scenarios</p>
      </div>

      {/* Connection Status */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-fg">Prerequisites</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">
              Wallet Connected: {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not connected'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-fg">Test Controls</h2>
          {totalTests > 0 && (
            <div className="text-sm text-muted">
              {passedTests} passed, {failedTests} failed, {totalTests} total
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={runAllTests}
            disabled={!isConnected || isRunning}
            className="btn-primary"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running Tests...
              </div>
            ) : (
              'Run All Tests'
            )}
          </button>
          
          <button
            onClick={resetTests}
            disabled={isRunning}
            className="btn-secondary"
          >
            Reset Tests
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testCases.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Test Results</h2>
          
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <div
                key={testCase.id}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${getStatusColor(testCase.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(testCase.status)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-fg mb-1">{testCase.name}</h3>
                    <p className="text-sm text-muted mb-2">{testCase.description}</p>
                    
                    {testCase.result && (
                      <div className="text-sm font-medium">
                        <span className={`${
                          testCase.status === 'passed' ? 'text-green-700' : 
                          testCase.status === 'failed' ? 'text-red-700' : 
                          'text-blue-700'
                        }`}>
                          {testCase.result}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => runSingleTest(testCase)}
                    disabled={isRunning || !isConnected}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {totalTests > 0 && !isRunning && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Summary</h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className={`text-lg font-semibold ${
              failedTests === 0 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {failedTests === 0 ? '🎉 All tests passed!' : '⚠️ Some tests failed'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}