'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { LogoMark, MenuIcon, CloseIcon } from '@/components/icons';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
] as const;

function getSectionId(href: string): string {
  return href.replace('#', '');
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = useCallback((href: string) => {
    const el = document.getElementById(getSectionId(href));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => getSectionId(item.href));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      scrollToSection(href);
    },
    [scrollToSection]
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-all duration-150 ease-in-out hover:text-primary active:scale-95"
          aria-label="Future Labs, go to top"
        >
          <div className="w-8 h-8 rounded-md border border-border bg-card shadow-sm flex items-center justify-center">
            <LogoMark width={18} height={18} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-foreground text-base font-semibold tracking-tight">Future Labs</span>
            <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
              Software Technologies
            </span>
          </div>
        </a>

        <ul className="hidden lg:flex items-center gap-1" role="menubar">
          {NAV_ITEMS.map((item) => {
            const sectionId = getSectionId(item.href);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out active:scale-95 ${
                    isActive
                      ? 'text-primary bg-secondary border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#contact');
            }}
            className="hidden lg:inline-flex btn-primary px-4 py-2 text-sm"
          >
            Get Started
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-border bg-card shadow-sm text-foreground transition-all duration-150 ease-in-out hover:border-primary hover:text-primary active:scale-95"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card shadow-[0_16px_40px_rgba(24,24,27,0.06)]">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === getSectionId(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out active:scale-95 ${
                    isActive
                      ? 'bg-secondary text-primary border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="btn-primary px-4 py-2.5 text-sm mt-2"
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
