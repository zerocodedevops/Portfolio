import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/Logo0.webp';

const links = [{ to: '.', label: 'Inicio' }, { to: 'servicios', label: 'Servicios' }, { to: 'nosotros', label: 'Cómo trabajamos' }, { to: 'ubicacion', label: 'Rutas' }];

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="zd-header"><div className="zd-shell zd-header__inner">
    <Link className="zd-brand" to="." aria-label="ZeroDelay, inicio" onClick={() => setOpen(false)}><img src={logo} alt="" /><span className="zd-brand__name">Zero<span>Delay</span></span></Link>
    <nav id="main-nav" className={`zd-nav${open ? ' is-open' : ''}`} aria-label="Navegación principal">
      {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '.'} onClick={() => setOpen(false)}>{link.label}</NavLink>)}
    </nav>
    <div className="zd-header__actions"><a className="zd-header__phone" href="tel:+34912622712">91 262 27 12</a><Link className="zd-button" to="contacto">Planificar mudanza <span className="zd-arrow" aria-hidden="true">↗</span></Link><button className="zd-menu-toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Cerrar' : 'Menú'}</button></div>
  </div></header>;
}
