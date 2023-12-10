'use client';

import { signOutAction } from '@/app/sign-in/actions';
import Link from 'next/link';

type Props = {
  isSignedIn: boolean;
};

export default function NavigationMenuBlock(props: Props) {
  return (
    <nav className="flex gap-4">
      <Link href="/">Home</Link>
      {props.isSignedIn && <Link href="/logbook">Logbook</Link>}
      <Link href="/calculator">Calculator</Link>
      {!props.isSignedIn && <Link href="/sign-in">Sign In</Link>}
      {props.isSignedIn && (
        <form action={signOutAction}>
          <button type="submit">Sign Out</button>
        </form>
      )}
    </nav>
  );
}
