import { Link } from "react-router-dom";
import { RootLayout } from "../core/layout/RootLayout";
import { servicios } from "../clients/madrid-zerochaos/servicios";
import { Reveal } from "../core/components/Reveal";
import { ParallaxImage } from "../core/components/ParallaxImage";
import { useZeroChaosPath } from "../core/hooks/useZeroChaosPath";
import atelierImage from "../assets/inspiration/atelier.webp";
import kitchenImage from "../assets/inspiration/cocina.webp";
import materialImage from "../assets/inspiration/materia.webp";

const conceptImages = [
  {
    src: kitchenImage,
    alt: "Cocina contemporánea con acabados de madera y piedra",
    title: "La cocina, en equilibrio",
    category: "Cocinas · Materiales naturales",
    number: "01",
  },
  {
    src: materialImage,
    alt: "Interior cálido con superficies minerales y carpintería de roble",
    title: "Texturas que perduran",
    category: "Interiores · Piedra y roble",
    number: "02",
  },
];

const faqs = [
  {
    question: "¿Cómo empieza una reforma?",
    answer:
      "Empezamos con una conversación y una visita para entender el espacio, las prioridades y el alcance. Después preparamos una propuesta detallada para que puedas decidir con toda la información.",
  },
  {
    question: "¿Puedo elegir los materiales y acabados?",
    answer:
      "Sí. Te acompañamos en la selección de materiales, acabados e iluminación para que cada decisión encaje con el diseño, el uso diario y el presupuesto acordado.",
  },
  {
    question: "¿Trabajáis solo en Madrid?",
    answer:
      "ZeroChaos está centrado en Madrid. La disponibilidad y el alcance se confirman en la primera conversación según la ubicación y el tipo de proyecto.",
  },
];

