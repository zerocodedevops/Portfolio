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
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui';
import { RecaptchaV2, type RecaptchaV2Handle } from '@/components/RecaptchaV2';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { slideInLeft, slideInRight } from '@/hooks/useScrollAnimation';
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
      setErrorMessage('Completa la verificación antispam antes de enviar.');
      setStatus('error');
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
    <section id="contacto" className="relative bg-[#f3f7fa] py-20 sm:py-24">
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

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start mt-8">
          {/* Left Column: Info & Form */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="font-outfit text-2xl font-semibold text-[#0a203d] sm:text-3xl">
                Diseño web a medida desde 400 €
              </h3>
              <div className="space-y-2 text-base leading-7 text-[#586a80]">
                <p>Trabajo online en toda España.</p>
                <p>Puedes traer una idea definida o pedirme que proponga el diseño.</p>
              </div>
              
              <div className="flex w-fit items-center gap-4 border border-[#d5e0e8] bg-white p-4">
                <div className="bg-[#e5f7fc] p-2.5 text-[#087cae]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#718197]">
                    Atención online
                  </p>
                  <p className="text-sm font-medium text-[#0b294a]">Toda España</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <form onFocusCapture={() => setCaptchaRequested(true)} onSubmit={handleSubmit(onSubmit)} className="border border-[#d5e0e8] bg-white p-6 sm:p-8">
              <div className="space-y-6">
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
                    className="w-full border border-[#cbd7e1] bg-white p-4 text-[#0b294a] placeholder:text-[#8291a2] focus:border-[#0789bd] focus:outline-none focus:ring-2 focus:ring-[#0789bd]/20"
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
                    className="w-full border border-[#cbd7e1] bg-white p-4 text-[#0b294a] placeholder:text-[#8291a2] focus:border-[#0789bd] focus:outline-none focus:ring-2 focus:ring-[#0789bd]/20"
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
                    className="w-full border border-[#cbd7e1] bg-white p-4 text-[#0b294a] placeholder:text-[#8291a2] focus:border-[#0789bd] focus:outline-none focus:ring-2 focus:ring-[#0789bd]/20"
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
                    className="w-full border border-[#cbd7e1] bg-white p-4 text-[#0b294a] placeholder:text-[#8291a2] focus:border-[#0789bd] focus:outline-none focus:ring-2 focus:ring-[#0789bd]/20"
                    placeholder={t('contact.form.placeholders.message')}
                    rows={4}
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
                  <p className="border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="status">
                    La protección antispam aún no está configurada. Puedes contactar por correo o WhatsApp.
                  </p>
                ) : (
                  <p className="text-sm text-slate-600">La protección antispam se carga al empezar a rellenar el formulario.</p>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-base mt-4"
                  isLoading={status === 'loading'}
                  disabled={!captchaSiteKey || !captchaToken || status === 'loading'}
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  {status === 'loading'
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
                </Button>

                <p className="text-xs leading-5 text-slate-600">
                  Responsable: David González (ZeroCode DevOps). Trataré tu nombre, correo y consulta para responderte y, si lo solicitas, preparar una propuesta; la base será atender medidas precontractuales que pidas o mi interés legítimo en responder a otras consultas. El formulario se envía mediante EmailJS a mi correo y no usaré tus datos para publicidad. Las consultas que no generen contratación se suprimen a los 90 días desde la última interacción, salvo excepciones legales. Puedes ejercer tus derechos en admin@zerocode-devops.com o reclamar ante la AEPD. Consulta proveedores, destinatarios y más información en la{' '}
                  <a className="underline" href="/politica-de-privacidad">política de privacidad</a>.
                </p>

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

          {/* Right Column: Channels Card & Terminal */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8 lg:sticky lg:top-24"
          >
            <div className="border border-[#d5e0e8] bg-white p-6 sm:p-8">
              <h4 className="font-outfit mb-6 text-lg font-semibold text-[#0b294a]">Escríbeme</h4>
              <div className="space-y-3">
                <a
                  href="mailto:admin@zerocode-devops.com"
                  className="group flex items-center gap-4 border border-[#dce4eb] bg-white p-4 transition hover:border-[#0789bd]"
                >
                  <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#718197]">
                      Email
                    </p>
                    <p className="text-sm font-medium text-[#0b294a]">
                      admin@zerocode-devops.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/34912622712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border border-[#dce4eb] bg-white p-4 transition hover:border-[#0789bd]"
                >
                  <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#718197]">
                      WhatsApp
                    </p>
                    <p className="text-sm font-medium text-[#0b294a]">Enviar un mensaje</p>
                  </div>
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
