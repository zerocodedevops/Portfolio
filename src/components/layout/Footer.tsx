import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/zerocodedevops', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/zerocode-devops', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:zerocode.devops@gmail.com', label: 'Email' },
];

const footerLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Sobre mí', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Contacto', href: '#contact' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-900/50 border-t border-dark-700/50">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <a
              href="#hero"
              className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
            >
              &lt;DevPortfolio /&gt;
            </a>
            <p className="mt-2 text-dark-400 text-sm">
              Creando experiencias digitales únicas
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Social links */}
          <div className="flex justify-center md:justify-end gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-dark-700/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-dark-700/50">
          <p className="text-center text-dark-500 text-sm flex items-center justify-center gap-1">
            © {currentYear} DevPortfolio. Hecho con{' '}
            <Heart className="w-4 h-4 text-accent-500 fill-accent-500" /> y mucho{' '}
            <span className="text-primary-400">código</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
