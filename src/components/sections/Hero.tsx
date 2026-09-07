import { ArrowRightIcon } from '@/components/icons';

export function Hero() {
  return (
    <section id="home" className="hero-pattern bg-card min-h-[80vh] flex items-center border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="max-w-5xl">
          <p className="label-caps text-primary mb-4">
            Technology Innovation Lab
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground max-w-4xl">
            Building the Future of Ethiopia Through Technology
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            We design, build, and deploy impactful technology products that accelerate
            Ethiopia&apos;s digital transformation with global software engineering standards.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
            <a href="#products" className="btn-primary h-12 px-6 text-sm sm:w-auto">
              Explore Our Work
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </a>
            <a href="#contact" className="btn-outline h-12 px-6 text-sm">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
