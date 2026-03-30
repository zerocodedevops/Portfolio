import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { Blog } from '@/components/sections/Blog';

export default function TechBlog() {
  return (
    <Layout>
      <Seo
        title="Laboratorio Técnico | ZeroCode"
        description="Reflexiones sobre desarrollo web, inteligencia artificial e ingeniería de software."
      />

      <div className="pt-32 pb-40">
        <Blog type="tech" />
      </div>
    </Layout>
  );
}
