import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { TRPCProvider } from '@/lib/trpc/Provider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'MLAcademy', template: '%s | MLAcademy' },
  description: 'La référence francophone en Data Science et Machine Learning',
  keywords: ['machine learning', 'data science', 'python', 'formation', 'cours'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'MLAcademy',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCProvider>
              {children}
              <Toaster position="bottom-right" />
            </TRPCProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
