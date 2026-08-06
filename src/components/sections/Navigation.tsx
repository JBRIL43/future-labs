'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Tech Stack', href: '#tech-stack' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

function getSectionId(href: string): string {
  return href.replace('#', '');
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = useCallback((href: string) => {
    const id = getSectionId(href);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // IntersectionObserver scroll spy
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
        rootMargin: '-20% 0px -60% 0px',
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

  // Close mobile menu on route/nav click
  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      scrollToSection(href);
    },
    [scrollToSection]
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass sticky top-0 z-50 w-full border-b border-border"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-2.5"
          aria-label="Future Labs - Go to top"
        >
          {/* FL mark — Circuit Teal on dark */}
          <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="56" height="56" rx="10" fill="#00C9A7" fillOpacity="0.12"/>
            <path d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26" stroke="#00C9A7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M34 20 L34 42 L46 42" stroke="#00C9A7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="34" cy="26" r="2.5" fill="#F5A623"/>
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-white text-lg font-bold tracking-tight">Future Labs</span>
            <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/40">Software Technologies</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
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
                  className={cn(
                    'relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md',
                    'hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {/* Active indicator dot */}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary transition-all duration-300',
                      isActive
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0'
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="hidden lg:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => scrollToSection('#contact')}
          >
            Get Started
          </Button>

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:text-primary"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-background/95 backdrop-blur-xl border-border"
            >
              <SheetHeader className="pt-8 pb-2">
                <SheetTitle className="flex items-center gap-2.5 text-white">
                  <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="56" height="56" rx="10" fill="#00C9A7" fillOpacity="0.12"/>
                    <path d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26" stroke="#00C9A7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M34 20 L34 42 L46 42" stroke="#00C9A7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="34" cy="26" r="2.5" fill="#F5A623"/>
                  </svg>
                  Future Labs
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4 mt-4" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => {
                  const sectionId = getSectionId(item.href);
                  const isActive = activeSection === sectionId;
                  return (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className={cn(
                          'relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Active indicator bar */}
                        <span
                          className={cn(
                            'mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary transition-all duration-300',
                            isActive
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0'
                          )}
                        />
                        {item.label}
                      </a>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="px-4 mt-6">
                <SheetClose asChild>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleNavClick('#contact')}
                  >
                    Get Started
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
