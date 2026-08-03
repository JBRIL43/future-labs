'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TiltCard3D } from '@/components/TiltCard3D'
import { FloatingShapes3D } from '@/components/FloatingShapes3D'

const features = [
  'AI-Powered Recommendations',
  'Real-time Order Tracking',
  'Restaurant Analytics Dashboard',
  'Multi-vendor Management',
  'Smart Route Optimization',
  'Seamless Payment Integration',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const productCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const featureItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-24 lg:py-32 relative section-3d"
    >
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px tricolor-line" />

      <FloatingShapes3D variant="subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Our Products
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 mb-6">
            Digital Ecosystems That <span className="gradient-text">Transform</span> Industries
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We build complete digital products — from concept to launch — that
            solve real problems and create lasting impact.
          </p>
        </motion.div>

        {/* Dayn Flow Product Showcase */}
        <motion.div
          variants={productCardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <TiltCard3D
            tiltDegree={5}
            scaleOnHover={1.01}
            className="glass glow-emerald-strong rounded-3xl overflow-hidden mb-20"
          >
            <div className="grid lg:grid-cols-2">
              {/* Left: Product Image */}
              <div
                className="relative h-[300px] sm:h-[400px] lg:h-auto lg:min-h-[520px]"
                style={{ transform: 'perspective(800px) rotateY(-3deg)' }}
              >
                <Image
                  src="/dayn-flow.png"
                  alt="Dayn Flow — AI-Powered Food Ordering & Restaurant Management Platform"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* 3D rotating ring decoration */}
              <div
                className="absolute top-4 right-4 w-[60px] h-[60px] shape-cube-reverse opacity-20"
              />

              {/* Right: Product Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                >
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mb-4 w-fit">
                    Flagship Product
                  </Badge>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold mb-2"
                >
                  <span className="gradient-text">Dayn Flow</span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
                  className="text-muted-foreground mb-4"
                >
                  AI-Powered Food Ordering & Restaurant Management Platform
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
                  className="text-muted-foreground text-sm leading-relaxed mb-6"
                >
                  More than a food delivery app — Dayn Flow is a complete digital
                  ecosystem connecting restaurants, customers, and delivery
                  services through intelligent automation.
                </motion.p>

                {/* Feature List */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={containerVariants}
                  transition={{ delayChildren: 0.45 }}
                >
                  {features.map((feature) => (
                    <motion.div
                      key={feature}
                      variants={featureItemVariants}
                      className="flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.7 }}
                >
                  <Button asChild variant="outline" className="group">
                    <a href="#dayn-flow">
                      Learn More About Dayn Flow
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </TiltCard3D>
        </motion.div>

        {/* More Products Coming Soon */}
        <div className="text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="text-xl font-semibold mb-3"
          >
            More Products Coming Soon
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
            className="text-muted-foreground text-sm mb-10"
          >
            We&apos;re constantly innovating. Stay tuned for exciting new products in our pipeline.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
              >
                <TiltCard3D
                  tiltDegree={12}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Product in Development
                    </span>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
