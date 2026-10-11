import { Link } from "react-router-dom";
import { RootLayout } from "../core/layout/RootLayout";
import { Reveal } from "../core/components/Reveal";
import kitchenImage from "../assets/inspiration/cocina.webp";
import materialImage from "../assets/inspiration/materia.webp";
import atelierImage from "../assets/inspiration/atelier.webp";
import { useZeroChaosPath } from "../core/hooks/useZeroChaosPath";

const inspirations = [
  {
    number: "01",
    title: "Una cocina abierta",
    type: "Cocina · Roble y piedra",
    image: kitchenImage,
    alt: "Cocina de inspiración con isla de piedra y mobiliario de madera",
    text: "Una composición serena que conecta la cocina con el espacio de encuentro.",
  },
  {
    number: "02",
    title: "Materia y luz",
    type: "Interior · Texturas naturales",
    image: materialImage,
    alt: "Interior de inspiración con acabados minerales y luz cálida",
    text: "Tonos minerales y madera natural para crear profundidad sin recargar el espacio.",
  },
  {
    number: "03",
    title: "Una nueva perspectiva",
    type: "Vivienda · Reforma integral",
    image: atelierImage,
    alt: "Espacio interior de inspiración para una reforma integral",
    text: "Una propuesta visual para imaginar cómo puede cambiar la relación entre las estancias.",
  },
];

export const ProjectsTemplate = () => {
  const zcPath = useZeroChaosPath();
  return <RootLayout>
    <section className="zc-subhero zc-subhero--dark zc-subhero--projects">
      <div className="zc-shell">
        <p className="zc-eyebrow zc-eyebrow--light">Ideas para imaginar</p>
        <h1 className="zc-heading zc-heading--light">Espacios con<br /><em>otra perspectiva.</em></h1>
        <p className="zc-subhero__lead">Una selección de referencias de materiales, luz y distribución que inspiran la mirada ZeroChaos.</p>
        <a className="zc-text-link zc-text-link--light" href="#inspiracion">Ver referencias <span aria-hidden="true">↓</span></a>
      </div>
      <span className="zc-subhero__index" aria-hidden="true">02 — 04</span>
    </section>

    <section className="zc-section zc-inspirations" id="inspiracion">
      <div className="zc-shell">
        <div className="zc-section-head zc-section-head--inspiration">
          <div><p className="zc-eyebrow">Cuaderno de materiales</p><h2 className="zc-heading">Ideas, no obras<br /><span>atribuidas.</span></h2></div>
          <p className="zc-section-head__aside">Estas imágenes son referencias visuales de inspiración. No representan proyectos realizados ni trabajos propios de ZeroChaos.</p>
        </div>
        <div className="zc-inspiration-grid">
          {inspirations.map((item, index) => (
            <Reveal key={item.number} delay={index * 100} className={`zc-inspiration-card zc-inspiration-card--${index + 1}`}>
              <figure>
                <div className="zc-inspiration-card__image"><img src={item.image} alt={item.alt} loading="lazy" /><span>{item.number}</span></div>
                <figcaption><span>{item.type}</span><h3>{item.title}</h3><p>{item.text}</p></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="zc-inspiration-note"><span aria-hidden="true">✳</span><p>La selección de acabados y soluciones se define para cada espacio, con muestras y decisiones compartidas antes de avanzar.</p></div>
      </div>
    </section>

    <section className="zc-about__end">
      <div className="zc-shell"><p className="zc-eyebrow">Tu proyecto empieza aquí</p><h2>¿Qué espacio<br /><em>te gustaría cambiar?</em></h2><Link className="zc-button zc-button--dark" to={zcPath("/contacto")}>Cuéntanos tu idea <span aria-hidden="true">↗</span></Link></div>
    </section>
  </RootLayout>;
};
