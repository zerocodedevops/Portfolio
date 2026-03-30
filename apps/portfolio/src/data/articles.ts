/* eslint-disable @typescript-eslint/no-deprecated */
import { Brain, Code2, Cpu } from 'lucide-react';
import blogAgents from '@/assets/blog/blog-agents.webp';
import blogAiFirst from '@/assets/blog/blog-ai-first.webp';
import blogFrontend from '@/assets/blog/blog-frontend.webp';

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  type: 'business' | 'tech';
  image: string;
  icon: React.ElementType;
  content: string; // HTML content
}

export const articles: Article[] = [
  {
    id: 1,
    title: 'Por qué "AI-First" no es solo un Buzzword',
    excerpt:
      'Cómo la inteligencia artificial está redefiniendo la arquitectura de software, desde el diseño hasta el despliegue.',
    date: 'Ene 2026',
    readTime: '5 min',
    category: 'Filosofía',
    type: 'tech',
    image: blogAiFirst,
    icon: Brain,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Vivimos en un <strong>punto de inflexión histórico</strong>. La programación tradicional, centrada obsesivamente en la sintaxis y la memorización de APIs, está dando paso a una nueva era inevitable: la <strong>Ingeniería AI-First</strong>.</p>

      <h2>El cambio de paradigma</h2>
      <p>Hasta hace poco, el valor de un desarrollador se medía casi exclusivamente por su capacidad para escribir código eficiente y sin errores de sintaxis en tiempo real. Hoy, con LLMs capaces de generar funciones complejas en milisegundos, el valor se desplaza radicalmente hacia la <strong>intención</strong>, la <strong>arquitectura de sistemas</strong> y la <strong>verificación rigurosa</strong>.</p>
    `,
  },
  {
    id: 2,
    title: 'Más allá de Copilot: Agentes Autónomos',
    excerpt:
      'La evolución de los asistentes de código hacia compañeros proactivos capaces de entender el contexto completo.',
    date: 'Dic 2025',
    readTime: '7 min',
    category: 'Tecnología',
    type: 'tech',
    image: blogAgents,
    icon: Cpu,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Github Copilot fue solo el comienzo, la punta del iceberg. El autocompletado inteligente es útil, sí, pero los <strong>Agentes Autónomos</strong> son la verdadera revolución que está por llegar a nuestros IDEs.</p>

      <h2>¿Qué es un Agente Autónomo en Desarrollo?</h2>
      <p>A diferencia de un sistema de autocompletado pasivo que espera a que escribas para sugerir la siguiente línea, un agente autónomo tiene características que lo hacen casi humano.</p>
    `,
  },
  {
    id: 3,
    title: 'El fin del "Boilerplate" en Frontend',
    excerpt:
      'Analizando cómo las nuevas herramientas de generación de UI están eliminando el trabajo repetitivo.',
    date: 'Nov 2025',
    readTime: '4 min',
    category: 'Desarrollo',
    type: 'tech',
    image: blogFrontend,
    icon: Code2,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">¿Cuántas veces has escrito el mismo componente de botón? ¿O la misma configuración de rutas en React Router? ¿O el mismo formulario de login? El <strong>"Boilerplate"</strong> (código repetitivo) ha sido la plaga que ha drenado la energía del desarrollo frontend durante años.</p>

      <h2>La era de la Generación Generativa de UI</h2>
      <p>Herramientas emergentes como <strong>v0.dev</strong> o <strong>Bolt.new</strong> nos permiten describir una interfaz en lenguaje natural y obtener el código React/Tailwind listo para producción en segundos.</p>
    `,
  },
  {
    id: 4,
    title: 'Por qué tu Pyme necesita algo más que Instagram',
    excerpt:
      'Descubre cómo una web profesional multiplica tus posibilidades de aparecer en Google Maps y generar confianza real en tus clientes.',
    date: 'Mar 2026',
    readTime: '4 min',
    category: 'Estrategia',
    type: 'business',
    image: blogAiFirst,
    icon: Brain,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Un perfil en redes sociales es un buen comienzo, pero <strong>no es tu casa, es un local alquilado</strong>. El algoritmo puede cambiar mañana y hundir tu visibilidad.</p>

      <h2>Controla tu Negocio</h2>
      <p>Una página web profesional trabaja para ti 24/7. Capta clientes locales en Google, da seguridad a quienes te buscan y te diferencia inmediatamente de los competidores que solo tienen un "link en bio".</p>
    `,
  },
  {
    id: 5,
    title: 'El Dominio Perfecto para tu Negocio en Madrid',
    excerpt:
      'Claves para elegir un nombre de dominio que ayude a tu posicionamiento local y sea fácil de recordar para tus clientes.',
    date: 'Mar 2026',
    readTime: '3 min',
    category: 'SEO Local',
    type: 'business',
    image: blogFrontend,
    icon: Code2,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Elegir el nombre de tu web es tan importante como elegir el local físico de tu negocio. Debe ser corto, fácil de pronunciar y relevante para tu sector en Madrid.</p>

      <h2>Consejos Rápidos</h2>
      <p>Prioriza el uso de palabras clave locales si tu negocio es puramente madrileño y busca siempre la extensión .com o .es si te diriges al público español.</p>
    `,
  },
];
