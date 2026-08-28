'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TiltCard3D } from '@/components/TiltCard3D';

interface TechItem {
  name: string;
  categoryTag: string;
  icon: React.ReactNode;
}

interface TechCategory {
  category: string;
  items: TechItem[];
}

// Helper SVG Icons for technologies
const TechIcons = {
  React: (
    <svg className="w-6 h-6 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1.5" fill="none">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
      </g>
    </svg>
  ),
  Nextjs: (
    <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M14.8 16.5L9.2 8.8V16.5H7.8V7.5H9.5L14.8 14.8V7.5H16.2V16.5H14.8Z" fill="var(--background, #000)" />
    </svg>
  ),
  TypeScript: (
    <svg className="w-6 h-6 text-[#3178C6]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm9.5 12.3c.6.4 1.4.7 2.2.7 1.3 0 1.9-.6 1.9-1.4 0-2.3-5.2-1.3-5.2-4.9 0-1.8 1.5-3.2 4-3.2 1.1 0 2 .3 2.7.7l-.7 1.6c-.6-.4-1.3-.6-2-.6-1.2 0-1.8.6-1.8 1.3 0 2.2 5.2 1.2 5.2 4.9 0 1.9-1.5 3.3-4.2 3.3-1.3 0-2.4-.3-3.2-.8l.7-1.6zM8 8.4h5v1.7h-1.8V18H9.3v-7.9H7.5V8.4H8z" />
    </svg>
  ),
  Tailwind: (
    <svg className="w-6 h-6 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c-3.3 0-5.3 1.6-6 4.9 1.3-1.6 2.7-2.3 4-2 1.6.4 2.7 1.6 4 2.9 2.1 2.2 4.5 4.6 9 4.6 3.3 0 5.3-1.6 6-4.9-1.3 1.6-2.7 2.3-4 2-1.6-.4-2.7-1.6-4-2.9C18.9 8.4 16.5 6 12 6zm-6 6c-3.3 0-5.3 1.6-6 4.9 1.3-1.6 2.7-2.3 4-2 1.6.4 2.7 1.6 4 2.9 2.1 2.2 4.5 4.6 9 4.6 3.3 0 5.3-1.6 6-4.9-1.3 1.6-2.7 2.3-4 2-1.6-.4-2.7-1.6-4-2.9C12.9 14.4 10.5 12 6 12z" />
    </svg>
  ),
  Framer: (
    <svg className="w-6 h-6 text-[#0055FF]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  ),
  Vue: (
    <svg className="w-6 h-6 text-[#4FC08D]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 3h3.5L12 15 18.5 3H22L12 21 2 3zm4.5 0h3L12 8.5 14.5 3h3L12 13 6.5 3z" />
    </svg>
  ),
  Node: (
    <svg className="w-6 h-6 text-[#5FA04E]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm-1 14.5v-4l-3.5 2v-2l3.5-2V7.5l4 2.3v7.2l-4-2.5z" />
    </svg>
  ),
  Python: (
    <svg className="w-6 h-6 text-[#3776AB]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.9 2c-5.2 0-4.9 2.3-4.9 2.3l.1 2.3h4.9v.7H5.2S2 7 2 12.2c0 5.2 2.8 5 2.8 5h1.7v-2.4c0-2.8 2.4-2.7 2.4-2.7h4.8s2.3 0 2.3-2.3V4.3S17.1 2 11.9 2zm-2.7 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm2.9 18.5c5.2 0 4.9-2.3 4.9-2.3l-.1-2.3h-4.9v-.7h6.8s3.2.3 3.2-4.9c0-5.2-2.8-5-2.8-5h-1.7v2.4c0 2.8-2.4 2.7-2.4 2.7h-4.8s-2.3 0-2.3 2.3v5.6s-1.1 2.3 4.1 2.3zm2.7-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" />
    </svg>
  ),
  Go: (
    <svg className="w-6 h-6 text-[#00ADD8]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.8 10.5c.2.1.4.1.6 0l1.2-.6c.1-.1.1-.3 0-.4L2.8 9c-.2-.1-.4-.1-.6 0l-1.2.6c-.1.1-.1.3 0 .4l.8.5zm2.8-2c.2.1.4.1.6 0l1.2-.6c.1-.1.1-.3 0-.4L5.6 7c-.2-.1-.4-.1-.6 0l-1.2.6c-.1.1-.1.3 0 .4l.8.5zM12 4.5C8 4.5 5 7.5 5 11.5s3 7 7 7 7-3 7-7-3-7-7-7zm2.5 8h-2.5v-1.8h4.2c.1.5.2 1 .2 1.5 0 2.5-1.8 4.3-4.4 4.3-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7c1.2 0 2.3.4 3.1 1.2l-1.3 1.3c-.5-.5-1.1-.7-1.8-.7-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9c1.3 0 2.3-.8 2.6-1.8h-2.1v-.1z" />
    </svg>
  ),
  Rust: (
    <svg className="w-6 h-6 text-[#DEA584]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5h-2v-4h2v4zm0-6h-2V7.5h2v3z" />
    </svg>
  ),
  GraphQL: (
    <svg className="w-6 h-6 text-[#E10098]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 2.3l7.5 4.3v8.7L12 21.7l-7.5-4.3V8.6L12 4.3zm0 3.7a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  RestAPI: (
    <svg className="w-6 h-6 text-[#00C9A7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="6" rx="2" />
      <rect x="2" y="15" width="20" height="6" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  ),
  ReactNative: (
    <svg className="w-6 h-6 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2" />
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
      </g>
    </svg>
  ),
  Flutter: (
    <svg className="w-6 h-6 text-[#02569B]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.3 2.3L5.7 10.9l4.3 4.3 8.6-8.6h-4.3zM14.3 15.2l-3.3 3.3 3.3 3.2h4.3l-3.3-3.2 3.3-3.3h-4.3z" />
    </svg>
  ),
  Swift: (
    <svg className="w-6 h-6 text-[#F05138]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.7 13c-.4.5-1 1-1.7 1.4-1.2.7-2.7 1.1-4.4.9-1.7-.2-3.2-1.1-4.2-2.3-1.1-1.3-1.6-3-1.4-4.7.2-1.7 1.1-3.2 2.4-4.2 1.3-1 2.9-1.5 4.6-1.3 1.7.2 3.2 1 4.2 2.3.1.2.3.3.4.5-2.2-.8-4.7-.5-6.6.9-1.9 1.4-2.8 3.8-2.2 6.1.6 2.3 2.6 4.1 5 4.4 2.4.3 4.8-.8 6.1-2.8.2-.3.3-.6.4-.9z" />
    </svg>
  ),
  Kotlin: (
    <svg className="w-6 h-6 text-[#7F52FF]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 24H0V0h24L12 12z" />
    </svg>
  ),
  Expo: (
    <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h4.5l5.5-11 5.5 11H22L12 2z" />
    </svg>
  ),
  TensorFlow: (
    <svg className="w-6 h-6 text-[#FF6F00]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5L3.5 6.4v9.8l4.2-2.4V8.8L12 6.1l4.3 2.7v5L20.5 16.2V6.4L12 1.5zm-4.3 16.5l4.3 2.5 4.3-2.5-4.3-2.4-4.3 2.4z" />
    </svg>
  ),
  PyTorch: (
    <svg className="w-6 h-6 text-[#EE4C2C]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 2.5a6.5 6.5 0 011.5 12.3V12a4 4 0 10-4-4h2.8l1.7-5.5z" />
    </svg>
  ),
  OpenAI: (
    <svg className="w-6 h-6 text-[#10A37F]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.3 10.7c-.2-1.4-.9-2.6-2-3.4-.6-.4-1.3-.7-2-1V4.5c0-1.4-.7-2.7-1.9-3.4-1.8-1.1-4.1-.7-5.4.9-.4.5-.7 1.1-.9 1.7C9.3 3.3 8 3.5 7 4.2 5.8 5 5.1 6.2 5 7.6c-.6.3-1.2.7-1.7 1.3C2.2 10.4 2.2 12.7 3.3 14.3c.3.5.7.9 1.2 1.3v1.8c0 1.4.7 2.7 1.9 3.4 1.8 1.1 4.1.7 5.4-.9.4-.5.7-1.1.9-1.7.8.4 1.7.6 2.6.5 1.4-.2 2.6-.9 3.4-2.1.5-.7.8-1.5.9-2.3.6-.3 1.2-.7 1.7-1.3 1.1-1.4 1.1-3.7 0-5.3z" />
    </svg>
  ),
  LangChain: (
    <svg className="w-6 h-6 text-[#1C3C3C]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 4a4 4 0 00-4 4v2a4 4 0 004 4h2a1 1 0 100-2H8a2 2 0 01-2-2V8a2 2 0 012-2h2a1 1 0 100-2H8zm8 6a1 1 0 100 2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a1 1 0 100 2h2a4 4 0 004-4v-2a4 4 0 00-4-4h-2z" />
    </svg>
  ),
  HuggingFace: (
    <svg className="w-6 h-6 text-[#FFD21E]" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="10" r="1.5" fill="#000" />
      <circle cx="16" cy="10" r="1.5" fill="#000" />
      <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Postgres: (
    <svg className="w-6 h-6 text-[#336791]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  Mongo: (
    <svg className="w-6 h-6 text-[#47A248]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2s-5 6.5-5 11c0 3.3 2.2 6 5 6s5-2.7 5-6c0-4.5-5-11-5-11zm0 15c-1.7 0-3-1.3-3-3s3-6 3-6 3 4.3 3 6-1.3 3-3 3z" />
    </svg>
  ),
  Redis: (
    <svg className="w-6 h-6 text-[#DC382D]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 3.5l6.5 3.2L12 12 5.5 8.7 12 5.5zm0 13l-6.5-3.3v-4.5l6.5 3.3 6.5-3.3v4.5L12 18.5z" />
    </svg>
  ),
  Prisma: (
    <svg className="w-6 h-6 text-[#2D3748]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2L5 19h14L18 2z" />
    </svg>
  ),
  SQLite: (
    <svg className="w-6 h-6 text-[#003B57]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 4.2 2 7v10c0 2.8 4.5 5 10 5s10-2.2 10-5V7c0-2.8-4.5-5-10-5zm0 3c4.4 0 8 1.3 8 2s-3.6 2-8 2-8-1.3-8-2 3.6-2 8-2z" />
    </svg>
  ),
  AWS: (
    <svg className="w-6 h-6 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 3l7 3.5v7L12 19l-7-3.5v-7L12 5z" />
    </svg>
  ),
  Docker: (
    <svg className="w-6 h-6 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 8h3v3h-3V8zm-4 0h3v3H9V8zm-4 0h3v3H5V8zm8-4h3v3h-3V4zm-4 0h3v3H9V4zm-4 0h3v3H5V4zm-4 8h3v3H1V12zm22 2c0 3.3-2.7 6-6 6H5c-2.8 0-5-2.2-5-5 0-.5.1-1 .3-1.5L2 13h18l1.7.5c.2.5.3 1 .3 1.5z" />
    </svg>
  ),
  Kubernetes: (
    <svg className="w-6 h-6 text-[#326CE5]" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v12M6 12h12M7.8 7.8l8.4 8.4M16.2 7.8l-8.4 8.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Vercel: (
    <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L24 22H0L12 1z" />
    </svg>
  ),
  CICD: (
    <svg className="w-6 h-6 text-[#F05032]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" strokeDasharray="3 3" />
      <path d="M8 12h8M13 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const techData: TechCategory[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React 19', categoryTag: 'Library', icon: TechIcons.React },
      { name: 'Next.js 16', categoryTag: 'Framework', icon: TechIcons.Nextjs },
      { name: 'TypeScript', categoryTag: 'Language', icon: TechIcons.TypeScript },
      { name: 'Tailwind CSS', categoryTag: 'Styling', icon: TechIcons.Tailwind },
      { name: 'Framer Motion', categoryTag: 'Animation', icon: TechIcons.Framer },
      { name: 'Vue.js', categoryTag: 'Framework', icon: TechIcons.Vue },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', categoryTag: 'Runtime', icon: TechIcons.Node },
      { name: 'Python', categoryTag: 'AI & Data', icon: TechIcons.Python },
      { name: 'Go', categoryTag: 'Systems', icon: TechIcons.Go },
      { name: 'Rust', categoryTag: 'Performance', icon: TechIcons.Rust },
      { name: 'GraphQL', categoryTag: 'API', icon: TechIcons.GraphQL },
      { name: 'REST APIs', categoryTag: 'Architecture', icon: TechIcons.RestAPI },
    ],
  },
  {
    category: 'Mobile',
    items: [
      { name: 'React Native', categoryTag: 'Cross-Platform', icon: TechIcons.ReactNative },
      { name: 'Flutter', categoryTag: 'Cross-Platform', icon: TechIcons.Flutter },
      { name: 'Swift', categoryTag: 'iOS Native', icon: TechIcons.Swift },
      { name: 'Kotlin', categoryTag: 'Android Native', icon: TechIcons.Kotlin },
      { name: 'Expo', categoryTag: 'Toolchain', icon: TechIcons.Expo },
    ],
  },
  {
    category: 'AI/ML',
    items: [
      { name: 'TensorFlow', categoryTag: 'Framework', icon: TechIcons.TensorFlow },
      { name: 'PyTorch', categoryTag: 'Deep Learning', icon: TechIcons.PyTorch },
      { name: 'OpenAI API', categoryTag: 'LLM', icon: TechIcons.OpenAI },
      { name: 'LangChain', categoryTag: 'AI Agent', icon: TechIcons.LangChain },
      { name: 'Hugging Face', categoryTag: 'Models', icon: TechIcons.HuggingFace },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'PostgreSQL', categoryTag: 'Relational', icon: TechIcons.Postgres },
      { name: 'MongoDB', categoryTag: 'NoSQL', icon: TechIcons.Mongo },
      { name: 'Redis', categoryTag: 'Cache', icon: TechIcons.Redis },
      { name: 'Prisma', categoryTag: 'ORM', icon: TechIcons.Prisma },
      { name: 'SQLite', categoryTag: 'Embedded', icon: TechIcons.SQLite },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS', categoryTag: 'Cloud', icon: TechIcons.AWS },
      { name: 'Docker', categoryTag: 'Container', icon: TechIcons.Docker },
      { name: 'Kubernetes', categoryTag: 'Orchestration', icon: TechIcons.Kubernetes },
      { name: 'Vercel', categoryTag: 'Deployment', icon: TechIcons.Vercel },
      { name: 'CI/CD Pipelines', categoryTag: 'Automation', icon: TechIcons.CICD },
    ],
  },
];

export function TechStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="tech-stack" ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-3">
            Technology Stack
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Engineered with Modern <span className="accent-gradient">Tools</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We leverage enterprise-proven open source tools and battle-tested frameworks.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="Frontend" className="w-full">
          <TabsList className="bg-secondary/40 border border-border p-1.5 rounded-full flex flex-wrap justify-center gap-1 max-w-3xl mx-auto mb-12">
            {techData.map((cat) => (
              <TabsTrigger
                key={cat.category}
                value={cat.category}
                className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {cat.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {techData.map((cat) => (
            <TabsContent key={cat.category} value={cat.category}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {cat.items.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                  >
                    <TiltCard3D className="p-5 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary/50 border border-border/80 flex items-center justify-center mb-3 shadow-sm">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-foreground text-sm block mb-1">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {item.categoryTag}
                      </span>
                    </TiltCard3D>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
