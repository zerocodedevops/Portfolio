import { useEffect } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { Contact } from '@/components/sections/Contact';
import { Blog } from '@/components/sections/Blog';
import { useABTest } from '@/hooks/useABTest';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import PymesContent from './components/PymesContent';
import PymesHeroDesktop from './components/PymesHeroDesktop';

export default function PymesService() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const heroVariant = useABTest('hero_h1_madrid');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  const handleCtaClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#contact');
    }
  };

  return (
    <Layout>
      <Seo
        title="Desarrollo Web Pymes Madrid | Páginas Web Autónomos"
        description="Creamos páginas web profesionales para pymes y autónomos en Madrid con diseño responsive, SEO local y enfoque en ventas."
        keywords="desarrollo web pymes madrid, paginas web autonomos madrid, diseño web madrid pymes, web para negocios locales madrid, desarrollo de tiendas online para pymes, creación de página web autónomos madrid"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'ZeroCode',
          image: 'https://zerocode-devops.com/og-image.webp',
          '@id': 'https://zerocode-devops.com/desarrollo-web-pymes-madrid/#professionalservice',
          url: 'https://zerocode-devops.com/desarrollo-web-pymes-madrid',
          telephone: '+34 912 622 712',
          areaServed: {
            '@type': 'City',
            name: 'Madrid',
          },
        }}
      />

      <div className="pt-12 md:pt-24 pb-16 md:pb-32 bg-dark-950 text-dark-100">
        <div className="container-custom">
          {/* Hero Section / H1 */}
          <header className="max-w-5xl mx-auto text-center mb-12 md:mb-32">
            {isDesktop ? (
                <PymesHeroDesktop heroVariant={heroVariant} />
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-6 leading-tight">
                  {heroVariant === 'A' ? (
                    <>
                      El diseñador web para <br className="hidden sm:block" />
                      <span className="text-gradient">pymes en Madrid</span>
                    </>
                  ) : (
                    <>
                      Más clientes locales con una web <br className="hidden sm:block" />
                      <span className="text-gradient">rápida y optimizada</span>
                    </>
                  )}
                </h1>
              )}

            {/* Static Content (no motion used here) */}
            <div className="text-lg md:text-xl text-dark-400 mb-10 w-full mx-auto space-y-2 md:whitespace-nowrap">
              <span className="block">Si quieres crear página web para tu negocio sin complicaciones, estás en el lugar correcto.</span>
              <span className="block">Ofrecemos soluciones reales para autónomos y pequeñas empresas.</span>
              <span className="block">Impulsa tu presencia local hoy.</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center sm:items-start gap-3 sm:gap-4">
              <div className="flex flex-col w-full sm:w-auto">
                <button
                  onClick={handleCtaClick}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2 w-full"
                >
                  <Phone className="w-5 h-5" />
                  Solicita presupuesto gratis
                </button>
                <span className="text-[11px] text-dark-400 mt-2 flex items-center justify-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Respuesta en menos de 24h</span>
                </span>
              </div>
              <div className="flex flex-col justify-start w-full sm:w-auto">
                <button
                  onClick={() => {
                    const el = document.getElementById('projects');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/portfolio#projects');
                    }
                  }}
                  className="px-6 py-4 bg-transparent hover:bg-dark-800 text-dark-300 hover:text-white font-medium rounded-2xl border border-dark-700 transition-all flex items-center justify-center gap-2 w-full"
                >
                  Ver proyectos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          <PymesContent handleCtaClick={handleCtaClick} />
        </div>

        {/* Formulario de Contacto en la misma página */}
        <div className="border-t border-dark-800 pt-10 pb-8">
          <Contact />
        </div>

        {/* Blog / Guías de Negocio */}
        <section className="border-t border-dark-800 pt-20">
          <Blog type="business" />
        </section>
      </div>
    </Layout>
  );
}
