import { motion } from 'framer-motion';
import {
  ArrowUp,
  Code2,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const socialLinks = [
  {
    icon: GithubIcon,
    href: 'https://github.com/zerocodedevops',
    label: 'GitHub',
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/zerocode-devops',
    label: 'LinkedIn',
  },
  { icon: Mail, href: 'mailto:zerocode.devops@gmail.com', label: 'Email' },
  { icon: MessageCircle, href: 'https://wa.me/34912622712', label: 'WhatsApp' },
];

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const footerLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Mí', href: '/disenador-web-freelance-madrid' },
    { label: 'Precios', href: '/precios-paginas-web' },
    { label: 'Contacto', href: '#contact' },
  ];

  const resourceLinks = [
    { label: 'Tech Blog', href: 'https://zerocode-devops.com/tech' },
    { label: 'Proyectos', href: '#projects' },
    { label: 'Mantenimiento', href: '/precios-paginas-web' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('http')) {
      globalThis.window.location.href = href;
      return;
    }
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
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
        aria-label={t('footer.scrollButton')}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="mb-6 md:mb-0 w-full">
              <motion.a
                href="/"
                className="flex items-center justify-center md:justify-start gap-2 mb-2 group w-fit mx-auto md:mx-0"
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/');
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-outfit font-bold text-xl text-white">
                  Zero<span className="text-neon-cyan">Code</span>
                </span>
              </motion.a>
              <p className="text-dark-400 mt-2 text-sm mx-auto md:mx-0 whitespace-nowrap">
                Creando experiencias digitales únicas
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Navegación</h4>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-dark-400 hover:text-primary-400 transition-colors text-xs font-medium"
                  whileHover={{ x: 2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Resources links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Recursos</h4>
            <div className="flex flex-col gap-2">
              {resourceLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-dark-400 hover:text-primary-400 transition-colors text-xs font-medium"
                  whileHover={{ x: 2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>

          { socialLinks.length > 0 && (
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
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-dark-700/50">
          <p className="text-center text-dark-500 text-sm flex items-center justify-center gap-2">
            © {currentYear} ZeroCode • Hecho con curiosidad + IA
          </p>

          {/* SEO Keywords */}
          <div className="mt-8 text-center border-t border-dark-800/20 pt-6">
            <p className="text-dark-600 text-[10px] mb-3 uppercase tracking-wider font-bold">
              Servicios de diseño y desarrollo web en Madrid para pymes y autónomos:
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-dark-600/70">
              <a 
                href="/desarrollo-web-pymes-madrid" 
                className="hover:text-primary-400 transition-colors font-medium border-b border-transparent hover:border-primary-400/30 pb-0.5"
                onClick={(e) => { e.preventDefault(); handleNavClick('/desarrollo-web-pymes-madrid'); }}
              >
                Desarrollo Web Pymes Madrid
              </a>
              <span className="opacity-30">•</span>
              <a 
                href="/desarrollo-web-pymes-madrid" 
                className="hover:text-primary-400 transition-colors border-b border-transparent hover:border-primary-400/30 pb-0.5"
                onClick={(e) => { e.preventDefault(); handleNavClick('/desarrollo-web-pymes-madrid'); }}
              >
                Diseño Web para Autónomos
              </a>
              <span className="opacity-30">•</span>
              <a 
                href="/desarrollo-web-pymes-madrid" 
                className="hover:text-primary-400 transition-colors border-b border-transparent hover:border-primary-400/30 pb-0.5"
                onClick={(e) => { e.preventDefault(); handleNavClick('/desarrollo-web-pymes-madrid'); }}
              >
                Diseño Web para Pymes
              </a>
              <span className="opacity-30">•</span>
              <a 
                href="/disenador-web-freelance-madrid" 
                className="hover:text-primary-400 transition-colors border-b border-transparent hover:border-primary-400/30 pb-0.5"
                onClick={(e) => { e.preventDefault(); handleNavClick('/disenador-web-freelance-madrid'); }}
              >
                Diseño Web Freelance Madrid
              </a>
              <span className="opacity-30">•</span>
              <a 
                href="/precios-paginas-web" 
                className="hover:text-primary-400 transition-colors border-b border-transparent hover:border-primary-400/30 pb-0.5"
                onClick={(e) => { e.preventDefault(); handleNavClick('/precios-paginas-web'); }}
              >
                Mantenimiento Web Profesional
              </a>
              <span className="opacity-30">•</span>
              <a 
                href="/desarrollo-web-pymes-madrid" 
                className="hover:text-primary-400 transition-colors border-b border-transparent hover:border-primary-400/30 pb-0.5"
                onClick={(e) => { e.preventDefault(); handleNavClick('/desarrollo-web-pymes-madrid'); }}
              >
                Páginas Web para Empresas Madrid
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
