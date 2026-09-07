const services = [
  {
    title: 'AI Systems & Automation',
    description: 'Machine learning, LLM workflows, conversational assistants, and business process automation built into existing operations.',
    tags: ['LLMs', 'MLOps', 'RAG'],
  },
  {
    title: 'Web & SaaS Platforms',
    description: 'Full-stack web products, multi-tenant SaaS systems, dashboards, and customer-facing platforms engineered for reliable growth.',
    tags: ['Next.js', 'Node.js', 'Billing'],
  },
  {
    title: 'Mobile Product Engineering',
    description: 'Native and cross-platform mobile applications for teams that need fast, polished, and maintainable user experiences.',
    tags: ['React Native', 'Flutter', 'iOS'],
  },
  {
    title: 'Cloud, APIs & Enterprise Architecture',
    description: 'Secure backend systems, APIs, cloud infrastructure, workflow platforms, and integration layers for complex organizations.',
    tags: ['AWS', 'GraphQL', 'DevOps'],
  },
  {
    title: 'Product Design & Data Intelligence',
    description: 'Design systems, user experience strategy, analytics dashboards, and data products that make software easier to use and manage.',
    tags: ['UX', 'BI', 'ETL'],
  },
];

export function Services() {
  return (
    <section id="services" className="bg-card py-24 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="label-caps text-primary mb-3">
            Our Core Expertise
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Technology Solutions Built for Impact
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We offer end-to-end software engineering capabilities tailored for startups,
            enterprise clients, and public sector innovation.
          </p>
        </div>

        <div className="card-solid overflow-hidden">
          {services.map((service) => (
            <div
              key={service.title}
              className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 p-6 sm:p-8 border-b border-border last:border-b-0 items-baseline transition-all duration-150 ease-in-out hover:bg-secondary"
            >
              <h3 className="md:col-span-4 text-base font-semibold text-foreground group-hover:text-primary">
                {service.title}
              </h3>
              <p className="md:col-span-5 text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="md:col-span-3 flex flex-wrap gap-2 md:justify-end">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="label-caps text-muted-foreground border border-border rounded-md px-2 py-0.5 bg-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
