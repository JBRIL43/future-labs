'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Brain,
  Cpu,
  Code2,
  Smartphone,
  MessageSquare,
  Cloud,
  Server,
  Shield,
  Globe,
  Palette,
  Database,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TiltCard3D } from '@/components/TiltCard3D'

const services: {
  title: string
  description: string
  tags: string[]
  icon: LucideIcon
}[] = [
  {
    title: 'AI & Machine Learning',
    description: 'Custom intelligent models, predictive analytics, and enterprise LLM automation.',
    tags: ['PyTorch', 'OpenAI', 'MLOps'],
    icon: Brain,
  },
  {
    title: 'AI Integration',
    description: 'Seamlessly embedding machine learning and NLP into existing business systems.',
    tags: ['APIs', 'Pipelines', 'RAG'],
    icon: Cpu,
  },
  {
    title: 'Full-Stack Engineering',
    description: 'Modern, high-performance web platforms engineered for scale and speed.',
    tags: ['React', 'Next.js', 'Node.js'],
    icon: Code2,
  },
  {
    title: 'Mobile Applications',
    description: 'Fluid native and cross-platform mobile experiences for iOS and Android.',
    tags: ['React Native', 'Flutter', 'Swift'],
    icon: Smartphone,
  },
  {
    title: 'Conversational AI',
    description: 'Custom intelligent virtual assistants and customer support automation.',
    tags: ['NLP', 'LLMs', 'Bots'],
    icon: MessageSquare,
  },
  {
    title: 'SaaS Platforms',
    description: 'Cloud-native multi-tenant SaaS architecture designed for global distribution.',
    tags: ['Multi-tenant', 'Billing', 'APIs'],
    icon: Cloud,
  },
  {
    title: 'Enterprise Architecture',
    description: 'Scalable backbones, custom ERPs, and workflow automation systems.',
    tags: ['Enterprise', 'Microservices'],
    icon: Server,
  },
  {
    title: 'Web3 & Blockchain',
    description: 'Smart contract development, decentralized protocols, and audit services.',
    tags: ['Solidity', 'Ethereum', 'DeFi'],
    icon: Shield,
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Architecting zero-downtime, secure, and optimized cloud environments.',
    tags: ['AWS', 'GCP', 'DevOps'],
    icon: Globe,
  },
  {
    title: 'UI/UX Design',
    description: 'Human-centered product design, design systems, and rapid interactive prototyping.',
    tags: ['Figma', 'Design System'],
    icon: Palette,
  },
  {
    title: 'API & Microservices',
    description: 'High-throughput REST, GraphQL, and gRPC backend systems.',
    tags: ['REST', 'GraphQL', 'gRPC'],
    icon: Database,
  },
  {
    title: 'Data Intelligence',
    description: 'Actionable real-time business intelligence, dashboards, and reporting.',
    tags: ['BI', 'Analytics', 'ETL'],
    icon: BarChart3,
  },
]

export function Services() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" ref={ref} className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-3">
            Our Core Expertise
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Technology Solutions Built for <span className="accent-gradient">Impact</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We offer end-to-end software engineering capabilities tailored for startups, enterprise clients, and public sector innovation.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <TiltCard3D className="p-7 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2.5">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
                    {service.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary/60 text-muted-foreground font-normal text-xs px-2.5 py-0.5 border border-border/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TiltCard3D>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
