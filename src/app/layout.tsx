import './globals.css';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavigationMenuBlock from '@/ui/core/navigation/NavigationMenuBlock';
import { Container, Theme } from '@radix-ui/themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Open Crumb',
  description: 'Bake better bread with Open Crumb.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          <Container mx="4">
            <NavigationMenuBlock />
            {children}
          </Container>
        </Theme>
      </body>
    </html>
  );
}
