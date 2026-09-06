export function Careers() {
  return (
    <section id="careers" className="bg-secondary py-24 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="label-caps text-primary mb-3">
            Careers at Future Labs
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Build the Future with Us
          </h2>
        </div>

        <div className="mt-12 card-interactive p-8 sm:p-12">
          <span className="label-caps inline-block text-primary border border-primary rounded-md px-2.5 py-1 bg-secondary mb-6">
            Coming Soon
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Open Roles Announcing Soon
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
            We are preparing our next wave of hiring for ambitious engineers, product
            designers, and researchers. Check back soon or get in touch to introduce
            yourself early.
          </p>
          <a href="#contact" className="btn-primary h-11 px-5 text-sm">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
