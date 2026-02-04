import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await getSession();

	if (!session) {
		redirect("/sign-in");
	}

	const { user } = session;

	return (
		<>
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p>Welcome, {user.name || "User"}!</p>
			<p>Email: {user.email}</p>
		</>
	);
}
