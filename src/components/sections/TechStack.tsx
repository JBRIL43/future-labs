'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TiltCard3D } from '@/components/TiltCard3D';

interface TechItem {
  name: string;
  color: string;
}

interface TechCategory {
  category: string;
  items: TechItem[];
}

const techData: TechCategory[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Next.js', color: '#ffffff' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Tailwind CSS', color: '#06B6D4' },
      { name: 'Framer Motion', color: '#BB4B96' },
      { name: 'Vue.js', color: '#4FC08D' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', color: '#339933' },
      { name: 'Python', color: '#3776AB' },
      { name: 'Go', color: '#00ADD8' },
      { name: 'Rust', color: '#CE412B' },
      { name: 'GraphQL', color: '#E535AB' },
      { name: 'REST APIs', color: '#FF6C37' },
    ],
  },
  {
    category: 'Mobile',
    items: [
      { name: 'React Native', color: '#61DAFB' },
      { name: 'Flutter', color: '#02569B' },
      { name: 'Swift', color: '#FA7343' },
      { name: 'Kotlin', color: '#7F52FF' },
      { name: 'Expo', color: '#000020' },
    ],
  },
  {
    category: 'AI/ML',
    items: [
      { name: 'TensorFlow', color: '#FF6F00' },
      { name: 'PyTorch', color: '#EE4C2C' },
      { name: 'OpenAI', color: '#10a37f' },
      { name: 'LangChain', color: '#1C3C3C' },
      { name: 'Hugging Face', color: '#FFD21E' },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'PostgreSQL', color: '#4169E1' },
      { name: 'MongoDB', color: '#47A248' },
      { name: 'Redis', color: '#DC382D' },
      { name: 'Prisma', color: '#2D3748' },
      { name: 'SQLite', color: '#003B57' },
    ],
  },
  {
    category: 'Cloud',
    items: [
      { name: 'AWS', color: '#FF9900' },
      { name: 'Azure', color: '#0078D4' },
      { name: 'GCP', color: '#4285F4' },
      { name: 'Vercel', color: '#ffffff' },
      { name: 'Docker', color: '#2496ED' },
    ],
  },
  {
    category: 'DevOps',
    items: [
      { name: 'GitHub', color: '#181717' },
      { name: 'CI/CD', color: '#FC6D26' },
      { name: 'Kubernetes', color: '#326CE5' },
      { name: 'Terraform', color: '#7B42BC' },
      { name: 'Linux', color: '#FCC624' },
    ],
  },
  {
    category: 'Blockchain',
    items: [
      { name: 'Solidity', color: '#363636' },
      { name: 'Ethereum', color: '#627EEA' },
      { name: 'Web3.js', color: '#F16822' },
      { name: 'Smart Contracts', color: '#0d9488' },
    ],
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const tabsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function TechStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="tech-stack"
      className="relative py-24 lg:py-32 overflow-hidden section-3d"
      ref={sectionRef}
    >
      <div className="absolute inset-0 dot-pattern" />
      <div className="absolute top-0 left-0 right-0 h-px tricolor-line" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
        >
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Technology Stack
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4">
            Built With the Best Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            We leverage cutting-edge technologies across the full spectrum of
            software development to deliver exceptional solutions for our clients.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={tabsVariants}
        >
          <Tabs defaultValue="Frontend" className="w-full">
            <TabsList className="glass mx-auto flex h-auto flex-wrap justify-center gap-2 bg-transparent p-2 rounded-xl mb-10">
              {techData.map((cat) => (
                <TabsTrigger
                  key={cat.category}
                  value={cat.category}
                  className="text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  {cat.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {techData.map((cat) => (
              <TabsContent key={cat.category} value={cat.category}>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cat.items.map((item) => (
                    <TiltCard3D key={item.name} className="glass rounded-xl p-4" tiltDegree={15}>
                      <motion.div
                        variants={gridItemVariants}
                        className="flex items-center gap-3 cursor-default transition-all duration-300"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                            boxShadow: `0 0 15px ${item.color}20`,
                          }}
                        >
                          {item.name[0]}
                        </div>
                        <span className="font-medium text-sm truncate">
                          {item.name}
                        </span>
                      </motion.div>
                    </TiltCard3D>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
