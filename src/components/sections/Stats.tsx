'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TiltCard3D } from '@/components/TiltCard3D';

interface StatItemProps {
  value: string;
  label: string;
  numericPart: number;
  suffix?: string;
}

function StatItem({ value, label, numericPart, suffix = '' }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const displayRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center"
    >
      <TiltCard3D className="glass rounded-2xl p-6" tiltDegree={15}>
        <span
          ref={displayRef}
          className="gradient-text text-4xl md:text-5xl lg:text-6xl font-bold"
          style={{ textShadow: '0 0 30px rgba(16,185,129,0.3)' }}
        >
          0{suffix}
        </span>
        <p className="text-muted-foreground text-sm uppercase tracking-wider mt-3">
          {label}
        </p>
      </TiltCard3D>
    </motion.div>
  );
}

const stats: StatItemProps[] = [
  { value: '15+', label: 'Projects Delivered', numericPart: 15, suffix: '+' },
  { value: '50+', label: 'Happy Clients', numericPart: 50, suffix: '+' },
  { value: '99%', label: 'Client Satisfaction', numericPart: 99, suffix: '%' },
  { value: '24/7', label: 'Support Available', numericPart: 24, suffix: '/7' },
];

export function Stats() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="stats"
      ref={containerRef}
      className="py-24 lg:py-32 relative section-3d"
    >
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px tricolor-line" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              numericPart={stat.numericPart}
              suffix={stat.suffix}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
