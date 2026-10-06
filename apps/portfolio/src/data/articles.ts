import { Brain, Code2, Cpu, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import imgAiArchitecture from '@/assets/blog/blog-ai-architecture.webp';
import imgAutonomousAgents from '@/assets/blog/blog-autonomous-agents.webp';
import imgFrontendMagic from '@/assets/blog/blog-frontend-magic.webp';
import imgGoogleMaps from '@/assets/blog/blog-google-maps.webp';
import imgFrontendSketch from '@/assets/blog/blog-frontend.webp';
import imgAuditRobot from '@/assets/blog/blog-agents.webp';
import imgProjectJBarranco from '@/assets/projects/project-jbarranco.webp';

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
    image: imgAiArchitecture,
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
      'La evolución de los asistentes de código hacia companions proactivos capaces de entender el contexto completo.',
    date: 'Dic 2025',
    readTime: '7 min',
    category: 'Tecnología',
    type: 'tech',
    image: imgAutonomousAgents,
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
    image: imgFrontendMagic,
    icon: Code2,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">¿Cuántas veces has escrito el mismo componente de botón? ¿O la misma configuración de rutas en React Router? ¿O el mismo formulario de login? El <strong>"Boilerplate"</strong> (código repetitivo) ha sido la plaga que ha drenado la energía del desarrollo frontend durante años.</p>

      <h2>La era de la Generación Generativa de UI</h2>
      <p>Herramientas emergentes como <strong>v0.dev</strong> o <strong>Bolt.new</strong> nos permiten describir una interfaz en lenguaje natural y obtener el código React/Tailwind listo para producción en segundos.</p>
    `,
  },
  {
    id: 6,
    title: 'Cómo destacar tu negocio de Madrid en Google',
    excerpt:
      'Aprende los pasos mínimos que tu negocio debe dar para aparecer cuando tus vecinos busquen tus servicios.',
    date: 'Mar 2026',
    readTime: '5 min',
    category: 'Negocio Local',
    type: 'business',
    image: imgGoogleMaps,
    icon: MapPin,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Si tienes un negocio en Madrid — una cafetería en Rivas, una asesoría en Arganda o una peluquería en Pozuelo — y no apareces cuando alguien busca en Google lo que tú ofreces, <strong>estás regalando clientes a tu competencia</strong>.</p>

      <hr class="my-10 border-dark-800" />

      <h2>1. Ficha de Google Business Profile</h2>
      <p><strong>Crea y completa tu ficha al 100%.</strong> Es gratis y es lo primero que ve la gente cuando busca un servicio cerca. Pon tu dirección real, horario actualizado y responde a todas las reseñas.</p>
      
      <blockquote>Una ficha completa tiene hasta un 70% más de probabilidades de generar visitas y ventas reales.</blockquote>

      <hr class="my-10 border-dark-800" />

      <h2>2. Reseñas constantes</h2>
      <p><strong>Pide opiniones a tus clientes contentos.</strong> Las reseñas son el boca a boca digital. No hace falta tener 200 estrellas; con 15-20 opiniones reales y recientes Google ya te toma en serio.</p>

      <hr class="my-10 border-dark-800" />

      <h2>3. Web rápida y diseño móvil</h2>
      <p><strong>Tu web tiene que cargar volando en smartphones.</strong> Más del 60% de las búsquedas locales se hacen desde el teléfono. Si tarda más de 3 segundos en abrir, estás perdiendo tráfico.</p>

      <hr class="my-10 border-dark-800" />

      <h2>4. Textos enfocados en tu zona</h2>
      <p><strong>Ataca tu barrio o ciudad en los títulos.</strong> No basta con poner "fontanero". Es mucho mejor "fontanero urgente en Vallecas". Así Google entiende exactamente dónde operas y te prioriza.</p>

      <hr class="my-10 border-dark-800" />

      <h2>5. ¿Y después qué?</h2>
      <p>Estos cuatro pasos son tu mínimo viable local. El siguiente nivel es <strong>tener una web profesional estructurada para vender</strong> que convierta el tráfico indirecto en reservas y llamadas de teléfono reales.</p>
    `,
  },
  {
    id: 7,
    title: 'Elementos clave en tu web para pymes de Madrid',
    excerpt:
      'El checklist imprescindible que diferencia una web que solo "está ahí" de una que genera clientes reales.',
    date: 'Mar 2026',
    readTime: '4 min',
    category: 'Guía Práctica',
    type: 'business',
    image: imgFrontendSketch,
    icon: CheckCircle,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Muchas pymes pagan por una web y luego se preguntan por qué no les llega ningún cliente. El problema casi nunca es el diseño visual, sino que <strong>faltan los elementos estratégicos que convierten visitas en contactos</strong>.</p>

      <hr class="my-10 border-dark-800" />

      <h2>1. Datos de contacto directos</h2>
      <p><strong>Teléfono, WhatsApp y dirección siempre a la vista.</strong> Si alguien tiene que hacer scroll hacia abajo o rebuscar en el menú para encontrar cómo llamarte, tienes un problema de usabilidad.</p>

      <hr class="my-10 border-dark-800" />

      <h2>2. Mensaje claro y sin rodeos</h2>
      <p><strong>Di exactamente lo que haces en la primera frase.</strong> Nada de "soluciones integrales". Usa fórmulas directas como: "Reformas de cocinas y baños en el sur de Madrid, presupuesto gratis".</p>

      <hr class="my-10 border-dark-800" />

      <h2>3. Velocidad y usabilidad móvil</h2>
      <p><strong>Tu web no puede tardar en cargar.</strong> Si la experiencia es lenta en móvil o hay bloques que se descuadran, pierdes al instante la confianza del usuario (y de Google).</p>
      
      <blockquote>El 53% de los visitantes abandonan una web móvil si tarda más de 3 segundos en cargar completamente. No es una opinión, es un dato oficial de Google.</blockquote>

      <hr class="my-10 border-dark-800" />

      <h2>4. Autenticidad y casos reales</h2>
      <p><strong>Enseña trabajos hechos y casos de éxito.</strong> Huye de las imágenes de archivo genéricas. "Ana, peluquería en Getafe" genera tres veces más confianza que cualquier texto estándar.</p>

      <hr class="my-10 border-dark-800" />

      <h2>5. Botón de acción destacado</h2>
      <p><strong>"Pide presupuesto", "Reserva tu cita" o "Llámanos".</strong> Debe haber solo uno principal por página, destacando mucho sobre el fondo. Esa es la diferencia entre un folleto digital y una máquina de captación.</p>
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
    image: imgProjectJBarranco,
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
    image: imgFrontendMagic,
    icon: Code2,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Elegir el nombre de tu web es tan importante como elegir el local físico de tu negocio. Debe ser corto, fácil de pronunciar y relevante para tu sector en Madrid.</p>

      <h2>Consejos Rápidos</h2>
      <p>Prioriza el uso de palabras clave locales si tu negocio es puramente madrileño y busca siempre la extensión .com o .es si te diriges al público español.</p>
    `,
  },
  {
    id: 8,
    title: 'Errores web que te hacen perder clientes',
    excerpt:
      '¿Tu web no funciona? Revisa si estás cometiendo alguno de estos errores comunes que espantan a tus visitantes.',
    date: 'Mar 2026',
    readTime: '4 min',
    category: 'Consejos',
    type: 'business',
    image: imgAuditRobot,
    icon: AlertTriangle,
    content: `
      <p class="lead text-xl text-dark-200 mb-8">Tener una web no es suficiente. Tener una <strong>mala web es peor que no tener ninguna</strong>, porque da una imagen de dejadez que se asocia directamente con tu negocio.</p>

      <h2>❌ "Diseñé mi web yo mismo con una plantilla gratis en 2018"</h2>
      <p>Si tu web parece de otra década, transmite que tu negocio también lo es. Los clientes juzgan tu profesionalidad en los primeros 3 segundos. Una web anticuada dice "no me importa lo suficiente".</p>

      <h2>❌ No tener certificado SSL (el candadito)</h2>
      <p>Si tu web muestra "No es seguro" en el navegador, Google te penaliza y los clientes huyen. Es como tener la puerta de tu tienda con el cristal roto.</p>

      <h2>❌ Textos kilométricos que nadie lee</h2>
      <p>Tu cliente quiere saber qué haces, cuánto cuesta y cómo contactarte. No quiere leer tu historia desde 1987. Sé directo: frases cortas, información clara, beneficios concretos.</p>

      <h2>❌ Sin llamada a la acción</h2>
      <p>Si tu web no tiene un botón claro de "Llámanos", "Pide presupuesto" o "Reserva cita", ¿qué esperas que haga el visitante? Aplaudir no va a ser.</p>

      <h2>❌ No aparecer en búsquedas locales</h2>
      <p>Si no tienes Google Business Profile, no mencionas tu zona en los textos y no tienes reseñas, básicamente eres invisible para Google. Y para tus vecinos.</p>

      <h2>¿Te suena alguno?</h2>
      <p>No te preocupes, todos tienen solución. Lo importante es ser consciente y actuar. Una web bien hecha no es un gasto: es la inversión que más clientes te va a traer este año.</p>
    `,
  },
];
