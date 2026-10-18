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
        title="Diseño web para autónomos y pymes desde 400 € | ZeroCode"
        description="Diseño web a medida para autónomos y pymes de toda España. Una página con Inicio y Contacto desde 400 €, con WhatsApp, adaptación móvil, dominio y hosting durante un año."
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              name: 'ZeroCode DevOps',
              url: 'https://zerocode-devops.com/',
              email: 'admin@zerocode-devops.com',
              logo: 'https://zerocode-devops.com/logo-zerocode.webp',
              areaServed: { '@type': 'Country', name: 'España' },
            },
            {
              '@type': 'Service',
              name: 'Diseño web a medida para autónomos y pymes',
              provider: { '@type': 'Organization', name: 'ZeroCode DevOps' },
              areaServed: { '@type': 'Country', name: 'España' },
              description: 'Diseño de una página web con Inicio y Contacto, adaptada a móviles, con botón de WhatsApp, dominio y hosting durante un año y certificado SSL.',
              offers: { '@type': 'Offer', price: '400', priceCurrency: 'EUR' },
            },
          ],
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
