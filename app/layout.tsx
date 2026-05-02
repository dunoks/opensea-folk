import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Basefolk',
    description: 'A premier NFT marketplace for the Farcaster ecosystem on Base.',
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: 'https://picsum.photos/seed/basefolkhero/1200/630',
        button: {
          title: 'Launch Basefolk',
          action: {
            type: 'launch_miniapp',
            name: 'Basefolk',
            url: process.env.APP_URL || 'https://ais-dev-lltlqnpgwyox5qfytkckar-615601803900.run.app',
            splashImageUrl: 'https://picsum.photos/seed/basefolksplash/600/600',
            splashBackgroundColor: '#09090b',
          },
        },
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
