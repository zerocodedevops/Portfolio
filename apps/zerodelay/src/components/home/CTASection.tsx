import { Link } from 'react-router-dom';

export default function CTASection() {
  return <section className="zd-callout"><div className="zd-shell zd-callout__inner zd-reveal"><div><h2 className="zd-title">Cuéntanos de dónde sales y adónde vas.</h2></div><Link className="zd-button" to="contacto">Hablar de mi mudanza <span className="zd-arrow" aria-hidden="true">↗</span></Link></div></section>;
}
