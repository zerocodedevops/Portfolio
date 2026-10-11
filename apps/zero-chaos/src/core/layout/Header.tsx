import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/brand/zerochaos-sello.webp";
import { useZeroChaosPath } from "../hooks/useZeroChaosPath";

interface HeaderProps { clientName: string }

const navLinks = [
  { name: "Filosofía", href: "#filosofia" },
  { name: "Servicios", href: "#servicios" },
  { name: "Espacios", href: "#espacios" },
  { name: "Proceso", href: "#proceso" },
  { name: "Preguntas", href: "#preguntas" },
];

export const Header = ({ clientName }: HeaderProps) => {
  const zcPath = useZeroChaosPath();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className={`zc-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="zc-header__inner">
        <Link to={zcPath("/")} className="zc-header__brand" aria-label={`${clientName}, inicio`}>
          <img className="zc-header__monogram" src={logo} alt="" />
          <span className="zc-header__wordmark">ZERO <span>CHAOS</span></span>
        </Link>
        <nav className="zc-header__nav" aria-label="Navegación principal">
          {navLinks.map((link) => <a key={link.href} href={zcPath(link.href)}>{link.name}</a>)}
          <Link className="zc-header__cta" to={zcPath("/contacto")}>Hablemos <span aria-hidden="true">↗</span></Link>
        </nav>
        <button
          className="zc-header__toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
        <nav className={`zc-header__mobile ${menuOpen ? "is-open" : ""}`} aria-label="Navegación móvil" aria-hidden={!menuOpen}>
          <button className="zc-header__mobile-close" type="button" tabIndex={menuOpen ? 0 : -1} aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>×</button>
          {navLinks.map((link) => <a key={link.href} href={zcPath(link.href)} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>{link.name}</a>)}
          <Link to={zcPath("/contacto")} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Hablemos ↗</Link>
        </nav>
      </div>
    </header>
  );
};
