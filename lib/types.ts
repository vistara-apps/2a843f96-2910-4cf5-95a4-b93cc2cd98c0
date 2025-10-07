export interface User {
  fid: string;
  walletAddress: string;
  displayName: string;
  avatarUrl?: string;
  isPremium: boolean;
  giftVaultBalance: bigint;
  monthlyBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipient {
  id: string;
  userId: string;
  name: string;
  walletAddress?: string;
  fid?: string;
  avatarUrl?: string;
  relationship: 'friend' | 'family' | 'partner' | 'colleague';
  interests: string[];
  preferredGiftTypes: string[];
  shippingAddress?: string;
  createdAt: Date;
}

export interface Occasion {
  id: string;
  recipientId: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'custom';
  name: string;
  date: string; // MM-DD format
  isRecurring: boolean;
  reminderDays: number[];
  createdAt: Date;
}

export interface ScheduledGift {
  id: string;
  userId: string;
  occasionId: string;
  giftType: 'crypto' | 'physical' | 'both';
  cryptoAmount?: bigint;
  cryptoToken?: 'ETH' | 'USDC';
  videoMessageUrl?: string;
  nftCardTokenId?: string;
  physicalGiftProductId?: string;
  physicalGiftBackup1?: string;
  physicalGiftBackup2?: string;
  budget: number;
  status: 'pending' | 'scheduled' | 'executed' | 'failed';
  executionDate: Date;
  txHash?: string;
  createdAt: Date;
}

export interface GiftHistory {
  id: string;
  userId: string;
  recipientId: string;
  occasionId: string;
  giftType: 'crypto' | 'physical' | 'both';
  amount: number;
  txHash?: string;
  recipientReaction?: 'thankYou' | 'loved' | 'neutral' | 'none';
  publicThankUrl?: string;
  executedAt: Date;
}

export interface GiftVault {
  contractAddress: string;
  userAddress: string;
  balance: bigint;
  monthlyAutoReplenish?: bigint;
  nextReplenishDate?: Date;
  totalDeposited: bigint;
  totalSpent: bigint;
}
