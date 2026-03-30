/* eslint-disable @typescript-eslint/no-deprecated */
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Terminal, Send, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui';
import { CodeWindow } from '@/components/ui/CodeWindow';
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
      className="relative min-h-screen flex items-center pt-10 overflow-hidden"
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
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Sobre <span className="text-gradient">Mí</span>
          </h2>
          <p className="text-xl text-dark-300 font-medium">
            Un desarrollador diferente con un enfoque innovador
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Left */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/50 border border-dark-700/50 text-dark-300 text-sm font-medium mb-8 backdrop-blur-sm w-fit"
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
              className="font-outfit font-bold text-5xl md:text-7xl text-white mb-6 tracking-tight leading-[1.1]"
            >
              {t('hero.title1')}{' '}
              <span className="text-gradient block lg:inline">
                {t('hero.title2')}
              </span>
            </motion.h1>

            {/* Subtitle with Type Animation */}
            <motion.div
              variants={fadeInUp}
              className="text-xl md:text-2xl font-mono text-primary-400 mb-8 font-medium h-10"
            >
              <TypeAnimation
                sequence={[
                  t('hero.typing.clients'),
                  2000,
                  t('hero.typing.webs'),
                  2000,
                  t('hero.typing.ai'),
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg text-dark-300 mb-10 max-w-xl leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4 mb-12"
            >
              <Button
                href="#contact"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[180px] shadow-glow"
                leftIcon={<Send className="w-5 h-5" />}
              >
                {t('hero.cta.primary')}
              </Button>
              <Button
                href="#projects"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[180px]"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {t('hero.cta.secondary')}
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-6"
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
              <div className="hidden sm:block w-px h-8 bg-dark-700 mx-2" />
              <div className="hidden sm:flex items-center gap-2 text-dark-400 text-sm font-medium">
                <Terminal className="w-10 h-4" />
                <span>ZeroCode_DevOps</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Right - Code Window */}
          <div className="hidden lg:block">
            <CodeWindow />
          </div>
        </div>
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
