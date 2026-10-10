import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logoZero from '@/assets/zerocode-horizontal.webp';

const navLinks = [
  { label: 'Proceso', href: '#proceso' },
  { label: 'Servicio', href: '#servicio' },
  { label: 'Precio', href: '#inversion' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Preguntas', href: '#preguntas' },
];

export function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(globalThis.scrollY > 24);
    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
        const targetTop = element.getBoundingClientRect().top + globalThis.scrollY - headerHeight;
        globalThis.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
      else { navigate(`/${href}`); }
    } else {
      navigate(href);
      globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.header initial={{ y: -72 }} animate={{ y: 0 }} transition={{ duration: 0.4 }} className={cn('fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#001b41] text-white transition-shadow duration-300', isScrolled ? 'shadow-[0_8px_25px_rgba(0,27,65,.24)]' : '')}>
      <div className="container-custom"><nav aria-label="Navegación principal" className="flex min-h-[70px] items-center justify-between gap-6">
        <a href="/" className="flex shrink-0 items-center" onClick={(event)=>{event.preventDefault();handleNavClick('/');}} aria-label="ZeroCode, inicio"><img src={logoZero} alt="ZeroCode DevOps" className="h-[54px] w-[164px] object-cover object-center sm:h-[58px] sm:w-[174px]" fetchPriority="high"/></a>
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">{navLinks.map((link)=><a key={link.href} href={link.href} className="text-sm font-medium text-white/80 transition-colors hover:text-[#11c7e6]" onClick={(event)=>{event.preventDefault();handleNavClick(link.href);}}>{link.label}</a>)}</div>
        <div className="hidden lg:block"><a href="#contacto" className="inline-flex min-h-10 items-center gap-2 bg-transparent px-3 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#001b41]" onClick={(event)=>{event.preventDefault();handleNavClick('#contacto');}}>Pedir presupuesto <span aria-hidden="true">↗</span></a></div>
        <button className="rounded-md p-2 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11c7e6] lg:hidden" onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded={isMobileMenuOpen} aria-label={isMobileMenuOpen?'Cerrar menú':'Abrir menú'}>{isMobileMenuOpen?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}</button>
      </nav></div>
      <AnimatePresence>{isMobileMenuOpen&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.18}} className="absolute inset-x-0 top-full border-b border-white/15 bg-[#001b41] shadow-lg lg:hidden"><div className="container-custom flex flex-col gap-1 py-4">{navLinks.map((link)=><a key={link.href} href={link.href} className="py-3 font-medium text-white/85 transition-colors hover:text-[#11c7e6]" onClick={(event)=>{event.preventDefault();handleNavClick(link.href);}}>{link.label}</a>)}<a href="#contacto" className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 bg-transparent px-5 font-semibold text-white/90 transition hover:bg-white/10 hover:text-white" onClick={(event)=>{event.preventDefault();handleNavClick('#contacto');}}>Pedir presupuesto <MessageCircle className="h-4 w-4"/></a></div></motion.div>}</AnimatePresence>
    </motion.header>
  );
}
