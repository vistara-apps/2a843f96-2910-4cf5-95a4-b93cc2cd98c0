'use client';

import { useState, useCallback } from 'react';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';
import { base } from 'wagmi/chains';
import { paymentService, type PaymentRequest, type PaymentResult } from '../payment-service';
import { type Address } from 'viem';

export interface UsePaymentsReturn {
  // State
  isLoading: boolean;
  error: string | null;
  lastTransaction: PaymentResult | null;
  
  // Balance management
  balance: string | null;
  isLoadingBalance: boolean;
  refreshBalance: () => Promise<void>;
  
  // Payment execution
  executePayment: (request: PaymentRequest) => Promise<PaymentResult>;
  
  // Transaction monitoring
  waitForConfirmation: (hash: string, confirmations?: number) => Promise<{
    confirmed: boolean;
    blockNumber?: bigint;
    gasUsed?: bigint;
  }>;
  
  // Gas estimation
  estimateGas: (request: PaymentRequest) => Promise<bigint | null>;
}

export function usePayments(): UsePaymentsReturn {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: base.id });
  const publicClient = usePublicClient({ chainId: base.id });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<PaymentResult | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!walletClient || !address || !isConnected) {
      setBalance(null);
      return;
    }

    setIsLoadingBalance(true);
    setError(null);

    try {
      const usdcBalance = await paymentService.getUSDCBalance(walletClient, address);
      setBalance(usdcBalance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(errorMessage);
      console.error('Balance fetch error:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [walletClient, address, isConnected]);

  const executePayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult> => {
    if (!walletClient || !address || !isConnected) {
      const result: PaymentResult = {
        success: false,
        error: 'Wallet not connected',
      };
      setLastTransaction(result);
      return result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.executePayment(walletClient, request);
      setLastTransaction(result);
      
      if (!result.success && result.error) {
        setError(result.error);
      }

      // Refresh balance after successful payment
      if (result.success) {
        await refreshBalance();
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment execution failed';
      const result: PaymentResult = {
        success: false,
        error: errorMessage,
      };
      
      setError(errorMessage);
      setLastTransaction(result);
      console.error('Payment error:', err);
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, isConnected, refreshBalance]);

  const waitForConfirmation = useCallback(async (
    hash: string, 
    confirmations: number = 1
  ) => {
    if (!walletClient) {
      return { confirmed: false };
    }

    try {
      return await paymentService.waitForConfirmation(walletClient, hash, confirmations);
    } catch (err) {
      console.error('Confirmation wait error:', err);
      return { confirmed: false };
    }
  }, [walletClient]);

  const estimateGas = useCallback(async (request: PaymentRequest): Promise<bigint | null> => {
    if (!walletClient || !address || !isConnected) {
      return null;
    }

    try {
      return await paymentService.estimateGas(walletClient, request);
    } catch (err) {
      console.error('Gas estimation error:', err);
      return null;
    }
  }, [walletClient, address, isConnected]);

  return {
    // State
    isLoading,
    error,
    lastTransaction,
    
    // Balance management
    balance,
    isLoadingBalance,
    refreshBalance,
    
    // Payment execution
    executePayment,
    
    // Transaction monitoring
    waitForConfirmation,
    
    // Gas estimation
    estimateGas,
  };
}