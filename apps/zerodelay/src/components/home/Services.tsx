import { Link } from 'react-router-dom';
import groupage from '../../assets/Grupajes.webp';
import storage from '../../assets/Guardamuebles.webp';
import home from '../../assets/Hogares.webp';
import office from '../../assets/Oficinas.webp';

const services = [
  { title: 'Mudanza de hogar', note: 'Una vivienda, muchas piezas. Organizamos el traslado contigo.', image: home, alt: 'Imagen ilustrativa de traslado de hogar' },
  { title: 'Traslado de oficina', note: 'Planifica el movimiento de mobiliario y equipos.', image: office, alt: 'Imagen ilustrativa de traslado de oficina' },
  { title: 'Guardamuebles', note: 'Consulta opciones de almacenaje según tu espacio y calendario.', image: storage, alt: 'Imagen ilustrativa de guardamuebles' },
  { title: 'Grupajes', note: 'Pregunta si hay una ruta compartida que encaje con tu traslado.', image: groupage, alt: 'Imagen ilustrativa de transporte compartido' },
];

export default function Services() {
  return <section className="zd-section"><div className="zd-shell"><div className="zd-section-head zd-reveal"><h2 className="zd-title">Servicios para cada traslado.</h2><p className="zd-copy">Hogar, oficina o almacenaje: revisamos los detalles contigo antes de proponer el servicio adecuado.</p></div><div className="zd-services-grid">{services.map((service) => <Link className="zd-service-tile zd-reveal" to="servicios" key={service.title}><img src={service.image} alt={service.alt} loading="lazy" /><span className="zd-service-tile__arrow" aria-hidden="true">↗</span><div className="zd-service-tile__body"><h3>{service.title}</h3><p>{service.note}</p></div></Link>)}</div></div></section>;
}
