import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Mail,
  Send,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui';
import { RecaptchaV2, type RecaptchaV2Handle } from '@/components/RecaptchaV2';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { slideInLeft, slideInRight } from '@/hooks/useScrollAnimation';
import { ParallaxBackdrop } from '@/components/ui/ParallaxBackdrop';
import { sileo } from 'sileo';

export function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackMailto, setFallbackMailto] = useState('mailto:admin@zerocode-devops.com');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaRequested, setCaptchaRequested] = useState(false);
  const captchaRef = useRef<RecaptchaV2Handle>(null);
  const captchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const handleCaptchaError = useCallback(() => {
    setErrorMessage('No se pudo cargar la protección antispam. Puedes escribirme directamente por correo.');
  }, []);
  const handleCaptchaTokenChange = useCallback((token: string) => {
    setCaptchaToken(token);
    if (token) setErrorMessage('');
  }, []);

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('contact.form.validation.name')).max(120),
        email: z.string().trim().max(254).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          message: t('contact.form.validation.email'),
        }),
        subject: z.string().trim().min(5, t('contact.form.validation.subject')).max(120),
        message: z.string().trim().min(10, t('contact.form.validation.message')).max(5000),
        companyWebsite: z.string().max(0).optional(),
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
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.companyWebsite) return;
    if (!captchaSiteKey) {
      setErrorMessage('El formulario está pendiente de configurar reCAPTCHA. Puedes escribirme directamente por correo.');
      setStatus('error');
      return;
    }
    if (!captchaToken) {
      setCaptchaRequested(true);
      setErrorMessage('La verificación de seguridad se está cargando. Complétala y vuelve a pulsar Enviar Mensaje.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setFallbackMailto(`mailto:admin@zerocode-devops.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Nombre: ${data.name}\nCorreo: ${data.email}\n\n${data.message}`)}`);

    try {
      // EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        const message = t('contact.form.notConfigured');
        setErrorMessage(message);
        setStatus('error');
        sileo.error({
          title: t('contact.form.errorTitle'),
          description: message,
        });
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
          'g-recaptcha-response': captchaToken,
        },
        publicKey,
      );

      sileo.success({
        title: t('contact.form.success'),
        description: 'En breve me pondré en contacto contigo.',
      });
      setStatus('success');
      reset();
      captchaRef.current?.reset();
    } catch {
      sileo.error({
        title: 'Error al enviar el mensaje',
        description: t('contact.form.error'),
      });
      setStatus('error');
      setErrorMessage(t('contact.form.error'));
      captchaRef.current?.reset();
    }
  };

  return (
    <section id="contacto" className="relative isolate overflow-hidden bg-[#f3f7fa] py-20 sm:py-24">
      <ParallaxBackdrop />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="mx-auto mb-12 max-w-5xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[#087cae]">Cuéntame tu idea</p>
          <h2 className="font-outfit mb-5 text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">
            Hablemos de tu proyecto
          </h2>
          <div className="space-y-1 text-base leading-7 text-[#586a80]">
            <p>Cuéntame qué necesita tu negocio.</p>
            <p>Te responderé personalmente con los siguientes pasos.</p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Form card */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="h-full"
          >
            {/* Contact form */}
            <form onSubmit={handleSubmit(onSubmit)} className="h-full rounded-3xl border border-[#d7e4ec] bg-white p-5 shadow-[0_24px_70px_rgba(7,26,53,0.07)] sm:p-7">
              <div className="mb-6 border-b border-[#e7eef3] pb-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.17em] text-[#087cae]">Diseño web a medida</p>
                <h3 className="font-outfit text-2xl font-semibold tracking-tight text-[#0a203d] sm:text-3xl">
                  Una web para tu negocio.
                </h3>
                <p className="mt-2 font-semibold text-[#0a203d]">Precio mínimo: 400 € + IVA</p>
                <div className="mt-2 space-y-1 text-sm leading-6 text-[#586a80] sm:text-base">
                  <p>Trabajo online en toda España.</p>
                  <p>Trae tu idea o te propongo el diseño.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="companyWebsite">Deja este campo vacío</label>
                  <input id="companyWebsite" tabIndex={-1} autoComplete="off" {...register('companyWebsite')} />
                </div>
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-2 text-sm font-bold text-[#263c56]">
                    {t('contact.form.name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full rounded-xl border border-[#d5e0e8] bg-[#f8fafc] px-4 py-3.5 text-[#0b294a] placeholder:text-[#8291a2] transition-colors focus:border-[#0789bd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0789bd]/10"
                    placeholder={t('contact.form.placeholders.name')}
                    maxLength={120}
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    required={true}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-sm font-medium text-red-700" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-2 text-sm font-bold text-[#263c56]">
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-xl border border-[#d5e0e8] bg-[#f8fafc] px-4 py-3.5 text-[#0b294a] placeholder:text-[#8291a2] transition-colors focus:border-[#0789bd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0789bd]/10"
                    placeholder={t('contact.form.placeholders.email')}
                    maxLength={254}
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    required={true}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-sm font-medium text-red-700" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                  <label htmlFor="subject" className="mb-2 text-sm font-bold text-[#263c56]">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full rounded-xl border border-[#d5e0e8] bg-[#f8fafc] px-4 py-3.5 text-[#0b294a] placeholder:text-[#8291a2] transition-colors focus:border-[#0789bd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0789bd]/10"
                    placeholder={t('contact.form.placeholders.subject')}
                    maxLength={120}
                    {...register('subject')}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    required
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-2 text-sm font-medium text-red-700" role="alert">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label htmlFor="message" className="mb-2 text-sm font-bold text-[#263c56]">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-xl border border-[#d5e0e8] bg-[#f8fafc] px-4 py-3.5 text-[#0b294a] placeholder:text-[#8291a2] transition-colors focus:border-[#0789bd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0789bd]/10"
                    placeholder={t('contact.form.placeholders.message')}
                    rows={3}
                    maxLength={5000}
                    {...register('message')}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    required={true}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-sm font-medium text-red-700" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {captchaSiteKey && captchaRequested ? (
                  <RecaptchaV2
                    ref={captchaRef}
                    siteKey={captchaSiteKey}
                    onTokenChange={handleCaptchaTokenChange}
                    onError={handleCaptchaError}
                  />
                ) : !captchaSiteKey ? (
                  <div className="space-y-2 border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="status">
                    <p>La protección antispam aún no está configurada.</p>
                    <p>Puedes contactar por correo o WhatsApp.</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">La verificación de seguridad se carga cuando intentas enviar el formulario.</p>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-base mt-4"
                  isLoading={status === 'loading'}
                  disabled={!captchaSiteKey || status === 'loading'}
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  {status === 'loading'
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
                </Button>

                <div className="space-y-1 text-xs leading-5 text-[#718197]">
                  <p>Responsable: David González (ZeroCode DevOps).</p>
                  <p>Usaré tus datos para responder a tu consulta.</p>
                  <p><a className="font-semibold text-[#087cae] underline underline-offset-2 hover:text-[#071a35]" href="/politica-de-privacidad">Privacidad y derechos</a>.</p>
                </div>

                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      role="status"
                      className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-800 mt-4"
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
                      role="alert"
                      className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-800 mt-4"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <div className="text-sm font-medium"><div className="space-y-1">{errorMessage.split(/(?<=\.)\s+/).map((sentence) => <p key={sentence}>{sentence}</p>)}</div><a className="mt-2 inline-block underline underline-offset-2" href={fallbackMailto}>Escríbeme directamente por correo</a></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Contact channels */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="self-start lg:sticky lg:top-24"
          >
            <div className="rounded-3xl border border-[#d7e4ec] bg-white/95 p-6 shadow-[0_24px_70px_rgba(7,26,53,0.07)] sm:p-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.17em] text-[#087cae]">Contacto directo</p>
              <h4 className="font-outfit mb-7 text-2xl font-semibold tracking-tight text-[#0b294a]">Escríbeme</h4>
              <div className="space-y-3.5">
                <a
                  href="mailto:admin@zerocode-devops.com"
                  className="group flex min-w-0 items-center gap-4 rounded-2xl border border-[#e2ebf1] bg-gradient-to-br from-[#f8fbfd] to-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#9bdced] hover:shadow-[0_14px_30px_rgba(7,26,53,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0789bd]/15"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5f7fc] text-[#0789bd] transition-colors group-hover:bg-[#0789bd] group-hover:text-white">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#718197]">
                      Email
                    </p>
                    <p className="break-words text-sm font-semibold text-[#0b294a] sm:text-base">
                      admin@zerocode-devops.com
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8b9aac] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0789bd]" aria-hidden="true" />
                </a>

                <a
                  href="https://wa.me/34912622712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-4 rounded-2xl border border-[#e2ebf1] bg-gradient-to-br from-[#f8fbfd] to-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#a9dfbd] hover:shadow-[0_14px_30px_rgba(7,26,53,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0789bd]/15"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf8ef] text-[#178b4d] transition-colors group-hover:bg-[#178b4d] group-hover:text-white">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#718197]">
                      WhatsApp
                    </p>
                    <p className="text-sm font-semibold text-[#0b294a] sm:text-base">Enviar un mensaje</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8b9aac] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#178b4d]" aria-hidden="true" />
                </a>

              </div>
            </div>

            {/* Terminal snippet */}
            <div className="hidden">
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
                  <span className="text-dark-400 select-none">$</span>
                  <span className="text-gray-300">echo $AVAILABILITY</span>
                </div>
                <div className="flex gap-3 pl-2">
                  <span className="text-green-400 select-none">{'>'}</span>
                  <span className="text-green-400 font-medium">
                    Open for new projects
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <span className="text-dark-400 select-none">$</span>
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
