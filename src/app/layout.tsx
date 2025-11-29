import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Sous Chef',
  description: 'A modern recipe management application built with Next.js',
  keywords: ['recipes', 'cooking', 'food', 'kitchen'],
  authors: [{ name: 'Jonathan Samuelsen' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' }, // Warm cream
    { media: '(prefers-color-scheme: dark)', color: '#1E1E1E' }, // Warm dark
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
