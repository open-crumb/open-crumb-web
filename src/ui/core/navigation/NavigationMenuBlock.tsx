'use client';

import Link from 'next/link';

export default function NavigationMenuBlock() {
  return (
    <nav className="flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/calculator">Calculator</Link>
    </nav>
  );
}
