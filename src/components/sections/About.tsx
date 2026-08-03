'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { TiltCard3D } from '@/components/TiltCard3D';

const coreValues = [
  'Innovation',
  'Excellence',
  'Transparency',
  'User-Centered Design',
  'Scalability',
  'Continuous Learning',
  'Ethical AI',
  'Local Impact with Global Standards',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const valueVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 lg:py-32 grid-pattern section-3d relative">
      {/* Floating 3D decoration */}
      <div className="shape-float-slow absolute top-10 right-10 w-16 h-16 rounded-full border border-primary/10 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.p
            className="text-primary uppercase tracking-widest text-sm font-medium mb-4"
            variants={headerVariants}
          >
            About Future Labs
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl"
            variants={headerVariants}
          >
            We Don&apos;t Just Build Software — We Shape the Future
          </motion.h2>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column: Mission & Vision */}
          <motion.div
            className="flex flex-col gap-6"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            {/* Mission Card */}
            <motion.div variants={cardVariants}>
              <TiltCard3D className="glass rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Develop innovative digital products powered by modern technologies
                  that solve real-world problems and accelerate Ethiopia&apos;s
                  digital transformation.
                </p>
              </TiltCard3D>
            </motion.div>

            {/* Vision Card */}
            <motion.div variants={cardVariants}>
              <TiltCard3D className="glass rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To become Ethiopia&apos;s leading technology innovation lab, creating
                  digital ecosystems that improve businesses, communities, and everyday
                  life.
                </p>
              </TiltCard3D>
            </motion.div>
          </motion.div>

          {/* Right Column: Core Values */}
          <div>
            <motion.h3
              className="text-xl font-semibold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              Core <span className="gradient-text">Values</span>
            </motion.h3>
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={containerVariants}
            >
              {coreValues.map((value) => (
                <motion.div
                  key={value}
                  variants={valueVariants}
                >
                  <TiltCard3D className="glass rounded-xl p-4" tiltDegree={10}>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  </TiltCard3D>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
