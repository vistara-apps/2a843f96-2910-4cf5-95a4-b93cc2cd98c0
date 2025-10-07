import { Recipient, Occasion, ScheduledGift, GiftHistory } from './types';

export const mockRecipients: Recipient[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Marley',
    walletAddress: '0x1234...5678',
    fid: 'marley.eth',
    avatarUrl: 'https://i.imgur.com/placeholder1.jpg',
    relationship: 'family',
    interests: ['crypto', 'art', 'music'],
    preferredGiftTypes: ['crypto', 'nft'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Dighal',
    walletAddress: '0x8765...4321',
    fid: 'dighal.eth',
    avatarUrl: 'https://i.imgur.com/placeholder2.jpg',
    relationship: 'friend',
    interests: ['gaming', 'tech', 'defi'],
    preferredGiftTypes: ['crypto', 'physical'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Cryptocurrency Gifts',
    walletAddress: '0xabcd...efgh',
    relationship: 'colleague',
    interests: ['blockchain', 'finance'],
    preferredGiftTypes: ['crypto'],
    createdAt: new Date('2024-02-01'),
  },
];

export const mockOccasions: Occasion[] = [
  {
    id: '1',
    recipientId: '1',
    type: 'birthday',
    name: "Marley's Birthday",
    date: '06-15',
    isRecurring: true,
    reminderDays: [7, 3, 1],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    recipientId: '2',
    type: 'birthday',
    name: "Dighal's Birthday",
    date: '08-22',
    isRecurring: true,
    reminderDays: [7, 3, 1],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    recipientId: '3',
    type: 'custom',
    name: 'Work Anniversary',
    date: '12-01',
    isRecurring: true,
    reminderDays: [7, 3],
    createdAt: new Date('2024-02-01'),
  },
];

export const mockScheduledGifts: ScheduledGift[] = [
  {
    id: '1',
    userId: 'user1',
    occasionId: '1',
    giftType: 'crypto',
    cryptoAmount: BigInt('50000000000000000'), // 0.05 ETH
    cryptoToken: 'ETH',
    budget: 50,
    status: 'scheduled',
    executionDate: new Date('2024-06-15'),
    createdAt: new Date('2024-01-01'),
  },
];

export const mockGiftHistory: GiftHistory[] = [
  {
    id: '1',
    userId: 'user1',
    recipientId: '1',
    occasionId: '1',
    giftType: 'crypto',
    amount: 50,
    txHash: '0x123...abc',
    recipientReaction: 'thankYou',
    executedAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    userId: 'user1',
    recipientId: '2',
    occasionId: '2',
    giftType: 'both',
    amount: 75,
    txHash: '0x456...def',
    recipientReaction: 'loved',
    executedAt: new Date('2023-08-22'),
  },
];
