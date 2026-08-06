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
  { label: 'Blockchain', href: '#tech-stack' },
  { label: 'Cloud Computing', href: '#tech-stack' },
  { label: 'Full-Stack Development', href: '#tech-stack' },
  { label: 'Mobile Development', href: '#tech-stack' },
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
    <footer id="footer" className="relative border-t border-border pt-16 pb-8 mt-auto">
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0,201,167,0.2), rgba(0,201,167,0.4), rgba(0,201,167,0.2), transparent)',
        boxShadow: '0 0 15px rgba(0,201,167,0.1)',
      }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 — Brand */}
          <div>
            <a href="#home" className="inline-flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="56" height="56" rx="10" fill="#00C9A7" fillOpacity="0.12"/>
                <path d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26" stroke="#00C9A7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M34 20 L34 42 L46 42" stroke="#00C9A7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="34" cy="26" r="2.5" fill="#F5A623"/>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg tracking-tight">Future Labs</span>
                <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/40">Software Technologies</span>
              </div>
            </a>
            <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
              Building the future of Ethiopia through innovative technology solutions.
            </p>
          </div>

          {/* Column 2 — Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Technologies */}
          <div>
            <h4 className="font-semibold mb-4">Technologies</h4>
            <ul className="space-y-3">
              {techLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <a href="mailto:info@futurelabs.et" className="hover:text-foreground transition-colors">
                  info@futurelabs.et
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <a href="tel:+251112345678" className="hover:text-foreground transition-colors">
                  +251 92 2871 1082
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>

            {/* Social icons row */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="glass rounded-full p-2.5 hover:border-primary/20 transition-all duration-300"
                  >
                    <SocialIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; 2025 Future Labs. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Designed &amp; Built with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    </footer>
  );
}
