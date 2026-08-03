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
  hidden: { opacity: 0, y: 30, scale: 0.97 },
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
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, -40])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Minimal gradient for text readability - let the 3D globe breathe */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/95" />
      </div>

      {/* Content with parallax - perfectly centered */}
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
            className="border-primary/25 text-primary/90 px-5 py-2 text-sm rounded-full"
            style={{
              boxShadow: '0 0 15px rgba(13,148,136,0.08)',
            }}
          >
            Technology Innovation Lab
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground leading-[1.08]"
          style={{
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          Building the{' '}
          <span className="text-primary" style={{ textShadow: '0 0 30px rgba(13,148,136,0.25)' }}>Future</span>{' '}
          of{' '}
          <span className="text-primary" style={{ textShadow: '0 0 30px rgba(13,148,136,0.25)' }}>Ethiopia</span>{' '}
          Through Technology
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-7 text-lg md:text-xl text-muted-foreground/80 max-w-2xl leading-relaxed"
        >
          We design, build, and deploy impactful technology products that
          accelerate Ethiopia&rsquo;s digital transformation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            className="min-w-[200px] relative overflow-hidden group"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              boxShadow: '0 0 25px rgba(13,148,136,0.15), 0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <span className="relative z-10">Explore Our Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px] border-border/50"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
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
          className="text-muted-foreground/40 hover:text-primary/70 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-1"
          aria-label="Scroll to About section"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Bottom edge line - subtle */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.2), rgba(13,148,136,0.4), rgba(13,148,136,0.2), transparent)',
      }} />
    </section>
  )
}
