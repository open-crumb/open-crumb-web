/**
 * @see https://www.edgedb.com/docs/guides/auth/built_in_ui
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    const error = request.nextUrl.searchParams.get('error');

    return new NextResponse(
      `OAuth callback is missing 'code'. OAuth provider responded with error: ${error}`,
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const verifier = cookieStore.get('edgedb-pkce-verifier');

  if (!verifier) {
    return new NextResponse(
      `Could not find 'verifier' in the cookie store. Is this the same user agent/browser that started the authorization flow?`,
      { status: 400 },
    );
  }

  const codeExchangeUrl = new URL('token', process.env.EDGEDB_AUTH_BASE_URL);

  codeExchangeUrl.searchParams.set('code', code);
  codeExchangeUrl.searchParams.set('verifier', verifier.value);

  const codeExchangeResponse = await fetch(codeExchangeUrl.href);

  if (!codeExchangeResponse.ok) {
    const text = await codeExchangeResponse.text();

    return new NextResponse(`Error from the auth server: ${text}.`, {
      status: 400,
    });
  }

  const { auth_token: authToken } = await codeExchangeResponse.json();

  cookieStore.set('edgedb-auth-token', authToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });
  cookieStore.delete('edgedb-pkce-verifier');

  redirect('/');
}
