/**
 * @see https://www.edgedb.com/docs/guides/auth/built_in_ui
 */
import generatePKCE from '@/server/auth/generate-pkce';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const cookieStore = cookies();
  const { verifier, challenge } = generatePKCE();

  const redirectURL = new URL('ui/signin', process.env.EDGEDB_AUTH_BASE_URL);

  redirectURL.searchParams.set('challenge', challenge);

  cookieStore.set('edgedb-pkce-verifier', verifier, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });

  redirect(redirectURL.href);
}
