import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { articles } from '@/data/articles';

export default function BlogPost() {
  const { id } = useParams();
  
  // Hacer scroll automático hacia arriba al cargar el post
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Encontrar el artículo basado en el ID
  const article = articles.find((a) => a.id === Number(id));
  
  if (!article) {
    return (
      <Layout>
        <div className="pt-32 pb-40 text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-dark-400 mb-8">El artículo que buscas no existe o ha sido movido.</p>
          <Link to="/" className="text-primary-500 hover:text-primary-400 font-bold">
            Volver a inicio
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = article.icon;

  return (
    <Layout>
      <Seo
        title={`${article.title} | ZeroCode Blog`}
        description={article.excerpt}
      />

      <div className="pt-32 pb-40">
        <div className="container-custom">
          {/* Back button */}
          <Link 
            to={article.type === 'business' ? '/' : '/tech'} 
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-12 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver a {article.type === 'business' ? 'inicio' : 'Laboratorio técnico'}
          </Link>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {article.category}
              </span>
              <span className="text-dark-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="text-dark-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mt-8 mb-16 md:mt-14 md:mb-20 leading-tight">
              {article.title}
            </h1>
            
            <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-dark-900 border border-dark-800 relative group">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 p-4 rounded-2xl bg-dark-900/80 backdrop-blur-sm border border-white/10">
                <Icon className="w-8 h-8 text-primary-400" />
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <article className="max-w-[720px] mx-auto">
            <div 
              className="prose prose-invert prose-primary max-w-none font-sans text-[17px] md:text-[18px] leading-[1.8]
                prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
                prose-p:text-dark-300
                prose-strong:text-white prose-strong:font-semibold
                prose-a:text-primary-500 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-ul:text-dark-300 prose-li:marker:text-primary-500
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-dark-800 prose-h2:pb-4
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-blockquote:bg-primary-500/10 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:px-6 prose-blockquote:py-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-white prose-blockquote:font-medium prose-blockquote:my-10 prose-blockquote:shadow-sm"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* CTA / Footer of the article */}
            <div className="mt-24 p-8 md:p-12 rounded-3xl bg-dark-900 border border-dark-800 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10 tracking-tight">¿Necesitas ayuda con tu negocio local?</h3>
              <p className="text-dark-300 mb-8 max-w-xl mx-auto relative z-10 text-[17px]">
                En ZeroCode ayudamos a pymes de Madrid a conseguir más clientes mediante desarrollo web profesional y SEO local realista.
              </p>
              <div className="relative z-10 flex flex-col items-center">
                <Link
                  to={article.type === 'business' ? '/#contacto' : '/disenador-web-freelance-madrid'}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Hablemos de tu proyecto
                </Link>
                <span className="text-sm text-dark-400 mt-5 flex items-center gap-2 font-medium">
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span>Respuesta en menos de 24 h</span>
                </span>
              </div>
            </div>

            {/* Volver arriba y Mini CTA */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-dark-800/80">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-dark-400 text-sm font-medium">¿Tienes un proyecto en mente?</span>
                <Link 
                  to={article.type === 'business' ? '/#contacto' : '/disenador-web-freelance-madrid'}
                  className="text-primary-400 text-sm font-bold hover:text-primary-300 transition-colors"
                >
                  Solicita presupuesto sin compromiso →
                </Link>
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-dark-900 border border-dark-800 text-dark-300 hover:text-white hover:bg-dark-800 hover:border-dark-700 transition-all text-sm font-medium shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 rotate-90" />
                Volver arriba
              </button>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
}
