'use client';

import Link from 'next/link';
import {
  LogoMark,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GithubIcon,
  LinkedinIcon,
} from '@/components/icons';

const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
];

const techLinks = [
  { label: 'AI & Machine Learning', href: '#services' },
  { label: 'Full-Stack Engineering', href: '#services' },
  { label: 'Mobile Engineering', href: '#services' },
  { label: 'Cloud Infrastructure', href: '#services' },
];

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/futurelabs', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/company/futurelabs', label: 'LinkedIn' },
  { icon: MailIcon, href: 'mailto:info@futurelabs.et', label: 'Email' },
];

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export function Footer() {
  return (
    <footer id="footer" className="bg-secondary border-t border-border pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <a href="#home" className="inline-flex items-center gap-2.5 transition-all duration-150 ease-in-out hover:text-primary active:scale-95" onClick={(e) => scrollToSection(e, '#home')}>
              <div className="w-8 h-8 rounded-md border border-border bg-card shadow-sm flex items-center justify-center">
                <LogoMark width={18} height={18} />
              </div>
              <span className="font-semibold text-lg text-foreground">Future Labs</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Shaping Ethiopia&apos;s digital transformation through software innovation,
              AI products, and enterprise cloud solutions.
            </p>
          </div>

          <div>
            <h4 className="label-caps text-foreground mb-4">Company</h4>
            <ul className="border-t border-border">
              {companyLinks.map((link) => (
                <li key={link.label} className="border-b border-border py-2.5">
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-primary text-sm transition-all duration-150 ease-in-out"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-caps text-foreground mb-4">Capabilities</h4>
            <ul className="border-t border-border">
              {techLinks.map((link) => (
                <li key={link.label} className="border-b border-border py-2.5">
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-primary text-sm transition-all duration-150 ease-in-out"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-caps text-foreground mb-4">Connect</h4>
            <ul className="border-t border-border text-muted-foreground text-sm">
              <li className="flex items-center gap-2 border-b border-border py-2.5">
                <MailIcon className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@futurelabs.et" className="hover:text-primary transition-all duration-150 ease-in-out">
                  info@futurelabs.et
                </a>
              </li>
              <li className="flex items-center gap-2 border-b border-border py-2.5">
                <PhoneIcon className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+251922871082" className="hover:text-primary transition-all duration-150 ease-in-out">
                  +251 922 871 082
                </a>
              </li>
              <li className="flex items-center gap-2 border-b border-border py-2.5">
                <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-md border border-border bg-card shadow-sm flex items-center justify-center text-muted-foreground transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:text-primary hover:border-primary hover:shadow-md active:scale-95"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Future Labs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-all duration-150 ease-in-out">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-all duration-150 ease-in-out">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
