import { motion } from 'framer-motion';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { pymeProjects } from '@/components/sections/Projects';

const caseDetails: Record<string, { title: string; description: string; need: string; approach: string; features: string[] }> = {
  'reformas-zerochaos': {
    title: 'Web para ZeroChaos, demo de reformas | ZeroCode',
    description: 'Explora el proyecto ZeroChaos, una demo web para servicios de reformas creada por ZeroCode.',
    need: 'Presentar servicios de reformas integrales y explicar cómo pedir un presupuesto.',
    approach: 'La demo organiza las especialidades y el proceso de trabajo para que una persona pueda entender la propuesta y solicitar información.',
    features: ['Secciones para distintos tipos de reforma', 'Explicación del proceso de trabajo', 'Formulario para solicitar presupuesto'],
  },
  'mudanzas-zerodelay': {
    title: 'Web para ZeroDelay, demo de mudanzas | ZeroCode',
    description: 'Explora el proyecto ZeroDelay, una demo web para servicios de mudanzas creada por ZeroCode.',
    need: 'Reunir información sobre los servicios de mudanza y facilitar la solicitud de presupuesto.',
    approach: 'La demo presenta los servicios y guía a la persona hacia el formulario de contacto y presupuesto.',
    features: ['Información sobre servicios de mudanza', 'Contenido adaptado a móviles', 'Solicitud de presupuesto en varios pasos'],
  },
};

export default function CaseStudy() {
  const { slug } = useParams();
  
  // Encontrar el proyecto basado en el slug (ej. "/casos-de-exito/mudanzas-zerodelay")
  const project = pymeProjects.find((p) => p.demoUrl?.endsWith(slug || ''));
  const details = caseDetails[slug || ''];
  
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
        title={details?.title ?? `Proyecto web: ${project.title} | ZeroCode`}
        description={details?.description ?? `Conoce el proyecto web de ${project.title}.`}
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
            {(project.isDemo || details) && (
              <div className="mb-8 space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-amber-100">
                <p>Demo de portfolio.</p>
                <p>Muestra una propuesta de diseño y no representa resultados comerciales de un cliente.</p>
              </div>
            )}
            
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-dark-900 border border-dark-800">
              {project.image && (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              )}
            </div>
          </motion.div>

          {/* Content */}
          <div className="max-w-3xl mx-auto space-y-16">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Necesidad que aborda</h2>
              <p className="text-dark-300 text-lg leading-relaxed">{details?.need ?? `Este proyecto presenta una propuesta web para ${project.title}.`}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Enfoque del proyecto</h2>
              <p className="text-dark-300 text-lg leading-relaxed mb-6">{details?.approach ?? 'La página muestra una estructura web para presentar el proyecto y facilitar el contacto.'}</p>
              <ul className="list-disc list-inside text-dark-300 space-y-2">
                {(details?.features ?? ['Presentación clara de la propuesta.', 'Navegación adaptada a móviles.', 'Acceso visible a la información de contacto.']).map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>

            <section className="bg-dark-900/50 p-8 rounded-3xl border border-dark-800">
              <h2 className="text-2xl font-bold text-white mb-4">Resultados</h2>
              <p className="text-dark-300 text-lg leading-relaxed">
                No se publican métricas de rendimiento ni resultados comerciales sin datos verificables del proyecto.
              </p>
            </section>

            <div className="text-center pt-8">
              <a 
                href={`/proyectos/${slug?.replace('mudanzas-zerodelay', 'zerodelay').replace('reformas-zerochaos', 'zero-chaos').replace('peluqueria-zerovanity', 'zerovanity')}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />
                {details ? 'Ver la demo' : 'Ver la web en vivo'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
