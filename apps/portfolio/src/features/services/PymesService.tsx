import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  Phone,
  MapPin,
  BarChart3,
  Search,
  ArrowDownRight,
  ArrowRight,
  User,
  Brain,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { useABTest } from '@/hooks/useABTest';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useUserInteraction } from '@/hooks/useUserInteraction';

const Blog = lazy(() => import('@/components/sections/Blog').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('@/components/sections/Contact').then(m => ({ default: m.Contact })));

export default function PymesService() {
  const navigate = useNavigate();
  const heroVariant = useABTest('hero_h1_madrid');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const hasInteracted = useUserInteraction();

  const handleCtaClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/disenador-web-freelance-madrid#contact');
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
          '@type': 'LocalBusiness',
          name: 'ZeroCode',
          image: 'https://zerocode-devops.com/og-image.png',
          '@id':
            'https://zerocode-devops.com/desarrollo-web-pymes-madrid/#localbusiness',
          url: 'https://zerocode-devops.com/desarrollo-web-pymes-madrid',
          telephone: '+34 912 622 712',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Madrid, Spain',
            addressLocality: 'Madrid',
            postalCode: '28001',
            addressCountry: 'ES',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.416775,
            longitude: -3.70379,
          },
        }}
      />

      <div className="pt-12 md:pt-24 pb-16 md:pb-32 bg-dark-950 text-dark-100">
        <div className="container-custom">
          {/* Hero Section / H1 */}
          <header className="max-w-5xl mx-auto text-center mb-12 md:mb-32">
            <motion.div
              initial={isDesktop ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-800/50 border border-dark-700/50 text-dark-300 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm">
                  <Brain className="w-3 h-3" />
                  Código limpio y optimizado con IA
                </span>
              </div>
              <span className="inline-block text-primary-400 font-bold uppercase tracking-wider text-sm mb-4">
                ¿Buscas contratar diseñador web freelance Madrid?
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-6 leading-tight">
                {heroVariant === 'A' ? (
                  <>
                    El diseñador web para{' '}
                    <br className="hidden sm:block" />
                    <span className="text-gradient">
                      pymes en Madrid
                    </span>
                  </>
                ) : (
                  <>
                    Más clientes locales con una web{' '}
                    <br className="hidden sm:block" />
                    <span className="text-gradient">
                      rápida y optimizada
                    </span>
                  </>
                )}
              </h1>
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
            </motion.div>
          </header>

          {(isDesktop || hasInteracted) && (
            <>
              <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12 lg:gap-20 items-start">
                <div className="lg:col-span-2 space-y-12 md:space-y-32">
                  {/* Sección Beneficios */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <BarChart3 className="text-primary-500" />
                  Beneficios de tener una web optimizada para SEO y conversión
                </h2>
                <div className="prose prose-invert max-w-none text-dark-300">
                  <p className="mb-6">
                    En el competitivo mercado actual, no basta con "estar" en
                    internet. Al buscar una <strong>empresa de diseño web para pymes</strong> en Madrid,
                    nuestro objetivo es enfocarnos en tu visibilidad y lograr resultados de negocio tangibles.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <BenefitCard
                      title="Visibilidad 24/7"
                      desc="Tu negocio nunca cierra. Una web profesional capta leads mientras duermes, los 365 días del año."
                    />
                    <BenefitCard
                      title="Autoridad de Marca"
                      desc="Una página web profesional proyecta la seriedad que tus clientes buscan en Pozuelo, Majadahonda o Las Rozas."
                    />
                    <BenefitCard
                      title="Diseño Responsive"
                      desc="Tu web se verá perfecta en teléfonos, tablets y ordenadores. Donde están tus clientes."
                    />
                    <BenefitCard
                      title="SEO Local Madrid"
                      desc="Aparece cuando alguien busca 'servicios en Madrid'. No pierdas clientes cerca de ti."
                    />
                  </div>
                  <p className="mt-8 text-center text-lg font-semibold text-dark-200 italic">
                    Si tu web genera contactos, no es un gasto — es una inversión.
                  </p>
                </div>
              </section>

              {/* Problemas que resolvemos (Existing Section Integrated) */}
              <section className="bg-dark-900/50 p-8 md:p-10 rounded-3xl border border-dark-800">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <Zap className="text-accent-500 shrink-0" />
                  ¿Qué incluye un desarrollo web profesional?
                </h2>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mt-8">
                  <FeatureListItem text="Arquitectura web escalable y modular" />
                  <FeatureListItem text="Diseño web responsive para negocios" />
                  <FeatureListItem text="Optimización técnica (Performance)" />
                  <FeatureListItem text="SEO On-Page para Google" />
                  <FeatureListItem text="Tienda online para pymes (eCommerce) - Opcional" />
                  <FeatureListItem text="Código limpio y optimizado con IA" />
                  <FeatureListItem text="Automatización de recepción de consultas" />
                  <FeatureListItem text="Velocidad de carga relámpago (optimizada para Core Web Vitals)" />
                </ul>
              </section>

              {/* Sección Precios */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-green-500" />
                  Presupuesto y precio de página web para empresa en Madrid
                </h2>
                <p className="text-dark-400 mb-12 italic text-sm">
                  *Nota: Pedir un <strong>presupuesto página web Madrid</strong> es gratis.
                  Estos costes son una base y varían a la hora de <strong>hacer página web para mi empresa Madrid</strong> según tus necesidades.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  <PriceCard
                    level="Web Esencial"
                    price="700€"
                    featured={true}
                    bestFor="La tarjeta de visita digital perfecta para arrancar tu presencia local con fuerza."
                    features={[
                      'Diseño de Inicio, Servicios y Contacto',
                      'Botón directo a WhatsApp / Llamada',
                      'Mapa de Google (SEO Local básico)',
                      '100% Adaptada a Móviles',
                      'Textos Legales y Cookies (RGPD)',
                      'Dominio y Hosting rápido (1 año)',
                      'Certificado de Seguridad (Candado SSL)',
                    ]}
                    onCtaClick={handleCtaClick}
                  />
                  <PriceCard
                    level="Web Profesional"
                    price="1.400€"
                    featured={false}
                    bestFor="La máquina de captar clientes para tu negocio local. Optimizada para posicionar en Google en tu sector."
                    features={[
                      'Todo lo incluido en la Web Esencial',
                      'Secciones extra: Equipo, Testimonios',
                      'SEO On-Page Avanzado (Más visibilidad)',
                      'Velocidad de carga relámpago (Core Web Vitals)',
                      'Cuentas de Email Profesional (@empresa.es)',
                      'Soporte directo por teléfono (1 año)',
                      'Cambios y actualizaciones incluidas (1 año)',
                    ]}
                    onCtaClick={handleCtaClick}
                  />
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      navigate('/precios-paginas-web');
                      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-all"
                  >
                    Ver detalles completos de planes y servicios
                    <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleCtaClick}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Solicita presupuesto gratis
                  </button>
                </div>
              </section>

              {/* Sección Proveedor */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Cómo elegir un proveedor de desarrollo web en Madrid
                </h2>
                <div className="prose prose-invert max-w-none text-dark-400">
                  <p>
                    Para un <strong>diseño web Madrid pymes</strong> exitoso
                    debes fijarte en la transparencia, el portfolio real y el
                    enfoque en ventas. Por eso trabajo siempre con{' '}
                    <strong>
                      contratos claros y presupuestos cerrados
                    </strong>, eliminando sorpresas o "letras pequeñas". La
                    cercanía y el trato directo marcan la diferencia frente a
                    cualquier agencia impersonal.
                  </p>
                </div>
              </section>

              {/* Sección ¿Quién está detrás? */}
              <section className="bg-gradient-to-br from-primary-500/5 to-accent-500/5 p-8 md:p-10 rounded-3xl border border-dark-800">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-center">
                  <div className="aspect-square w-full max-w-[280px] mx-auto md:max-w-none rounded-3xl bg-dark-800/80 flex items-center justify-center border border-primary-500/30 shadow-glow relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors duration-500" />
                    <User className="w-24 h-24 text-primary-500 relative z-10" />
                  </div>
                  <div className="space-y-6 text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      ¿Quién está detrás de ZeroCode?
                    </h2>
                    <p className="text-dark-300 text-lg md:text-xl leading-relaxed">
                      Hola, soy <strong>David</strong>, arquitecto web freelance.
                      Vivo y trabajo en <strong>Madrid (Rivas)</strong>, lo que me
                      permite ofrecerte un trato directo y cercano que ninguna
                      agencia impersonal puede igualar. Mi objetivo no es solo
                      hacerte una web, sino que tu tecnología trabaje para traerte
                      más clientes cada día.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 text-sm text-dark-300 justify-center md:justify-start pt-2">
                      <span className="flex items-center justify-center md:justify-start gap-2 italic">
                        <CheckCircle className="w-5 h-5 text-primary-500 shrink-0" />
                        Trato directo
                      </span>
                      <span className="flex items-center justify-center md:justify-start gap-2 italic">
                        <CheckCircle className="w-5 h-5 text-primary-500 shrink-0" />
                        Enfoque en negocio
                      </span>
                      <span className="flex items-center justify-center md:justify-start gap-2 italic">
                        <CheckCircle className="w-5 h-5 text-primary-500 shrink-0" />
                        Soporte continuo
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección Casos de Éxito */}
              <section className="border-t border-dark-800 pt-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <CheckCircle className="text-green-500" />
                  Casos de éxito y testimonios locales en Madrid
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  <TestimonialCard
                    name="Caso tipo: Cafetería"
                    location="Rivas Vaciamadrid"
                    text="ZeroCode entendió perfectamente lo que necesitábamos. Nuestra web ahora carga al instante y hemos notado un aumento claro en las reservas locales mes a mes."
                  />
                  <TestimonialCard
                    name="Caso tipo: Consultoría"
                    location="Coslada"
                    text="La web corporativa que diseñaron ha elevado nuestra imagen profesional. El trato directo en Madrid facilita mucho las cosas."
                  />
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      const el = document.getElementById('projects');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/portfolio#projects');
                      }
                    }}
                    className="group inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-all text-sm"
                  >
                    Ver más proyectos reales
                    <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleCtaClick}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Solicita presupuesto gratis
                  </button>
                </div>
              </section>

              {/* FAQ Section */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center sm:text-left">
                  Preguntas frecuentes (FAQ)
                </h2>
                <div className="space-y-4">
                  <FaqItem
                    q="¿Cuánto cuesta contratar un diseñador web para mi empresa en Madrid?"
                    a="El precio de una página web para empresa puede variar. Un diseño web profesional parte de 700€, pudiendo llegar a 1.400€ o más si tu negocio necesita integraciones complejas o SEO local avanzado."
                  />
                  <FaqItem
                    q="¿Qué incluye el servicio de creación de página web para pymes?"
                    a="Al contratar diseñador web freelance Madrid con nosotros, el paquete incluye un diseño a medida y autogestionable, optimización de velocidad de carga, textos legales (RGPD), certificado SSL, e integración para contacto directo por WhatsApp o email."
                  />
                  <FaqItem
                    q="¿Cuánto tarda en estar lista?"
                    a="Crear una página web para mi negocio suele demorarse entre 2 y 4 semanas, siempre dependiendo del tiempo que tardemos en recopilar los textos, fotos e información de tus servicios."
                  />
                  <FaqItem
                    q="¿Tengo que saber de informática para gestionar mi web?"
                    a="Para nada. Te entregamos la web lista y te damos una formación básica para que seas autónomo al 100%."
                  />
                  <FaqItem
                    q="¿La web será mía al 100%?"
                    a="Sí. Siempre recomendamos que el dominio y el hosting estén a tu nombre. Tú eres el dueño legal de todo."
                  />
                  <FaqItem
                    q="¿Por qué necesito una web si ya tengo redes sociales?"
                    a="Porque tu web es tuya. Las redes son prestadas. Pueden cambiar reglas, alcance o incluso cerrar tu cuenta sin avisar. Un desarrollo propio te da el control total de tu negocio."
                  />
                  <FaqItem
                    q="¿Trabajas solo en Madrid o también online?"
                    a="Mi base está en Madrid y doy servicio presencial en toda la Comunidad (Rivas, Pozuelo, Alcobendas, Coslada…), pero trabajo igualmente con clientes de toda España de forma 100% online. La comunicación es igual de fluida por videollamada."
                  />
                </div>
              </section>
            </div>

            {/* Sidebar / Stats & Advice */}
            <aside className="sticky top-[68px]">
              <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-[2rem] space-y-6">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  Por qué es importante una buena web para tu negocio en Madrid
                </h2>

                <div className="space-y-[18px]">
                  {/* Estadísticas Clave */}
                  <div className="bg-gradient-to-br from-primary-600/20 to-accent-600/20 p-8 rounded-3xl border border-white/5 mt-16 text-center">
                    <h3 className="text-xl font-bold text-white mb-10">
                      Estadísticas Clave
                    </h3>
                    <div className="grid grid-cols-1 gap-8 divide-y divide-white/10">
                      <div className="pb-8">
                        <span className="block text-5xl font-extrabold text-primary-400 mb-2">
                          88%
                        </span>
                        <p className="text-sm text-dark-300 leading-relaxed px-4">
                          de consumidores investigan online antes de comprar
                          localmente.
                        </p>
                      </div>
                      <div className="pt-8">
                        <span className="block text-5xl font-extrabold text-accent-400 mb-2">
                          53%
                        </span>
                        <p className="text-sm text-dark-300 leading-relaxed px-4">
                          abandona una web local que tarda más de 3s en
                          cargar.
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-dark-400 mt-8 italic">
                      Fuente: estudios de comportamiento de usuarios en buscadores.
                    </p>
                  </div>

                  {/* Consejo SEO Técnico */}
                  <div className="p-3 rounded-xl border border-dark-700/50 bg-dark-800/30">
                    <h3 className="text-sm font-bold text-white mb-[6px] flex items-center gap-2">
                      <Search className="w-4 h-4 text-primary-400" />
                      Consejo SEO Técnico
                    </h3>
                    <p className="text-dark-400 text-xs leading-relaxed">
                      Optimiza tus "Core Web Vitals". Un buen{' '}
                      <strong>servicio de diseño web</strong> garantiza que
                      Google favorezca tu sitio.
                    </p>
                  </div>

                  {/* Presencia en Madrid */}
                  <div className="p-6 rounded-3xl border border-dark-700/50 bg-dark-800/30">
                    <h3 className="text-sm font-bold text-white mb-5 flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
                      Presencia en Madrid
                    </h3>
                    <ul className="grid grid-cols-2 gap-3 text-left">
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Madrid Capital</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Rivas Vaciamadrid</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Coslada</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>San Fernando</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Arganda del Rey</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Pozuelo y Aravaca</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Majadahonda</li>
                      <li className="flex items-center gap-2 text-xs text-dark-300"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"/>Las Rozas</li>
                    </ul>
                    <p className="text-[11px] text-dark-400 mt-5 italic text-center">
                      *Online para el resto de España.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Formulario de Contacto en la misma página */}
          <Suspense fallback={<div className="h-96 animate-pulse bg-dark-900/50 rounded-3xl" />}>
            <div className="border-t border-dark-800 pt-10 pb-8">
              <Contact />
            </div>
          </Suspense>

          {/* Blog / Guías de Negocio */}
          <Suspense fallback={<div className="h-96 animate-pulse bg-dark-900/50 rounded-3xl" />}>
            <section className="border-t border-dark-800 pt-20">
              <Blog type="business" />
            </section>
          </Suspense>
        </>
      )}
        </div> {/* closing container-custom */}
      </div> {/* closing pt-12... div */}
    </Layout>
  );
}

