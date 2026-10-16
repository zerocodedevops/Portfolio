import { ArrowDown, ArrowRight, Check, ChevronDown, Compass, MessageCircle, MonitorSmartphone, PencilRuler, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import profilePhoto from '@/assets/perfil-david.webp';
import { ParallaxBackdrop } from '@/components/ui/ParallaxBackdrop';
import { ProductOptions } from '@/features/pricing/ProductOptions';

const steps = [
  { number: '01', icon: MessageCircle, title: 'Cuéntame qué necesitas', description: 'Hablamos de tu negocio y de lo que quieres explicar en tu web.' },
  { number: '02', icon: PencilRuler, title: 'Definimos la propuesta', description: 'Partimos de tu idea o preparo una dirección visual para ti.' },
  { number: '03', icon: Check, title: 'La ponemos en marcha', description: 'Revisamos juntos la página antes de publicarla.' },
];

const faqs = [
  ['¿Qué incluye el precio mínimo de 400 € + IVA?', 'Incluye una página con Inicio y Contacto, un botón para redirigir a WhatsApp, adaptación a móviles, enlaces a los textos legales que facilite tu negocio, dominio y hosting durante el primer año y certificado SSL. Cualquier renovación o mantenimiento posterior se acordará y presupuestará antes de contratarlo.'],
  ['¿El precio puede cambiar?', 'El precio mínimo de 400 € + IVA corresponde a ese alcance concreto. Si necesitas algo distinto, te detallaré el alcance y el presupuesto antes de empezar.'],
  ['¿Trabajas en toda España?', 'Sí. Trabajo online con autónomos y pymes de cualquier punto de España.'],
  ['¿Tengo que llevar el diseño decidido?', 'No. Puedes compartir tu idea o referencias, o puedo proponerte una dirección visual para tu negocio.'],
  ['¿Cómo puedo contactar contigo?', 'Puedes escribirme por WhatsApp o por correo.'],
];

const separateSentences = (text: string) => text.split(/(?<=\.)\s+/);

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[#006b92]">{children}</p>;
}

function ParallaxPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-60, 60],
  );

  return (
    <div ref={frameRef} className="relative aspect-[4/3] w-full max-w-sm overflow-hidden shadow-[0_30px_80px_rgba(7,26,53,.16)]">
      <motion.img
        src={profilePhoto}
        alt="David, diseñador web de ZeroCode"
        loading="lazy"
        style={{ y: imageY, scale: prefersReducedMotion ? 1 : 1.22 }}
        className="absolute -inset-y-[11%] inset-x-0 h-[122%] w-full object-cover object-[center_28%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#001b41]/40 via-transparent to-transparent" />
    </div>
  );
}

