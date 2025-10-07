import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'GiftChain - Never Miss a Birthday',
  description: 'Automated crypto and physical gift-giving with personalized touches',
  openGraph: {
    title: 'GiftChain',
    description: 'Never miss a birthday. Never stress about gifts. All automated, all crypto.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
