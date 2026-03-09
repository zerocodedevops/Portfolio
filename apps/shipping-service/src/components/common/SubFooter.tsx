import { useState } from 'react';
import PrivacyModal from './PrivacyModal';

const SubFooter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const seoTerms = [
    'Mudanzas en Madrid',
    'Empresa de Mudanzas',
    'Empresas de Guardamuebles',
    'Empresas de Mudanzas Internacionales',
    'Guardamuebles Madrid',
    'Mudanzas Guardamuebles',
    'Mudanzas Nacionales',
    'Mudanzas y Guardamuebles',
    'Servicio de Mudanzas',
    'Transporte Mudanzas Madrid',
    'Transporte y Mudanzas',
    'Traslados Madrid',
    'Trastero Madrid',
    'Mudanzas Internacionales',
    'Mudanzas Baratas Madrid',
    'Mudanzas en Madrid',
  ];

  const legalLinks = [
    'Política de Calidad y Medio Ambiente',
    'Aviso Legal y Política de Privacidad',
    'Política de Cookies',
    'Página creada por ProvidersWeb',
  ];

  return (
    <div
      style={{
        backgroundColor: '#212121',
        color: '#9E9E9E',
        fontSize: '0.75rem',
        padding: '1rem 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2rem',
        }}
      >
        {/* Shield Icon Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: '#4CAF50',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '5px',
          }}
          aria-label="Configuración de privacidad"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2ZM12 11.99H7V10H12V7.41L15.29 10.7L12 13.99V11.99Z"
              fill="white"
            />
            <path
              d="M12 22C7.31 20.77 4 16.14 4 11V5.8L12 3.12L20 5.8V11C20 16.14 16.69 20.77 12 22ZM10.5 16L17.5 9L16.09 7.59L10.5 13.17L7.91 10.59L6.5 12L10.5 16Z"
              fill="white"
            />
          </svg>
        </button>

        {/* SEO Text Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            lineHeight: '1.4',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {seoTerms.map((term, index) => (
              <span key={index}>
                {term}{' '}
                {index < seoTerms.length - 1 && (
                  <span style={{ color: '#424242', marginLeft: '0.5rem' }}>
                    |
                  </span>
                )}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              color: '#4CAF50',
              marginTop: '0.5rem',
            }}
          >
            {legalLinks.map((link, index) => (
              <span key={index}>
                {link}{' '}
                {index < legalLinks.length - 1 && (
                  <span style={{ color: '#424242', marginLeft: '0.5rem' }}>
                    |
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <PrivacyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SubFooter;
