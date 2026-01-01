import { Layout } from '@/components/layout';
import { Hero, About, Skills, Projects, FeaturedProject, Contact } from '@/components/sections';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <FeaturedProject />
      <Projects />
      <Contact />
    </Layout>
  );
}
