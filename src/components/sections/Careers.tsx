'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TiltCard3D } from '@/components/TiltCard3D';
import { FloatingShapes3D } from '@/components/FloatingShapes3D';

interface JobListing {
  title: string;
  type: string;
  location: string;
  tags: string[];
}

const jobs: JobListing[] = [
  {
    title: 'Senior Full-Stack Developer',
    type: 'Full-time',
    location: 'Remote',
    tags: ['React', 'Next.js', 'Node.js'],
  },
  {
    title: 'AI/ML Engineer',
    type: 'Full-time',
    location: 'Remote',
    tags: ['Python', 'TensorFlow', 'PyTorch'],
  },
  {
    title: 'Mobile Developer',
    type: 'Full-time',
    location: 'Addis Ababa/Remote',
    tags: ['React Native', 'Flutter'],
  },
  {
    title: 'UI/UX Designer',
    type: 'Full-time',
    location: 'Remote',
    tags: ['Figma', 'Design Systems'],
  },
  {
    title: 'DevOps Engineer',
    type: 'Full-time',
    location: 'Remote',
    tags: ['AWS', 'Docker', 'Kubernetes'],
  },
];

const benefits = [
  'Competitive salary & equity',
  'Remote-first culture',
  'Learning & development budget',
  'Health & wellness programs',
  'Annual team retreats',
  'Flexible working hours',
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
      delay: i * 0.1,
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const benefitItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function Careers() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="careers" ref={sectionRef} className="py-24 lg:py-32 section-3d relative">
      <div className="absolute top-0 left-0 right-0 h-px tricolor-line" />
      <FloatingShapes3D variant="subtle" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column */}
          <div>
            <motion.p
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="text-primary uppercase tracking-widest text-sm font-medium"
            >
              Careers
            </motion.p>
            <motion.h2
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-3"
            >
              Join the Future of <span className="gradient-text">Innovation</span>
            </motion.h2>
            <motion.p
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="text-muted-foreground mt-4 text-lg leading-relaxed"
            >
              We&apos;re looking for passionate developers, designers, and innovators
              who want to build technology that matters. At Future Labs, you&apos;ll
              work on cutting-edge projects that shape Ethiopia&apos;s digital future.
            </motion.p>

            {/* Team culture image */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              className="mt-8 relative rounded-2xl overflow-hidden h-[240px] sm:h-[300px] glow-emerald glow-emerald-strong"
              style={{ transform: 'perspective(1000px) rotateY(3deg)' }}
            >
              <Image
                src="/team-culture.png"
                alt="Team Culture"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Benefits list */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="mt-8 space-y-3 glass rounded-2xl p-6"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={benefitItemVariants}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                  <span className="text-sm text-foreground/90">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right column */}
          <div>
            <motion.h3
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
              className="text-2xl font-bold mb-6"
            >
              Open Positions
            </motion.h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-4"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job.title}
                  custom={index}
                  variants={cardVariants}
                >
                  <TiltCard3D className="glass rounded-xl p-5" tiltDegree={8}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        <div className="flex items-center gap-4 mt-1.5 text-muted-foreground text-sm">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-primary hover:underline text-sm font-medium flex-shrink-0 group"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </TiltCard3D>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
              className="text-muted-foreground text-sm mt-8"
            >
              Don&apos;t see your role? Send us your resume at{' '}
              <a
                href="mailto:careers@futurelabs.et"
                className="text-primary hover:underline"
              >
                careers@futurelabs.et
              </a>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
