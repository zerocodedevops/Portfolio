import { Link } from 'react-router-dom';
const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Mudanzas de Hogar',
      description:
        'Servicio completo de mudanza residencial para particulares. Nos ocupamos de todo, desde el embalaje hasta el montaje en tu nuevo hogar.',
      features: [
        'Embalaje profesional con materiales de calidad',
        'Desmontaje y montaje de muebles',
        'Protección de suelos y escaleras',
        'Transporte seguro con vehículos equipados',
        'Seguro a todo riesgo incluido',
        'Equipo experimentado y uniformado',
      ],
      imagePosition: 'left',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 9.3V4H17V7.6L12 3L2 12H5V20H11V14H13V20H19V12H22L19 9.3ZM17 18H15V12H9V18H7V10.19L12 5.69L17 10.19V18Z"
            fill="#2196F3"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Mudanzas de Oficina',
      description:
        'Traslado de empresas con mínima interrupción de la actividad. Planificación detallada y ejecución eficiente para relocalizaciones corporativas.',
      features: [
        'Planificación personalizada con tu equipo',
        'Mudanzas fuera de horario laboral',
        'Embalaje especializado de equipos',
        'Transporte de mobiliario de oficina',
        'Montaje y configuración en destino',
        'Gestión de archivos y documentación',
      ],
      imagePosition: 'right',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM7.5 16.5H16.5V15H7.5V16.5ZM7.5 13.5H16.5V12H7.5V13.5Z"
            fill="#2196F3"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Guardamuebles',
      description:
        'Almacenaje seguro de tus pertenencias en nuestras instalaciones vigiladas. Soluciones flexibles a corto y largo plazo.',
      features: [
        'Instalaciones seguras y climatizadas',
        'Vigilancia 24/7 con cámaras',
        'Acceso flexible a tus pertenencias',
        'Cajas y palets disponibles',
        'Tarifas competitivas mensuales',
        'Sin permanencia mínima obligatoria',
      ],
      imagePosition: 'left',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 2H4C3 2 2 2.9 2 4V7.01C2 7.73 2.43 8.35 3 8.7V20C3 21.1 4.1 22 5 22H19C19.9 22 21 21.1 21 20V8.7C21.57 8.35 22 7.73 22 7.01V4C22 2.9 21 2 20 2ZM19 20H5V9H19V20ZM20 7H4V4H20V7Z"
            fill="#2196F3"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Mudanzas Internacionales',
      description:
        'Servicio especializado para traslados al extranjero. Gestionamos toda la logística, aduanas y documentación necesaria.',
      features: [
        'Experiencia en envíos internacionales',
        'Gestión de documentación aduanera',
        'Embalaje especializado para largos trayectos',
        'Seguros internacionales completos',
        'Seguimiento en tiempo real',
        'Asesoramiento personalizado en destino',
      ],
      imagePosition: 'right',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"
            fill="#2196F3"
          />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: '2rem' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1A237E 0%, #2196F3 100%)',
          color: '#FFFFFF',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1rem',
            }}
          >
            Nuestros Servicios
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              opacity: '0.9',
              lineHeight: '1.6',
            }}
          >
            Soluciones completas de mudanza adaptadas a tus necesidades.
            Experiencia, profesionalidad y cero demoras.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((service, index) => (
        <section
          key={service.id}
          style={{
            padding: '5rem 2rem',
            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9F9F9',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center',
                flexDirection:
                  service.imagePosition === 'right' ? 'row-reverse' : 'row',
              }}
            >
              {/* Image/Icon Side */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  order: service.imagePosition === 'right' ? 2 : 1,
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    padding: '3rem',
                    borderRadius: '50%',
                    display: 'inline-flex',
                  }}
                >
                  {service.icon}
                </div>
              </div>

              {/* Content Side */}
              <div style={{ order: service.imagePosition === 'right' ? 1 : 2 }}>
                <h2
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#1A237E',
                    marginBottom: '1rem',
                  }}
                >
                  {service.title}
                </h2>
                <p
                  style={{
                    fontSize: '1.125rem',
                    color: '#666666',
                    lineHeight: '1.7',
                    marginBottom: '2rem',
                  }}
                >
                  {service.description}
                </p>

                {/* Features List */}
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '2rem',
                  }}
                >
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem',
                      }}
                    >
                      <span
                        style={{
                          color: '#4CAF50',
                          fontSize: '1.5rem',
                          lineHeight: '1',
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      <span style={{ color: '#666666', lineHeight: '1.6' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to="/contacto"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    backgroundColor: '#4CAF50',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(76, 175, 80, 0.3)';
                  }}
                >
                  Solicitar Presupuesto
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section
        style={{
          padding: '4rem 2rem',
          backgroundColor: '#1A237E',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            ¿No encuentras lo que buscas?
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              opacity: '0.9',
            }}
          >
            Ofrecemos soluciones personalizadas para cualquier tipo de mudanza.
            Contáctanos y cuéntanos tu caso.
          </p>
          <Link
            to="/contacto"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              backgroundColor: '#FFFFFF',
              color: '#1A237E',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'transform 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = 'translateY(-2px)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            Contactar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
