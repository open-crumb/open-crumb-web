/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		/**
		 * @see https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/#working-with-preview-urls
		 */
		KINDE_SITE_URL:
			process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_URL}`,
		KINDE_POST_LOGOUT_REDIRECT_URL:
			process.env.KINDE_POST_LOGOUT_REDIRECT_URL ??
			`https://${process.env.VERCEL_URL}`,
		KINDE_POST_LOGIN_REDIRECT_URL:
			process.env.KINDE_POST_LOGIN_REDIRECT_URL ??
			`https://${process.env.VERCEL_URL}/dashboard`,
	},
};

export default nextConfig;
