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
  title: 'Blog - DECKapp',
  description: 'Read the latest insights about swimming training, team management, and performance analytics from DECKapp experts.',
  keywords: [
    'Swimming',
    'Blog',
    'Training',
    'Analytics',
    'Team Management',
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
    title: 'Blog - DECKapp',
    description: 'Read the latest insights about swimming training, team management, and performance analytics from DECKapp experts.',
    siteName: 'DECKapp',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'DECKapp Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - DECKapp',
    description: 'Read the latest insights about swimming training, team management, and performance analytics from DECKapp experts.',
    images: ['/og.jpg'],
    creator: '@deckapp',
  },
};

export default function BlogLayout({
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
