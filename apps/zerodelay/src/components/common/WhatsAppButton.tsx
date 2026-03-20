// WhatsApp Floating Button Component
const WhatsAppButton = () => {
  const phoneNumber = '+34912622712'; // Número de WhatsApp
  const message =
    '¡Hola! Me gustaría solicitar información sobre sus servicios de mudanzas.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        zIndex: 1000,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.6)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
      }}
      onFocus={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.6)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="whatsapp-title"
      >
        <title id="whatsapp-title">WhatsApp Contact</title>
        <path
          d="M16 2C8.3 2 2 8.3 2 16C2 18.4 2.6 20.6 3.7 22.5L2.1 28.9L8.7 27.3C10.5 28.3 12.6 28.9 14.9 28.9C22.6 28.9 28.9 22.6 28.9 14.9C29 8.3 23.7 2 16 2ZM23.4 21.5C23.1 22.4 21.6 23.2 20.8 23.3C20.2 23.4 19.4 23.4 18.5 23.1C17.9 22.9 17.2 22.6 16.3 22.2C12.9 20.7 10.7 17.3 10.5 17.1C10.3 16.8 9 15.1 9 13.3C9 11.5 9.9 10.6 10.3 10.2C10.6 9.9 11 9.8 11.3 9.8C11.4 9.8 11.6 9.8 11.7 9.8C12 9.8 12.3 9.8 12.5 10.4C12.8 11.1 13.5 12.9 13.6 13C13.7 13.1 13.7 13.3 13.6 13.4C13.5 13.6 13.4 13.7 13.2 13.9C13 14.1 12.8 14.4 12.7 14.5C12.5 14.7 12.3 14.9 12.5 15.2C12.7 15.6 13.4 16.7 14.5 17.7C15.8 18.8 16.9 19.2 17.3 19.4C17.6 19.5 17.8 19.5 18 19.3C18.2 19.1 18.9 18.3 19.1 17.9C19.3 17.6 19.6 17.6 19.9 17.7C20.2 17.8 22 18.7 22.3 18.9C22.7 19.1 22.9 19.2 23 19.3C23.1 19.6 23.1 20.2 22.9 20.9C22.8 21.1 23.7 20.6 23.4 21.5Z"
          fill="white"
        />
      </svg>

      {/* Pulse Animation */}
      <div
        style={{
          position: 'absolute',
          inset: '-5px',
          borderRadius: '50%',
          border: '3px solid #25D366',
          animation: 'pulse 2s infinite',
          opacity: 0.6,
        }}
      ></div>

      <style>{`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                }
            `}</style>
    </a>
  );
};

export default WhatsAppButton;
