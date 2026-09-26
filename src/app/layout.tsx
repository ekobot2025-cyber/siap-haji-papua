import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { NavigationProgressBar } from '@/components/common/NavigationProgressBar';

export const metadata: Metadata = {
  title: 'SIAP HAJI PAPUA — Command Center Penyelenggaraan Haji',
  description: 'Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua. Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap.',
  icons: {
    icon: '/assets/branding/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/assets/branding/app-icon.png" />
      </head>
      <body>
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
