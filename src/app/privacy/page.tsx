import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy | Future Labs",
  description:
    "How Future Labs collects, uses, and protects personal information submitted through our website and products.",
};

const sections = [
  {
    heading: "1. Information We Collect",
    body: [
      "When you contact us through the contact form on this website, we collect the information you choose to provide: your name, email address, phone number, and the contents of your message.",
      "If you apply for a position through our careers section, we collect the information you include in your application, such as your name, contact details, and CV.",
      "We do not collect payment information through this website. We do not use tracking cookies for advertising purposes.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: [
      "We use the information you provide to respond to your inquiries, discuss potential projects or partnerships, process job applications, and communicate with you about our products and services.",
      "We do not sell, rent, or share your personal information with third parties for their marketing purposes.",
    ],
  },
  {
    heading: "3. Data Storage and Security",
    body: [
      "Your information is stored on secured cloud infrastructure and is accessible only to authorized members of our team. We apply reasonable technical and organizational measures to protect it against unauthorized access, alteration, or loss.",
      "We retain contact inquiries for as long as necessary to handle your request and for legitimate business record-keeping purposes.",
    ],
  },
  {
    heading: "4. Your Rights",
    body: [
      "You may request access to the personal information we hold about you, ask us to correct it, or ask us to delete it. To exercise these rights, contact us at info@futurelabs.et.",
      "If you have submitted a job application and wish to withdraw it, you may also contact us at the same address.",
    ],
  },
  {
    heading: "5. Third-Party Services",
    body: [
      "Our website links to third-party platforms such as our Dine Flow product site and our social media profiles. Once you follow a link to an external platform, that platform's own privacy policy applies.",
    ],
  },
  {
    heading: "6. Changes to This Policy",
    body: [
      "We may update this privacy policy from time to time. Any changes will be published on this page with an updated effective date.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      "For questions about this policy, contact us at info@futurelabs.et or write to us at Future Labs, Addis Ababa, Ethiopia.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
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
          <Link href="/terms" className="transition-all duration-150 ease-in-out hover:text-primary">
            Terms and Conditions
          </Link>
        </div>
      </footer>
    </div>
  );
}
