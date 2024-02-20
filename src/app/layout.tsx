import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import NavigationMenuBlock from '@/ui/core/navigation/NavigationMenuBlock';
import { ApplicationProvider } from '@/ui/core/ApplicationContext';
import { cn } from '@/lib/shadcn';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Open Crumb',
  description: 'Bake better bread with Open Crumb.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen font-sans antialiased', fontSans.variable)}
      >
        <div className="container">
          <ApplicationProvider>
            <NavigationMenuBlock isSignedIn={false} />
            <main>{children}</main>
          </ApplicationProvider>
        </div>
      </body>
    </html>
  );
}
