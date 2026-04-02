import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui';
import {
  GithubIcon,
  LinkedinIcon,
  WhatsAppIcon,
} from '@/components/ui/BrandIcons';
import { slideInLeft, slideInRight } from '@/hooks/useScrollAnimation';
import { sileo } from 'sileo';

export function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('contact.form.validation.name')),
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          message: t('contact.form.validation.email'),
        }),
        subject: z.string().min(5, t('contact.form.validation.subject')),
        message: z.string().min(10, t('contact.form.validation.message')),
      }),
    [t],
  );

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema as any),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      // EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        // For demo purposes, simulate success
        await new Promise((resolve) => setTimeout(resolve, 1500));
        sileo.success({
          title: t('contact.form.success'),
          description: 'En breve me pondré en contacto contigo.',
        });
        setStatus('success');
        reset();
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
        publicKey,
      );

      sileo.success({
        title: t('contact.form.success'),
        description: 'En breve me pondré en contacto contigo.',
      });
      setStatus('success');
      reset();
    } catch {
      sileo.error({
        title: 'Error al enviar el mensaje',
        description: t('contact.form.error'),
      });
      setStatus('error');
      setErrorMessage(t('contact.form.error'));
    }
  };

  return (
    <section id="contact" className="relative pb-16 lg:pb-24 pt-8 lg:pt-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Hablemos de tu <span className="text-gradient">Proyecto</span>
          </h2>
          <p className="text-xl text-dark-300 font-medium max-w-2xl mx-auto">
            ¿Tienes una idea en mente? Me encantaría escucharla
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start mt-8">
          {/* Left Column: Info & Form */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                ¿Listo para colaborar?
              </h3>
              <p className="text-dark-300 text-lg leading-relaxed max-w-lg">
                Estoy abierto a colaborar en proyectos que valoren la{' '}
                <span className="text-primary-400 font-medium">innovación</span>
                , la{' '}
                <span className="text-primary-400 font-medium">
                  transparencia
                </span>{' '}
                y el uso estratégico de{' '}
                <span className="text-accent-400 font-medium">IA</span>.
              </p>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/30 border border-dark-700/50 w-fit">
                <div className="p-2.5 rounded-lg bg-primary-500/10 text-primary-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-dark-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                    Ubicación
                  </p>
                  <p className="text-white text-sm font-medium">Madrid, España</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 bg-dark-800/10 border-dark-700/50">
              <div className="space-y-6">
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-bold text-dark-200 mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input w-full p-4"
                    placeholder={t('contact.form.placeholders.name')}
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    required={true}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400 font-medium" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-bold text-dark-200 mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input w-full p-4"
                    placeholder={t('contact.form.placeholders.email')}
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    required={true}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 font-medium" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label htmlFor="message" className="text-sm font-bold text-dark-200 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    className="textarea w-full p-4"
                    placeholder={t('contact.form.placeholders.message')}
                    rows={4}
                    {...register('message')}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    required={true}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-400 font-medium" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-base mt-4"
                  isLoading={status === 'loading'}
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  {status === 'loading'
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
                </Button>

                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 mt-4"
                    >
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm font-medium">{t('contact.form.success')}</p>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 mt-4"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm font-medium">{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Channels Card & Terminal */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8 lg:sticky lg:top-24"
          >
            <div className="card p-6 sm:p-8 bg-dark-800/20 border-dark-700/50">
              <h4 className="text-lg font-bold text-white mb-6">Canales Directos</h4>
              <div className="space-y-3">
                <a
                  href="mailto:admin@zerocode-devops.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900/80 border border-dark-700/50 hover:border-primary-500/50 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                      Email
                    </p>
                    <p className="text-white text-sm font-medium">
                      admin@zerocode-devops.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/34912622712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900/80 border border-dark-700/50 hover:border-accent-500/50 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                      WhatsApp Business
                    </p>
                    <p className="text-white text-sm font-medium">+34 912 622 712</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/zerocode-devops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900/80 border border-dark-700/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                      LinkedIn
                    </p>
                    <p className="text-white text-sm font-medium">zerocode-devops</p>
                  </div>
                </a>

                <a
                  href="https://github.com/zerocodedevops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900/80 border border-dark-700/50 hover:border-gray-400/50 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-gray-500/10 text-gray-400 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                    <GithubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                      GitHub
                    </p>
                    <p className="text-white text-sm font-medium">zerocodedevops</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Terminal snippet */}
            <div className="rounded-2xl bg-dark-950/90 border border-dark-700/50 overflow-hidden font-mono text-sm leading-relaxed shadow-glow w-full max-w-full sm:max-w-[340px]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-800/80 bg-dark-900/80">
                <div className="flex gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-dark-400 text-xs">contact.sh</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex gap-3">
                  <span className="text-dark-500 select-none">$</span>
                  <span className="text-gray-300">echo $AVAILABILITY</span>
                </div>
                <div className="flex gap-3 pl-2">
                  <span className="text-green-400 select-none">{'>'}</span>
                  <span className="text-green-400 font-medium">
                    Open for new projects
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <span className="text-dark-500 select-none">$</span>
                  <span className="text-gray-300">echo $RESPONSE_TIME</span>
                </div>
                <div className="flex gap-3 pl-2">
                  <span className="text-primary-400 select-none">{'>'}</span>
                  <span className="text-primary-400 font-medium whitespace-nowrap">
                    Under 24 hours
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
