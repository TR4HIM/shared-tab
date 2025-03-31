import { AppToast } from '@/components/AppToast';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReduxProvider from '@/store/ReduxProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SharedTab',
  description: 'Split expenses, not friendships',
  icons: {
    icon: [{ url: '/SharedTab.svg' }],
    apple: '/SharedTab.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-white text-black antialiased`}
      >
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AppToast />
        </ReduxProvider>
      </body>
    </html>
  );
}
