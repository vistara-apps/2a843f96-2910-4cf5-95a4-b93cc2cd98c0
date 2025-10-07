# GiftChain - Never Miss a Birthday

A Base Mini App that automates crypto and physical gift-giving with personalized touches.

## Features

- 🎂 **Smart Occasion Calendar** - Auto-sync birthdays from Farcaster profiles
- 💰 **Crypto Gift Autopilot** - Schedule automated crypto transfers with video messages
- 🤖 **AI Gift Suggestions** - Get personalized gift ideas based on recipient interests
- 📦 **Physical Gift Autopilot** - Auto-order physical gifts from partner APIs
- 🎁 **Social Gifting Loop** - Public thank-you casts and generosity badges
- 💎 **Gift Vault** - Smart contract vault with budget tracking

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **Social**: Farcaster integration via MiniKit

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Then add your API keys.

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page with upcoming occasions
├── calendar/           # Calendar view
├── vault/              # Gift vault management
├── settings/           # User settings
└── globals.css         # Global styles with design tokens

components/
├── ui/                 # Reusable UI components
├── layout/             # Layout components (Navigation)
├── occasions/          # Occasion-related components
└── vault/              # Vault-related components

lib/
├── types.ts            # TypeScript type definitions
├── utils.ts            # Utility functions
└── mock-data.ts        # Mock data for development
```

## Design System

The app uses a professional finance theme with:
- **Colors**: Dark navy background with gold accents (#ffd700)
- **Typography**: Clean, modern font stack
- **Components**: Glass-morphism cards with subtle shadows
- **Motion**: Smooth transitions with cubic-bezier easing

## Key Features Implementation

### 1. Occasion Calendar
- Auto-syncs birthdays from Farcaster profiles
- Visual timeline with countdown badges
- Customizable reminders (7, 3, 1 day before)

### 2. Crypto Gift Automation
- Smart contract vault for pre-funding
- Scheduled transfers on occasion dates
- Video message recording and NFT greeting cards

### 3. AI Gift Suggestions (Premium)
- Analyzes recipient's Farcaster activity
- Suggests 3-5 gift ideas with budget tiers
- Learns from user selections

### 4. Physical Gift Autopilot (Beta)
- Pre-approved gift categories
- Auto-orders from partner APIs
- Tracking notifications via Frames

### 5. Social Gifting Loop
- Public thank-you casts
- Generosity badges and streaks
- 'Gift Back' reciprocity button

## Environment Variables

Required:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - OnchainKit API key from Coinbase

Optional:
- `OPENAI_API_KEY` - For AI gift suggestions
- `UPSTASH_REDIS_REST_URL` - For caching
- `UPSTASH_REDIS_REST_TOKEN` - Redis token

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, visit our [GitHub repository](https://github.com/yourusername/giftchain)
