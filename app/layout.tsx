import type { Metadata } from "next";
import "./globals.css";
import { getSeoSettings } from "@/service/cms";

export async function generateMetadata(): Promise<Metadata> {
  const seo: Record<string, string> = await getSeoSettings().catch(() => ({}));

  const title = seo["Seo_DefaultTitle"] || "KB Beverage | Pure Taste, Every Time.";
  const description = seo["Seo_DefaultDesc"] || "Premium beverage manufacturer and tea premix crafts including Vrinda, Sangam, Urban Roast, and CocoJoy. Handcrafted with single-origin purity.";
  const ogImage = seo["Seo_OgImage"] || "/kbealeas_logo.jpeg";
  const twitterCreator = seo["Seo_TwitterHandle"] || "@KBBeverage";
  const googleVerification = seo["Seo_GoogleSiteVerification"];

  return {
    title,
    description,
    keywords: seo["Seo_Keywords"] || "tea premix, cardamom chai, instant iced tea, arabica coffee, cocojoy chocolate",
    icons: {
      icon: "/kbealeas_logo.jpeg",
      shortcut: "/kbealeas_logo.jpeg",
      apple: "/kbealeas_logo.jpeg",
    },
    openGraph: {
      title,
      description,
      siteName: "KB Beverage",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "KB Beverage",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterCreator,
      images: [ogImage],
    },
    verification: googleVerification
      ? {
          google: googleVerification,
        }
      : undefined,
  };
}

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
