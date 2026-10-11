import { config } from "../../clients/madrid-zerochaos/config";

export const ContactFloat = () => {
  return (
    <a
      href={`mailto:${config.contact.email}?subject=${encodeURIComponent("Hablemos de mi proyecto")}`}
      className="zc-contact-float"
      aria-label="Escribir a ZeroChaos por correo electrónico"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg>
    </a>
  );
};
