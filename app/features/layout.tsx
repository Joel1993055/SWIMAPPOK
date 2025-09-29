import './styles/globals.css';

import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import { ThemeProvider } from '@/app/marketing/components/contexts/theme-provider';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'Features - DECKapp',
  description: 'Discover all the powerful features of DECKapp swimming platform. Advanced analytics, team management, and training tools.',
  keywords: [
    'Swimming',
    'Features',
    'Analytics',
    'Team Management',
    'Training',
    'Next.js',
    'React',
    'TypeScript',
    'TailwindCSS',
  ],
  authors: [{ name: 'DECKapp Team' }],
  creator: 'DECKapp Team',
  publisher: 'DECKapp',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon.ico' }],
  },
  openGraph: {
    title: 'Features - DECKapp',
    description: 'Discover all the powerful features of DECKapp swimming platform. Advanced analytics, team management, and training tools.',
    siteName: 'DECKapp',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'DECKapp Features',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - DECKapp',
    description: 'Discover all the powerful features of DECKapp swimming platform. Advanced analytics, team management, and training tools.',
    images: ['/og.jpg'],
    creator: '@deckapp',
  },
};

export default function FeaturesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className={`${figtree.variable} antialiased`}>
        <main className="">{children}</main>
      </div>
    </ThemeProvider>
  );
}
