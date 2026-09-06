import Image from "next/image";
import Link from "next/link";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";
import { PRODUCTS } from "@/lib/products";

export function Products() {
  const flagshipProduct = PRODUCTS[0];
  const otherProductsCount = PRODUCTS.length - 1;

  if (!flagshipProduct) return null;

  return (
    <section id="products" className="bg-secondary py-24 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="label-caps text-primary mb-3">
            Flagship Product Showcase
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Digital Platforms Built for Scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            High-impact software engineering powering next-generation commerce and
            logistics in East Africa.
          </p>
        </div>

        <div className="card-interactive overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="card-media relative h-[340px] sm:h-[450px] lg:h-auto lg:min-h-[560px] bg-secondary border-b lg:border-b-0 lg:border-r border-border">
              <Image
                src={flagshipProduct.image}
                alt={flagshipProduct.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-8 sm:p-12 lg:p-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="label-caps text-primary border border-primary rounded-md px-2.5 py-1 bg-secondary">
                  {flagshipProduct.badgeText}
                </span>
                <span className="label-caps text-muted-foreground">{flagshipProduct.category}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                {flagshipProduct.logo && (
                  <div className="w-10 h-10 relative shrink-0 rounded-md overflow-hidden border border-border bg-secondary p-1 shadow-sm">
                    <Image
                      src={flagshipProduct.logo}
                      alt={`${flagshipProduct.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="card-title text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  {flagshipProduct.name}
                </h3>
              </div>

              <p className="font-medium text-base text-primary mb-4">
                {flagshipProduct.tagline}
              </p>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
                {flagshipProduct.description}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-6 border-t border-border">
                {flagshipProduct.features.map((feature) => (
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

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={flagshipProduct.ctaHref || "https://www.dineflow.et/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full sm:w-auto h-11 px-5 text-sm"
                >
                  {flagshipProduct.ctaText || `Inquire About ${flagshipProduct.name}`}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </a>

                <Link href="/products" className="btn-outline w-full sm:w-auto h-11 px-5 text-sm">
                  <ArrowRightIcon className="w-4 h-4 mr-2" />
                  View Other Products ({otherProductsCount})
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card-interactive p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <h4 className="text-base font-semibold text-foreground text-center sm:text-left">
            Looking for our complete suite of platforms?
          </h4>
          <Link href="/products" className="btn-primary h-11 px-5 text-sm shrink-0">
            Browse the Product Directory
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
