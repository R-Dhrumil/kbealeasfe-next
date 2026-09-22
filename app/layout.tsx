import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KB Beverage | Pure Taste, Every Time.",
  description: "Premium beverage manufacturer and tea premix crafts including Vrinda, Sangam, Urban Roast, and CocoJoy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


