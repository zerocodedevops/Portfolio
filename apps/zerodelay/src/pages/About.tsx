import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const steps = [{ title: 'Escuchar', text: 'Entender el destino, las fechas y qué necesitas trasladar.' }, { title: 'Valorar', text: 'Revisar el volumen, los accesos y los servicios que pueden hacer falta.' }, { title: 'Coordinar', text: 'Acordar contigo el alcance y los siguientes pasos antes de confirmar.' }];

export default function About() {
  return <><SEO title="Cómo trabajamos | ZeroDelay" description="Conoce el proceso para consultar y organizar tu mudanza con ZeroDelay." /><header className="zd-page-hero"><div className="zd-shell"><h1 className="zd-title">Cada traslado empieza con una conversación concreta.</h1><p className="zd-copy">ZeroDelay organiza servicios de mudanza y traslado. Queremos que puedas explicar tu caso y conocer el alcance antes de tomar una decisión.</p></div></header><section className="zd-section"><div className="zd-shell"><div className="zd-process-grid">{steps.map((step) => <article className="zd-process-step zd-reveal" key={step.title}><h2>{step.title}</h2><p>{step.text}</p></article>)}</div><div className="zd-topline" style={{ paddingTop: 36, marginTop: 48 }}><p className="zd-copy">La propuesta depende de la ruta, el volumen, las fechas y las condiciones del traslado. Si algún dato aún no está claro, podemos empezar por lo que ya sabes.</p><Link className="zd-button" to="../contacto">Cuéntanos tu caso <span className="zd-arrow" aria-hidden="true">↗</span></Link></div></div></section></>;
}
