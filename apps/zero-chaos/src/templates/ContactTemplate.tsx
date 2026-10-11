import { Link } from "react-router-dom";
import { config } from "../clients/madrid-zerochaos/config";
import { RootLayout } from "../core/layout/RootLayout";
import { Reveal } from "../core/components/Reveal";
import { useZeroChaosPath } from "../core/hooks/useZeroChaosPath";

const mailto = `mailto:${config.contact.email}?subject=${encodeURIComponent("Hablemos de mi proyecto")}`;

export const ContactTemplate = () => {
  const zcPath = useZeroChaosPath();
  return <RootLayout>
    <section className="zc-contact-page">
      <div className="zc-contact-page__left">
        <div className="zc-contact-page__copy">
          <p className="zc-eyebrow zc-eyebrow--light">Una primera conversación</p>
          <h1>Tu idea merece<br /><em>un buen comienzo.</em></h1>
          <p>Cuéntanos qué espacio quieres transformar, qué te gustaría mejorar y en qué momento estás pensando empezar.</p>
          <a className="zc-button zc-button--light" href={mailto}>Escribir un correo <span aria-hidden="true">↗</span></a>
        </div>
        <span className="zc-contact-page__coordinates" aria-hidden="true">ZEROCHAOS · MADRID</span>
      </div>
      <div className="zc-contact-page__right">
        <Reveal className="zc-contact-card">
          <p className="zc-eyebrow">Para orientarnos</p>
          <h2>Cuatro datos<br /><span>para empezar.</span></h2>
          <ol>
            <li><span>01</span>Qué estancia o vivienda quieres reformar.</li>
            <li><span>02</span>Qué te gustaría cambiar o conservar.</li>
            <li><span>03</span>Dónde se encuentra el espacio.</li>
            <li><span>04</span>En qué plazo te gustaría abordarlo.</li>
          </ol>
          <a className="zc-contact-card__email" href={mailto}><span>{config.contact.email}</span><span aria-hidden="true">↗</span></a>
          <small>El enlace abrirá tu aplicación de correo. El mensaje solo se enviará cuando lo confirmes desde allí.</small>
        </Reveal>
        <Link className="zc-contact-back" to={zcPath("/")}>← Volver a ZeroChaos</Link>
      </div>
    </section>
  </RootLayout>;
};
