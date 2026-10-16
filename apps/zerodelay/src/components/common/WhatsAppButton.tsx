import { useEffect, useState } from 'react';

const phone = '34912622712';
const message = encodeURIComponent('Hola, quiero consultar una mudanza.');

export default function WhatsAppButton() {
  const [coveredByContact, setCoveredByContact] = useState(false);
  useEffect(() => {
    const callout = document.querySelector('.zd-callout');
    if (!callout || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setCoveredByContact(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(callout);
    return () => observer.disconnect();
  }, []);
  return <a className="zd-wa" hidden={coveredByContact} href={`https://wa.me/${phone}?text=${message}`} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp">WA</a>;
}
