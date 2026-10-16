import { useState, type FormEvent } from 'react';

export default function BudgetCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [service, setService] = useState('Mudanza de hogar');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = `Hola, quiero consultar disponibilidad para una mudanza.\nTipo: ${service}\nOrigen: ${origin}\nDestino: ${destination}`;
    window.open(`https://wa.me/34912622712?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return <section className="zd-section zd-shell" id="planificar"><div className="zd-planner zd-reveal"><div className="zd-planner__intro"><h2 className="zd-title">Traza el primer tramo.</h2><p className="zd-copy">Déjanos los datos básicos y se abrirá WhatsApp con un mensaje preparado para que puedas revisarlo y enviarlo.</p></div><form className="zd-planner__form" onSubmit={handleSubmit}><div className="zd-field"><label htmlFor="service">¿Qué necesitas mover?</label><select id="service" value={service} onChange={(event) => setService(event.target.value)}><option>Mudanza de hogar</option><option>Traslado de oficina</option><option>Guardamuebles</option><option>Grupaje</option><option>Otro servicio</option></select></div><div className="zd-field"><label htmlFor="origin">Origen</label><input id="origin" required value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="Ciudad o código postal" /></div><div className="zd-field"><label htmlFor="destination">Destino</label><input id="destination" required value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Ciudad o código postal" /></div><button className="zd-button" type="submit">Preparar consulta <span className="zd-arrow" aria-hidden="true">↗</span></button><p className="zd-form-note">Los datos se incorporan al mensaje de WhatsApp. Solo se comparten si tú lo envías desde esa aplicación.</p></form></div></section>;
}
