import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavigationMenuBlock from '@/ui/core/navigation/NavigationMenuBlock';
import { ApplicationProvider } from '@/ui/core/ApplicationContext';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className="text-gray-900">
      <body className={inter.className}>
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
