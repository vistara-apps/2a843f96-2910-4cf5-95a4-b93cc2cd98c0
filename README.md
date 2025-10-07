# GiftChain - Never Miss a Birthday

A Base Mini App that automates crypto and physical gift-giving with personalized touches.

## Features

- 🎂 **Smart Occasion Calendar**: Auto-sync birthdays from Farcaster profiles
- 💰 **Crypto Gift Autopilot**: Schedule automated crypto transfers with video messages
- 🤖 **AI Gift Suggestions**: Get personalized gift ideas based on recipient interests
- 📦 **Physical Gift Autopilot**: Automated physical gift ordering and fulfillment
- 🔄 **Social Gifting Loop**: Public thank-yous and reciprocal gifting via Frames
- 💳 **Gift Vault**: Pre-fund gifts with smart contract vault and budget tracking

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS with custom design system
- **Social**: Farcaster integration via MiniKit
- **Storage**: IPFS for video messages, Upstash Redis for caching

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and add your API keys

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Get from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- `OPENAI_API_KEY`: For AI gift suggestions
- `UPSTASH_REDIS_REST_URL`: For caching
- `PRINTFUL_API_KEY`: For physical gift fulfillment
- `PINATA_API_KEY`: For IPFS storage

## Design System

GiftChain uses a professional finance theme:
- **Colors**: Dark navy background with gold accents (#ffd700)
- **Typography**: Inter font family
- **Components**: Glass-morphism cards with smooth animations
- **Layout**: Mobile-first responsive design

## Business Model

- Free core app
- 2-5% transaction fee on automated gifts
- Premium tier: $2.99/month for unlimited contacts & AI suggestions

## License

MIT
