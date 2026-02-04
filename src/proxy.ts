import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	// THIS IS NOT SECURE! This only checks that a session cookie is present, but
	// NOT that it is valid.
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	// @see https://www.better-auth.com/docs/integrations/next#rsc-and-server-actions
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard"],
};
