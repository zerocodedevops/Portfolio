import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Seo } from '@/components/common/SEO';
import { About } from '@/components/sections/About';
import { Blog } from '@/components/sections/Blog';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { staggerContainer } from '@/hooks/useScrollAnimation';

export default function Home() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Logic to scroll to sections based on SEO paths
    if (pathname === '/desarrollo-web-pymes-madrid') {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/disenador-web-freelance-madrid') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/precios-paginas-web') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/') {
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <Layout>
      <Seo 
        title="Diseño y Desarrollo de Productos Digitales (SaaS & Web Apps)" 
        description="David G. - AI-First Fullstack Developer especializado en la creación de productos digitales de alta calidad a velocidad extrema usando Inteligencia Artificial." 
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
      >
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Blog />
        <Contact />
      </motion.div>
    </Layout>
  );
}
