import { motion } from 'framer-motion';
import { ArrowUp, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import footerLogo from '@/assets/zerocode-horizontal.webp';

const socialLinks = [
  { icon: Mail, href: 'mailto:admin@zerocode-devops.com', label: 'Email' },
  { icon: MessageCircle, href: 'https://wa.me/34912622712', label: 'WhatsApp' },
];

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const footerLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre mí', href: '/#sobre-mi' },
    { label: 'Precios', href: '/precios-paginas-web' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const resourceLinks = [
    { label: 'Proyectos', href: '#projects' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('https://')) {
      globalThis.window.location.href = href;
      return;
    }
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => document.querySelector(href.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 100);
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
    <footer className="relative border-t border-[#0b294a]/10 bg-[#071a35] text-white">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 rounded-full bg-[#12b8e8] text-white shadow-glow"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('footer.scrollButton')}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 items-start md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
          {/* Logo and tagline */}
          <div className="text-center md:col-span-2 md:text-left xl:col-span-1">
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
                <img src={footerLogo} alt="ZeroCode DevOps" className="h-[70px] w-[210px] object-cover object-center" />
              </motion.a>
              <p className="text-dark-400 mt-2 mx-auto w-max max-w-none whitespace-nowrap text-[clamp(0.6rem,2.8vw,0.875rem)] leading-5 md:mx-0">
                Diseño web a medida para autónomos y pymes de toda España
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
          <p className="text-center text-dark-400 text-sm flex items-center justify-center gap-2">
            © {currentYear} ZeroCode • Hecho con curiosidad
          </p>

        </div>
      </div>
    </footer>
  );
}
