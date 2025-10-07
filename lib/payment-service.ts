import { createPublicClient, createWalletClient, custom, parseUnits, formatUnits, Address, Hash, WalletClient, PublicClient } from 'viem';
import { base } from 'viem/chains';
import axios, { AxiosInstance } from 'axios';
import { withPaymentInterceptor, createSigner } from 'x402-axios';

// USDC contract address on Base
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

// USDC ABI (minimal for transfer operations)
export const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

export interface PaymentResult {
  success: boolean;
  txHash?: Hash;
  error?: string;
  gasUsed?: bigint;
  effectiveGasPrice?: bigint;
}

export interface PaymentOptions {
  useX402?: boolean;
  x402Endpoint?: string;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export class PaymentService {
  private publicClient: PublicClient;
  private x402Client?: AxiosInstance;

  constructor() {
    this.publicClient = createPublicClient({
      chain: base,
      transport: custom(window.ethereum!),
    });
  }

  /**
   * Initialize x402 client for micropayments
   */
  initializeX402(endpoint: string, walletClient: WalletClient) {
    try {
      const signer = createSigner(walletClient);
      const axiosInstance = axios.create({
        baseURL: endpoint,
      });
      
      this.x402Client = withPaymentInterceptor(axiosInstance, signer);
    } catch (error) {
      console.warn('Failed to initialize x402 client:', error);
      // Continue without x402 support
    }
  }

  /**
   * Get USDC balance for an address
   */
  async getUSDCBalance(address: Address): Promise<bigint> {
    try {
      const balance = await this.publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [address],
      });
      return balance as bigint;
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      throw new Error('Failed to fetch USDC balance');
    }
  }

  /**
   * Get formatted USDC balance (with 6 decimals)
   */
  async getFormattedUSDCBalance(address: Address): Promise<string> {
    const balance = await this.getUSDCBalance(address);
    return formatUnits(balance, 6);
  }

  /**
   * Estimate gas for USDC transfer
   */
  async estimateTransferGas(
    walletClient: WalletClient,
    to: Address,
    amount: bigint
  ): Promise<bigint> {
    try {
      const [account] = await walletClient.getAddresses();
      
      const gasEstimate = await this.publicClient.estimateContractGas({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [to, amount],
        account,
      });
      
      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      // Return a reasonable default if estimation fails
      return BigInt(100000);
    }
  }

  /**
   * Send USDC payment with x402 support
   */
  async sendUSDCPayment(
    walletClient: WalletClient,
    to: Address,
    amountUSD: string,
    options: PaymentOptions = {}
  ): Promise<PaymentResult> {
    try {
      const [account] = await walletClient.getAddresses();
      const amount = parseUnits(amountUSD, 6); // USDC has 6 decimals

      // Check balance first
      const balance = await this.getUSDCBalance(account);
      if (balance < amount) {
        return {
          success: false,
          error: `Insufficient USDC balance. Required: ${amountUSD}, Available: ${formatUnits(balance, 6)}`,
        };
      }

      // Try x402 payment first if enabled and client is available
      if (options.useX402 && this.x402Client) {
        try {
          const x402Result = await this.sendX402Payment(to, amount, options);
          if (x402Result.success) {
            return x402Result;
          }
          console.warn('x402 payment failed, falling back to direct transfer:', x402Result.error);
        } catch (error) {
          console.warn('x402 payment error, falling back to direct transfer:', error);
        }
      }

      // Fallback to direct transfer
      return await this.sendDirectTransfer(walletClient, to, amount, options);
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  /**
   * Send payment via x402 protocol
   */
  private async sendX402Payment(
    to: Address,
    amount: bigint,
    options: PaymentOptions
  ): Promise<PaymentResult> {
    if (!this.x402Client) {
      throw new Error('x402 client not initialized');
    }

    try {
      // Make x402 payment request
      const response = await this.x402Client.post('/payment', {
        to,
        amount: amount.toString(),
        token: USDC_CONTRACT_ADDRESS,
        gasLimit: options.gasLimit?.toString(),
      });

      if (response.data.success && response.data.txHash) {
        return {
          success: true,
          txHash: response.data.txHash as Hash,
        };
      }

      return {
        success: false,
        error: response.data.error || 'x402 payment failed',
      };
    } catch (error) {
      throw new Error(`x402 payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send direct USDC transfer
   */
  private async sendDirectTransfer(
    walletClient: WalletClient,
    to: Address,
    amount: bigint,
    options: PaymentOptions
  ): Promise<PaymentResult> {
    try {
      const [account] = await walletClient.getAddresses();

      // Estimate gas if not provided
      const gasLimit = options.gasLimit || await this.estimateTransferGas(walletClient, to, amount);

      // Execute the transfer
      const txHash = await walletClient.writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [to, amount],
        account,
        gas: gasLimit,
        maxFeePerGas: options.maxFeePerGas,
        maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      });

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      console.error('Direct transfer error:', error);
      throw new Error(`Direct transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransactionConfirmation(
    txHash: Hash,
    confirmations: number = 1
  ): Promise<{ success: boolean; receipt?: any; error?: string }> {
    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations,
        timeout: 60_000, // 60 seconds timeout
      });

      return {
        success: receipt.status === 'success',
        receipt,
      };
    } catch (error) {
      console.error('Transaction confirmation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction confirmation failed',
      };
    }
  }

  /**
   * Get current gas prices
   */
  async getGasPrices(): Promise<{
    gasPrice: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  }> {
    try {
      const gasPrice = await this.publicClient.getGasPrice();
      const feeData = await this.publicClient.estimateFeesPerGas();

      return {
        gasPrice,
        maxFeePerGas: feeData.maxFeePerGas || gasPrice,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || parseUnits('1', 9), // 1 gwei default
      };
    } catch (error) {
      console.error('Error fetching gas prices:', error);
      // Return reasonable defaults
      const defaultGasPrice = parseUnits('0.1', 9); // 0.1 gwei
      return {
        gasPrice: defaultGasPrice,
        maxFeePerGas: defaultGasPrice,
        maxPriorityFeePerGas: parseUnits('0.05', 9), // 0.05 gwei
      };
    }
  }

  /**
   * Calculate estimated transaction cost in ETH
   */
  async estimateTransactionCost(
    walletClient: WalletClient,
    to: Address,
    amount: bigint
  ): Promise<string> {
    try {
      const gasLimit = await this.estimateTransferGas(walletClient, to, amount);
      const { maxFeePerGas } = await this.getGasPrices();
      
      const totalCost = gasLimit * maxFeePerGas;
      return formatUnits(totalCost, 18); // ETH has 18 decimals
    } catch (error) {
      console.error('Error estimating transaction cost:', error);
      return '0.001'; // Default estimate
    }
  }
}

// Singleton instance
export const paymentService = new PaymentService();