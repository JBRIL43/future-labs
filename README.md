# Future Labs

Future Labs is a modern landing page built with Next.js, TypeScript, and Tailwind CSS. It presents the company's mission, services, technology focus, careers, contact information, and flagship product `Dayn Flow`.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Three.js with React Three Fiber

## Features

- Animated multi-section company landing page
- Interactive visual background and 3D scene elements
- Product showcase for `Dayn Flow`
- Responsive layout for desktop and mobile
- UI built with reusable component patterns

## Getting Started

Install dependencies:

```bash
npm install
```

Or with Bun:

```bash
bun install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Project Structure

```text
src/
  app/          # App Router files and global styles
  components/   # Shared UI and page sections
public/         # Static assets
```

## Notes

- The app uses the Next.js App Router.
- Production start is configured to run the standalone build with Bun.
