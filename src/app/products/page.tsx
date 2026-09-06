'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, SearchIcon } from '@/components/icons'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { PRODUCTS } from '@/lib/products'

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

      <main className="flex-1 py-16 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center btn-outline h-10 px-4 text-sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="max-w-3xl mb-12">
            <p className="label-caps text-primary mb-2">
              Full Product Directory
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              All Digital Products
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Explore our complete suite of high-impact software platforms, AI tools, and
              enterprise infrastructure solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 card-interactive p-4 sm:p-6">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-md border transition-all duration-150 ease-in-out active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card text-muted-foreground border-border shadow-sm hover:-translate-y-0.5 hover:text-primary hover:border-primary hover:shadow-md'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="field-input pl-9 h-10"
                aria-label="Search products"
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="space-y-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card-interactive overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="card-media relative h-[300px] sm:h-[400px] bg-secondary border-b lg:border-b-0 lg:border-r border-border">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-8 sm:p-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="label-caps text-primary border border-primary rounded-md px-2.5 py-1 bg-secondary">
                          {product.badgeText}
                        </span>
                        <span className="label-caps text-muted-foreground">{product.category}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {product.logo && (
                          <div className="w-9 h-9 relative shrink-0 rounded-md overflow-hidden border border-border bg-secondary p-1 shadow-sm">
                            <Image
                              src={product.logo}
                              alt={`${product.name} logo`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <h2 className="card-title text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                          {product.name}
                        </h2>
                      </div>

                      <p className="font-medium text-sm text-primary mb-4">{product.tagline}</p>

                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                        {product.description}
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-6 border-t border-border">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <span className="text-primary mt-0.5 shrink-0">
                              <CheckIcon className="w-4 h-4" />
                            </span>
                            <span className="text-xs sm:text-sm text-foreground font-medium">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={product.ctaHref || '/#contact'}
                        target={product.ctaHref?.startsWith('http') ? '_blank' : undefined}
                        rel={product.ctaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="btn-primary h-11 px-5 text-sm"
                      >
                        {product.ctaText || `Inquire About ${product.name}`}
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 card-solid">
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
