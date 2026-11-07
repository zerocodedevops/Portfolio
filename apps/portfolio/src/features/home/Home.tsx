import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Seo } from '@/components/common/SEO';
import { Hero } from '@/components/sections/Hero';
import {
  HomeFaqSection,
  HomeOfferSections,
  HomeProcessSections,
} from './HomeOfferSections';
import { HomeProjectGallery } from './HomeProjectGallery';

const Contact = lazy(() => import('@/components/sections/Contact').then((m) => ({ default: m.Contact })));

export default function Home() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top on root path change, or to section if hash exists
    if (hash) {
      globalThis.setTimeout(() => {
        globalThis.document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return (
    <Layout>
      <Seo
        title="Diseño Web para Autónomos y Pymes en Madrid y Rivas | ZeroCode"
        description="Diseño web a medida para autónomos y pymes en Madrid, Rivas y toda España. Pide tu demo personalizada en 48 horas sin compromiso. Nos adaptamos a tu presupuesto."
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': ['ProfessionalService', 'LocalBusiness'],
              '@id': 'https://zerocode-devops.com/#localbusiness',
              name: 'ZeroCode DevOps - Diseño Web Autónomos y Pymes',
              url: 'https://zerocode-devops.com/',
              email: 'admin@zerocode-devops.com',
              telephone: '+34912622712',
              logo: 'https://zerocode-devops.com/logo-zerocode.webp',
              image: 'https://zerocode-devops.com/og-image.webp',
              priceRange: '€€',
              founder: {
                '@type': 'Person',
                name: 'David González',
                jobTitle: 'Diseñador y Desarrollador Web Freelance',
                url: 'https://zerocode-devops.com/#sobre-mi'
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Rivas-Vaciamadrid',
                addressRegion: 'Madrid',
                postalCode: '28522',
                addressCountry: 'ES'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 40.3524,
                longitude: -3.5358
              },
              areaServed: [
                { '@type': 'City', name: 'Rivas-Vaciamadrid' },
                { '@type': 'AdministrativeArea', name: 'Comunidad de Madrid' },
                { '@type': 'Country', name: 'España' }
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Servicios de Diseño Web',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Demo personalizada de página web en 48 horas sin compromiso',
                      description: 'Propuesta visual previa adaptada a tu negocio y presupuesto antes de decidir.'
                    }
                  }
                ]
              }
            }
          ]
        }}
      />
      <main>
      <Hero />
      <HomeProcessSections />
      <HomeOfferSections />
      <HomeProjectGallery />
      <HomeFaqSection />
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
      </main>
    </Layout>
  );
}
