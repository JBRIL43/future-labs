'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
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

function getSectionId(href: string): string {
  return href.replace('#', '');
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = useCallback((href: string) => {
    const id = getSectionId(href);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-border/80 shadow-sm'
          : 'bg-background/40 backdrop-blur-md border-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          aria-label="Future Labs - Go to top"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-primary/20">
            <svg width="20" height="20" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M34 20 L34 42 L46 42" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white text-base font-semibold tracking-tight">Future Labs</span>
            <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Software Technologies</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-1 bg-secondary/40 border border-border/60 p-1.5 rounded-full" role="menubar">
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
                    'relative px-4 py-1.5 text-xs font-medium transition-all duration-200 rounded-full inline-block',
                    isActive
                      ? 'text-foreground bg-primary/15 font-semibold border border-primary/20 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="hidden lg:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full px-5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => scrollToSection('#contact')}
          >
            Get Started
          </Button>

          {/* Mobile Navigation Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:bg-secondary rounded-full"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-2xl border-border p-6">
              <SheetHeader className="pb-6 border-b border-border">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 56 56" fill="none">
                      <path d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M34 20 L34 42 L46 42" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-lg">Future Labs</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-2 mt-6">
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
                          'px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-border">
                <SheetClose asChild>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
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
