import SEO from '../components/common/SEO';
import CTASection from '../components/home/CTASection';
import Hero from '../components/home/Hero';
import BudgetCalculator from '../components/home/BudgetCalculator';
import Services from '../components/home/Services';
import WhyChooseUs from '../components/home/WhyChooseUs';

export default function Home() {
  return <><SEO title="ZeroDelay | Mudanzas con un plan claro" description="Mudanzas de hogar y oficina, guardamuebles y grupajes. Cuéntanos tu ruta para consultar disponibilidad y recibir una propuesta." /><Hero /><div className="zd-strip"><div className="zd-shell zd-strip__inner"><span className="zd-strip__item"><i className="zd-strip__mark" aria-hidden="true" />Hogar y oficina</span><span className="zd-strip__item"><i className="zd-strip__mark" aria-hidden="true" />Guardamuebles</span><span className="zd-strip__item"><i className="zd-strip__mark" aria-hidden="true" />Grupajes y rutas</span><span className="zd-strip__item">Disponibilidad según trayecto</span></div></div><Services /><WhyChooseUs /><BudgetCalculator /><CTASection /></>;
}
