import { useState, useCallback, useEffect } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { Address, Hash } from 'viem';
import { paymentService, PaymentResult, PaymentOptions } from '../payment-service';

export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  txHash: Hash | null;
  isConfirmed: boolean;
  balance: string | null;
  estimatedCost: string | null;
}

export interface UsePaymentsReturn {
  state: PaymentState;
  sendPayment: (to: Address, amount: string, options?: PaymentOptions) => Promise<PaymentResult>;
  getBalance: () => Promise<void>;
  estimateCost: (to: Address, amount: string) => Promise<void>;
  waitForConfirmation: (txHash: Hash, confirmations?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState: PaymentState = {
  isLoading: false,
  error: null,
  txHash: null,
  isConfirmed: false,
  balance: null,
  estimatedCost: null,
};

export function usePayments(): UsePaymentsReturn {
  const [state, setState] = useState<PaymentState>(initialState);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  // Initialize x402 client when wallet is connected
  useEffect(() => {
    if (walletClient && process.env.NEXT_PUBLIC_X402_ENDPOINT) {
      paymentService.initializeX402(process.env.NEXT_PUBLIC_X402_ENDPOINT, walletClient);
    }
  }, [walletClient]);

  const sendPayment = useCallback(async (
    to: Address,
    amount: string,
    options: PaymentOptions = {}
  ): Promise<PaymentResult> => {
    if (!walletClient) {
      const error = 'Wallet not connected';
      setState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      txHash: null, 
      isConfirmed: false 
    }));

    try {
      // Enable x402 by default if endpoint is configured
      const paymentOptions: PaymentOptions = {
        useX402: !!process.env.NEXT_PUBLIC_X402_ENDPOINT,
        x402Endpoint: process.env.NEXT_PUBLIC_X402_ENDPOINT,
        ...options,
      };

      const result = await paymentService.sendUSDCPayment(
        walletClient,
        to,
        amount,
        paymentOptions
      );

      if (result.success && result.txHash) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          txHash: result.txHash!, 
          error: null 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || 'Payment failed' 
        }));
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown payment error';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, [walletClient]);

  const getBalance = useCallback(async (): Promise<void> => {
    if (!address) {
      setState(prev => ({ ...prev, error: 'No wallet address' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const balance = await paymentService.getFormattedUSDCBalance(address);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        balance, 
        error: null 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balance';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  }, [address]);

  const estimateCost = useCallback(async (
    to: Address,
    amount: string
  ): Promise<void> => {
    if (!walletClient) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    try {
      const amountBigInt = BigInt(parseFloat(amount) * 1e6); // Convert to USDC units
      const cost = await paymentService.estimateTransactionCost(walletClient, to, amountBigInt);
      setState(prev => ({ 
        ...prev, 
        estimatedCost: cost, 
        error: null 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to estimate cost';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));
    }
  }, [walletClient]);

  const waitForConfirmation = useCallback(async (
    txHash: Hash,
    confirmations: number = 1
  ): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await paymentService.waitForTransactionConfirmation(txHash, confirmations);
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          isConfirmed: true, 
          error: null 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || 'Transaction confirmation failed' 
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Confirmation error';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Auto-fetch balance when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      getBalance();
    }
  }, [isConnected, address, getBalance]);

  return {
    state,
    sendPayment,
    getBalance,
    estimateCost,
    waitForConfirmation,
    clearError,
    reset,
  };
}