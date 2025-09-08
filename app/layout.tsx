import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Swim APP PRO - Plataforma de Análisis de Natación',
  description:
    'La plataforma de análisis de natación más avanzada para nadadores de todos los niveles',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={geistSans.className} suppressHydrationWarning>
      <body className='bg-background text-foreground'>
        <ErrorBoundary>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <main className='min-h-screen'>{children}</main>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}