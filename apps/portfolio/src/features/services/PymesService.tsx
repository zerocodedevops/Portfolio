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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';

export default function PymesService() {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    navigate('/disenador-web-freelance-madrid#contact');
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
          image: 'https://zerocode-devops.web.app/og-image.png',
          '@id':
            'https://zerocode-devops.web.app/desarrollo-web-pymes-madrid/#localbusiness',
          url: 'https://zerocode-devops.web.app/desarrollo-web-pymes-madrid',
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

      <div className="pt-[10px] pb-20 bg-dark-950 text-dark-100">
        <div className="container-custom">
          {/* Hero Section / H1 */}
          <header className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-primary-400 font-bold uppercase tracking-wider text-sm mb-4">
                Diseñador web freelance especializado en pymes y autónomos de Madrid
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Desarrollo web profesional para{' '}
                <span className="text-gradient">
                  pymes y autónomos en Madrid
                </span>
              </h1>
              <p className="text-xl text-dark-400 mb-8 max-w-3xl mx-auto">
                Soluciones reales para autónomos y pequeñas empresas que
                necesitan resultados, no complicaciones; sin tecnicismos ni líos
                técnicos. Impulsa tu presencia local hoy.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleCtaClick}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Solicita presupuesto gratis
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('projects');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/portfolio#projects');
                    }
                  }}
                  className="px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-2xl border border-dark-700 transition-all flex items-center justify-center gap-2"
                >
                  Ver proyectos
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </header>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-16">
              {/* Sección Beneficios */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <BarChart3 className="text-primary-500" />
                  Beneficios de tener una web optimizada para SEO y conversión
                </h2>
                <div className="prose prose-invert max-w-none text-dark-300">
                  <p className="mb-6">
                    En el competitivo mercado de Madrid, no basta con "estar" en
                    internet. El <strong>desarrollo web pymes Madrid</strong>{' '}
                    debe enfocarse en visibilidad y resultados tangibles.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <BenefitCard
                      title="Visibilidad 24/7"
                      desc="Tu negocio local en Madrid (ya sea en la capital o en Rivas Vaciamadrid) nunca cierra. Capta leads mientras duermes."
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
                </div>
              </section>

              {/* Problemas que resolvemos (Existing Section Integrated) */}
              <section className="bg-dark-900/50 p-8 rounded-3xl border border-dark-800">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <Zap className="text-accent-500" />
                  ¿Qué incluye un desarrollo web profesional?
                </h2>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  <FeatureListItem text="Arquitectura web escalable y modular" />
                  <FeatureListItem text="Diseño web responsive para negocios" />
                  <FeatureListItem text="Optimización técnica (Performance)" />
                  <FeatureListItem text="SEO On-Page para Google" />
                  <FeatureListItem text="Tienda online para pymes (eCommerce) - Opcional" />
                  <FeatureListItem text="Código limpio y optimizado con IA" />
                  <FeatureListItem text="Automatización de recepción de consultas" />
                  <FeatureListItem text="Velocidad de carga relámpago (optimizada para Core Web Vitals)" />
                </div>
              </section>

              {/* Sección Precios */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-green-500" />
                  Precios orientativos en Madrid para pymes y autónomos
                </h2>
                <p className="text-dark-400 mb-8 italic text-sm">
                  *Nota: Estos precios son una base y varían según las
                  funcionalidades específicas de cada proyecto de{' '}
                  <strong>páginas web para autónomos Madrid</strong>.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <PriceCard
                    level="Web Esencial"
                    price="700€"
                    bestFor="La tarjeta digital perfecta para arrancar tu presencia local en Google."
                  />
                  <PriceCard
                    level="Web Profesional"
                    price="1.400€"
                    bestFor="La máquina de captar clientes para tu negocio local. Optimizada para posicionar en tu sector y convertir visitas en clientes."
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
                <h2 className="text-3xl font-bold text-white mb-6">
                  Cómo elegir un proveedor de desarrollo web en Madrid
                </h2>
                <div className="prose prose-invert max-w-none text-dark-400">
                  <p>
                    Para un <strong>diseño web Madrid pymes</strong> exitoso
                    debes fijarte en la transparencia, el portfolio real y el
                    enfoque en ventas. Por eso trabajo siempre con{' '}
                    <strong>
                      contratos claros y presupuestos cerrados
                    </strong>, eliminando sorpresas o "letras pequeñas". Además, la
                    proximidad en zonas como Rivas, Coslada o San Fernando
                    permite una mejor comunicación y confianza mutua.
                  </p>
                </div>
              </section>

              {/* Sección ¿Quién está detrás? */}
              <section className="bg-gradient-to-br from-primary-500/5 to-accent-500/5 p-8 rounded-3xl border border-dark-800">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-24 h-24 rounded-2xl bg-dark-800 flex items-center justify-center border border-primary-500/30 shadow-glow shrink-0">
                    <User className="w-12 h-12 text-primary-500" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">
                      ¿Quién está detrás de ZeroCode?
                    </h2>
                    <p className="text-dark-400 text-lg leading-relaxed">
                      Hola, soy <strong>David</strong>, arquitecto web freelance.
                      Vivo y trabajo en <strong>Madrid (Rivas)</strong>, lo que me
                      permite ofrecerte un trato directo y cercano que ninguna
                      agencia impersonal puede igualar. Mi objetivo no es solo
                      hacerte una web, sino que tu tecnología trabaje para traerte
                      más clientes cada día.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-dark-300">
                      <span className="flex items-center gap-2 italic">
                        <CheckCircle className="w-4 h-4 text-primary-500" />{' '}
                        Trato directo
                      </span>
                      <span className="flex items-center gap-2 italic">
                        <CheckCircle className="w-4 h-4 text-primary-500" />{' '}
                        Enfoque en negocio
                      </span>
                      <span className="flex items-center gap-2 italic">
                        <CheckCircle className="w-4 h-4 text-primary-500" />{' '}
                        Soporte continuo
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección Casos de Éxito */}
              <section className="border-t border-dark-800 pt-16">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <CheckCircle className="text-green-500" />
                  Casos de éxito y testimonios locales en Madrid
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  <TestimonialCard
                    name="Caso tipo: Cafetería"
                    location="Rivas Vaciamadrid"
                    text="ZeroCode entendió perfectamente lo que necesitábamos. Nuestra web ahora carga al instante y hemos notado un aumento claro en las reservas locales."
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
                <h2 className="text-3xl font-bold text-white mb-8 text-center sm:text-left">
                  Preguntas frecuentes (FAQ)
                </h2>
                <div className="space-y-6">
                  <FaqItem
                    q="¿Cuánto tarda en estar lista?"
                    a="Crear una página web para autónomos en Madrid suele tardar entre 2 y 4 semanas, dependiendo del contenido."
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
                  <div className="bg-gradient-to-br from-primary-600/20 to-accent-600/20 p-[18px] rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-3">
                      Estadísticas Clave
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-3xl font-bold text-primary-400">
                          88%
                        </span>
                        <p className="text-xs text-dark-300 mt-1">
                          de consumidores investigan online antes de comprar
                          localmente.
                        </p>
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-accent-400">
                          53%
                        </span>
                        <p className="text-xs text-dark-300 mt-1">
                          abandona una web que tarda más de 3 segundos en
                          cargar.
                        </p>
                      </div>
                    </div>
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
                  <div className="p-3 rounded-xl border border-dark-700/50 bg-dark-800/30">
                    <h3 className="text-sm font-bold text-white mb-[6px] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent-400" />
                      Presencia en Madrid
                    </h3>
                    <p className="text-dark-400 text-xs">
                      Damos servicio en: Madrid Capital, Rivas Vaciamadrid, Coslada, San Fernando de Henares, Arganda del Rey, Pozuelo, Aravaca, Majadahonda, Las Rozas y alrededores (online para el
                      resto de España).
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function BenefitCard({ title, desc }: Readonly<{ title: string; desc: string }>) {
  return (
    <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 hover:border-primary-500/50 transition-all">
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-dark-400">{desc}</p>
    </div>
  );
}

function FeatureListItem({ text }: Readonly<{ text: string }>) {
  return (
    <li className="flex items-center gap-2 text-dark-300">
      <CheckCircle className="w-5 h-5 text-primary-500 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function PriceCard({
  level,
  price,
  bestFor,
}: Readonly<{
  level: string;
  price: string;
  bestFor: string;
}>) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
      <span className="text-xs text-primary-400 font-bold uppercase tracking-wider">
        {level}
      </span>
      <div className="text-3xl font-bold text-white my-2">{price}</div>
      <p className="text-sm text-dark-400">{bestFor}</p>
    </div>
  );
}

function FaqItem({ q, a }: Readonly<{ q: string; a: string }>) {
  return (
    <div className="p-6 rounded-2xl bg-dark-900 border border-dark-800">
      <h4 className="text-lg font-bold text-white mb-2">{q}</h4>
      <p className="text-dark-400 leading-relaxed text-sm">{a}</p>
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
    <div className="bg-dark-900/40 p-6 rounded-2xl border border-dark-800 relative">
      <div className="absolute top-4 right-6 text-primary-500/20 text-6xl font-serif">
        "
      </div>
      <p className="text-dark-300 italic mb-6 relative z-10">{text}</p>
      <div>
        <div className="text-xs text-dark-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary-500/70" /> {name}, {location} (Madrid)
        </div>
      </div>
    </div>
  );
}
