export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  image: string;
  logo?: string;
  accentColor: string;
  badgeText: string;
  features: string[];
  ctaText?: string;
  ctaHref?: string;
  orbit: {
    speed: number;
    startAngle?: number;
    showInOrbit?: boolean;
  };
}

export const PRODUCTS: Product[] = [
  {
    id: 'dayn-flow',
    name: 'Dine Flow',
    tagline: 'AI Food Ordering & Delivery',
    category: 'Logistics & E-Commerce',
    description: 'An intelligent food ordering and fulfillment ecosystem connecting merchants, logistics fleets, and consumers through automated dispatching and AI recommendation engines.',
    image: '/dayn-flow.jpg',
    logo: '/daynflow.png',
    accentColor: '#0F766E',
    badgeText: 'Flagship Platform',
    features: [
      'AI-Powered Recommendation Engine',
      'Real-time Multi-store Order Tracking',
      'Merchant & Restaurant Analytics Dashboard',
      'Automated Driver Route Optimization',
      'Integrated Digital Payments',
      'Multi-tenant Cloud Ecosystem',
    ],
    ctaText: 'Explore Dine Flow',
    ctaHref: 'https://www.dineflow.et/',
    orbit: {
      speed: 0.38,
      startAngle: 0,
      showInOrbit: true,
    },
  },
];
