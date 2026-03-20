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
  return (
    <Layout>
      <Seo title="Home" description="AI-First Developer Portfolio" />
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
