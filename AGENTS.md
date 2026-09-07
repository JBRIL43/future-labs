# Project Rules (User Directives - always apply)

## Design & Content Bans (No generic AI aesthetics)
- Never use default purple or indigo AI gradients.
- No pill-shaped buttons. Do not use fully rounded `rounded-full` buttons. Use tight radius.
- No fake reviews or fake metrics. Do not invent testimonials, counters, "10+ projects", "500+ clients", or similar claims.
- No vague hero text or hallucinated marketing copy.
- No emoji icons.
- No em dashes anywhere in user-facing copy.
- No over-the-top, scroll-triggered macro animations. Do not add page-wide fade-ins or slide-ups.
- No cursor animations. `CustomCursor` is strictly banned.
- No AI placeholder images.

## Launch Checklist
1. Connect a custom domain.
2. Add a custom favicon.
3. Remove any "Made with AI" tags.
4. Add functional Privacy Policy and Terms & Conditions pages.

## Quality & Architecture Bar
- Make zero syntax errors. Verify with `npm run lint` and `npm run build` before considering work done.
- Stack: Next.js App Router, Tailwind CSS v4, Prisma, SQLite (`db/custom.db`), Node scripts.
- No shadcn/ui and no pre-built component libraries. Generate custom, modular components structured for immediate Git repository commits.
- Scripts: `npm run lint`, `npm run build`, `npm run dev`, `npm run start` for Node standalone production start.

## Modern Design System (Strict 2026 Guidelines)
- Palette: `#FAFAFA` background, `#FFFFFF` card, `#18181B` foreground, `#52525B` muted text, `#F4F4F5` secondary surface, `#E4E4E7` borders and inputs, `#0F766E` teal accent, `#0C5F59` teal hover, `#B91C1C` destructive.
- Typography: Work Sans via `next/font/google`. Never use Inter, Roboto, or system defaults.
- Icons: raw inline SVGs only, centralized in `src/components/icons.tsx`. Never use `lucide-react` or external icon packages.
- Shape: use 12px border radius (`rounded-xl`) on major cards and 8px (`rounded-md`) on interior inputs, controls, and buttons for a softer modern feel.
- Elevation & shadows: cards, dropdowns, and modals must use subtle, highly diffused drop shadows. Use `shadow-sm` for static cards and stronger but soft shadows for popovers, such as very low opacity `rgba(0,0,0,0.04)`. Do not use harsh, dark shadows.
- Borders: combine subtle shadows with an ultra-light 1px border using `#E4E4E7` on white cards for a crisp, premium layered effect.
- Micro-interactions: buttons and interactive cards should use swift tactile transitions with `transition-all duration-150 ease-in-out`. Slight structural hover states are allowed, such as `hover:-translate-y-0.5`, `hover:shadow-md`, and click states like `active:scale-95`.
- Glassmorphism: allowed only on sticky structural elements, such as top navigation bars. Use a high blur with semi-transparent white, for example `bg-white/70 backdrop-blur-md border-b border-[#E4E4E7]`.
- Content: no mock testimonials, fake logos, hallucinated copy, or placeholders.
- Routing: no dead ends. Every footer link, social icon, and interactive element must map to functional routing, external URLs, or state logic.
- Layout: avoid the standard SaaS hero plus 3-column feature grid pattern. Use asymmetrical or tight bento-box layouts tailored to the provided data structure.
