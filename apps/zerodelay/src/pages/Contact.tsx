import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (aquí integrarías con un backend real)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Form data:', formData);
    setIsSubmitting(false);
    setSubmitStatus('success');

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitStatus('idle');
    }, 3000);
  };

  return (
    <div
      style={{
        padding: '5rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        backgroundColor: '#F5F5F5',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '4rem',
          backgroundColor: '#FFFFFF',
          padding: '3rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            color: '#1A237E',
            marginBottom: '0.5rem',
          }}
        >
          Recibe un Presupuesto de tu{' '}
          <span style={{ fontWeight: '700' }}>Mudanza</span>
        </h1>
        <p
          style={{ fontSize: '1.125rem', color: '#666666', marginTop: '1rem' }}
        >
          Rellena el formulario y nos pondremos en contacto contigo en menos de
          24 horas.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* Contact Info */}
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1A237E',
              marginBottom: '1.5rem',
            }}
          >
            Información de Contacto
          </h2>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                    fill="#2196F3"
                  />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.25rem',
                  }}
                >
                  Teléfono
                </p>
                <p style={{ color: '#666666' }}>91 123 45 67</p>
                <p style={{ color: '#666666' }}>612 34 56 78</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="#2196F3"
                  />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.25rem',
                  }}
                >
                  Email
                </p>
                <p style={{ color: '#666666' }}>info@zerodelay.es</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                    fill="#2196F3"
                  />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.25rem',
                  }}
                >
                  Horario
                </p>
                <p style={{ color: '#666666' }}>L-V: 8:00 - 20:00h</p>
                <p style={{ color: '#666666' }}>Sábados: 9:00 - 14:00h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #E0E0E0',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
                  onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
                  onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
                  placeholder="tu@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
                  onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
                  placeholder="612 345 678"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  Tipo de mudanza *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
                  onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
                  placeholder="Ej: Mudanza de hogar, oficina, guardamuebles..."
                />
              </div>

              {/* Message */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1A237E',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
                  onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
                  placeholder="Cuéntanos los detalles de tu mudanza..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '1.25rem 3rem',
                  background: isSubmitting
                    ? '#CCCCCC'
                    : 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 16px rgba(76, 175, 80, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(76, 175, 80, 0.3)';
                  }
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#E8F5E9',
                    border: '1px solid #4CAF50',
                    borderRadius: '8px',
                    color: '#2E7D32',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  ✓ ¡Mensaje enviado correctamente! Nos pondremos en contacto
                  contigo pronto.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
