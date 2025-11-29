import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/ui/header/Header";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
				<Header isAuthenticated={data.isAuthenticated} />
				<main className="my-md container">{children}</main>
			</body>
		</html>
	);
}

type RootLayoutData = {
	isAuthenticated: boolean;
};

async function getData(): Promise<RootLayoutData> {
	const { isAuthenticated } = getKindeServerSession();

	return {
		isAuthenticated: (await isAuthenticated()) ?? false,
	};
}
