import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Git DNA - Developer Identity",
  description: "Reveal your true developer class and journey based on your GitHub activity.",
  openGraph: {
    title: "Git DNA - Developer Identity",
    description: "Reveal your true developer class and journey based on your GitHub activity.",
    type: "website",
    siteName: "Git DNA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Git DNA Preview Card",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Git DNA - Developer Identity",
    description: "Reveal your true developer class and journey based on your GitHub activity.",
    images: ["/og-image.png"]
  }
};

import InfoOverlay from "./components/InfoOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <InfoOverlay />
      </body>
    </html>
  );
}
