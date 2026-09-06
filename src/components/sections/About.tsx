const coreValues = [
  { title: 'Innovation', desc: 'Pushing digital boundaries' },
  { title: 'Excellence', desc: 'Uncompromising craftsmanship' },
  { title: 'Transparency', desc: 'Open, honest collaboration' },
  { title: 'User-Centered', desc: 'Built for human experience' },
  { title: 'Scalability', desc: 'Architecture built to grow' },
  { title: 'Ethical AI', desc: 'Responsible technology' },
];

export function About() {
  return (
    <section id="about" className="bg-secondary py-24 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="label-caps text-primary mb-3">
            About Future Labs
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            We don&apos;t just build software. We shape digital ecosystems.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Future Labs is an innovation laboratory focused on pioneering high-impact
            software products and custom digital solutions for businesses across
            Ethiopia and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="card-interactive p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To research, design, and deploy world-class digital products powered by
              modern technology that solve pressing economic challenges and accelerate
              digital maturity across East Africa.
            </p>
            <hr className="mt-8 mb-4 border-border" />
            <p className="label-caps text-muted-foreground">Purpose-Driven Engineering</p>
          </div>
          <div className="card-interactive p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become Ethiopia&apos;s benchmark technology lab, setting global standards
              for product engineering, design quality, and technology leadership.
            </p>
            <hr className="mt-8 mb-4 border-border" />
            <p className="label-caps text-muted-foreground">Ethiopia and Global</p>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="label-caps text-foreground mb-6">Core Operating Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {coreValues.map((val) => (
              <div key={val.title} className="card-interactive p-6 sm:p-8">
                <p className="card-title text-base font-semibold text-foreground">{val.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
