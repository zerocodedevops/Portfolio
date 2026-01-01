import { motion } from 'framer-motion';
import { ExternalLink, Github, Folder } from 'lucide-react';
import { SectionTitle, TechBadge, Card } from '@/components/ui';
import { fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';

interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Plataforma de comercio electrónico completa con carrito, pagos y panel de administración.',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/zerocodedevops',
  },
  {
    id: 2,
    title: 'AI Chat Assistant',
    description: 'Asistente de chat inteligente con integración de OpenAI y memoria contextual.',
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'Supabase'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/zerocodedevops',
  },
  {
    id: 3,
    title: 'Task Management App',
    description: 'Aplicación de gestión de tareas con colaboración en tiempo real y notificaciones.',
    tags: ['React', 'Firebase', 'Tailwind', 'Framer Motion'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/zerocodedevops',
  },
  {
    id: 4,
    title: 'Portfolio Dashboard',
    description: 'Dashboard analítico para visualizar métricas de portafolio de inversiones.',
    tags: ['React', 'TypeScript', 'Chart.js', 'Node.js'],
    repoUrl: 'https://github.com/zerocodedevops',
  },
  {
    id: 5,
    title: 'Weather App',
    description: 'Aplicación del clima con pronósticos detallados y mapas interactivos.',
    tags: ['React', 'TypeScript', 'API REST', 'Tailwind'],
    demoUrl: 'https://example.com',
  },
  {
    id: 6,
    title: 'Blog Platform',
    description: 'Plataforma de blog con CMS headless, markdown y optimización SEO.',
    tags: ['Next.js', 'MDX', 'Tailwind', 'Vercel'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/zerocodedevops',
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="h-full flex flex-col group">
        {/* Image placeholder */}
        <div className="aspect-video bg-gradient-to-br from-dark-700 to-dark-800 rounded-lg mb-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Folder className="w-12 h-12 text-dark-600 group-hover:text-primary-500/50 transition-colors duration-300" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="heading-3 text-dark-100 mb-2 group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-dark-400 text-sm mb-4 flex-1">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <TechBadge key={tag} tech={tag} />
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
                whileHover={{ x: 3 }}
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </motion.a>
            )}
            {project.repoUrl && (
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
                whileHover={{ x: 3 }}
              >
                <Github className="w-4 h-4" />
                Código
              </motion.a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-gradient-radial from-accent-500/5 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Proyectos"
          subtitle="Una selección de mis trabajos más recientes"
        />

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
