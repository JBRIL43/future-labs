'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TiltCard3D } from '@/components/TiltCard3D';

export function Careers() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="careers" ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-3">
            Careers at Future Labs
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl">
            Build the Future with <span className="accent-gradient">Us</span>
          </h2>
          
          <div className="mt-8 w-full max-w-2xl">
            <TiltCard3D className="p-8 sm:p-12 text-center flex flex-col items-center">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold rounded-full tracking-wider uppercase mb-6 inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Coming Soon
              </Badge>

              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Open Roles Announcing Soon
              </h3>
              
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                We are preparing our next wave of hiring for ambitious engineers, product designers, and researchers. Check back soon or get in touch to introduce yourself early.
              </p>

              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium shadow-lg shadow-primary/10 group"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </TiltCard3D>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
