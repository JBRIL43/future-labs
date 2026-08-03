import { Navigation } from '@/components/sections/Navigation';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { Stats } from '@/components/sections/Stats';
import { TechStack } from '@/components/sections/TechStack';
import { Careers } from '@/components/sections/Careers';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Stats />
        <About />
        <Services />
        <Products />
        <TechStack />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}