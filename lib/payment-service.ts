'use client';

import axios from 'axios';
import { parseUnits, formatUnits, type Address } from 'viem';
import { base } from 'wagmi/chains';
import { 
  USDC_CONTRACT_ADDRESS, 
  USDC_DECIMALS, 
  X402_PAYMENT_ENDPOINT,
  DEFAULT_GAS_LIMIT 
} from './constants';

// USDC ERC-20 ABI (minimal for transfers)
export const USDC_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export interface PaymentRequest {
  recipientAddress: Address;
  amount: string; // Amount in USDC (e.g., "25.50")
  recipientName?: string;
  occasionType?: string;
  message?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: bigint;
  blockNumber?: bigint;
}

export class PaymentService {
  private x402Client: any;

  constructor() {
    // Initialize axios client for x402 integration
    // For now, using standard axios - x402 integration can be added later
    this.x402Client = axios.create({
      baseURL: X402_PAYMENT_ENDPOINT,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Convert USDC amount to wei (considering 6 decimals)
   */
  public parseUSDCAmount(amount: string): bigint {
    return parseUnits(amount, USDC_DECIMALS);
  }

  /**
   * Convert wei to USDC amount string
   */
  public formatUSDCAmount(amount: bigint): string {
    return formatUnits(amount, USDC_DECIMALS);
  }

  /**
   * Get USDC balance for an address
   */
  public async getUSDCBalance(
    walletClient: any,
    address: Address
  ): Promise<string> {
    try {
      const balance = await walletClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [address],
      });

      return this.formatUSDCAmount(balance as bigint);
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      throw new Error('Failed to fetch USDC balance');
    }
  }

  /**
   * Estimate gas for USDC transfer
   */
  public async estimateGas(
    walletClient: any,
    request: PaymentRequest
  ): Promise<bigint> {
    try {
      const amountWei = this.parseUSDCAmount(request.amount);
      
      const gasEstimate = await walletClient.estimateContractGas({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [request.recipientAddress, amountWei],
        account: walletClient.account?.address,
      });

      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      return DEFAULT_GAS_LIMIT;
    }
  }

  /**
   * Execute USDC payment using x402 for enhanced reliability
   */
  public async executePayment(
    walletClient: any,
    request: PaymentRequest
  ): Promise<PaymentResult> {
    try {
      if (!walletClient.account?.address) {
        throw new Error('Wallet not connected');
      }

      const amountWei = this.parseUSDCAmount(request.amount);
      const senderAddress = walletClient.account.address;

      // Check balance before transaction
      const balance = await this.getUSDCBalance(walletClient, senderAddress);
      const balanceWei = this.parseUSDCAmount(balance);
      
      if (balanceWei < amountWei) {
        throw new Error(`Insufficient USDC balance. Have: ${balance}, Need: ${request.amount}`);
      }

      // Estimate gas
      const gasEstimate = await this.estimateGas(walletClient, request);

      // Prepare transaction data
      const transactionData = {
        to: USDC_CONTRACT_ADDRESS,
        data: walletClient.encodeFunctionData({
          abi: USDC_ABI,
          functionName: 'transfer',
          args: [request.recipientAddress, amountWei],
        }),
        gas: gasEstimate,
        value: BigInt(0),
      };

      // Use x402 for enhanced transaction submission
      const response = await this.x402Client.post('/transactions/submit', {
        transaction: transactionData,
        metadata: {
          type: 'gift_payment',
          recipientName: request.recipientName,
          occasionType: request.occasionType,
          message: request.message,
          amount: request.amount,
          token: 'USDC',
        },
      });

      if (response.data.success && response.data.transactionHash) {
        return {
          success: true,
          transactionHash: response.data.transactionHash,
          gasUsed: response.data.gasUsed ? BigInt(response.data.gasUsed) : undefined,
          blockNumber: response.data.blockNumber ? BigInt(response.data.blockNumber) : undefined,
        };
      } else {
        // Fallback to direct wallet transaction if x402 fails
        console.warn('x402 submission failed, falling back to direct transaction');
        return await this.executeDirectPayment(walletClient, request);
      }
    } catch (error) {
      console.error('Payment execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  /**
   * Direct payment execution without x402 (fallback)
   */
  private async executeDirectPayment(
    walletClient: any,
    request: PaymentRequest
  ): Promise<PaymentResult> {
    try {
      const amountWei = this.parseUSDCAmount(request.amount);
      const gasEstimate = await this.estimateGas(walletClient, request);

      const hash = await walletClient.writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [request.recipientAddress, amountWei],
        gas: gasEstimate,
      });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error) {
      console.error('Direct payment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Direct payment failed',
      };
    }
  }

  /**
   * Wait for transaction confirmation
   */
  public async waitForConfirmation(
    walletClient: any,
    transactionHash: string,
    confirmations: number = 1
  ): Promise<{ confirmed: boolean; blockNumber?: bigint; gasUsed?: bigint }> {
    try {
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: transactionHash as `0x${string}`,
        confirmations,
        timeout: 60000, // 60 seconds timeout
      });

      return {
        confirmed: receipt.status === 'success',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
      };
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      return { confirmed: false };
    }
  }

  /**
   * Get transaction status via x402
   */
  public async getTransactionStatus(transactionHash: string) {
    try {
      const response = await this.x402Client.get(`/transactions/${transactionHash}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return null;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();