export function HomeProcessSections() {
  return <section id="proceso" className="relative isolate overflow-hidden bg-white py-20 sm:py-28"><ParallaxBackdrop /><div className="container-custom relative z-10">
    <div className="mx-auto mb-14 max-w-5xl text-center"><SectionLabel>Un proceso sencillo</SectionLabel><h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">De la primera conversación a tu nueva web</h2><p className="mx-auto mt-4 max-w-none leading-7 text-[#586a80] lg:whitespace-nowrap">Sabes qué ocurre en cada fase y quién está al otro lado: la persona que diseña tu página también habla contigo.</p></div>
    <div className="grid gap-0 md:grid-cols-3">{steps.map(({ number, icon: Icon, title, description }) => <article key={number} className="relative border-t border-[#d8e1e9] px-1 pb-6 pt-7 md:px-8 md:first:pl-0 md:last:pr-0"><div className="mb-7 flex items-center justify-between"><Icon className="h-6 w-6 text-[#0789bd]" aria-hidden="true"/><span className="font-outfit text-sm font-semibold tracking-widest text-[#8b9aac]">{number}</span></div><h3 className="font-outfit text-xl font-semibold text-[#0a203d]">{title}</h3><div className="mt-3 max-w-sm space-y-2 text-sm leading-6 text-[#586a80]">{separateSentences(description).map((sentence) => <p key={sentence}>{sentence}</p>)}</div></article>)}</div>
  </div></section>;
}

export function HomeOfferSections() {
  const included = ['Una sola página de Inicio y Contacto', 'Botón de contacto por WhatsApp', 'Diseño adaptado a móviles', 'RGPD', 'Dominio y hosting (1 año)', 'Certificado SSL'];
  return <>
    <section id="servicio" className="relative isolate overflow-hidden bg-[#f3f7fa] py-20 sm:py-28"><ParallaxBackdrop /><div className="container-custom relative z-10 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div className="max-w-lg"><SectionLabel>Diseño web a medida</SectionLabel><h2 className="font-outfit text-3xl font-semibold leading-tight tracking-tight text-[#071a35] sm:text-4xl">Presenta lo que haces y facilita el contacto.</h2><div className="mt-5 space-y-2 leading-7 text-[#586a80]"><p>Una página clara ayuda a explicar qué haces y facilita que las personas interesadas contacten contigo.</p><p>Diseñada para tu negocio y para verse cómodamente desde el móvil.</p></div><a href="#contacto" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#006b92] hover:gap-3">Cuéntame tu idea <ArrowRight className="h-4 w-4"/></a></div>
      <div className="grid gap-x-9 gap-y-10 sm:grid-cols-2">{[{icon:Compass,title:'Diseño a medida',description:'Una propuesta visual acorde con tu negocio y con lo que quieres comunicar.'},{icon:MonitorSmartphone,title:'Adaptada a móviles',description:'La información se presenta con claridad en teléfonos, tabletas y ordenadores.'},{icon:MessageCircle,title:'Contacto sencillo',description:'Un camino claro para que las personas interesadas puedan escribirte.'},{icon:ShieldCheck,title:'Alcance transparente',description:'Acordamos contenidos, entregables y presupuesto antes de comenzar.'}].map(({icon:Icon,title,description})=><article key={title} className="border-t border-[#cbd7e1] pt-5"><Icon className="mb-5 h-6 w-6 text-[#0789bd]" aria-hidden="true"/><h3 className="font-outfit text-lg font-semibold text-[#0a203d]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#586a80]">{description}</p></article>)}</div>
    </div></section>
    <section id="inversion" className="relative isolate overflow-hidden bg-white py-20 sm:py-28"><ParallaxBackdrop /><div className="container-custom relative z-10">
      <div className="mx-auto mb-12 max-w-3xl text-center"><SectionLabel>Precio claro</SectionLabel><h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">Precio mínimo: 400 € + IVA</h2><p className="mt-4 leading-7 text-[#586a80]">Para autónomos y pymes que necesitan presentar su negocio y facilitar el contacto.</p></div>
      <article className="mx-auto max-w-4xl border border-[#dce4eb] bg-white p-6 sm:p-10"><div className="grid gap-8 md:grid-cols-[0.72fr_1.28fr]"><div><p className="font-outfit text-4xl font-semibold text-[#071a35]">400 € + IVA</p><p className="mt-2 text-sm text-[#5b687a]">Precio mínimo para este alcance</p><div className="mt-7 flex flex-col items-start gap-3"><a href="#contacto" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#087cae] px-5 font-semibold text-white transition hover:bg-[#071a35]">Pedir presupuesto <ArrowRight className="h-4 w-4"/></a><a href="#catalogo-opciones" className="inline-flex min-h-10 items-center gap-2 font-semibold text-[#006b92] underline decoration-[#b9eaf5] underline-offset-4 transition hover:text-[#071a35]">Ver catálogo de opciones <ArrowDown className="h-4 w-4" aria-hidden="true"/></a></div></div><ul className="grid gap-x-8 gap-y-5 text-sm leading-6 text-[#263c56] sm:grid-cols-2">{included.map((item)=><li key={item} className="flex min-h-12 items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0789bd]" aria-hidden="true"/><span>{item}</span></li>)}</ul></div></article>
      <ProductOptions />
    </div></section>
    <section id="sobre-mi" className="relative isolate scroll-mt-[71px] overflow-hidden bg-[#eaf2f7] py-16 sm:py-20"><ParallaxBackdrop /><div className="container-custom relative z-10 grid items-center gap-10 md:grid-cols-[0.6fr_1.4fr]"><ParallaxPortrait /><div><SectionLabel>Sobre mí</SectionLabel><h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">Soy David, y hablarás directamente conmigo.</h2><div className="mt-5 space-y-3 leading-7 text-[#586a80]"><p>Diseño y desarrollo webs para autónomos y pymes que quieren presentar mejor su negocio en internet.</p><p>También desarrollo productos y aplicaciones full stack, desde la interfaz hasta la puesta en marcha.</p><p>Mi experiencia incluye herramientas de gestión, plataformas con varios perfiles de usuario e integraciones de servicios.</p><p>Trabajo online en toda España. Puedes traer una idea o dejar que te proponga una dirección visual.</p></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><article className="border-t border-[#bdd2df] pt-3"><h3 className="font-outfit text-sm font-semibold text-[#0b294a]">Diseño de producto</h3><p className="mt-1 text-xs leading-5 text-[#586a80]">Experiencias claras y adaptadas a cada negocio.</p></article><article className="border-t border-[#bdd2df] pt-3"><h3 className="font-outfit text-sm font-semibold text-[#0b294a]">Desarrollo full stack</h3><p className="mt-1 text-xs leading-5 text-[#586a80]">Interfaces, servicios y aplicaciones conectadas.</p></article><article className="border-t border-[#bdd2df] pt-3"><h3 className="font-outfit text-sm font-semibold text-[#0b294a]">Integraciones</h3><p className="mt-1 text-xs leading-5 text-[#586a80]">Automatizaciones y herramientas según las necesidades del proyecto.</p></article></div><a href="#contacto" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#006b92]">Cuéntame tu proyecto <ArrowRight className="h-4 w-4"/></a></div></div></section>
  </>;
}

export function HomeFaqSection() {
  return <section id="preguntas" className="relative isolate overflow-hidden bg-[#f3f7fa] py-20 sm:py-28"><ParallaxBackdrop /><div className="container-custom relative z-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><div><SectionLabel>Respuestas claras</SectionLabel><h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">Preguntas frecuentes</h2><p className="mt-4 leading-7 text-[#586a80]">Si tienes otra pregunta, escríbeme y te responderé personalmente.</p><a href="#contacto" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#006b92]">Contactar <ArrowRight className="h-4 w-4"/></a></div><div className="divide-y divide-[#d5e0e8] border-y border-[#d5e0e8]">{faqs.map(([question,answer])=><details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-outfit font-semibold text-[#0a203d] marker:hidden">{question}<ChevronDown className="h-5 w-5 shrink-0 text-[#006b92] transition-transform group-open:rotate-180"/></summary><div className="max-w-2xl space-y-2 pt-4 pr-8 text-sm leading-6 text-[#586a80]">{separateSentences(answer).map((sentence)=><p key={sentence}>{sentence}</p>)}</div></details>)}</div></div></section>;
}
