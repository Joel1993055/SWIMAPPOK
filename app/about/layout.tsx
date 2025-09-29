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
  title: 'About Us - DECKapp',
  description: 'Learn about DECKapp team and our mission to revolutionize swimming training with advanced analytics and team management tools.',
  keywords: [
    'Swimming',
    'About',
    'Team',
    'Mission',
    'Company',
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
    title: 'About Us - DECKapp',
    description: 'Learn about DECKapp team and our mission to revolutionize swimming training with advanced analytics and team management tools.',
    siteName: 'DECKapp',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'DECKapp About',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - DECKapp',
    description: 'Learn about DECKapp team and our mission to revolutionize swimming training with advanced analytics and team management tools.',
    images: ['/og.jpg'],
    creator: '@deckapp',
  },
};

export default function AboutLayout({
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
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
