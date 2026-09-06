import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/icons";

export const metadata: Metadata = {
  title: "Terms and Conditions | Future Labs",
  description:
    "Terms and conditions governing the use of the Future Labs website and services.",
};

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: [
      "By accessing or using the Future Labs website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use the website.",
    ],
  },
  {
    heading: "2. About Our Services",
    body: [
      "Future Labs is a technology innovation company based in Addis Ababa, Ethiopia. We design, build, and operate software products and provide custom digital solutions including AI, blockchain, cloud computing, and SaaS platforms.",
      "Descriptions of products and services on this website are provided for general information. Specific engagements are governed by separate written agreements between you and Future Labs.",
    ],
  },
  {
    heading: "3. Acceptable Use",
    body: [
      "You agree to use this website only for lawful purposes. You must not attempt to interfere with the operation of the website, gain unauthorized access to our systems, scrape content in a manner that degrades service for others, or use the website to transmit harmful or unlawful material.",
    ],
  },
  {
    heading: "4. Intellectual Property",
    body: [
      "All content on this website, including text, graphics, logos, and the design of our platforms, is the property of Future Labs or its licensors and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, or create derivative works from this content without our prior written permission.",
    ],
  },
  {
    heading: "5. Third-Party Links",
    body: [
      "This website contains links to third-party websites, including our product platforms and social media profiles. We are not responsible for the content, policies, or practices of third-party websites.",
    ],
  },
  {
    heading: "6. Disclaimers",
    body: [
      "This website is provided on an as-is basis. While we take reasonable care to keep the information on this website accurate and up to date, we make no warranties, express or implied, regarding the completeness or reliability of the content.",
      "Future Labs shall not be liable for any indirect or consequential loss arising from the use of this website.",
    ],
  },
  {
    heading: "7. Governing Law",
    body: [
      "These terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Ethiopia.",
    ],
  },
  {
    heading: "8. Changes to These Terms",
    body: [
      "We may revise these terms and conditions from time to time. Changes will be published on this page with an updated effective date, and continued use of the website constitutes acceptance of the revised terms.",
    ],
  },
  {
    heading: "9. Contact",
    body: [
      "For questions about these terms, contact us at info@futurelabs.et or write to us at Future Labs, Addis Ababa, Ethiopia.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Future Labs home">
            <div className="w-8 h-8 rounded-md bg-card border border-border shadow-sm flex items-center justify-center">
              <LogoMark width={18} height={18} />
            </div>
            <span className="text-foreground text-base font-semibold tracking-tight">Future Labs</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-all duration-150 ease-in-out hover:text-primary active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="label-caps text-primary mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Terms and Conditions</h1>
          <p className="text-muted-foreground text-sm mb-12">Effective date: January 1, 2026</p>

          <div className="card-solid overflow-hidden">
            {sections.map((section) => (
              <section key={section.heading} className="p-6 sm:p-8 border-b border-border last:border-b-0 bg-card transition-all duration-150 ease-in-out hover:bg-secondary">
                <h2 className="text-lg font-semibold mb-3">{section.heading}</h2>
                <div className="space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 bg-secondary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Future Labs. All rights reserved.</p>
          <Link href="/privacy" className="transition-all duration-150 ease-in-out hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
