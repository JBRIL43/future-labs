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
    accentColor: '#F5A623',
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
  // {
  //   id: 'fintech-core',
  //   name: 'FinCore Pay',
  //   tagline: 'Digital Wallet & Payments',
  //   category: 'Financial Technology',
  //   description: 'Next-generation financial infrastructure providing multi-currency digital wallets, micro-loan scoring algorithms, and merchant settlement APIs.',
  //   image: '/hero-bg.png',
  //   logo: '/logo.svg',
  //   accentColor: '#00C9A7',
  //   badgeText: 'FinTech Platform',
  //   features: [
  //     'Multi-Currency Wallet Engine',
  //     'Instant Merchant Settlement APIs',
  //     'AI Credit Risk Scoring',
  //     'Bank & Mobile Money Interoperability',
  //     'Fraud Detection & Audit Trails',
  //     'Sub-second Transaction Latency',
  //   ],
  //   ctaText: 'Inquire About FinCore',
  //   ctaHref: '#contact',
  //   orbit: {
  //     speed: 0.28,
  //     startAngle: 2.1,
  //     showInOrbit: true,
  //   },
  // },
  // {
  //   id: 'health-pulse',
  //   name: 'HealthPulse AI',
  //   tagline: 'Telemedicine & Triage',
  //   category: 'Healthcare Technology',
  //   description: 'AI-assisted clinical triage and patient management platform connecting rural healthcare providers with medical specialists in real time.',
  //   image: '/team-culture.png',
  //   accentColor: '#34d399',
  //   badgeText: 'HealthTech Platform',
  //   features: [
  //     'AI Symptom Analysis & Triage',
  //     'Remote Patient Monitoring',
  //     'Electronic Health Records (EHR)',
  //     'Low-Bandwidth Video Consultation',
  //     'Offline-First Data Syncing',
  //     'HIPAA & Local Compliance',
  //   ],
  //   ctaText: 'Discover HealthPulse',
  //   ctaHref: '#contact',
  //   orbit: {
  //     speed: 0.22,
  //     startAngle: 4.2,
  //     showInOrbit: true,
  //   },
  // },
  // {
  //   id: 'agri-flow',
  //   name: 'AgriFlow AI',
  //   tagline: 'Precision Farming & Yield Intelligence',
  //   category: 'Agricultural Tech',
  //   description: 'Satellite-driven crop monitoring and supply chain management system empowering smallholder farmers and agricultural exporters with predictive insights.',
  //   image: '/hero-bg.png',
  //   accentColor: '#8b5cf6',
  //   badgeText: 'AgriTech Platform',
  //   features: [
  //     'Satellite Soil & Crop Health Analysis',
  //     'Weather & Disease Outbreak Warnings',
  //     'Direct Buyer Marketplace Integration',
  //     'Micro-Insurance Risk Modeling',
  //     'Geospatial Mapping & Analytics',
  //     'USSD & SMS Farmer Gateway',
  //   ],
  //   ctaText: 'Explore AgriFlow',
  //   ctaHref: '#contact',
  //   orbit: {
  //     speed: 0.18,
  //     startAngle: 5.5,
  //     showInOrbit: true,
  //   },
  // },
];
