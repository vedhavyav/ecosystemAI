export const runtime = 'edge';

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { AuthProvider } from '@/lib/firebase/authContext';

import { Handlee } from 'next/font/google';

const handlee = Handlee({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-handlee',
});

export const metadata: Metadata = {
  title: 'Ecosystem AI',
  description: 'Understand and optimize your environmental footprint.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ecosystem AI',
  },
};

export const viewport: Viewport = {
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={handlee.variable}>
      <AuthProvider>
        <body className="font-sans antialiased">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-emerald-900 focus:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Skip to main content
          </a>
          <Navigation />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
