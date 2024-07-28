import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/ui/core/header/Header";

/**
 * @see https://ui.shadcn.com/docs/installation/next
 */
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Open Crumb",
  description: "Open tools to help make better bread.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased font-sans", fontSans.variable)}>
        <Header />
        <main className="container my-md">{children}</main>
      </body>
    </html>
  );
}
