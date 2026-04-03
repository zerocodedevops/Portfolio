import React from 'react';
import { motion } from 'framer-motion';

export default function PymesHeroDesktop({
  heroVariant,
}: {
  readonly heroVariant: 'A' | 'B';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-6 leading-tight">
        {heroVariant === 'A' ? (
          <>
            El diseñador web para{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient">pymes en Madrid</span>
          </>
        ) : (
          <>
            Más clientes locales con una web{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient">rápida y optimizada</span>
          </>
        )}
      </h1>
    </motion.div>
  );
}
