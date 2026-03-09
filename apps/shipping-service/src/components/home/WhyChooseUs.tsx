const WhyChooseUs = () => {
  const advantages = [
    {
      id: 1,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="icon-particulares"
        >
          <title id="icon-particulares">Traslados de Particulares</title>
          <path
            d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
            fill="#2196F3"
          />
        </svg>
      ),
      title: 'Traslados de Particulares',
      description:
        'Nos responsabilizamos de todas las etapas del Traslado de su vivienda. Realizamos mudanzas a Particulares.',
    },
    {
      id: 2,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="icon-montaje"
        >
          <title id="icon-montaje">Desmontaje y Montaje de Muebles</title>
          <path
            d="M20 8H18V6C18 4.89 17.11 4 16 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V10C22 8.89 21.11 8 20 8ZM4 6H16V11H4V6ZM4 18V13H20V18H4ZM9 15H7V17H9V15ZM13 15H11V17H13V15ZM17 15H15V17H17V15Z"
            fill="#2196F3"
          />
        </svg>
      ),
      title: 'Desmontaje y Montaje de Muebles',
      description:
        'Disponemos de Personal Especialista propio. Garantizamos el perfecto traslado de sus muebles y enseres.',
    },
    {
      id: 3,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="icon-empresa"
        >
          <title id="icon-empresa">Empresa de mudanzas</title>
          <path
            d="M12 2L2 7V12C2 17.55 5.84 22.74 12 24C18.16 22.74 22 17.55 22 12V7L12 2ZM12 12.99H20C19.47 17.11 16.72 20.78 12 21.93V13H4V7.3L12 3.19V12.99Z"
            fill="#2196F3"
          />
        </svg>
      ),
      title: 'Empresa de mudanzas',
      description:
        'No sólo en Madrid Capital, También Realizamos Mudanzas a nivel Nacional incluidos Canarias y Baleares.',
    },
    {
      id: 4,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="icon-eficacia"
        >
          <title id="icon-eficacia">Eficacia y organización</title>
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
            fill="#2196F3"
          />
        </svg>
      ),
      title: 'Eficacia y organización',
      description:
        'En todos los procesos de la mudanza para continuar con el normal funcionamiento de su empresa.',
    },
  ];

  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: '#F9F9F9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Intro Text */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#1A237E',
              marginBottom: '2rem',
              maxWidth: '900px',
              margin: '0 auto 2rem',
              lineHeight: '1.7',
            }}
          >
            Realizamos un Servicio Integral de Mudanzas. Personal especialista
            propio. Disponemos tanto de Plataformas Montamuebles así como
            Vehículos acordes a la Mudanza a trasladar.
          </p>
          <p
            style={{
              fontSize: '1.25rem',
              color: '#2196F3',
              fontWeight: '600',
              marginBottom: '3rem',
            }}
          >
            Pida Presupuesto sin Compromiso
          </p>
        </div>

        {/* Advantages Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
          }}
        >
          {advantages.map((advantage) => (
            <div
              key={advantage.id}
              style={{
                textAlign: 'center',
                padding: '0 1rem',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  display: 'inline-flex',
                  marginBottom: '1.5rem',
                }}
              >
                {advantage.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#333333',
                  marginBottom: '1rem',
                }}
              >
                {advantage.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: '#666666',
                  lineHeight: '1.6',
                  fontSize: '0.9375rem',
                }}
              >
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
