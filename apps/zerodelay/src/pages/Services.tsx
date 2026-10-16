import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import home from '../assets/Hogares.webp';
import office from '../assets/Oficinas.webp';
import storage from '../assets/Guardamuebles.webp';
import groupage from '../assets/Grupajes.webp';

const services = [
  { id: 'hogar', title: 'Mudanzas de hogar', intro: 'Un cambio de vivienda reúne objetos, tiempos y accesos distintos. Cuéntanos qué hay que trasladar para valorar el alcance.', image: home, alt: 'Imagen ilustrativa de mudanza de hogar', items: ['Origen, destino y fechas aproximadas', 'Volumen y objetos que requieren atención especial', 'Accesos, plantas y posibles restricciones'] },
  { id: 'oficina', title: 'Traslados de oficina', intro: 'Organiza el movimiento de mobiliario y equipos con una secuencia acordada para tu espacio y actividad.', image: office, alt: 'Imagen ilustrativa de traslado de oficina', items: ['Espacios y elementos que se trasladan', 'Ventana de fechas y coordinación', 'Necesidades de desmontaje o protección'] },
  { id: 'guardamuebles', title: 'Guardamuebles', intro: 'Si las fechas de salida y entrada no coinciden, consulta disponibilidad y condiciones para almacenar tus pertenencias.', image: storage, alt: 'Imagen ilustrativa de guardamuebles', items: ['Volumen aproximado', 'Tiempo previsto de almacenamiento', 'Acceso y condiciones que necesitas'] },
  { id: 'grupajes', title: 'Grupajes', intro: 'Para algunos trayectos puede haber opciones de carga compartida. La disponibilidad depende de ruta y calendario.', image: groupage, alt: 'Imagen ilustrativa de transporte compartido', items: ['Poblaciones de origen y destino', 'Flexibilidad de fechas', 'Volumen y tipo de carga'] },
];

export default function Services() {
  return <><SEO title="Servicios de mudanza | ZeroDelay" description="Mudanzas de hogar y oficina, guardamuebles y grupajes. Consulta qué opción encaja con tu trayecto." /><header className="zd-page-hero"><div className="zd-shell"><h1 className="zd-title">La mudanza se diseña alrededor de tu ruta.</h1><p className="zd-copy">Revisamos contigo el trayecto, el volumen y el calendario para valorar el servicio que necesitas.</p></div></header><div className="zd-shell">{services.map((service) => <section className="zd-detail-row zd-reveal" id={service.id} key={service.id}><img className="zd-detail-row__image" src={service.image} alt={service.alt} loading="lazy" /><div><h2>{service.title}</h2><p>{service.intro}</p><ul className="zd-bullet-list">{service.items.map((item) => <li key={item}>{item}</li>)}</ul><Link className="zd-button zd-button--outline" to="../contacto">Consultar disponibilidad <span className="zd-arrow" aria-hidden="true">↗</span></Link></div></section>)}</div></>;
}
