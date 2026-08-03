'use client'

import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with floating animation */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image
          src="/hero-bg.png"
          alt="Future Labs hero background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-background" />

      {/* Dot pattern texture */}
      <div className="dot-pattern absolute inset-0 z-10" />

      {/* Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge / Tag line */}
        <motion.div variants={itemVariants} className="mb-6">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary px-4 py-1.5 text-sm rounded-full"
          >
            Technology Innovation Lab
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
        >
          Building the{' '}
          <span className="gradient-text">Future of Ethiopia</span>{' '}
          Through Technology
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          We design, build, and deploy impactful technology products that
          accelerate Ethiopia&rsquo;s digital transformation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="lg" className="min-w-[180px]" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Our Work
          </Button>
          <Button variant="outline" size="lg" className="min-w-[180px]" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Get in Touch
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() =>
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
        aria-label="Scroll to About section"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.button>
    </section>
  )
}
