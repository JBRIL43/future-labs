'use client';

import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
];

const techLinks = [
  { label: 'AI & Machine Learning', href: '#tech-stack' },
  { label: 'Full-Stack Engineering', href: '#tech-stack' },
  { label: 'Mobile Engineering', href: '#tech-stack' },
  { label: 'Cloud Infrastructure', href: '#tech-stack' },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/futurelabs', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/futurelabs', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:info@futurelabs.et', label: 'Email' },
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
    <footer id="footer" className="relative border-t border-border bg-background/50 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <a href="#home" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 56 56" fill="none">
                  <path d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M34 20 L34 42 L46 42" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-lg text-foreground">Future Labs</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Shaping Ethiopia&apos;s digital transformation through software innovation, AI products, and enterprise cloud solutions.
            </p>
          </div>

          {/* Column 2 — Company */}
          <div>
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Technologies */}
          <div>
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4">Capabilities</h4>
            <ul className="space-y-2.5">
              {techLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2.5 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@futurelabs.et" className="hover:text-foreground transition-colors">
                  info@futurelabs.et
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+251922871082" className="hover:text-foreground transition-colors">
                  +251 922 871 082
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
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
                    className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Future Labs. All rights reserved.</p>
          <p>Built with precision in Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </footer>
  );
}
