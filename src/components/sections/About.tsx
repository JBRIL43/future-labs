'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Eye, Sparkles } from 'lucide-react';
import { TiltCard3D } from '@/components/TiltCard3D';

const coreValues = [
  { title: 'Innovation', desc: 'Pushing digital boundaries' },
  { title: 'Excellence', desc: 'Uncompromising craftsmanship' },
  { title: 'Transparency', desc: 'Open, honest collaboration' },
  { title: 'User-Centered', desc: 'Built for human experience' },
  { title: 'Scalability', desc: 'Architecture built to grow' },
  { title: 'Ethical AI', desc: 'Responsible technology' },
];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-3">
            About Future Labs
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            We don&apos;t just build software — <span className="accent-gradient">we shape digital ecosystems</span>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Future Labs is an innovation laboratory focused on pioneering high-impact software products and custom digital solutions for businesses across Ethiopia and beyond.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Mission Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7"
          >
            <TiltCard3D className="p-8 sm:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  To research, design, and deploy world-class digital products powered by modern technology that solve pressing economic challenges and accelerate digital maturity across East Africa.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>PURPOSE-DRIVEN ENGINEERING</span>
              </div>
            </TiltCard3D>
          </motion.div>

          {/* Vision Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5"
          >
            <TiltCard3D className="p-8 sm:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Vision</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  To become Ethiopia&apos;s benchmark technology lab, setting global standards for product engineering, design quality, and technology leadership.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>ETHIOPIA &amp; GLOBAL</span>
              </div>
            </TiltCard3D>
          </motion.div>

          {/* Core Values Grid (12 cols) */}
          <div className="md:col-span-12 mt-4">
            <h3 className="text-xl font-bold text-foreground mb-6">Core Operating Principles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreValues.map((val, idx) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                >
                  <TiltCard3D className="p-6">
                    <h4 className="text-base font-semibold text-foreground mb-1">{val.title}</h4>
                    <p className="text-sm text-muted-foreground">{val.desc}</p>
                  </TiltCard3D>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
