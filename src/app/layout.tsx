import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PageBackground } from "@/components/PageBackground";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Future Labs | Building the Future of Ethiopia Through Technology",
  description:
    "Future Labs is a technology innovation company focused on shaping the future of Ethiopia through cutting-edge digital solutions including AI, Blockchain, Cloud Computing, and SaaS platforms.",
  keywords: [
    "Future Labs",
    "Ethiopia technology",
    "AI development",
    "digital transformation",
    "Dayn Flow",
    "SaaS",
    "blockchain",
    "cloud computing",
    "web development",
    "mobile apps",
  ],
  authors: [{ name: "Future Labs" }],
  icons: {
    icon: "/fl-logo.png",
  },
  openGraph: {
    title: "Future Labs | Building the Future of Ethiopia Through Technology",
    description:
      "Technology innovation company shaping Ethiopia's digital future through AI, Blockchain, Cloud Computing, and impactful digital products.",
    siteName: "Future Labs",
    type: "website",
    images: [{
      url: "/hero-bg.png",
      width: 1344,
      height: 768,
      alt: "Future Labs Technology",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Labs",
    description: "Building the Future of Ethiopia Through Technology",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased bg-background text-foreground`}
      >
        <PageBackground />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
