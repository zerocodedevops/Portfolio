import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="zd-footer"><div className="zd-shell">
    <div className="zd-footer__grid">
      <div><h2>ZeroDelay</h2><p>Planificamos contigo los detalles de tu mudanza. Cuéntanos origen, destino y qué necesitas trasladar.</p></div>
      <div><h3>Explora</h3><div className="zd-footer__links"><Link to="servicios">Servicios</Link><Link to="nosotros">Cómo trabajamos</Link><Link to="ubicacion">Rutas y disponibilidad</Link><Link to="contacto">Contacto</Link></div></div>
      <div><h3>Contacto y legal</h3><div className="zd-footer__links"><a href="tel:+34912622712">91 262 27 12</a><a href="mailto:info@zerodelay.es">info@zerodelay.es</a><Link to="aviso-legal">Aviso legal</Link><Link to="privacidad">Privacidad</Link><Link to="cookies">Cookies</Link></div></div>
    </div>
    <div className="zd-footer__bottom"><span>ZeroDelay · Mudanzas y traslados</span><span>Consulta disponibilidad y alcance para tu ruta.</span></div>
  </div></footer>;
}
