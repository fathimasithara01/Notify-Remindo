import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { APP_NAME, APP_DESCRIPTION } from '@/constants/app';
import './globals.css';

export const metadata: Metadata = {
  title: `${APP_NAME} — Super Admin`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}