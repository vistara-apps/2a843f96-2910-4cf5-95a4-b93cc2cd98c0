export const APP_NAME = 'GiftChain';
export const APP_TAGLINE = 'Never miss a birthday. Never stress about gifts.';

export const TRANSACTION_FEE_PERCENT = 3;
export const PREMIUM_PRICE_MONTHLY = 2.99;

// Base Network Constants
export const BASE_CHAIN_ID = 8453;
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
export const USDC_DECIMALS = 6;

// Payment Configuration
export const X402_PAYMENT_ENDPOINT = process.env.NEXT_PUBLIC_X402_ENDPOINT || 'https://api.x402.dev';
export const DEFAULT_GAS_LIMIT = BigInt(100000);

export const REMINDER_DAYS = [7, 3, 1];

export const GIFT_CATEGORIES = [
  'Books',
  'Coffee',
  'Plants',
  'Tech',
  'Fashion',
  'Art',
  'Food',
  'Experiences',
];

export const RELATIONSHIP_TYPES = [
  'friend',
  'family',
  'partner',
  'colleague',
] as const;

export const OCCASION_TYPES = [
  'birthday',
  'anniversary',
  'holiday',
  'custom',
] as const;

export const NFT_CARD_TEMPLATES = [
  { id: '1', name: 'Birthday Celebration', free: true },
  { id: '2', name: 'Anniversary Love', free: true },
  { id: '3', name: 'Holiday Cheer', free: true },
  { id: '4', name: 'Thank You', free: true },
  { id: '5', name: 'Congratulations', free: true },
];
