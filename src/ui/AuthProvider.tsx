"use client";

import type { JSX } from "react";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return <>{children}</>;
}
