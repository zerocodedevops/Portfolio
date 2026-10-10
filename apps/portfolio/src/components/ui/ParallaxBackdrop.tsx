import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Decorative scroll layers for long-form sections. Kept behind content and disabled for reduced-motion users. */
export function ParallaxBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: backdropRef,
    offset: ['start end', 'end start'],
  });
  const firstLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [175, -175],
  );
  const secondLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-120, 120],
  );
  const orbitY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [145, -145],
  );
  const orbitRotation = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [-12, -12] : [-32, 32],
  );
  const ribbonY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-240, 240],
  );
  const innerOrbitY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-105, 105],
  );
  const innerOrbitRotation = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [18, -18],
  );

  return (
    <div
      ref={backdropRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        style={{ y: firstLayerY }}
        className="absolute -right-56 top-[4%] h-[30rem] w-[30rem] rounded-full bg-[#11c7e6]/25 blur-3xl sm:h-[38rem] sm:w-[38rem]"
      />
      <motion.div
        style={{ y: secondLayerY }}
        className="absolute -bottom-56 -left-48 h-[27rem] w-[27rem] rounded-full bg-[#087cae]/20 blur-3xl sm:h-[34rem] sm:w-[34rem]"
      />
      <motion.div
        style={{ y: orbitY, rotate: orbitRotation }}
        className="absolute right-[10%] top-[27%] h-52 w-52 rounded-[36%] border-2 border-[#0789bd]/20 sm:h-72 sm:w-72"
      />
      <motion.div
        style={{ y: innerOrbitY, rotate: innerOrbitRotation }}
        className="absolute right-[19%] top-[39%] h-28 w-28 rounded-[30%] border border-[#11c7e6]/15 sm:h-40 sm:w-40"
      />
      <motion.div
        style={{ y: ribbonY }}
        className="absolute -left-[18%] top-[57%] h-16 w-[80%] -rotate-[12deg] rounded-full bg-gradient-to-r from-transparent via-[#11c7e6]/24 to-transparent blur-sm sm:h-24"
      />
    </div>
  );
}
