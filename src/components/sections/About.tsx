import { motion } from 'framer-motion';
import { Code2, Rocket, Lightbulb, Heart } from 'lucide-react';
import { SectionTitle } from '@/components/ui';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/hooks/useScrollAnimation';

const highlights = [
  {
    icon: Heart,
    title: 'Pasión',
    description: 'Entusiasta al 200%',
  },
  {
    icon: Lightbulb,
    title: 'IA como aliada',
    description: 'Desarrollo asistido por IA',
  },
  {
    icon: Rocket,
    title: 'Autodidacta',
    description: 'Aprendizaje continuo',
  },
  {
    icon: Code2,
    title: 'Compromiso',
    description: 'Involucrado en cada detalle',
  },
];

export function About() {
  return (
    <section id="about" className="section relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent-500/5 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Sobre mí"
          subtitle="Un enfoque diferente al desarrollo"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual side */}
          <motion.div
            className="relative"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl rotate-6 blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-3xl -rotate-3" />
              
              {/* Main content area */}
              <div className="relative bg-dark-800/50 backdrop-blur-xl rounded-3xl p-8 border border-dark-700/50 h-full flex items-center justify-center">
                <img 
                  src="/logo-zerocode.jpg" 
                  alt="ZeroCode DevOps - David G." 
                  className="w-full max-w-[384px] h-auto rounded-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="heading-3 text-dark-100 mb-4">
              Desarrollador autodidacta potenciado por IA
            </h3>
            
            <div className="space-y-4 text-dark-400">
              <p>
                Soy transparente: <span className="text-primary-400 font-medium">no tengo formación académica 
                específica ni experiencia laboral previa</span> en desarrollo de software. Lo que sí tengo 
                es una pasión desbordante por la tecnología y una mentalidad de aprendizaje continuo.
              </p>
              
              <p>
                Todo lo que construyo lo hago <span className="text-accent-400 font-medium">en colaboración 
                con herramientas de Inteligencia Artificial</span>. Veo la IA no como un atajo, sino como 
                un mentor incansable que me permite aprender mientras creo, cuestionando cada línea de 
                código y entendiendo el porqué de cada decisión.
              </p>
              
              <p>
                Mi verdadera fortaleza es el <span className="text-primary-400 font-medium">compromiso 
                absoluto</span> con cada proyecto. Me involucro al 200%, obsesionándome con los detalles 
                y no descansando hasta que el resultado supera las expectativas. Cada reto es una 
                oportunidad de aprendizaje, y cada error es un paso hacia la mejora.
              </p>
            </div>

            {/* Highlights grid */}
            <motion.div
              className="grid grid-cols-2 gap-4 mt-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {highlights.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/50 hover:border-primary-500/30 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-primary-400 mb-2" />
                  <div className="text-lg font-semibold text-dark-100">{item.title}</div>
                  <div className="text-sm text-dark-500">{item.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
