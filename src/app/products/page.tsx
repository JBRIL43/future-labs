'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ArrowRight, Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { TiltCard3D } from '@/components/TiltCard3D'
import { PRODUCTS, type Product } from '@/lib/products'

export default function AllProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))]

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Back Link */}
          <div className="mb-8">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Page Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-2">
              Full Product Directory
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              All Digital <span className="accent-gradient">Products</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Explore our complete suite of high-impact software platforms, AI tools, and enterprise infrastructure solutions.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 bg-secondary/30 p-4 rounded-2xl border border-border/60">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-background/60 border-border/80 rounded-full text-xs"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-12">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <TiltCard3D className="p-0 overflow-hidden">
                    <div className={`grid grid-cols-1 lg:grid-cols-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                      {/* Product Image */}
                      <div className={`lg:col-span-6 relative h-[300px] sm:h-[400px] lg:h-[480px] bg-secondary/40 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Details */}
                      <div className={`lg:col-span-6 p-8 sm:p-12 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge
                            className="rounded-full px-3 py-1 font-medium text-xs border"
                            style={{
                              backgroundColor: `${product.accentColor}15`,
                              color: product.accentColor,
                              borderColor: `${product.accentColor}40`,
                            }}
                          >
                            {product.badgeText}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">{product.category}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          {product.logo && (
                            <div className="w-9 h-9 relative shrink-0 rounded-xl overflow-hidden bg-background/60 border border-white/10 p-1 flex items-center justify-center">
                              <Image src={product.logo} alt={`${product.name} logo`} fill className="object-contain" />
                            </div>
                          )}
                          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                            {product.name}
                          </h2>
                        </div>

                        <p className="font-medium text-sm mb-4" style={{ color: product.accentColor }}>
                          {product.tagline}
                        </p>

                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                          {product.description}
                        </p>

                        {/* All Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-4 border-t border-border/40">
                          {product.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-2.5">
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                style={{ backgroundColor: `${product.accentColor}20`, border: `1px solid ${product.accentColor}40` }}
                              >
                                <Check className="w-2.5 h-2.5" style={{ color: product.accentColor }} />
                              </div>
                              <span className="text-xs sm:text-sm text-foreground/90 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          asChild
                          size="lg"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                        >
                          <Link
                            href={product.ctaHref || '/#contact'}
                            target={product.ctaHref?.startsWith('http') ? '_blank' : undefined}
                            rel={product.ctaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {product.ctaText || `Inquire About ${product.name}`}
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </TiltCard3D>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-border">
              <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search query or selected category filter.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
