'use client'

import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.8 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, -50])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Subtle gradient for text readability over 3D scene */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Content with parallax */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pointer-events-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary px-5 py-2 text-sm rounded-full relative overflow-hidden"
            style={{
              boxShadow: '0 0 20px rgba(13,148,136,0.1), inset 0 1px 0 rgba(13,148,136,0.1)',
            }}
          >
            <span className="relative z-10">Technology Innovation Lab</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.6)',
          }}
        >
          Building the{' '}
          <span className="text-primary" style={{ textShadow: '0 0 40px rgba(13,148,136,0.3)' }}>Future</span>{' '}
          of{' '}
          <span className="text-primary" style={{ textShadow: '0 0 40px rgba(13,148,136,0.3)' }}>Ethiopia</span>{' '}
          Through Technology
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          We design, build, and deploy impactful technology products that
          accelerate Ethiopia&rsquo;s digital transformation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            className="min-w-[200px] relative overflow-hidden group"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              boxShadow: '0 0 30px rgba(13,148,136,0.2), 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <span className="relative z-10">Explore Our Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px]"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              boxShadow: '0 0 20px rgba(13,148,136,0.05), 0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            Get in Touch
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.button
          onClick={() =>
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-1"
          aria-label="Scroll to About section"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
        <motion.div
          className="w-6 h-6 rounded-full border border-primary/20"
          style={{ boxShadow: '0 0 10px rgba(13,148,136,0.1)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute w-1.5 h-1.5 rounded-full bg-primary/50 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </motion.div>

      {/* Bottom edge line */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.3), rgba(13,148,136,0.5), rgba(13,148,136,0.3), transparent)',
        boxShadow: '0 0 20px rgba(13,148,136,0.1)',
      }} />
    </section>
  )
}
