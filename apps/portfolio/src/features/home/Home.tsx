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
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top on root path change, or to section if hash exists
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return (
    <Layout>
      <Seo 
        title="Diseñador Web Freelance en Madrid | Páginas para Pymes" 
        description="Ayudo a pymes y autónomos en Madrid a conseguir más clientes mediante páginas web rápidas, optimizadas para Google y orientadas a ventas." 
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
