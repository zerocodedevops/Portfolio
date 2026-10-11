import { Link } from "react-router-dom";
import { RootLayout } from "../core/layout/RootLayout";
import { Reveal } from "../core/components/Reveal";
import { useZeroChaosPath } from "../core/hooks/useZeroChaosPath";
import type { BarrioConfig } from "../core/types";
import atelierImage from "../assets/inspiration/atelier.webp";

interface BarrioTemplateProps { barrio: BarrioConfig }

export const BarrioTemplate = ({ barrio }: BarrioTemplateProps) => {
  const zcPath = useZeroChaosPath();
  return (
    <RootLayout>
      <section className="zc-subhero zc-subhero--dark">
        <div className="zc-shell">
          <p className="zc-eyebrow zc-eyebrow--light">Reformas en Madrid</p>
          <h1 className="zc-heading zc-heading--light">Tu vivienda en<br /><em>{barrio.name}.</em></h1>
          <p className="zc-subhero__lead">{barrio.description}</p>
          <Link className="zc-button zc-button--light" to={zcPath("/contacto")}>Hablar de mi espacio <span aria-hidden="true">↗</span></Link>
        </div>
        <span className="zc-subhero__index" aria-hidden="true">ZEROCHAOS · MADRID</span>
      </section>

      <section className="zc-section zc-barrio">
        <div className="zc-shell zc-barrio__grid">
          <Reveal>
            <p className="zc-eyebrow">Una reforma con contexto</p>
            <h2 className="zc-heading">Cada vivienda<br /><span>tiene su carácter.</span></h2>
          </Reveal>
          <Reveal delay={100} className="zc-barrio__copy">
            <p className="zc-lead">La ubicación, la distribución y la luz forman parte de las decisiones del proyecto.</p>
            <p>En una primera conversación podemos conocer el espacio, qué te gustaría cambiar y el alcance que tienes en mente. La propuesta se concreta después de revisar sus condiciones y necesidades.</p>
            <Link className="zc-text-link" to={zcPath("/contacto")}>Cuéntanos tu idea <span aria-hidden="true">↗</span></Link>
          </Reveal>
        </div>
      </section>

      <section className="zc-barrio__image">
        <img src={atelierImage} alt="Imagen de inspiración para una vivienda en Madrid" loading="lazy" />
        <div><p className="zc-eyebrow zc-eyebrow--light">{barrio.name} · Madrid</p><p>Una nueva lectura<br />para tu espacio.</p></div>
      </section>

      <section className="zc-section zc-barrio__next">
        <div className="zc-shell"><p className="zc-eyebrow">Primer paso</p><h2 className="zc-heading">Pongamos orden<br /><span>a las ideas.</span></h2><Link className="zc-button zc-button--dark" to={zcPath("/contacto")}>Iniciar una conversación <span aria-hidden="true">↗</span></Link></div>
      </section>
    </RootLayout>
  );
};
