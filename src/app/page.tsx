import { Navigation } from '@/components/sections/Navigation';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { TechStack } from '@/components/sections/TechStack';
import { Careers } from '@/components/sections/Careers';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { SolarSystemScene } from '@/components/SolarSystemScene';
import { CustomCursor } from '@/components/CustomCursor';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground">
      <CustomCursor />
      <SolarSystemScene />
      <Navigation />
      <main className="flex-1 relative z-10 space-y-16 md:space-y-24">
        <Hero />
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
