import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tad's Photos",
  description: "A modern photo portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
