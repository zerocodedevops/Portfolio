import { Layout } from '@/components/layout';
import { Hero, About, Skills, Projects, FeaturedProject, Blog, Contact } from '@/components/sections';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <FeaturedProject />
      <Projects />
      <Blog />
      <Contact />
    </Layout>
  );
}
