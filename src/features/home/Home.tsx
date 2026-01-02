import { Layout } from '@/components/layout';
import { Hero, About, Skills, Projects, FeaturedProject, Blog, Contact } from '@/components/sections';

export default function Home() {
  return (
    <Layout>
      <div id="main-content">
        <Hero />
        <About />
        <Skills />
        <FeaturedProject />
        <Projects />
        <Blog />
        <Contact />
      </div>
    </Layout>
  );
}
