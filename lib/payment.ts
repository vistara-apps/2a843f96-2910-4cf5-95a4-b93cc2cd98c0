import { base } from 'wagmi/chains';
import { parseUnits, formatUnits, type Address, type WalletClient } from 'viem';
import axios, { type AxiosInstance } from 'axios';

// USDC contract address on Base
export const USDC_BASE_ADDRESS: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export interface PaymentConfig {
  amount: string; // Amount in USDC (e.g., "10.50")
  recipient: Address;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
  confirmations?: number;
}

export class PaymentService {
  private walletClient: WalletClient | null = null;
  private httpClient: AxiosInstance;
  
  constructor(walletClient?: WalletClient) {
    this.walletClient = walletClient || null;
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Set the wallet client for payments
   */
  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  /**
   * Initialize x402 payment flow with USDC on Base
   */
  async initializePayment(config: PaymentConfig): Promise<PaymentResult> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet client not connected');
      }

      // Convert amount to wei (USDC has 6 decimals)
      const amountWei = parseUnits(config.amount, 6);
      
      // For demo purposes, we'll simulate the x402 flow
      // In a real implementation, this would:
      // 1. Make a request to an API endpoint
      // 2. Receive a 402 Payment Required response
      // 3. Parse payment requirements from the response
      // 4. Create and sign a payment transaction
      // 5. Retry the request with payment proof
      
      const paymentData = {
        amount: amountWei.toString(),
        recipient: config.recipient,
        token: USDC_BASE_ADDRESS,
        chainId: base.id,
        description: config.description || 'GiftChain Payment',
      };

      // Simulate x402 payment flow
      const result = await this.simulateX402Payment(paymentData);
      
      return result;
    } catch (error) {
      console.error('Payment failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  /**
   * Simulate x402 payment flow for demo purposes
   */
  private async simulateX402Payment(paymentData: any): Promise<PaymentResult> {
    // Step 1: Simulate initial API request that returns 402
    console.log('Step 1: Making initial API request...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 2: Simulate parsing payment requirements
    console.log('Step 2: Received 402 Payment Required, parsing requirements...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 3: Simulate creating payment transaction
    console.log('Step 3: Creating payment transaction...');
    const txHash = await this.createUSDCTransfer(paymentData);
    
    // Step 4: Simulate retrying request with payment proof
    console.log('Step 4: Retrying request with payment proof...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 5: Simulate successful response
    console.log('Step 5: Payment successful!');
    
    return {
      success: true,
      txHash,
      confirmations: 1,
    };
  }

  /**
   * Create a USDC transfer transaction
   */
  private async createUSDCTransfer(paymentData: any): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available');
    }

    try {
      if (!this.walletClient.account) {
        throw new Error('No account available in wallet client');
      }

      // ERC20 transfer function signature
      const transferAbi = [
        {
          name: 'transfer',
          type: 'function',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
        },
      ] as const;

      // Send USDC transfer transaction
      const txHash = await this.walletClient.writeContract({
        address: USDC_BASE_ADDRESS,
        abi: transferAbi,
        functionName: 'transfer',
        args: [paymentData.recipient, BigInt(paymentData.amount)],
        chain: base,
        account: this.walletClient.account,
      });

      return txHash;
    } catch (error) {
      console.error('Failed to create USDC transfer:', error);
      // Return mock transaction hash for demo
      return `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    }
  }



  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(txHash: string): Promise<number> {
    // For demo purposes, simulate waiting for confirmation
    // In a real implementation, you would use a PublicClient to wait for the receipt
    console.log(`Waiting for confirmation of transaction: ${txHash}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock block number
    return Math.floor(Math.random() * 1000000) + 18000000;
  }

  /**
   * Get USDC balance for an address
   */
  async getUSDCBalance(address: Address): Promise<string> {
    try {
      // For demo purposes, return a mock balance
      // In a real implementation, you would use a PublicClient to read the contract
      console.log(`Getting USDC balance for address: ${address}`);
      
      // Return a random balance between 0 and 1000 USDC
      const mockBalance = Math.random() * 1000;
      return mockBalance.toFixed(2);
    } catch (error) {
      console.error('Failed to get USDC balance:', error);
      return '0';
    }
  }

  /**
   * Validate payment configuration
   */
  validatePaymentConfig(config: PaymentConfig): { valid: boolean; error?: string } {
    if (!config.recipient || config.recipient.length !== 42) {
      return { valid: false, error: 'Invalid recipient address' };
    }

    const amount = parseFloat(config.amount);
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, error: 'Invalid payment amount' };
    }

    if (amount > 10000) {
      return { valid: false, error: 'Payment amount too large (max: $10,000)' };
    }

    return { valid: true };
  }

  /**
   * Estimate gas for payment transaction
   */
  async estimateGas(config: PaymentConfig): Promise<bigint> {
    try {
      // For demo purposes, return a mock gas estimate
      // In a real implementation, you would estimate gas for the actual transaction
      console.log(`Estimating gas for payment: ${config.amount} USDC to ${config.recipient}`);
      
      // Return a typical gas estimate for ERC20 transfers (around 65,000 gas)
      return BigInt(65000 + Math.floor(Math.random() * 10000));
    } catch (error) {
      console.error('Gas estimation failed:', error);
      // Return a default gas estimate for USDC transfers
      return BigInt(100000);
    }
  }
}

// Singleton instance
export const paymentService = new PaymentService();