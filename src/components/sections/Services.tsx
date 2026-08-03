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
    title: 'AI Development',
    description: 'Custom AI models and solutions tailored to your business needs',
    tags: ['TensorFlow', 'PyTorch', 'OpenAI'],
    icon: Brain,
  },
  {
    title: 'AI Integration',
    description: 'Seamlessly integrate AI capabilities into your existing systems',
    tags: ['APIs', 'ML Pipelines', 'NLP'],
    icon: Cpu,
  },
  {
    title: 'Full-Stack Development',
    description: 'End-to-end web applications built with modern frameworks',
    tags: ['React', 'Next.js', 'Node.js'],
    icon: Code2,
  },
  {
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps for iOS and Android',
    tags: ['React Native', 'Flutter', 'Swift'],
    icon: Smartphone,
  },
  {
    title: 'Chatbot Development',
    description: 'Intelligent conversational AI for customer engagement',
    tags: ['NLP', 'Dialogflow', 'Custom LLM'],
    icon: MessageSquare,
  },
  {
    title: 'SaaS Development',
    description: 'Scalable software-as-a-service platforms from concept to launch',
    tags: ['Multi-tenant', 'Subscriptions', 'APIs'],
    icon: Cloud,
  },
  {
    title: 'Enterprise Software',
    description: 'Robust solutions for complex business operations',
    tags: ['ERP', 'CRM', 'Workflow'],
    icon: Server,
  },
  {
    title: 'Blockchain Solutions',
    description: 'Decentralized applications and smart contract development',
    tags: ['Solidity', 'Web3', 'DeFi'],
    icon: Shield,
  },
  {
    title: 'Cloud Solutions',
    description: 'Cloud architecture, migration, and optimization services',
    tags: ['AWS', 'Azure', 'GCP'],
    icon: Globe,
  },
  {
    title: 'UI/UX Design',
    description: 'Human-centered design that delights users and drives results',
    tags: ['Figma', 'Prototyping', 'Research'],
    icon: Palette,
  },
  {
    title: 'API Development',
    description: 'RESTful and GraphQL APIs with robust documentation',
    tags: ['REST', 'GraphQL', 'gRPC'],
    icon: Database,
  },
  {
    title: 'Data Analytics',
    description: 'Turn your data into actionable insights and competitive advantage',
    tags: ['BI', 'Dashboards', 'ML'],
    icon: BarChart3,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 5 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Services() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="py-24 lg:py-32 relative section-3d">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-primary uppercase tracking-widest text-sm font-medium">Our Services</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 mb-6">
            Technology Solutions That{' '}
            <span className="gradient-text">Drive Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We deliver cutting-edge technology solutions that transform ideas into
            powerful, scalable products — from AI and cloud to mobile and enterprise platforms.
          </p>
        </motion.div>

        {/* Services Grid with 3D Tilt Cards */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: '1200px' }}
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <TiltCard3D className="glass rounded-2xl p-6 h-full cursor-default">
                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-primary/20"
                      style={{
                        boxShadow: '0 0 20px rgba(16,185,129,0.08)',
                        transform: 'translateZ(30px)',
                      }}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2" style={{ transform: 'translateZ(20px)' }}>{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4" style={{ transform: 'translateZ(15px)' }}>
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(10px)' }}>
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
