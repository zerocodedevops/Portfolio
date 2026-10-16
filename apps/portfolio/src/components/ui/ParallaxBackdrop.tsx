import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Oversized scroll-reactive orbital, kept behind content and ignored by pointer input. */
export function ParallaxBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: backdropRef,
    offset: ['start end', 'end start'],
  });

  const coreY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [260, -260]);
  const coreX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-90, 120]);
  const coreScale = useTransform(scrollYProgress, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [0.68, 1.18, 0.78]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [-28, -28] : [-115, 245]);
  const ringCounterRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [18, 18] : [150, -210]);
  const trailX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [260, -260]);
  const trailRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [-22, -22] : [-42, 32]);

  return (
    <div
      ref={backdropRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        style={{ x: trailX, rotate: trailRotate }}
        className="absolute -left-[35%] top-[46%] h-24 w-[170%] rounded-full bg-gradient-to-r from-transparent via-[#11c7e6]/35 to-transparent blur-xl sm:h-36"
      />

      <motion.div
        style={{ x: coreX, y: coreY, scale: coreScale }}
        className="absolute -right-44 top-[18%] h-[22rem] w-[22rem] sm:-right-32 sm:h-[32rem] sm:w-[32rem]"
      >
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(84,232,255,.9),rgba(17,199,230,.28)_25%,rgba(8,124,174,.13)_58%,transparent_72%)] blur-md" />
        <motion.div
          style={{ rotate: ringRotate }}
          className="absolute inset-[8%] rounded-[42%] border-[3px] border-[#11c7e6]/60 shadow-[0_0_35px_rgba(17,199,230,.24),inset_0_0_30px_rgba(17,199,230,.12)]"
        >
          <span className="absolute -top-2 left-[24%] h-4 w-4 rounded-full bg-[#d9fbff] shadow-[0_0_24px_8px_rgba(17,199,230,.75)]" />
          <span className="absolute bottom-[13%] right-[8%] h-3 w-3 rounded-full bg-[#11c7e6] shadow-[0_0_20px_7px_rgba(17,199,230,.7)]" />
        </motion.div>
        <motion.div
          style={{ rotate: ringCounterRotate }}
          className="absolute inset-[25%] rounded-[35%] border-2 border-[#087cae]/45"
        >
          <span className="absolute -right-1 top-[18%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,.65)]" />
        </motion.div>
        <div className="absolute inset-[42%] rounded-full border border-white/30 bg-[#11c7e6]/10 shadow-[0_0_55px_15px_rgba(17,199,230,.22)] backdrop-blur-[2px]" />
      </motion.div>

      <div className="absolute -bottom-48 -left-48 h-[28rem] w-[28rem] rounded-full bg-[#087cae]/15 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
    </div>
  );
}
