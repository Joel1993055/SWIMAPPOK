import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={geistSans.className} suppressHydrationWarning>
      <body className='bg-background text-foreground'>
        <ErrorBoundary>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            <main className='min-h-screen'>{children}</main>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
