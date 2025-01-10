import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const data = await getData();

	if (!data.isAuthenticated) {
		redirect("/api/auth/login");
	}

	return children;
}

type DashboardLayoutData = {
	isAuthenticated: boolean;
};

async function getData(): Promise<DashboardLayoutData> {
	const { isAuthenticated } = getKindeServerSession();

	return {
		isAuthenticated: await isAuthenticated(),
	};
}
