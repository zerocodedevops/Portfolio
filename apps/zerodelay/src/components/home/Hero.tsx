import { Link } from 'react-router-dom';
import heroImage from '../../assets/Hogares.webp';

export default function Hero() {
  return <section className="zd-hero"><img className="zd-hero__photo zd-reveal" src={heroImage} alt="Imagen ilustrativa de una mudanza de hogar" fetchPriority="high" /><div className="zd-shell zd-hero__grid"><div className="zd-hero__copy zd-reveal"><h1><span className="zd-title-line"><span>Tu mudanza,</span></span><span className="zd-title-line"><span><em>bien pensada.</em></span></span></h1><p className="zd-hero__lead">Organiza tu traslado con una ruta bien pensada, atención directa y los servicios que realmente necesitas.</p><div className="zd-hero__buttons"><Link className="zd-button" to="contacto">Cuéntanos tu mudanza <span className="zd-arrow" aria-hidden="true">↗</span></Link><Link className="zd-button zd-button--outline" to="servicios">Ver servicios</Link></div><p className="zd-hero__note">La propuesta depende de origen, destino y volumen.</p></div><div className="zd-hero__manifest zd-reveal"><strong>Del punto de salida al nuevo destino.</strong>Hogar · Oficina · Grupaje · Guardamuebles</div></div></section>;
}
