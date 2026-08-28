'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TiltCard3D } from '@/components/TiltCard3D';

interface StatItemProps {
  label: string;
  numericPart: number;
  suffix?: string;
  description: string;
}

function StatItem({ label, numericPart, suffix = '', description }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const displayRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1600;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numericPart);

      if (displayRef.current) {
        displayRef.current.textContent = `${current}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, numericPart, suffix]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <TiltCard3D className="p-8 text-center sm:text-left h-full flex flex-col justify-between">
        <div>
          <span
            ref={displayRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground block mb-2"
          >
            0{suffix}
          </span>
          <h3 className="text-base font-semibold text-foreground mb-1">{label}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </TiltCard3D>
    </motion.div>
  );
}

const stats: StatItemProps[] = [
  { label: 'Products & Projects', numericPart: 15, suffix: '+', description: 'Deploys across web & mobile' },
  { label: 'Happy Clients', numericPart: 50, suffix: '+', description: 'Enterprises & startups served' },
  { label: 'CSAT Rating', numericPart: 99, suffix: '%', description: 'Client satisfaction score' },
  { label: 'Uptime SLA', numericPart: 99, suffix: '.9%', description: 'Reliable cloud infrastructure' },
];

export function Stats() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section id="stats" ref={containerRef} className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              numericPart={stat.numericPart}
              suffix={stat.suffix}
              description={stat.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
