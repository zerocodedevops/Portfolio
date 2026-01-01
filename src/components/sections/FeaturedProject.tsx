import { motion } from 'framer-motion';
import { ExternalLink, Star, Zap, Users, FileCode, GitCommit, Database, Bot } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-deprecated
import { Github as GithubIcon } from 'lucide-react';
import { Button, TechBadge, SectionTitle } from '@/components/ui';
import { fadeInUp, slideInLeft, slideInRight } from '@/hooks/useScrollAnimation';

const featuredProject = {
  title: 'Sistema de Gestión de Limpieza de Comunidades',
  subtitle: 'Proyecto Destacado',
  description: `Aplicación web empresarial desarrollada para J. Barranco Limpieza, 
una empresa de servicios de limpieza de comunidades en Madrid. El sistema gestiona 
integralmente empleados, clientes, rutas de trabajo, facturación automática, control 
de inventario y comunicación en tiempo real. Incluye tres portales diferenciados: 
administrador, empleado y cliente, cada uno con funcionalidades específicas y 
autenticación por roles.`,
  features: [
    'Dashboard con métricas en tiempo real y gráficos de facturación',
    'Gestión de 51 clientes y empleados con autenticación por roles',
    'Calendario interactivo con planificación de rutas y tareas',
    'Sistema de quejas, solicitudes y observaciones en tiempo real',
    'Generación automática de PDFs (facturas, partes de trabajo)',
    'App móvil Android con Capacitor + soporte offline (PWA)',
  ],
  stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Firebase', 'Supabase', 'Capacitor'],
  stats: {
    lines: '31K+',
    files: '222',
    components: '151',
    commits: '100+',
  },
  demoUrl: 'https://j-barranco.web.app',
  repoUrl: 'https://github.com/zerocodedevops',
};

export function FeaturedProject() {
  return (
    <section className="section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent-500/10 to-transparent blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Proyecto Destacado"
          subtitle="Aplicación empresarial real en producción"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual side - Code Preview */}
          <motion.div
            className="relative"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl" />
              
              {/* Main frame */}
              <div className="relative bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6 overflow-hidden">
                {/* Window controls */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-dark-500 text-sm font-mono">useDashboardStats.ts</span>
                </div>
                
                {/* Code preview */}
                <div className="font-mono text-xs sm:text-sm space-y-1 overflow-x-auto">
                  <div className="text-dark-500">// Hook real del proyecto</div>
                  <div>
                    <span className="text-purple-400">import</span>
                    <span className="text-dark-300"> {'{ '}</span>
                    <span className="text-primary-400">useEffect, useState</span>
                    <span className="text-dark-300"> {'}'} </span>
                    <span className="text-purple-400">from</span>
                    <span className="text-green-400"> "react"</span>
                  </div>
                  <div>
                    <span className="text-purple-400">import</span>
                    <span className="text-dark-300"> {'{ '}</span>
                    <span className="text-primary-400">onSnapshot</span>
                    <span className="text-dark-300"> {'}'} </span>
                    <span className="text-purple-400">from</span>
                    <span className="text-green-400"> "firebase/firestore"</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-purple-400">export function</span>
                    <span className="text-yellow-400"> useDashboardStats</span>
                    <span className="text-dark-300">() {'{'}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">const</span>
                    <span className="text-dark-300"> [stats, setStats] = </span>
                    <span className="text-yellow-400">useState</span>
                    <span className="text-dark-300">({'{'}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-primary-400">quejasPendientes</span>
                    <span className="text-dark-300">: 0,</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-primary-400">solicitudesExtra</span>
                    <span className="text-dark-300">: 0,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-dark-300">{'})'}</span>
                  </div>
                  
                  {/* AI Tooltip */}
                  <div className="mt-3 p-3 bg-accent-500/10 border border-accent-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-accent-400">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-medium">Sugerencia IA</span>
                    </div>
                    <p className="text-dark-400 text-xs mt-1">
                      Considera usar React.memo() para optimizar el renderizado...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              {featuredProject.subtitle}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-4">
              {featuredProject.title}
            </h3>

            <p className="text-dark-400 text-sm sm:text-base mb-6 leading-relaxed">
              {featuredProject.description}
            </p>

            {/* Features list */}
            <ul className="space-y-2 mb-6">
              {featuredProject.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-dark-300 text-sm"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            {/* Tech stack */}
            <div className="mb-6">
              <p className="text-dark-500 text-sm mb-3">Stack tecnológico:</p>
              <div className="flex flex-wrap gap-2">
                {featuredProject.stack.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-dark-800/30 rounded-xl border border-dark-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-primary-400">
                  <FileCode className="w-4 h-4" />
                  {featuredProject.stats.lines}
                </div>
                <div className="text-dark-500 text-xs">Líneas</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent-400">{featuredProject.stats.files}</div>
                <div className="text-dark-500 text-xs">Archivos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-400">
                  <Users className="w-4 h-4" />
                  {featuredProject.stats.components}
                </div>
                <div className="text-dark-500 text-xs">Componentes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-orange-400">
                  <GitCommit className="w-4 h-4" />
                  {featuredProject.stats.commits}
                </div>
                <div className="text-dark-500 text-xs">Commits</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                leftIcon={<ExternalLink className="w-5 h-5" />}
                onClick={() => window.open(featuredProject.demoUrl, '_blank')}
              >
                Ver Demo
              </Button>
              <Button
                variant="outline"
                leftIcon={<GithubIcon className="w-5 h-5" />}
                onClick={() => window.open(featuredProject.repoUrl, '_blank')}
              >
                Ver Código
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
