'use client'

import { ChevronDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-24 overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Subtle pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full tracking-wide inline-flex items-center gap-2 shadow-sm backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Technology Innovation Lab
          </Badge>
        </motion.div>

        {/* Massive Geometric Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-foreground"
        >
          Building the <span className="accent-gradient">Future</span> of Ethiopia Through Technology
        </motion.h1>

        {/* Subtitle with generous spacing */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed font-normal"
        >
          We design, build, and deploy impactful technology products that accelerate Ethiopia&rsquo;s digital transformation with global software engineering standards.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[200px] h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium shadow-lg shadow-primary/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Our Work
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[200px] h-12 border-border bg-secondary/40 hover:bg-secondary text-foreground hover:border-foreground/20 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get in Touch
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 flex flex-col items-center"
        >
          <button
            onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-muted-foreground/60 hover:text-foreground transition-colors p-2 rounded-full focus:outline-none"
            aria-label="Scroll to content"
          >
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
