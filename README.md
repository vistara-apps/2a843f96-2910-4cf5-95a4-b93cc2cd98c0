# GiftChain - Crypto Gift Scheduling Platform

GiftChain is a comprehensive platform for scheduling and sending cryptocurrency gifts on the Base network, featuring USDC payments with x402 protocol support.

## 🚀 Features

- **Wallet Integration**: Connect with Coinbase Wallet, MetaMask, and WalletConnect
- **USDC Payments**: Send USDC gifts on Base network with real-time balance checking
- **x402 Protocol**: Advanced payment protocol with fallback to direct transfers
- **Gas Estimation**: Real-time gas fee estimation and optimization
- **Transaction Tracking**: Complete transaction lifecycle monitoring
- **Error Handling**: Comprehensive error handling and user feedback
- **Gift Scheduling**: Schedule gifts for special occasions
- **Testing Suite**: Built-in testing components for payment flows

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: Viem, Wagmi, OnchainKit
- **Payments**: x402-axios for micropayments
- **Styling**: Tailwind CSS
- **Network**: Base (Ethereum L2)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A wallet (Coinbase Wallet, MetaMask, etc.)
- USDC on Base network for testing

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd giftchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id_here
   NEXT_PUBLIC_X402_ENDPOINT=https://your-x402-endpoint.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Automated USDC Integration Test
```bash
npx tsx scripts/verify-usdc-integration.ts
```

### Manual Testing Pages

1. **Payment Flow Testing**
   - Navigate to `/test-payments`
   - Connect your wallet
   - Test USDC payments with various amounts
   - Verify x402 protocol integration

2. **Error Handling Testing**
   - Navigate to `/test-errors`
   - Run comprehensive error handling tests
   - Verify graceful error recovery

3. **Gift Scheduling**
   - Use the main app to schedule gifts
   - Test the complete flow from scheduling to payment

### Test Scenarios Covered

- ✅ Valid USDC payments
- ✅ Invalid recipient addresses
- ✅ Zero and negative amounts
- ✅ Insufficient balance handling
- ✅ Gas estimation errors
- ✅ Network connectivity issues
- ✅ Transaction confirmation tracking
- ✅ x402 protocol fallback

## 💳 Payment Flow

### x402 Protocol Integration

1. **Primary Flow**: Attempts payment via x402 protocol
2. **Fallback Flow**: Direct USDC transfer if x402 fails
3. **Error Handling**: Comprehensive error messages and recovery

### Transaction Lifecycle

1. **Validation**: Address format, amount, balance checks
2. **Gas Estimation**: Real-time gas fee calculation
3. **Execution**: Payment via x402 or direct transfer
4. **Confirmation**: Transaction monitoring and status updates
5. **Completion**: Success notification and receipt

## 🔧 Configuration

### Wallet Configuration
The app supports multiple wallet connectors:
- Coinbase Wallet (Smart Wallet preferred)
- MetaMask
- WalletConnect

### Network Configuration
- **Primary Network**: Base (Chain ID: 8453)
- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **RPC**: Uses default Base RPC or custom endpoint

### x402 Configuration
Optional x402 protocol support for micropayments:
- Set `NEXT_PUBLIC_X402_ENDPOINT` for x402 integration
- Automatic fallback to direct transfers
- Enhanced payment routing and optimization

## 🏗 Architecture

### Core Components

- **PaymentService** (`lib/payment-service.ts`): Core payment logic
- **usePayments** (`lib/hooks/usePayments.ts`): React hook for payment state
- **ScheduleGiftModal**: Main gift scheduling interface
- **PaymentTester**: Testing component for payment flows
- **ErrorHandlingTest**: Comprehensive error testing suite

### Key Features

- **Real-time Balance**: Automatic USDC balance fetching
- **Gas Optimization**: Dynamic gas price estimation
- **Error Recovery**: Graceful error handling and user feedback
- **Transaction Tracking**: Complete payment lifecycle monitoring
- **Responsive UI**: Mobile-friendly interface

## 🔒 Security

- **Input Validation**: All user inputs are validated
- **Address Verification**: Ethereum address format validation
- **Balance Checks**: Insufficient balance protection
- **Error Boundaries**: Comprehensive error handling
- **Transaction Verification**: On-chain transaction confirmation

## 📚 API Reference

### PaymentService Methods

```typescript
// Get USDC balance
await paymentService.getUSDCBalance(address: Address): Promise<bigint>

// Send USDC payment
await paymentService.sendUSDCPayment(
  walletClient: WalletClient,
  to: Address,
  amountUSD: string,
  options?: PaymentOptions
): Promise<PaymentResult>

// Wait for confirmation
await paymentService.waitForTransactionConfirmation(
  txHash: Hash,
  confirmations?: number
): Promise<ConfirmationResult>
```

### usePayments Hook

```typescript
const {
  state,           // Payment state (loading, error, txHash, etc.)
  sendPayment,     // Send payment function
  getBalance,      // Fetch balance function
  estimateCost,    // Gas estimation function
  waitForConfirmation, // Transaction confirmation
  clearError,      // Clear error state
  reset           // Reset all state
} = usePayments();
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Configure OnchainKit API key
   - Set WalletConnect project ID
   - Configure x402 endpoint (if using)

3. **Deploy to your preferred platform**
   - Vercel (recommended)
   - Netlify
   - Custom server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the testing pages for troubleshooting
- Review error handling test results
- Verify USDC integration status
- Ensure proper environment configuration

## 🔗 Links

- [Base Network](https://base.org/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Wagmi Documentation](https://wagmi.sh/)
- [x402 Protocol](https://github.com/x402-protocol)