'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeroParticleImage } from '@/components/HeroParticleImage'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
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
  const blobRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, -60])

  // Direct mouse tracking — no React state, no lag
  useEffect(() => {
    const blob = blobRef.current
    if (!blob) return

    const handleMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      // Direct DOM write — zero React re-renders, zero lag
      blob.style.transform = `translate(${nx * 15}px, ${ny * 15}px)`
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Image Background — reacts to cursor */}
      <div className="absolute inset-0 z-0" style={{
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}>
        <HeroParticleImage />
      </div>

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        {/* 3D vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.8) 100%)',
        }} />
      </div>

      {/* Morphing blob behind content */}
      <div
        ref={blobRef}
        className="absolute z-[9] w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-250px',
          marginTop: '-250px',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            borderRadius: ['40% 60% 60% 40% / 60% 30% 70% 40%', '60% 40% 30% 70% / 50% 60% 30% 60%', '40% 60% 60% 40% / 60% 30% 70% 40%'],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1, 1.05, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full" style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)',
            borderRadius: 'inherit',
            filter: 'blur(60px)',
          }} />
        </motion.div>
      </div>

      {/* Content with parallax */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Badge with 3D depth */}
        <motion.div variants={itemVariants} className="mb-8">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary px-5 py-2 text-sm rounded-full relative overflow-hidden"
            style={{
              boxShadow: '0 0 20px rgba(16,185,129,0.1), inset 0 1px 0 rgba(16,185,129,0.1)',
            }}
          >
            <span className="relative z-10">Technology Innovation Lab</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
          </Badge>
        </motion.div>

        {/* Main headline with 3D text shadow */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
          style={{
            textShadow: '0 0 40px rgba(16,185,129,0.08), 0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          Building the{' '}
          <span className="gradient-text">Future of Ethiopia</span>{' '}
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

        {/* CTA Buttons with 3D effect */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            className="min-w-[200px] relative overflow-hidden group"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              boxShadow: '0 0 30px rgba(16,185,129,0.2), 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
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
              boxShadow: '0 0 20px rgba(16,185,129,0.05), 0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            Get in Touch
          </Button>
        </motion.div>
      </motion.div>

      {/* 3D Scroll indicator with orbiting ring */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
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
          style={{ boxShadow: '0 0 10px rgba(16,185,129,0.1)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute w-1.5 h-1.5 rounded-full bg-primary/50 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </motion.div>

      {/* Bottom 3D edge line */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(16,185,129,0.5), rgba(16,185,129,0.3), transparent)',
        boxShadow: '0 0 20px rgba(16,185,129,0.1)',
      }} />
    </section>
  )
}
