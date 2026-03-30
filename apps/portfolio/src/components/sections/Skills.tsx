import { motion } from 'framer-motion';
import {
  Bot,
  Brain,
  Cloud,
  Code2,
  FileCode2,
  GitBranch,
  Palette,
  Server,
  Smartphone,
  Terminal,
  TestTube,
  Wrench,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';

interface Skill {
  name: string;
  nameKey?: string;
  icon: React.ReactNode;
  level: number;
}

interface SkillCategory {
  key: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

// Radar Chart Data
const radarData = [
  { subject: 'Frontend', A: 95, fullMark: 100 },
  { subject: 'Backend', A: 80, fullMark: 100 },
  { subject: 'Testing', A: 85, fullMark: 100 },
  { subject: 'DevOps', A: 80, fullMark: 100 },
  { subject: 'AI Tools', A: 95, fullMark: 100 },
  { subject: 'Soft Skills', A: 95, fullMark: 100 },
];

const softSkills = [
  { name: 'Aprendizaje Autónomo', level: 100 },
  { name: 'Resolución de Problemas', level: 100 },
  { name: 'Comunicación', level: 95 },
  { name: 'Adaptabilidad', level: 95 },
  { name: 'Pensamiento Crítico', level: 90 },
  { name: 'Trabajo en Equipo', level: 90 },
];

const skillCategoriesData: SkillCategory[] = [
  {
    key: 'frontend',
    icon: <Code2 className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-500',
    skills: [
      { name: 'React', icon: <FileCode2 className="w-4 h-4" />, level: 95 },
      {
        name: 'TypeScript',
        icon: <FileCode2 className="w-4 h-4" />,
        level: 90,
      },
      {
        name: 'Tailwind CSS',
        icon: <Palette className="w-4 h-4" />,
        level: 95,
      },
      { name: 'Vite', icon: <Zap className="w-4 h-4" />, level: 85 },
      {
        name: 'React Hook Form',
        icon: <FileCode2 className="w-4 h-4" />,
        level: 80,
      },
    ],
  },
  {
    key: 'backend',
    icon: <Server className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Firebase', icon: <Cloud className="w-4 h-4" />, level: 95 },
      { name: 'Supabase', icon: <Server className="w-4 h-4" />, level: 70 },
      { name: 'Node.js', icon: <Terminal className="w-4 h-4" />, level: 75 },
      { name: 'FastAPI', icon: <Terminal className="w-4 h-4" />, level: 70 },
      { name: 'MongoDB', icon: <Server className="w-4 h-4" />, level: 65 },
    ],
  },
  {
    key: 'testing',
    icon: <TestTube className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Vitest', icon: <TestTube className="w-4 h-4" />, level: 85 },
      { name: 'Playwright', icon: <TestTube className="w-4 h-4" />, level: 80 },
      {
        name: 'Testing Library',
        icon: <TestTube className="w-4 h-4" />,
        level: 85,
      },
      { name: 'ESLint', icon: <FileCode2 className="w-4 h-4" />, level: 90 },
      { name: 'Prettier', icon: <FileCode2 className="w-4 h-4" />, level: 85 },
    ],
  },
  {
    key: 'devops',
    icon: <Wrench className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Git', icon: <GitBranch className="w-4 h-4" />, level: 95 },
      { name: 'GitHub Actions', icon: <Zap className="w-4 h-4" />, level: 85 },
      {
        name: 'Firebase CLI',
        icon: <Terminal className="w-4 h-4" />,
        level: 90,
      },
      {
        name: 'PWA/Workbox',
        icon: <Smartphone className="w-4 h-4" />,
        level: 80,
      },
      { name: 'Docker', icon: <Server className="w-4 h-4" />, level: 60 },
    ],
  },
];

// Helper to get label key based on level
const getSkillLabelKey = (level: number) => {
  if (level >= 90) return 'skills.levels.expert';
  if (level >= 80) return 'skills.levels.advanced';
  if (level >= 70) return 'skills.levels.proficient';
  return 'skills.levels.competent';
};

