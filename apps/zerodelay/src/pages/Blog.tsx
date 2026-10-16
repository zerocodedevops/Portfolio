import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const checklist = ['Anota origen, destino y fechas aproximadas.', 'Haz un inventario general por habitaciones o zonas.', 'Separa los objetos que necesitan un manejo especial.', 'Comprueba accesos, ascensores y restricciones de carga.', 'Deja a mano lo imprescindible para el primer día.'];

export default function Blog() {
  return <><SEO title="Preparar una mudanza | ZeroDelay" description="Una lista básica para reunir la información antes de organizar una mudanza." /><header className="zd-page-hero"><div className="zd-shell"><h1 className="zd-title">Cinco apuntes para ordenar tu mudanza.</h1><p className="zd-copy">Una lista sencilla para reunir la información antes de pedir una valoración.</p></div></header><section className="zd-section"><div className="zd-shell zd-content-grid"><article className="zd-content-card zd-reveal" style={{ gridColumn: '1 / -1' }}><ol className="zd-bullet-list">{checklist.map((item) => <li key={item}>{item}</li>)}</ol><p>Con esos datos podrás explicar mejor el alcance, aunque algunos detalles se concreten más adelante.</p><Link className="zd-button" to="../contacto">Consultar mi traslado <span className="zd-arrow" aria-hidden="true">↗</span></Link></article></div></section></>;
}
