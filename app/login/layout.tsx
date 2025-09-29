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
  title: 'Login - DECKapp',
  description: 'Sign in to your DECKapp account to access your swimming team management dashboard and analytics.',
  keywords: [
    'Swimming',
    'Login',
    'Sign in',
    'Account',
    'Dashboard',
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
    title: 'Login - DECKapp',
    description: 'Sign in to your DECKapp account to access your swimming team management dashboard and analytics.',
    siteName: 'DECKapp',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'DECKapp Login',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login - DECKapp',
    description: 'Sign in to your DECKapp account to access your swimming team management dashboard and analytics.',
    images: ['/og.jpg'],
    creator: '@deckapp',
  },
};

export default function LoginLayout({
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
