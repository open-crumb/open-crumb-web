import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavigationMenuBlock from '@/ui/core/navigation/NavigationMenuBlock';
import { ApplicationProvider } from '@/ui/core/ApplicationContext';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className="text-gray-900">
      <body className={inter.className}>
        <div className="container">
          <ApplicationProvider>
            <NavigationMenuBlock isSignedIn={!!user} />
            <main>{children}</main>
          </ApplicationProvider>
        </div>
      </body>
    </html>
  );
}
