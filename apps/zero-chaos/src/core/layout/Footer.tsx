import { Link } from "react-router-dom";
import logo from "../../assets/brand/zerochaos-sello.webp";
import { useZeroChaosPath } from "../hooks/useZeroChaosPath";

export const Footer = () => {
  const zcPath = useZeroChaosPath();
  return <footer className="zc-footer">
    <div className="zc-shell zc-footer__main">
      <div className="zc-footer__brand">
        <img
          src={logo}
          alt="ZeroChaos Reformas Integrales"
          className="zc-footer__logo"
          loading="lazy"
        />
        <p>Diseño de espacios, reformas y coordinación de obra en Madrid.</p>
      </div>
      <nav aria-label="Servicios de reforma" className="zc-footer__nav">
        <p className="zc-eyebrow zc-eyebrow--light">Servicios</p>
        <Link to={zcPath("/reformas-integrales-madrid")}>Reformas integrales</Link>
        <Link to={zcPath("/reformas-cocinas-madrid")}>Cocinas</Link>
        <Link to={zcPath("/reformas-banos-madrid")}>Baños</Link>
      </nav>
      <nav aria-label="Explorar ZeroChaos" className="zc-footer__nav">
        <p className="zc-eyebrow zc-eyebrow--light">Explorar</p>
        <Link to={zcPath("/proyectos")}>Proyectos</Link>
        <Link to={zcPath("/sobre-nosotros")}>Sobre nosotros</Link>
        <Link to={zcPath("/contacto")}>Contacto</Link>
      </nav>
      <div className="zc-footer__contact">
        <p className="zc-eyebrow zc-eyebrow--light">Una idea en mente</p>
        <p>Hablemos de tu espacio y de lo que quieres cambiar.</p>
        <Link to={zcPath("/contacto")} className="zc-footer__cta">Empezar una conversación <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
    <div className="zc-shell zc-footer__bottom">
      <span>© {new Date().getFullYear()} ZeroChaos</span>
      <span>DISEÑO · MATERIA · OFICIO</span>
      <Link to={zcPath("/")}>Volver arriba ↑</Link>
    </div>
  </footer>
};
