import { motion } from 'framer-motion';
import { 
  Code2, 
  Server, 
  TestTube,
  Wrench,
  Smartphone,
  FileCode2,
  Cloud,
  Palette,
  GitBranch,
  Terminal,
  Zap,
  Bot,
  Brain,
  MessageSquare,
  Puzzle,
  Search
} from 'lucide-react';
import { SectionTitle } from '@/components/ui';
import { fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';

interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number; // 0-100
}

interface SkillCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    description: 'Interfaces modernas y reactivas',
    icon: <Code2 className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-500',
    skills: [
      { name: 'React', icon: <FileCode2 className="w-4 h-4" />, level: 95 },
      { name: 'TypeScript', icon: <FileCode2 className="w-4 h-4" />, level: 90 },
      { name: 'Tailwind CSS', icon: <Palette className="w-4 h-4" />, level: 95 },
      { name: 'Vite', icon: <Zap className="w-4 h-4" />, level: 85 },
      { name: 'React Hook Form', icon: <FileCode2 className="w-4 h-4" />, level: 80 },
    ],
  },
  {
    title: 'Backend & BaaS',
    description: 'Firebase y Supabase como pilares',
    icon: <Server className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Firebase', icon: <Cloud className="w-4 h-4" />, level: 95 },
      { name: 'Supabase', icon: <Server className="w-4 h-4" />, level: 70 },
      { name: 'Node.js', icon: <Terminal className="w-4 h-4" />, level: 75 },
      { name: 'Deno', icon: <Terminal className="w-4 h-4" />, level: 60 },
      { name: 'Upstash Redis', icon: <Server className="w-4 h-4" />, level: 65 },
    ],
  },
  {
    title: 'Testing & QA',
    description: 'Calidad asegurada en cada commit',
    icon: <TestTube className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Vitest', icon: <TestTube className="w-4 h-4" />, level: 85 },
      { name: 'Playwright', icon: <TestTube className="w-4 h-4" />, level: 80 },
      { name: 'Testing Library', icon: <TestTube className="w-4 h-4" />, level: 85 },
      { name: 'ESLint', icon: <FileCode2 className="w-4 h-4" />, level: 90 },
      { name: 'Prettier', icon: <FileCode2 className="w-4 h-4" />, level: 85 },
    ],
  },
  {
    title: 'DevOps & Mobile',
    description: 'CI/CD y apps multiplataforma',
    icon: <Wrench className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Git', icon: <GitBranch className="w-4 h-4" />, level: 95 },
      { name: 'GitHub Actions', icon: <Zap className="w-4 h-4" />, level: 85 },
      { name: 'Firebase CLI', icon: <Terminal className="w-4 h-4" />, level: 90 },
      { name: 'Capacitor', icon: <Smartphone className="w-4 h-4" />, level: 75 },
      { name: 'PWA/Workbox', icon: <Smartphone className="w-4 h-4" />, level: 80 },
    ],
  },
  {
    title: 'Soft Skills',
    description: 'Habilidades humanas y mentalidad',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-amber-500 to-yellow-500',
    skills: [
      { name: 'Aprendizaje Autónomo', icon: <Search className="w-4 h-4" />, level: 100 },
      { name: 'Resolución de Problemas', icon: <Puzzle className="w-4 h-4" />, level: 100 },
      { name: 'Comunicación', icon: <MessageSquare className="w-4 h-4" />, level: 95 },
      { name: 'Adaptabilidad', icon: <Zap className="w-4 h-4" />, level: 95 },
      { name: 'Pensamiento Crítico', icon: <Brain className="w-4 h-4" />, level: 90 },
    ],
  },
];

function SkillBar({ skill, color }: { readonly skill: Skill; readonly color: string }) {
  return (
    <motion.div
      className="group"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-dark-400 group-hover:text-primary-400 transition-colors">
            {skill.icon}
          </span>
          <span className="text-dark-200 text-sm font-medium">{skill.name}</span>
        </div>
        <span className="text-dark-500 text-xs">{skill.level}%</span>
      </div>
      <div className="h-2 bg-dark-700/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
}

function SkillCard({ category }: { readonly category: SkillCategory }) {
  return (
    <motion.div
      className="card card-hover p-6"
      variants={fadeInUp}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
          {category.icon}
        </div>
        <div>
          <h3 className="heading-3 text-dark-100">{category.title}</h3>
          <p className="text-dark-500 text-xs">{category.description}</p>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        {category.skills.map((skill) => (
          <SkillBar key={skill.name} skill={skill} color={category.color} />
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary-500/5 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Skills & Tecnologías"
          subtitle="Stack real usado en proyectos"
        />

        {/* AI Badge */}
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm">
            <Bot className="w-4 h-4" />
            <span>Desarrollo asistido por Inteligencia Artificial</span>
          </div>
        </motion.div>

        {/* Percentage Note */}
        <motion.p 
          className="text-center text-dark-400 text-sm max-w-2xl mx-auto mb-8 italic"
          variants={fadeInUp}
        >
          * Los porcentajes reflejan mi <span className="text-primary-400 font-medium">nivel de autonomía</span> usando cada tecnología en proyectos reales.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skillCategories.map((category) => (
            <SkillCard key={category.title} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
