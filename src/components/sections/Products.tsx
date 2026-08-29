'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TiltCard3D } from '@/components/TiltCard3D'
import { PRODUCTS } from '@/lib/products'

export function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Dayn Flow (Flagship Product) shown full-size on the homepage
  const flagshipProduct = PRODUCTS[0] // Dayn Flow
  const otherProductsCount = PRODUCTS.length - 1

  return (
    <section id="products" ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-3">
            Flagship Product Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Digital Platforms Built for <span className="accent-gradient">Scale</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            High-impact software engineering powering next-generation commerce and logistics in East Africa.
          </p>
        </motion.div>

        {/* Full-Size Flagship Bento Card for Dayn Flow */}
        {flagshipProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TiltCard3D className="p-0 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Full-Size Image Container (6 cols) */}
                <div className="lg:col-span-6 relative h-[340px] sm:h-[450px] lg:h-[560px] bg-secondary/30">
                  <Image
                    src={flagshipProduct.image}
                    alt={flagshipProduct.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent lg:hidden" />
                </div>

                {/* Details Container (6 cols) */}
                <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge
                      className="rounded-full px-3 py-1 font-medium text-xs border"
                      style={{
                        backgroundColor: `${flagshipProduct.accentColor}15`,
                        color: flagshipProduct.accentColor,
                        borderColor: `${flagshipProduct.accentColor}40`,
                      }}
                    >
                      {flagshipProduct.badgeText}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{flagshipProduct.category}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    {flagshipProduct.logo && (
                      <div className="w-10 h-10 relative shrink-0 rounded-xl overflow-hidden bg-background/60 border border-white/10 p-1 flex items-center justify-center">
                        <Image src={flagshipProduct.logo} alt={`${flagshipProduct.name} logo`} fill className="object-contain" />
                      </div>
                    )}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                      {flagshipProduct.name}
                    </h3>
                  </div>

                  <p className="font-medium text-base sm:text-lg mb-4" style={{ color: flagshipProduct.accentColor }}>
                    {flagshipProduct.tagline}
                  </p>
                  
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
                    {flagshipProduct.description}
                  </p>

                  {/* All Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-4 border-t border-border/40">
                    {flagshipProduct.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${flagshipProduct.accentColor}20`, border: `1px solid ${flagshipProduct.accentColor}40` }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: flagshipProduct.accentColor }} />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#F5A623] text-primary-foreground hover:bg-[#F5A623]/90 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                      onClick={() => {
                        const target = document.getElementById('contact');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {flagshipProduct.ctaText || `Inquire About ${flagshipProduct.name}`}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-border bg-[#F5A623]/40 hover:scale-104 hover:text-white rounded-full font-medium cursor-default"
                    >
                      <Link href="/products">
                        <Layers className="w-4 h-4 mr-2 text-[#F5A623]" />
                        View Other Products ({otherProductsCount})
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </motion.div>
        )}

        {/* Bottom Banner to Products Directory */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bento-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-foreground">Looking for our complete suite of platforms?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Explore FinCore Pay, HealthPulse AI, AgriFlow AI, and custom solution architectures.
              </p>
            </div>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-medium shrink-0 group"
            >
              <Link href="/products">
                Explore Product Catalog
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