export const HomeTemplate = () => {
  const zcPath = useZeroChaosPath();
  return <RootLayout>
    <section className="zc-hero" id="inicio">
      <div className="zc-hero__image" aria-hidden="true">
        <ParallaxImage
          src={atelierImage}
          alt=""
          className="zc-hero__photo"
          strength={0.12}
        />
      </div>
      <div className="zc-hero__shade" aria-hidden="true" />
      <div className="zc-hero__grain" aria-hidden="true" />
      <div className="zc-shell zc-hero__content">
        <p className="zc-eyebrow zc-eyebrow--light zc-enter zc-enter--1">
          Reformas integrales · Madrid
        </p>
        <h1 className="zc-display zc-enter zc-enter--2">
          El espacio que imaginas.
          <br />
          <em>La obra, bajo control.</em>
        </h1>
        <div className="zc-hero__bottom zc-enter zc-enter--3">
          <p>
            Reformas pensadas al detalle, con materiales honestos y un proceso
            claro desde la primera visita hasta la entrega.
          </p>
          <div className="zc-actions">
            <Link className="zc-button zc-button--light" to={zcPath("/contacto")}>
              Cuéntanos tu proyecto <span aria-hidden="true">↗</span>
            </Link>
            <a className="zc-text-link zc-text-link--light" href="#espacios">
              Explorar la propuesta <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
      <div className="zc-hero__side-label" aria-hidden="true">
        DISEÑO · MATERIA · OFICIO
      </div>
      <a href="#espacios" className="zc-scroll-cue" aria-label="Desplazarse hacia abajo">
        <span />
      </a>
    </section>

    <section className="zc-intro zc-section" id="filosofia">
      <div className="zc-shell zc-intro__grid">
        <Reveal>
          <p className="zc-eyebrow">01 / Una forma distinta de reformar</p>
          <h2 className="zc-heading">
            Menos ruido.
            <br />
            <span>Más intención.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="zc-intro__copy">
            <p className="zc-lead">
              Una reforma transforma una casa. La manera de hacerla transforma
              la experiencia.
            </p>
            <p>
              Diseñamos cada intervención alrededor de cómo quieres vivir:
              escuchamos, ordenamos las decisiones y coordinamos los oficios
              para que forma y función avancen juntas.
            </p>
            <div className="zc-principles">
              <div><span>01</span> Diseño con propósito</div>
              <div><span>02</span> Materiales bien elegidos</div>
              <div><span>03</span> Comunicación directa</div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="zc-marquee" aria-label="Diseño, materia, oficio">
        <div className="zc-marquee__track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span key={copy}>DISEÑO <i>✳</i> MATERIA <i>✳</i> OFICIO <i>✳</i> CALMA <i>✳</i> </span>
          ))}
        </div>
      </div>
    </section>

    <section className="zc-services zc-section" id="servicios">
      <div className="zc-shell">
        <Reveal className="zc-section-head">
          <div>
            <p className="zc-eyebrow">02 / Qué hacemos</p>
            <h2 className="zc-heading">Cada espacio,<br /><span>una nueva lectura.</span></h2>
          </div>
          <p className="zc-section-head__aside">
            Del cambio preciso a la transformación completa. El alcance se
            define contigo antes de empezar.
          </p>
        </Reveal>
        <div className="zc-service-list">
          {servicios.map((servicio, index) => (
            <Reveal key={servicio.id} delay={index * 90}>
              <Link className="zc-service-row" to={zcPath(`/${servicio.slug}`)}>
                <span className="zc-service-row__index">0{index + 1}</span>
                <span className="zc-service-row__name">{servicio.name}</span>
                <span className="zc-service-row__description">{servicio.shortDescription}</span>
                <span className="zc-service-row__arrow" aria-hidden="true">↗</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="zc-service-footnote">
          <span>También estudiamos proyectos parciales y necesidades especiales.</span>
          <Link to={zcPath("/contacto")}>Consultar mi caso <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>

    <section className="zc-materials zc-section" id="espacios">
      <div className="zc-shell">
        <Reveal className="zc-section-head zc-section-head--light">
          <div>
            <p className="zc-eyebrow zc-eyebrow--light">03 / La materia habla</p>
            <h2 className="zc-heading zc-heading--light">Texturas con<br /><em>carácter propio.</em></h2>
          </div>
          <p className="zc-section-head__aside">
            Piedra, madera, metal y luz. Una selección serena que gana belleza
            con el tiempo y hace que cada estancia se sienta tuya.
          </p>
        </Reveal>
        <div className="zc-gallery">
          {conceptImages.map((image, index) => (
            <Reveal key={image.src} delay={index * 130} className={`zc-gallery__item zc-gallery__item--${index + 1}`}>
              <figure>
                <div className="zc-gallery__image-wrap">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <span className="zc-gallery__number">{image.number}</span>
                  <span className="zc-gallery__zoom" aria-hidden="true">↗</span>
                </div>
                <figcaption>
                  <span>{image.category}</span>
                  <h3>{image.title}</h3>
                </figcaption>
              </figure>
            </Reveal>
          ))}
          <Reveal className="zc-gallery-note" delay={220}>
            <span className="zc-gallery-note__mark">“</span>
            <p>La calidad de un espacio está en lo que se ve y en cómo se vive.</p>
            <small>Imágenes de inspiración; no representan obras ejecutadas por ZeroChaos.</small>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="zc-process zc-section" id="proceso">
      <div className="zc-shell zc-process__layout">
        <Reveal className="zc-process__intro">
          <p className="zc-eyebrow">04 / El proceso</p>
          <h2 className="zc-heading">Claridad en<br /><span>cada etapa.</span></h2>
          <p>Un buen resultado empieza mucho antes de la obra: empieza con buenas preguntas y decisiones compartidas.</p>
          <Link className="zc-button zc-button--dark" to={zcPath("/contacto")}>Empezar a conversar <span aria-hidden="true">↗</span></Link>
        </Reveal>
        <div className="zc-timeline">
          {[
            ["01", "Escuchar", "Entendemos el espacio, tus prioridades y la forma en que lo utilizas."],
            ["02", "Proyectar", "Definimos alcance, distribución, acabados y una propuesta detallada."],
            ["03", "Coordinar", "Organizamos calendario, materiales y equipos antes de cada fase."],
            ["04", "Entregar", "Revisamos juntos los detalles y cerramos el proyecto contigo."],
          ].map(([number, title, description], index) => (
            <Reveal key={number} delay={index * 100}>
              <div className="zc-timeline__item">
                <span className="zc-timeline__number">{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <span className="zc-timeline__tick" aria-hidden="true">✳</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="zc-detail" aria-label="Detalle de materiales">
      <div className="zc-detail__image">
          <ParallaxImage src={materialImage} alt="Detalle de interiorismo en madera y piedra" strength={0.08} />
      </div>
      <div className="zc-detail__overlay" />
      <div className="zc-shell zc-detail__content">
        <Reveal>
          <p className="zc-eyebrow zc-eyebrow--light">Diseñado para durar</p>
          <p className="zc-detail__quote">La belleza está en<br />el encuentro entre<br /><em>materia y luz.</em></p>
          <span className="zc-detail__line" />
        </Reveal>
      </div>
      <span className="zc-detail__caption">PIEDRA · ROBLE · ACERO</span>
    </section>

    <section className="zc-faq zc-section" id="preguntas">
      <div className="zc-shell zc-faq__layout">
        <Reveal>
          <p className="zc-eyebrow">05 / Antes de empezar</p>
          <h2 className="zc-heading">Hablemos<br /><span>sin rodeos.</span></h2>
          <p className="zc-faq__intro">Cada proyecto es distinto. Estas son algunas de las primeras preguntas que solemos resolver.</p>
          <Link to={zcPath("/contacto")} className="zc-text-link">¿Tienes otra duda? Escríbenos <span aria-hidden="true">↗</span></Link>
        </Reveal>
        <div className="zc-faq__list">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 90}>
              <details className="zc-faq__item">
                <summary><span>{faq.question}</span><i aria-hidden="true">+</i></summary>
                <p>{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="zc-contact-cta" id="contacto">
      <div className="zc-contact-cta__texture" aria-hidden="true" />
      <Reveal className="zc-contact-cta__inner">
        <p className="zc-eyebrow zc-eyebrow--light">ZeroChaos · Madrid</p>
        <h2>Tu casa merece<br /><em>una nueva historia.</em></h2>
        <p>Cuéntanos qué tienes en mente. La primera conversación sirve para poner orden a las ideas.</p>
        <Link className="zc-button zc-button--light" to={zcPath("/contacto")}>Solicitar una primera visita <span aria-hidden="true">↗</span></Link>
      </Reveal>
      <span className="zc-contact-cta__seal" aria-hidden="true">ZC<br /><small>EST. · MADRID</small></span>
    </section>
  </RootLayout>;
};
