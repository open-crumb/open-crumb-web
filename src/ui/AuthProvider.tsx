"use client";

import type { JSX } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return <KindeProvider>{children}</KindeProvider>;
}
