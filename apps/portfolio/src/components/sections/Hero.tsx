/* eslint-disable @typescript-eslint/no-deprecated */
import { motion } from 'framer-motion';
// eslint-disable-next-line
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui';
import { fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';

export function Hero() {
  const { t } = useTranslation();

  const handleSocialClick = (platform: string) => {
    trackEvent('Social', 'Click', platform);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      url: 'https://github.com/zerocodedevops',
      color: 'hover:text-white hover:bg-dark-800',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      url: 'https://www.linkedin.com/in/zerocode-devops',
      color: 'hover:text-white hover:bg-blue-600',
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      url: 'mailto:admin@zerocode-devops.com',
      color: 'hover:text-white hover:bg-primary-500',
    },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background with patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(3,7,18,1))]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20" />

        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-custom relative z-10 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/50 border border-dark-700/50 text-dark-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            {t('hero.badge')}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="font-outfit font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight"
          >
            {t('hero.title1')}{' '}
            <span className="text-gradient inline-block">
              {t('hero.title2')}
            </span>
          </motion.h1>

          {/* Subtitle with Type Animation */}
          <motion.div
            variants={fadeInUp}
            className="text-xl md:text-2xl text-dark-300 mb-12 font-medium flex flex-col sm:flex-row items-center justify-center gap-2"
          >
            <span className="opacity-80">{t('hero.im')}</span>
            <div className="h-8 md:h-9 text-white font-bold bg-dark-800/30 px-4 py-1 rounded-lg border border-dark-700/50">
              <TypeAnimation
                sequence={[
                  'Senior FullStack Engineer',
                  2000,
                  'AI Solutions Architect',
                  2000,
                  'DevOps Specialist',
                  2000,
                  'Creative Developer',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-primary-400"
              />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              href="#contact"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
            >
              {t('hero.cta.primary')}
            </Button>
            <Button
              href="#projects"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
            >
              {t('hero.cta.secondary')}
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-6"
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick(link.name)}
                className={`p-3 rounded-xl border border-dark-700/50 bg-dark-900/30 text-dark-400 transition-all ${link.color} hover:scale-110`}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
            <div className="w-px h-8 bg-dark-700 mx-2" />
            <a
              href="#about"
              className="flex items-center gap-2 text-dark-400 hover:text-primary-400 text-sm font-medium transition-colors"
            >
              <Terminal className="w-4 h-4" />
              <span>Scroll to explore</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] fill-dark-950"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}
