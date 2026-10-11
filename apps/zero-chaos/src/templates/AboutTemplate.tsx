import { Link } from "react-router-dom";
import { RootLayout } from "../core/layout/RootLayout";
import { Reveal } from "../core/components/Reveal";
import materialImage from "../assets/inspiration/materia.webp";
import { useZeroChaosPath } from "../core/hooks/useZeroChaosPath";

const principles = [
  {
    number: "01",
    title: "Escuchar antes de proyectar",
    text: "Cada vivienda y cada forma de vivirla son distintas. El diseño empieza entendiendo qué necesitas conservar, cambiar y sentir.",
  },
  {
    number: "02",
    title: "Elegir con criterio",
    text: "Distribución, luz, textura y materiales se piensan como un conjunto: atractivo, funcional y coherente con el uso diario.",
  },
  {
    number: "03",
    title: "Dar claridad al proceso",
    text: "Las decisiones, el alcance y los siguientes pasos se hablan de forma directa antes de avanzar con cada fase.",
  },
];

export const AboutTemplate = () => {
  const zcPath = useZeroChaosPath();
  return <RootLayout>
    <section className="zc-subhero zc-subhero--dark">
      <div className="zc-shell">
        <p className="zc-eyebrow zc-eyebrow--light">La mirada ZeroChaos</p>
        <h1 className="zc-heading zc-heading--light">Menos ruido.<br /><em>Más intención.</em></h1>
        <p className="zc-subhero__lead">Una reforma transforma un espacio. Un buen proyecto también mejora la forma de vivirlo.</p>
        <a className="zc-text-link zc-text-link--light" href={zcPath("#filosofia")}>Descubre nuestra filosofía <span aria-hidden="true">↓</span></a>
      </div>
      <span className="zc-subhero__index" aria-hidden="true">01 — 04</span>
    </section>

    <section className="zc-section zc-about" id="filosofia">
      <div className="zc-shell zc-about__intro">
        <Reveal>
          <p className="zc-eyebrow">Una forma de hacer</p>
          <h2 className="zc-heading">La calma también<br /><span>se puede diseñar.</span></h2>
        </Reveal>
        <Reveal className="zc-about__copy" delay={100}>
          <p className="zc-lead">ZeroChaos nace de una idea sencilla: una reforma debe sentirse tan bien pensada como el espacio que deja atrás.</p>
          <p>Por eso reunimos diseño, materiales y planificación en una misma conversación. Buscamos equilibrio entre carácter y comodidad, con decisiones claras en cada etapa.</p>
          <p>Esta propuesta se centra en viviendas de Madrid y se adapta a las necesidades y al alcance de cada proyecto.</p>
        </Reveal>
      </div>
    </section>

    <section className="zc-section zc-about__principles">
      <div className="zc-shell">
        <div className="zc-section-head">
          <div><p className="zc-eyebrow">Lo que guía cada decisión</p><h2 className="zc-heading">Tres principios.<br /><span>Un espacio propio.</span></h2></div>
        </div>
        <div className="zc-about__grid">
          {principles.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 110} className="zc-about__card">
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="zc-about__image" aria-label="Inspiración de interiores">
      <img src={materialImage} alt="Interior de inspiración con madera, piedra y luz natural" loading="lazy" />
      <div><p className="zc-eyebrow zc-eyebrow--light">Materiales honestos · Espacios vividos</p><p>La belleza aparece<br />cuando todo encuentra<br /><em>su lugar.</em></p></div>
    </section>

    <section className="zc-about__end">
      <div className="zc-shell"><p className="zc-eyebrow">El siguiente paso</p><h2>Empecemos por<br /><em>escuchar tu idea.</em></h2><Link className="zc-button zc-button--dark" to={zcPath("/contacto")}>Hablemos de tu proyecto <span aria-hidden="true">↗</span></Link></div>
    </section>
  </RootLayout>;
};
