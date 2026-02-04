import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { headers } from "next/headers";

export const SIGN_UP_ENABLED = false;

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	experimental: {
		joins: true,
	},
	plugins: [nextCookies()],
	emailAndPassword: {
		enabled: true,
		disableSignUp: !SIGN_UP_ENABLED,
	},
});

export const getSession = cache(async () => {
	const headersList = await headers();

	return await auth.api.getSession({
		headers: headersList,
	});
});
