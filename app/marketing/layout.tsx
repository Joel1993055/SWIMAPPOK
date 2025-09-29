import './styles/globals.css';

import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import { ThemeProvider } from '@/app/marketing/components/contexts/theme-provider';
import { Footer } from '@/app/marketing/components/layout/footer';
import Navbar from '@/app/marketing/components/layout/navbar';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: {
    default: 'DECKapp - Modern Swimming Platform',
    template: '%s | DECKapp',
  },
  description:
    'A modern swimming platform built with Next.js, featuring comprehensive training management, analytics, and team collaboration tools.',
  keywords: [
    'Swimming',
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
    title: 'DECKapp - Modern Swimming Platform',
    description:
      'A modern swimming platform built with Next.js, featuring comprehensive training management, analytics, and team collaboration tools.',
    siteName: 'DECKapp',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'DECKapp - Modern Swimming Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DECKapp - Modern Swimming Platform',
    description:
      'A modern swimming platform built with Next.js, featuring comprehensive training management, analytics, and team collaboration tools.',
    images: ['/og.jpg'],
    creator: '@deckapp',
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`h-screen ${figtree.variable} antialiased`}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem={false}
                  disableTransitionOnChange
                >
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
