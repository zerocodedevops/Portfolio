import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../common/Footer';
import Header from '../common/Header';
import WhatsAppButton from '../common/WhatsAppButton';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-motion');
    const elements = document.querySelectorAll<HTMLElement>('.zd-reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return () => document.documentElement.classList.remove('has-motion');
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('has-motion');
    };
  }, [pathname]);

  return <div className="zd-layout"><Header /><main id="contenido"><Outlet /></main><Footer /><WhatsAppButton /></div>;
}