// Helper to get badge class based on level
const getSkillBadgeClass = (level: number) => {
  if (level >= 90)
    return 'bg-primary-500/10 border-primary-500/20 text-primary-400';
  if (level >= 80) return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  return 'bg-dark-700/50 border-dark-700 text-dark-400';
};

// Fixed SkillBar to accept color again
function SkillBarWithColor({
  skill,
  color,
}: {
  readonly skill: Skill;
  readonly color: string;
}) {
  const { t } = useTranslation();
  const displayName = skill.nameKey
    ? t(`skills.categories.soft.items.${skill.nameKey}`)
    : skill.name;

  const labelKey = getSkillLabelKey(skill.level);
  const badgeClass = getSkillBadgeClass(skill.level);

  return (
    <motion.div className="group" variants={fadeInUp}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-dark-400 group-hover:text-primary-400 transition-colors p-1.5 bg-dark-800/50 rounded-lg">
            {skill.icon}
          </span>
          <span className="text-dark-200 text-sm font-medium">
            {displayName}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-md font-medium border ${badgeClass}`}
        >
          {t(labelKey)}
        </span>
      </div>
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
}

function SkillCard({ category }: { readonly category: SkillCategory }) {
  const { t } = useTranslation();

  return (
    <motion.div className="card card-hover p-6" variants={fadeInUp}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
        >
          {category.icon}
        </div>
        <div>
          <h3 className="heading-3 text-dark-100">
            {t(`skills.categories.${category.key}.title`)}
          </h3>
          <p className="text-dark-400 text-xs font-medium tracking-wide uppercase">
            {t(`skills.categories.${category.key}.description`)}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {category.skills.map((skill) => (
          <SkillBarWithColor
            key={skill.name}
            skill={skill}
            color={category.color}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills" className="section relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800/50 via-dark-950 to-dark-950" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            {t('skills.title')}
          </h2>
          <p className="text-xl text-dark-300 font-medium mb-8">
            {t('skills.subtitle')}
          </p>

          <motion.div
            className="inline-flex justify-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-dark-800/80 border border-primary-500/30 text-primary-400 shadow-lg shadow-primary-500/10 backdrop-blur-sm transition-all hover:scale-105">
              <Bot className="w-5 h-5" />
              <span className="font-medium tracking-wide">
                {t('skills.aiBadge')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Business Value Section */}
        <motion.div 
          className="max-w-4xl mx-auto bg-dark-900/40 border border-dark-800 rounded-3xl p-8 mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Velocidad Extrema</h3>
              <p className="text-dark-400 text-sm">Carga rápida para no perder clientes impacientes y mejorar la experiencia de usuario.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Estabilidad Total</h3>
              <p className="text-dark-400 text-sm">Tu web no se caerá en los peores momentos. Arquitectura sólida a prueba de picos de tráfico.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">SEO Integrado</h3>
              <p className="text-dark-400 text-sm">Desarrollo limpio desde las bases para que Google entienda y priorice tu negocio local.</p>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Accordion wrapper */}
        <details className="group max-w-5xl mx-auto">
          <summary className="flex items-center justify-between cursor-pointer list-none p-6 rounded-2xl bg-dark-900 border border-dark-800 hover:border-dark-700 transition-colors mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Code2 className="w-6 h-6 text-dark-400" />
              Para Techies / CTOs curiosos
            </h3>
            <span className="text-primary-500 font-bold group-open:rotate-180 transition-transform duration-300">▼</span>
          </summary>
          
          <div className="pt-4">

        {/* Top Section: Radar & Soft Skills */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Radar Chart */}
          <motion.div
            className="bg-dark-900/50 border border-dark-700/50 rounded-3xl p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 to-transparent opacity-50" />
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={radarData}
                >
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="#06b6d4"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#f1f5f9',
                    }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            className="bg-dark-900/50 border border-dark-700/50 rounded-3xl p-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-outfit">
                  Soft Skills
                </h3>
                <p className="text-dark-400">Habilidades que me diferencian</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
              {softSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-200 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-amber-500 font-bold">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Technical Skills Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skillCategoriesData.map((category) => (
            <SkillCard key={category.key} category={category} />
          ))}
        </motion.div>
        
        </div>
        </details>
      </div>
    </section>
  );
}
