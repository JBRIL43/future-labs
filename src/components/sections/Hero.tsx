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
      {/* Very subtle gradient — just enough to keep text legible, doesn't block the atom */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/80" />
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
            className="border-primary/20 px-5 py-2 text-sm rounded-full"
            style={{
              color: 'rgba(0,201,167,0.75)',
              background: 'rgba(0,201,167,0.04)',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 0 15px rgba(0,201,167,0.06)',
            }}
          >
            Technology Innovation Lab
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.08]"
          style={{
            color: 'rgba(250,250,250,0.72)',
            textShadow: '0 2px 24px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)',
          }}
        >
          Building the{' '}
          <span style={{ color: 'rgba(0,201,167,0.85)', textShadow: '0 0 30px rgba(0,201,167,0.3)' }}>Future</span>{' '}
          of{' '}
          <span style={{ color: 'rgba(0,201,167,0.85)', textShadow: '0 0 30px rgba(0,201,167,0.3)' }}>Ethiopia</span>{' '}
          Through Technology
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-7 text-lg md:text-xl max-w-2xl leading-relaxed"
          style={{ color: 'rgba(161,161,170,0.65)' }}
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
            className="min-w-[200px] relative overflow-hidden group bg-[#F5A623]/80 hover:bg-[#F5A623]/95 text-[#0a0a0f]"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              boxShadow: '0 0 25px rgba(245,166,35,0.15), 0 4px 20px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span className="relative z-10 font-semibold">Explore Our Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px]"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(250,250,250,0.65)',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(6px)',
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
        background: 'linear-gradient(90deg, transparent, rgba(0,201,167,0.2), rgba(0,201,167,0.4), rgba(0,201,167,0.2), transparent)',
      }} />
    </section>
  )
}
