import { motion } from 'framer-motion';

export function CodeWindow() {
  const codeLines = [
    { text: 'const', color: 'text-purple-400' },
    { text: ' developer', color: 'text-blue-400' },
    { text: ' = {', color: 'text-gray-300' },
    { text: '  name:', color: 'text-emerald-400', indent: true },
    { text: " 'David G.'", color: 'text-yellow-200' },
    { text: ',', color: 'text-gray-300' },
    { text: '  role:', color: 'text-emerald-400', indent: true },
    { text: " 'AI-First Architect'", color: 'text-yellow-200' },
    { text: ',', color: 'text-gray-300' },
    { text: '  location:', color: 'text-emerald-400', indent: true },
    { text: " 'Madrid, Spain'", color: 'text-yellow-200' },
    { text: ',', color: 'text-gray-300' },
    { text: '  specialty:', color: 'text-emerald-400', indent: true },
    { text: " 'Business Solutions'", color: 'text-yellow-200' },
    { text: ' };', color: 'text-gray-300' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative group w-full max-w-xl mx-auto lg:mx-0"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-dark-900/80 backdrop-blur-xl border border-dark-700 rounded-2xl overflow-hidden shadow-2xl">
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-dark-800/50 border-b border-dark-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-xs text-dark-400 font-mono">portfolio.ts</div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Code Content */}
        <div className="p-6 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
          {codeLines.map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-dark-400 select-none w-5 text-right">{i + 1}</span>
              <span className={`${line.indent ? 'pl-4' : ''}`}>
                {line.text.split(' ').map((word, j) => (
                  <span key={j} className={line.color}>{word}{j < line.text.split(' ').length - 1 ? ' ' : ''}</span>
                ))}
              </span>
            </div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-5 bg-primary-400 ml-1 translate-y-1"
          />
        </div>
      </div>
    </motion.div>
  );
}
