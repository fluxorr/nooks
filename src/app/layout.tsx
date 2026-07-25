import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
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
  title: {
    default: 'Nooks — Curate your web',
    template: '%s — Nooks',
  },
  description: 'Save, organize, and search across the web content you care about.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Nooks — Curate your web',
    description: 'Save, organize, and search across the web content you care about.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nooks — Curate your web',
    description: 'Save, organize, and search across the web content you care about.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ClerkProvider>
          <ViewTransitions>{children}</ViewTransitions>
        </ClerkProvider>
      </body>
    </html>
  );
}