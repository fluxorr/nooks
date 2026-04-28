import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from '@/components/ViewTransitions';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#d97706',
};

export const metadata: Metadata = {
  title: 'Nooks — Curate your web',
  description: 'Save, organize, and search across the web content you care about.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ViewTransitions>{children}</ViewTransitions>
      </body>
    </html>
  );
}