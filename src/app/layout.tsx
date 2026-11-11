import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SIAGA POSKO — Aplikasi Tanggap Bencana & Distribusi Logistik',
  description:
    'Platform koordinasi posko darurat, distribusi logistik, dan pencarian korban bencana alam secara real-time.',
  keywords: ['siaga posko', 'bencana alam', 'logistik darurat', 'relawan', 'BPBD', 'BNPB'],
  authors: [{ name: 'Tim SIAGA POSKO' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1e3a8a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-siaga-surface font-sans text-siaga-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
