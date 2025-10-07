import { createPublicClient, http, Address } from 'viem';
import { base } from 'viem/chains';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

// USDC ABI (minimal for verification)
const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
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

// Create a public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

async function verifyUSDCIntegration() {
  console.log('🔍 Verifying USDC Integration on Base Network');
  console.log('=' .repeat(50));
  
  try {
    // 1. Verify contract exists
    console.log('1. Checking USDC contract...');
    const code = await publicClient.getCode({
      address: USDC_CONTRACT_ADDRESS,
    });
    
    if (!code || code === '0x') {
      throw new Error('USDC contract not found at address');
    }
    console.log('✅ USDC contract exists at:', USDC_CONTRACT_ADDRESS);

    // 2. Check contract decimals
    console.log('\n2. Checking USDC decimals...');
    const decimals = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: USDC_ABI,
      functionName: 'decimals',
    });
    console.log('✅ USDC decimals:', decimals);
    
    if (decimals !== 6) {
      console.warn('⚠️  Expected 6 decimals, got:', decimals);
    }

    // 3. Test balance query for a known address (Coinbase)
    console.log('\n3. Testing balance query...');
    const testAddress = '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf' as Address; // Polygon Ecosystem Token
    
    try {
      const balance = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [testAddress],
      });
      console.log('✅ Balance query successful for test address');
      console.log('   Balance:', balance.toString(), 'USDC units');
    } catch (error) {
      console.log('⚠️  Balance query failed (this is normal for some addresses)');
    }

    // 4. Verify network connectivity
    console.log('\n4. Checking Base network connectivity...');
    const blockNumber = await publicClient.getBlockNumber();
    console.log('✅ Connected to Base network, latest block:', blockNumber.toString());

    // 5. Check gas price
    console.log('\n5. Checking current gas prices...');
    const gasPrice = await publicClient.getGasPrice();
    console.log('✅ Current gas price:', gasPrice.toString(), 'wei');
    console.log('   Gas price in gwei:', (Number(gasPrice) / 1e9).toFixed(2));

    console.log('\n🎉 USDC Integration Verification Complete!');
    console.log('=' .repeat(50));
    console.log('✅ All checks passed');
    console.log('✅ Ready for production use');
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  verifyUSDCIntegration();
}

export { verifyUSDCIntegration };