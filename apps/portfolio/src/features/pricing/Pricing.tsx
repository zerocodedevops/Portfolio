import { motion } from 'framer-motion';
import { Building2, Check, Info, User } from 'lucide-react';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { PricingConfigurator } from './PricingConfigurator';

export default function Pricing() {
  return (
    <Layout>
      <Seo
        title="Precios de Diseño Web para Pymes | Madrid"
        description="Packs de páginas web para autónomos y pymes en Madrid. Funcionales, sin sorpresas y enfocadas a conseguir clientes. Presupuesto desde 700€."
        keywords="precios diseño web madrid, web pymes madrid, presupuesto autonomos web"
      />

      <div className="pt-16 pb-40">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tarifas y Packs:{' '}
              <span className="text-gradient">Transparencia Total</span>
            </h1>
            <p className="text-xl text-dark-400">
              Elige un pack base o configura tu presupuesto a medida según las
              secciones que necesite tu negocio.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-32 max-w-5xl mx-auto">
            <PricingCard
              icon={User}
              title="Web Esencial"
              price="700€"
              originalPrice="1.200€"
              description="La tarjeta de visita digital perfecta para arrancar tu presencia local con fuerza."
              features={[
                'Diseño de Inicio, Servicios y Contacto',
                'Botón directo a WhatsApp / Llamada',
                'Mapa de Google (SEO Local básico)',
                '100% Adaptada a Móviles',
                'Textos Legales y Cookies (RGPD)',
                'Dominio y Hosting rápido (1 año)',
                'Certificado de Seguridad (Candado SSL)',
              ]}
              ctaText="Me interesa esta opción"
            />
            <PricingCard
              icon={Building2}
              title="Web Profesional"
              price="1.400€"
              originalPrice="2.500€"
              featured={true}
              description="La máquina de captar clientes para tu negocio local. Optimizada para posicionar en Google en tu sector."
              features={[
                'Todo lo incluido en la Web Esencial',
                'Secciones extra: Equipo, Testimonios',
                'SEO On-Page Avanzado (Más visibilidad)',
                'Velocidad de carga relámpago (optimizada para Core Web Vitals)',
                'Cuentas de Email Profesional (@empresa.es)',
                'Soporte directo por teléfono (1 año)',
                'Cambios y actualizaciones incluidas (1 año)',
              ]}
              ctaText="Quiero esta web para captar clientes"
            />
          </div>

          {/* Bloque de inclusiones generales */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Todo lo que siempre está incluido</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl text-center">
                <Check className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">Trato Cercano Local</h4>
                <p className="text-sm text-dark-400">Si estás en Madrid, nos tomamos un café o llamamos directamente. Sin tickets ni esperas.</p>
              </div>
              <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl text-center">
                <Check className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">Formación Básica</h4>
                <p className="text-sm text-dark-400">Te enseño en un video cómo entrar a cambiar un texto o una foto tú mismo, sin depender de mí.</p>
              </div>
              <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl text-center">
                <Check className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">Mantenimiento Inicial</h4>
                <p className="text-sm text-dark-400">Pequeños cambios y ajustes técnicos cubiertos durante los primeros meses para tu total tranquilidad.</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-dark-900/30 border border-dark-800 p-10 rounded-3xl">
            <div className="flex gap-4 items-start mb-6">
              <Info className="w-8 h-8 text-primary-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  ¿Por qué no hago webs de 200€?
                </h2>
                <p className="text-dark-400 leading-relaxed mb-4">
                  Seguramente has visto ofertas que parecen increíbles. Sin
                  embargo, en el diseño web,{' '}
                  <strong>lo barato sale caro</strong>. Una web de bajo coste
                  suele ser una plantilla genérica que no carga bien, no está
                  optimizada para SEO y no genera confianza en tus clientes.
                </p>
                <p className="text-dark-400 leading-relaxed">
                  En ZeroCode dedicamos horas a cada proyecto para asegurar que
                  tu inversión sea rentable. No estás comprando "píxeles", estás
                  comprando una <strong>estrategia de negocio</strong>.
                  <br /><br />
                  <span className="text-xs opacity-70 italic">* Nota: El desarrollo de Tiendas Online (eCommerce) es un servicio opcional y se presupuesta de forma independiente según el catálogo de productos.</span>
                </p>
              </div>
            </div>
          </div>

          {/* New Interactive Configurator Section */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 italic">
                ¿Quieres un presupuesto a medida?
              </h2>
              <p className="text-dark-400">
                Selecciona exactamente lo que necesitas y obtén una estimación
                instantánea.
              </p>
            </div>
            <PricingConfigurator />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PricingCard({
  icon: Icon,
  title,
  price,
  originalPrice,
  description,
  features,
  featured = false,
  ctaText,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative p-8 rounded-3xl border ${featured ? 'border-primary-500 bg-primary-500/5 shadow-glow' : 'border-dark-800 bg-dark-950'} flex flex-col`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-sm font-bold rounded-full">
          Más popular
        </div>
      )}

      <div className="mb-6 p-4 rounded-2xl bg-dark-900 w-fit">
        <Icon className="w-8 h-8 text-primary-400" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-sm text-dark-500 line-through">
          {originalPrice}
        </span>
        <span className="text-4xl font-bold text-white">{price}</span>
      </div>
      <p className="text-dark-400 text-sm mb-8">{description}</p>

      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature: string) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-dark-300 text-sm"
          >
            <Check className="w-4 h-4 text-primary-500 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

        <button
          onClick={() => {
            const el = document.getElementById('contact');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              globalThis.location.href = '/#contact';
            }
          }}
          className={`w-full py-4 rounded-xl font-bold transition-all ${featured ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-dark-800 hover:bg-dark-700 text-white'}`}
        >
          {ctaText || 'Elegir este plan'}
        </button>
    </motion.div>
  );
}
