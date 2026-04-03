import React, { lazy, Suspense } from 'react';
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  Phone,
  BarChart3,
  ArrowDownRight,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PymesFaq = lazy(() => import('./PymesFaq'));
const PymesSidebar = lazy(() => import('./PymesSidebar'));

export default function PymesContent({
  handleCtaClick,
}: {
  readonly handleCtaClick: () => void;
}) {
  const navigate = useNavigate();

  return (
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

          {/* Problemas que resolvemos */}
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
                  'Todo lo included en la Web Esencial',
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
                  hacearte una web, sino que tu tecnología trabaje para traerte
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

          <Suspense fallback={<div className="h-64 animate-pulse bg-dark-900/50 rounded-3xl" />}>
            <PymesFaq />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-96 animate-pulse bg-dark-900/50 rounded-3xl" />}>
            <PymesSidebar />
          </Suspense>
        </div>
      </div>
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