function BenefitCard({ title, desc }: Readonly<{ title: string; desc: string }>) {
  return (
    <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:border-primary-500/50 transition-all">
      <h3 className="font-bold text-white mb-3 text-lg">{title}</h3>
      <p className="text-sm text-dark-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureListItem({ text }: Readonly<{ text: string }>) {
  return (
    <li className="flex items-start gap-3 text-dark-300">
      <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
      <span className="leading-tight">{text}</span>
    </li>
  );
}

function PriceCard({
  level,
  price,
  bestFor,
  features = [],
  featured = false,
  onCtaClick,
}: Readonly<{
  level: string;
  price: string;
  bestFor: string;
  features?: string[];
  featured?: boolean;
  onCtaClick?: () => void;
}>) {
  return (
    <div className={`p-8 rounded-3xl border transition-all flex flex-col relative h-full ${featured
      ? 'bg-dark-800 border-primary-500/50 shadow-2xl scale-100 md:scale-105 z-10'
      : 'bg-dark-900 border-dark-800 hover:border-dark-700 mt-0 md:mt-4 mb-0 md:mb-4'
      }`}>
      {featured && (
        <div className="absolute -top-4 left-6 px-4 py-1.5 bg-primary-600 text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-glow">
          Más Popular
        </div>
      )}
      <h3 className="text-sm text-primary-400 font-bold uppercase tracking-wider">
        {level}
      </h3>
      <div className="text-4xl md:text-5xl font-extrabold text-white my-4">{price}</div>
      <p className="text-sm text-dark-400 mb-8 leading-relaxed h-[42px]">{bestFor}</p>

      {features.length > 0 && (
        <ul className="space-y-4 mb-10 flex-grow">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-dark-300 text-sm">
              <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
              <span className="leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onCtaClick}
        className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-auto ${featured 
          ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-glow' 
          : 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700'
        }`}
      >
        <Phone className="w-4 h-4" />
        Solicita presupuesto gratis
      </button>
    </div>
  );
}

function FaqItem({ q, a }: Readonly<{ q: string; a: string }>) {
  return (
    <div className="p-6 rounded-2xl bg-dark-800/40 border border-dark-700/50 hover:border-dark-700 transition-colors">
      <h3 className="text-lg font-bold text-white mb-3">{q}</h3>
      <p className="text-dark-300 leading-relaxed text-sm">
        {a}
      </p>
    </div>
  );
}

function TestimonialCard({
  name,
  location,
  text,
}: Readonly<{
  name: string;
  location: string;
  text: string;
}>) {
  return (
    <div className="bg-dark-800/40 p-8 rounded-3xl border border-dark-700/50 relative flex flex-col h-full">
      <div className="text-primary-500/20 text-6xl font-serif mb-2 leading-none">
        &ldquo;
      </div>
      <p className="text-dark-200 text-lg font-medium italic mb-8 relative z-10 flex-grow">{text}</p>
      <div className="mt-auto pt-6 border-t border-dark-700/50">
        <div className="text-sm font-bold text-white">{name}</div>
        <div className="text-xs text-dark-400 mt-1">{location} (Madrid)</div>
      </div>
    </div>
  );
}
