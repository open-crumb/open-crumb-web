import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/ui/header/Header";
import AuthProvider from "@/ui/AuthProvider";
import { SIGN_UP_ENABLED, getSession } from "@/lib/auth";

/**
 * @see https://ui.shadcn.com/docs/installation/next
 */
const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Open Crumb",
	description: "Tools to help make better bread.",
	keywords: ["Bread", "Baking", "Bread Calculators"],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const data = await getData();

	return (
		<html lang="en">
			<body className={cn("font-sans antialiased", fontSans.variable)}>
				<AuthProvider>
					<Header
						isSignUpEnabled={SIGN_UP_ENABLED}
						isAuthenticated={data.isAuthenticated}
					/>
					<main className="my-md container">{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}

type RootLayoutData = {
	isAuthenticated: boolean;
};

async function getData(): Promise<RootLayoutData> {
	const session = await getSession();

	return {
		isAuthenticated: !!session,
	};
}
