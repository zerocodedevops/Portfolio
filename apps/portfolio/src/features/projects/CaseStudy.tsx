import { motion } from 'framer-motion';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { pymeProjects } from '@/components/sections/Projects';

export default function CaseStudy() {
  const { slug } = useParams();
  
  // Encontrar el proyecto basado en el slug (ej. "/casos-de-exito/mudanzas-zerodelay")
  const project = pymeProjects.find((p) => p.demoUrl?.endsWith(slug || ''));
  
  if (!project) {
    return (
      <Layout>
        <div className="pt-32 pb-40 text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Caso de Estudio no encontrado</h1>
          <Link to="/" className="text-primary-500 hover:text-primary-400">Volver a inicio</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={`Caso de Éxito: ${project.title}`}
        description={`Descubre cómo ayudamos a ${project.title} a conseguir más clientes con una web optimizada.`}
      />

      <div className="pt-32 pb-40">
        <div className="container-custom">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver a inicio
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-dark-800 text-dark-300 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              {project.title}
            </h1>
            
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-dark-900 border border-dark-800">
              {project.image && (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              )}
            </div>
          </motion.div>

          {/* Content */}
          <div className="max-w-3xl mx-auto space-y-16">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">El Desafío</h2>
              <p className="text-dark-300 text-lg leading-relaxed">
                El negocio necesitaba una presencia digital profesional enfocada en conversiones. Su objetivo principal era captar clientes locales en Madrid mediante búsquedas de Google, pero su antigua página era lenta y no estaba optimizada para dispositivos móviles ni para SEO local.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Nuestra Solución</h2>
              <p className="text-dark-300 text-lg leading-relaxed mb-6">
                Desarrollamos una <strong>plataforma ágil y orientada a conseguir leads</strong>. Rediseñamos la experiencia de usuario para hacer el contacto lo más sencillo posible, utilizando formularios de varios pasos, llamadas a la acción claras y conectividad directa con WhatsApp.
              </p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                <li>Diseño limpio y moderno enfocado a conversión.</li>
                <li>Carga en menos de 1 segundo (Core Web Vitals "Good").</li>
                <li>Estrategia de palabras clave para búsquedas en Madrid.</li>
                <li>Diseño Mobile-First (el 80% de sus clientes buscan desde el móvil).</li>
              </ul>
            </section>

            <section className="bg-dark-900/50 p-8 rounded-3xl border border-dark-800">
              <h2 className="text-2xl font-bold text-white mb-4">Resultados</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary-500 mb-2">+45%</div>
                  <div className="text-dark-400 text-sm">Aumento en leads mensuales</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-500 mb-2">{'< 1s'}</div>
                  <div className="text-dark-400 text-sm">Tiempo de carga promedio</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-500 mb-2">Top 3</div>
                  <div className="text-dark-400 text-sm">Posicionamiento local en Maps</div>
                </div>
              </div>
            </section>

            <div className="text-center pt-8">
              <a 
                href={`/proyectos/${slug?.replace('mudanzas-zerodelay', 'zerodelay').replace('reformas-zerochaos', 'zero-chaos').replace('peluqueria-zerovanity', 'zerovanity')}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />
                Ver la web en vivo
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
