import { Link } from "react-router-dom";
import { RootLayout } from "../core/layout/RootLayout";
import { Reveal } from "../core/components/Reveal";
import type { ServiceConfig } from "../core/types";
import atelierImage from "../assets/inspiration/atelier.webp";
import kitchenImage from "../assets/inspiration/cocina.webp";
import materialImage from "../assets/inspiration/materia.webp";
import { useZeroChaosPath } from "../core/hooks/useZeroChaosPath";

interface ServiceTemplateProps { service: ServiceConfig }

const imageByService: Record<string, { src: string; alt: string }> = {
  integrales: { src: atelierImage, alt: "Interior de inspiración para una reforma integral" },
  cocinas: { src: kitchenImage, alt: "Cocina de inspiración con madera y piedra" },
  banos: { src: materialImage, alt: "Detalle de materiales naturales e iluminación cálida" },
};

export const ServiceTemplate = ({ service }: ServiceTemplateProps) => {
  const zcPath = useZeroChaosPath();
  const image = imageByService[service.id] ?? imageByService.integrales;

  return (
    <RootLayout>
      <section className="zc-service-hero">
        <div className="zc-service-hero__image"><img src={image.src} alt={image.alt} /></div>
        <div className="zc-service-hero__shade" />
        <div className="zc-shell zc-service-hero__content">
          <p className="zc-eyebrow zc-eyebrow--light">Diseño · Material · Oficio</p>
          <h1>{service.name}<br /><em>con intención.</em></h1>
          <p>{service.shortDescription}</p>
          <Link className="zc-button zc-button--light" to={zcPath("/contacto")}>Cuéntanos qué necesitas <span aria-hidden="true">↗</span></Link>
        </div>
        <span className="zc-service-hero__caption">ZEROCHAOS · MADRID</span>
      </section>

      <section className="zc-section zc-service-story">
        <div className="zc-shell zc-service-story__grid">
          <Reveal><p className="zc-eyebrow">01 / El espacio</p><h2 className="zc-heading">Una reforma<br /><span>hecha a tu medida.</span></h2></Reveal>
          <Reveal delay={100} className="zc-service-story__copy"><p className="zc-lead">{service.fullContent}</p><p>El proyecto define el alcance, las decisiones de diseño y los siguientes pasos de forma clara. Cada propuesta se prepara después de conocer el espacio y las prioridades de quienes lo habitan.</p><Link className="zc-text-link" to={zcPath("/contacto")}>Hablar de mi espacio <span aria-hidden="true">↗</span></Link></Reveal>
        </div>
      </section>

      <section className="zc-service-values">
        <div className="zc-shell zc-service-values__grid">
          {[
            ["01", "Distribución", "Proporciones y recorridos pensados para el día a día."],
            ["02", "Materiales", "Texturas y acabados elegidos en relación con el espacio."],
            ["03", "Planificación", "Un alcance definido y decisiones revisadas antes de avanzar."],
          ].map(([number, title, text]) => <Reveal key={number} className="zc-service-value"><span>{number}</span><h3>{title}</h3><p>{text}</p></Reveal>)}
        </div>
      </section>

      <section className="zc-section zc-service-faq">
        <div className="zc-shell zc-faq__layout">
          <div><p className="zc-eyebrow">02 / Dudas habituales</p><h2 className="zc-heading">Antes de<br /><span>dar el paso.</span></h2><p className="zc-faq__intro">Cada vivienda tiene sus particularidades. La primera conversación nos ayuda a ponerlas en contexto.</p></div>
          <div className="zc-faq__list">{service.faqs.map((faq) => <details key={faq.question} className="zc-faq__item"><summary><span>{faq.question}</span><i aria-hidden="true">+</i></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="zc-about__end"><div className="zc-shell"><p className="zc-eyebrow">Empecemos con una conversación</p><h2>Tu espacio.<br /><em>Tu siguiente etapa.</em></h2><Link className="zc-button zc-button--dark" to={zcPath("/contacto")}>Contactar con ZeroChaos <span aria-hidden="true">↗</span></Link></div></section>
    </RootLayout>
  );
};
