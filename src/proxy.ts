import type { NextRequest } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export function proxy(request: NextRequest) {
	return withAuth(request, {
		isReturnToCurrentPage: true,
		publicPaths: ["/", "/calculators"],
	});
}

export const config = {
	matcher:
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
};
