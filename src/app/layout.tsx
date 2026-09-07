import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.futurelabs.et"),
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Future Labs | Building the Future of Ethiopia Through Technology",
    description:
      "Technology innovation company shaping Ethiopia's digital future through AI, Blockchain, Cloud Computing, and impactful digital products.",
    url: "https://www.futurelabs.et",
    siteName: "Future Labs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero-bg.png",
        width: 1869,
        height: 832,
        alt: "Future Labs - Building the Future of Ethiopia Through Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Labs | Building the Future of Ethiopia Through Technology",
    description:
      "Technology innovation company shaping Ethiopia's digital future through AI, Blockchain, Cloud Computing, and impactful digital products.",
    images: ["/hero-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${workSans.variable} ${workSans.className} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
