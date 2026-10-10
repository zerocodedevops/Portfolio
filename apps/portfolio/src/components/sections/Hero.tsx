import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, MessageCircle, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';
import profilePhoto from '@/assets/perfil-david.webp';

const benefits = [
  'Una forma clara de presentar lo que ofrece tu negocio',
  'Diseño a medida y adaptado a móviles',
  'Trato directo conmigo durante el proyecto',
];

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });
  const photoParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-175, 175],
  );
  const decorationParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [340, -340],
  );
  const browserCardParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [260, -260],
  );
  const whatsappUrl = `https://wa.me/34912622712?text=${encodeURIComponent('Hola, quiero información sobre una web para mi negocio.')}`;

  return (
    <section id="home" className="bg-white px-3 pb-10 pt-4 sm:px-5 sm:pb-14 sm:pt-6">
      <div id="hero" className="container-custom">
        <div ref={heroRef} className="relative isolate grid min-h-[500px] overflow-hidden rounded-[1.25rem] bg-[#062856] text-white shadow-[0_24px_70px_rgba(4,30,68,.16)] lg:grid-cols-[1.08fr_0.92fr]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div style={{ y: decorationParallaxY }} className="absolute -left-44 -top-56 h-[35rem] w-[35rem] rounded-full border border-white/[0.07]" />
            <motion.div style={{ y: decorationParallaxY }} className="absolute -left-24 -top-36 h-[26rem] w-[26rem] rounded-full border border-white/[0.07]" />
            <motion.div style={{ y: decorationParallaxY }} className="absolute bottom-[-16rem] left-[28%] h-[31rem] w-[31rem] rounded-full bg-[#087cae]/20 blur-3xl" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16"
          >
            <motion.div variants={fadeInUp} className="mb-5 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#53d9f2] sm:text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Diseño web a medida
            </motion.div>
            <motion.h1 variants={fadeInUp} className="max-w-[620px] font-outfit text-[clamp(2.5rem,4.3vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-white">
              Una web propia para dar visibilidad a tu negocio.
            </motion.h1>
            <motion.ul variants={fadeInUp} className="mt-6 grid max-w-[590px] gap-3 text-sm leading-6 text-white/85 sm:text-base">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-white text-[#062856]">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeInUp} className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#contacto" className="group inline-flex min-h-12 items-center justify-center gap-2 bg-[#11c7e6] px-5 font-semibold text-[#001b41] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#062856] active:scale-[0.98]">
                Pedir presupuesto <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/35 px-4 font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </motion.div>
            <motion.p variants={fadeInUp} className="mt-5 text-sm text-white/75">
              Desde <strong className="font-semibold text-white">400 € + IVA</strong>
              <span className="mx-2 text-white/40">·</span>
              Online en toda España
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="relative min-h-[360px] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:w-[49%] lg:overflow-visible"
          >
            <motion.div
              style={{ y: photoParallaxY, scale: prefersReducedMotion ? 1 : 1.24 }}
              className="absolute inset-0"
            >
              <img
                src={profilePhoto}
                alt="David, diseñador web de ZeroCode, en su espacio de trabajo"
                className="absolute inset-0 h-full w-full object-cover object-[center_26%] lg:[clip-path:ellipse(90%_75%_at_112%_52%)]"
                fetchPriority="high"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#001b41]/65 via-transparent to-[#001b41]/[0.06] lg:bg-gradient-to-r lg:from-[#062856]/25 lg:via-transparent lg:to-transparent lg:[clip-path:ellipse(90%_75%_at_112%_52%)]" />
            </motion.div>
            <motion.div
              aria-hidden="true"
              style={{ y: browserCardParallaxY }}
              className="absolute bottom-6 left-5 z-10 hidden w-52 -rotate-3 rounded-xl border border-white/70 bg-white/95 p-3.5 text-[#0b294a] shadow-[0_24px_80px_rgba(0,12,35,.35)] backdrop-blur-md sm:block lg:bottom-6 lg:-left-14 lg:w-56 lg:p-4"
            >
              <div className="flex items-center gap-1.5 border-b border-[#dce5ec] pb-2.5">
                <span className="h-2 w-2 rounded-full bg-[#ff8b73]" />
                <span className="h-2 w-2 rounded-full bg-[#ffd66b]" />
                <span className="h-2 w-2 rounded-full bg-[#54d7ae]" />
                <span className="ml-auto h-1.5 w-16 rounded-full bg-[#e8eef3]" />
              </div>
              <div className="mt-3 rounded-lg bg-gradient-to-br from-[#e8f8fc] to-[#f4f7fb] p-3 lg:p-4">
                <span className="block h-1.5 w-9 rounded-full bg-[#11c7e6]" />
                <span className="mt-2 block h-3 w-4/5 rounded-sm bg-[#0b294a]" />
                <span className="mt-1.5 block h-1.5 w-3/5 rounded-sm bg-[#8b9aac]" />
                <span className="mt-3 block h-6 w-20 rounded-sm bg-[#11c7e6] lg:h-7 lg:w-24" />
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <span className="h-8 rounded bg-[#f1f5f8]" />
                <span className="h-8 rounded bg-[#f1f5f8]" />
                <span className="h-8 rounded bg-[#f1f5f8]" />
              </div>
            </motion.div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7 lg:bottom-8 lg:left-auto lg:right-8">
              <div className="border-l-2 border-[#11c7e6] pl-3 text-white drop-shadow-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#73e2f5]">Atención personal</p>
                <p className="mt-1 font-outfit text-2xl font-semibold sm:text-3xl">David G.</p>
              </div>
              <span className="mb-1 hidden rounded-full border border-white/55 bg-[#062856]/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm sm:block">Tu diseñador web</span>
            </div>
            <div aria-hidden="true" className="absolute -bottom-28 -right-28 hidden h-64 w-64 rounded-full border-[28px] border-[#11c7e6]/20 lg:block" />
          </motion.div>
        </div>

        <a href="#proceso" className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#718197] transition hover:text-[#0b294a]">
          Conoce el proceso <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
