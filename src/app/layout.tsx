import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Telegram Message Dashboard',
  description: 'Dashboard for managing scheduled Telegram messages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
