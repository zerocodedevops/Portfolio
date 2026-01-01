import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { Send, Mail, MapPin, Phone, CheckCircle, AlertCircle, Linkedin, Github } from 'lucide-react';
import { Button, SectionTitle } from '@/components/ui';
import { fadeInUp, slideInLeft, slideInRight } from '@/hooks/useScrollAnimation';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'zerocode.devops@gmail.com',
    href: 'mailto:zerocode.devops@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Madrid, España',
    href: '#',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'zerocode-devops',
    href: 'https://www.linkedin.com/in/zerocode-devops',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'zerocodedevops',
    href: 'https://github.com/zerocodedevops',
  },
];

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
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
        publicKey
      );

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  return (
    <section id="contact" className="section relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Contacto"
          subtitle="¿Tienes un proyecto en mente? ¡Hablemos!"
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="heading-3 text-dark-100 mb-6">
              ¡Vamos a trabajar juntos!
            </h3>
            <p className="text-dark-400 mb-8">
              Estoy siempre abierto a discutir nuevos proyectos, ideas creativas 
              u oportunidades para ser parte de algo increíble.
            </p>

            <div className="space-y-4">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 border border-dark-700/50 hover:border-primary-500/30 transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-3 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-dark-500 text-sm">{info.label}</p>
                    <p className="text-dark-200 font-medium">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card p-8"
            >
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="label">
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    placeholder="Tu nombre"
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    placeholder="tu@email.com"
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="label">
                    Asunto
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="input"
                    placeholder="¿De qué quieres hablar?"
                    {...register('subject')}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400" role="alert">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="label">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    className="textarea"
                    placeholder="Tu mensaje..."
                    rows={5}
                    {...register('message')}
                    aria-invalid={errors.message ? 'true' : 'false'}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={status === 'loading'}
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
                </Button>

                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <p>¡Mensaje enviado con éxito! Te responderé pronto.</p>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <p>{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
