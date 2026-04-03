import { lazy, Suspense, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Seo } from '@/components/common/SEO';
import { Hero } from '@/components/sections/Hero';
import { staggerContainer } from '@/hooks/useScrollAnimation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useUserInteraction } from '@/hooks/useUserInteraction';

const About = lazy(() => import('@/components/sections/About').then((m) => ({ default: m.About })));
const Blog = lazy(() => import('@/components/sections/Blog').then((m) => ({ default: m.Blog })));
const Contact = lazy(() => import('@/components/sections/Contact').then((m) => ({ default: m.Contact })));
const Projects = lazy(() => import('@/components/sections/Projects').then((m) => ({ default: m.Projects })));
const Skills = lazy(() => import('@/components/sections/Skills').then((m) => ({ default: m.Skills })));

export default function Home() {
  const { pathname, hash } = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const hasInteracted = useUserInteraction();
  const [showAnimations, setShowAnimations] = useState(isDesktop);

  useEffect(() => {
    if (!isDesktop) {
      const runAnimations = () => setShowAnimations(true);
      if ('requestIdleCallback' in globalThis) {
        const id = (globalThis as any).requestIdleCallback(runAnimations);
        return () => (globalThis as any).cancelIdleCallback(id);
      } else {
        const id = globalThis.setTimeout(runAnimations, 100);
        return () => globalThis.clearTimeout(id);
      }
    }
  }, [isDesktop]);

  useEffect(() => {
    // Scroll to top on root path change, or to section if hash exists
    if (hash) {
      globalThis.setTimeout(() => {
        globalThis.document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  const mobileInitial = showAnimations ? "hidden" : "visible";
  const initialVariant = isDesktop ? "hidden" : mobileInitial;

  return (
    <Layout>
      <Seo 
        title="Diseñador Web Freelance en Madrid | Páginas para Pymes" 
        description="Ayudo a pymes y autónomos en Madrid a conseguir más clientes mediante páginas web rápidas, optimizadas para Google y orientadas a ventas." 
      />
      <motion.div
        variants={staggerContainer}
        initial={initialVariant}
        animate="visible"
        viewport={{ once: true }}
      >
        <Hero />
        {(isDesktop || hasInteracted) && (
          <Suspense fallback={null}>
            <About />
            <Skills />
            <Projects />
            <Blog />
            <Contact />
          </Suspense>
        )}
      </motion.div>
    </Layout>
  );
}
