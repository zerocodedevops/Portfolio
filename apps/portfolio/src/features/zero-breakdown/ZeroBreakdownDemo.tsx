import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Droplets, Fan, Lightbulb, Menu, X } from 'lucide-react';
import { Seo } from '@/components/common/SEO';
import './zero-breakdown.css';

type TradeSlug = 'fontaneria' | 'electricidad' | 'climatizacion';
type TradeTheme = 'water' | 'power' | 'air';

type Trade = {
  slug: TradeSlug;
  theme: TradeTheme;
  name: string;
  short: string;
  code: string;
  image: string;
  alt: string;
  headline: string;
  lead: string;
  cardCopy: string;
  services: { title: string; copy: string }[];
  contextTitle: string;
  contextIntro: string;
  contextItems: { title: string; copy: string }[];
  steps: { title: string; copy: string }[];
  questions: { q: string; a: string }[];
};

const basePath = '/proyectos/zero-breakdown';
const trades: Trade[] = [
  {
    slug: 'fontaneria',
    theme: 'water',
    name: 'Fontanería',
    short: 'Agua y desagües',
    code: 'AGUA',
    image: '/images/zero-breakdown/plumber.webp',
    alt: 'Fontanero trabajando en las tuberías de un cuarto de baño',
    headline: 'Fontanería para casa y negocio.',
    lead: 'Reparación de fugas, desagües, grifería y tuberías. También instalaciones para cocinas, baños, comunidades y locales.',
    cardCopy: 'Averías, desatascos, calderas y trabajos de fontanería para hogares y negocios.',
    services: [
      { title: 'Reparación e instalación de fontanería', copy: 'Reparación de tuberías y conexiones, instalación de nuevas líneas de agua y renovación de tramos deteriorados.' },
      { title: 'Fugas de agua y filtraciones', copy: 'Localización del punto de fuga y revisión de la conducción para definir la reparación necesaria.' },
      { title: 'Desagües y alcantarillado', copy: 'Limpieza, desatasco y sustitución de desagües en cocinas, baños y redes de evacuación.' },
      { title: 'Baños y cocinas', copy: 'Cambio de grifos, cisternas y sanitarios; adaptación de tomas para reformar o equipar baños y cocinas.' },
      { title: 'Calderas y agua caliente', copy: 'Consulta sobre instalación, sustitución y mantenimiento de calderas y equipos de agua caliente.' },
      { title: 'Bombas de achique y aguas residuales', copy: 'Instalación y revisión de bombas para evacuar agua acumulada y aguas residuales.' },
      { title: 'Fontanería para negocios y comunidades', copy: 'Cocinas y baños comerciales, tuberías comunes, redes de agua y fontanería para instalaciones de trabajo.' },
      { title: 'Desbordamientos y roturas', copy: 'Atención a tuberías con fugas, latiguillos de lavadora rotos, inodoros desbordados y desagües bloqueados.' },
      { title: 'Instalaciones de gas', copy: 'Consulta por instalación o revisión de gas y calderas. Los trabajos sujetos a habilitación se realizarán por profesionales autorizados.' },
    ],
    contextTitle: 'Una avería de agua no puede esperar.',
    contextIntro: 'Describe el problema con el mayor detalle posible: ayuda a identificar el tipo de intervención que necesitas.',
    contextItems: [
      { title: 'Fuga en una tubería', copy: 'Indica dónde ves el agua y si la instalación permite cortar el suministro.' },
      { title: 'Atasco en baño o cocina', copy: 'Cuéntanos qué desagüe está afectado y si el agua evacúa lentamente o no baja.' },
      { title: 'Avería en caldera o agua caliente', copy: 'Anota el equipo y qué sucede; no desmontes la instalación.' },
      { title: 'Rotura o desbordamiento', copy: 'Si existe riesgo eléctrico o de inundación, evita acercarte y contacta con emergencias.' },
    ],
    steps: [
      { title: 'Describe la avería', copy: 'Indica dónde ocurre, qué has observado y desde cuándo.' },
      { title: 'Revisamos el trabajo', copy: 'Acordamos qué hay que comprobar y qué solución puede encajar.' },
      { title: 'Recibe una valoración', copy: 'Con el alcance claro, podrás decidir cómo continuar.' },
    ],
    questions: [
      { q: '¿Qué hago si hay una fuga?', a: 'Si puedes hacerlo sin riesgo, cierra la llave de paso y describe dónde aparece el agua y qué elemento está afectado. Ante peligro eléctrico o daños importantes, aléjate de la zona y contacta con emergencias.' },
      { q: '¿Qué averías de desagüe puedo consultar?', a: 'Atascos y evacuación lenta en fregaderos, duchas, bañeras e inodoros, además de problemas en tuberías y alcantarillado.' },
      { q: '¿Atendéis viviendas y negocios?', a: 'La página contempla trabajos domésticos, comerciales y en comunidades: desde grifería y sanitarios hasta tuberías y redes de agua.' },
      { q: '¿Puedo pedir varios trabajos a la vez?', a: 'Sí. Describe cada reparación o instalación para poder valorar el conjunto.' },
      { q: '¿Puedo enviar fotos?', a: 'Las fotos suelen ayudar a localizar el elemento y entender el problema. Este formulario de demostración no adjunta ni envía archivos.' },
    ],
  },
  {
    slug: 'electricidad',
    theme: 'power',
    name: 'Electricidad',
    short: 'Cuadros, luz y circuitos',
    code: 'ENERGÍA',
    image: '/images/zero-breakdown/electric.webp',
    alt: 'Instalación eléctrica en proceso de revisión',
    headline: 'Electricidad para tu espacio.',
    lead: 'Instalaciones eléctricas para obra nueva y reformas, cuadros y protecciones, iluminación, averías y certificados cuando correspondan.',
    cardCopy: 'Instalaciones, reformas, cuadros eléctricos, iluminación y averías.',
    services: [
      { title: 'Instalación eléctrica completa', copy: 'Proyecto de instalación para vivienda, local u obra nueva: cuadro, circuitos, mecanismos, iluminación y toma de tierra según el alcance.' },
      { title: 'Reforma de instalaciones antiguas', copy: 'Renovación de cableado, mecanismos y circuitos; planificación del trabajo en coordinación con la reforma del espacio.' },
      { title: 'Cuadros eléctricos y protecciones', copy: 'Montaje o actualización de cuadros, organización de circuitos y consulta sobre diferenciales y protección contra sobretensiones.' },
      { title: 'Certificado eléctrico (CIE)', copy: 'Consulta para alta, cambio de titular o modificación de potencia. La emisión del certificado depende de la inspección y de que el profesional esté autorizado.' },
      { title: 'Averías eléctricas', copy: 'Revisión de cortes parciales, diferenciales que se disparan, interruptores defectuosos o circuitos que dejan de funcionar.' },
      { title: 'Iluminación y nuevos puntos', copy: 'Instalación de luminarias, focos empotrados, tiras LED y puntos de luz para cada estancia.' },
      { title: 'Enchufes y tomas de corriente', copy: 'Nuevas tomas para electrodomésticos y equipos, ubicadas de acuerdo con el uso del espacio y la instalación existente.' },
      { title: 'Domótica', copy: 'Consulta sobre automatización de iluminación, persianas y otros elementos eléctricos del hogar.' },
      { title: 'Redes y fibra óptica', copy: 'Previsión de cableado de datos, redes informáticas y puntos de conexión para viviendas y negocios.' },
    ],
    contextTitle: 'Señales que conviene revisar.',
    contextIntro: 'Una comprobación permite localizar el origen antes de sustituir piezas o modificar circuitos.',
    contextItems: [
      { title: 'Salta el diferencial', copy: 'El problema puede estar en un circuito o en un aparato conectado; es necesario revisar para encontrar la causa.' },
      { title: 'Cuadro antiguo', copy: 'Si todavía hay fusibles antiguos o faltan protecciones, conviene comprobar el estado y las necesidades actuales.' },
      { title: 'Enchufe caliente o deteriorado', copy: 'Deja de utilizarlo y pide una revisión. Si hay humo, olor a quemado o fuego, aléjate y llama a emergencias.' },
      { title: 'Reforma o alta de suministro', copy: 'Consulta con antelación qué cambios y documentación corresponden a la instalación.' },
    ],
    steps: [
      { title: 'Cuéntanos qué pasa', copy: 'Explica qué deja de funcionar, qué protección salta o qué quieres instalar.' },
      { title: 'Comprobamos la instalación', copy: 'Revisamos el espacio y definimos el alcance antes de plantear cambios.' },
      { title: 'Acordamos la solución', copy: 'Recibirás una valoración del trabajo previsto antes de decidir.' },
    ],
    questions: [
      { q: '¿Por qué salta el diferencial?', a: 'Puede haber varias causas, desde un aparato defectuoso hasta una derivación o humedad. Desconecta los equipos que puedas identificar y solicita una revisión si el problema continúa.' },
      { q: '¿Cuándo conviene revisar una instalación antigua?', a: 'Si hay fusibles antiguos, faltan protecciones, los mecanismos están dañados o se calientan enchufes y cables, conviene pedir una revisión.' },
      { q: '¿Se pueden añadir enchufes y puntos de luz?', a: 'Se estudia el recorrido del cableado, la capacidad del circuito y el estado de la instalación antes de definir dónde pueden añadirse.' },
      { q: '¿Qué es el certificado CIE?', a: 'Es el Certificado de Instalación Eléctrica. Puede ser necesario para determinados trámites del suministro; su emisión requiere comprobar la instalación y contar con habilitación.' },
      { q: '¿Podéis valorar trabajos para comunidades?', a: 'La demo contempla consultas sobre zonas comunes, garajes, cuartos técnicos e instalaciones de comunidades.' },
    ],
  },
  {
    slug: 'climatizacion',
    theme: 'air',
    name: 'Climatización',
    short: 'Aire y calefacción',
    code: 'CONFORT',
    image: '/images/zero-breakdown/hvac-unit.webp',
    alt: 'Unidad exterior de climatización instalada en una fachada',
    headline: 'Climatización para tu espacio.',
    lead: 'Aire acondicionado, calefacción, sistemas por conductos, ventilación y energías renovables para viviendas, comunidades y espacios de trabajo.',
    cardCopy: 'Aire acondicionado, calefacción, aerotermia, ventilación y mantenimiento.',
    services: [
      { title: 'Aire acondicionado doméstico', copy: 'Estudio, instalación, sustitución, reparación y mantenimiento de equipos para viviendas.' },
      { title: 'Climatización industrial y por conductos', copy: 'Soluciones para locales, oficinas, instalaciones técnicas y espacios con distribución de aire por conductos.' },
      { title: 'Calefacción doméstica y central', copy: 'Revisión e instalación de sistemas de calefacción para viviendas y comunidades.' },
      { title: 'Aerotermia y bombas de calor', copy: 'Consulta sobre sistemas que aprovechan la energía del aire exterior para calefacción, refrigeración y agua caliente.' },
      { title: 'Geotermia y suelo radiante', copy: 'Alternativas de climatización que requieren valorar el edificio, el terreno y las condiciones de la instalación.' },
      { title: 'Placas solares y autoconsumo', copy: 'Estudio de instalaciones fotovoltaicas y solar térmica para viviendas y edificios.' },
      { title: 'Ventilación y extracción', copy: 'Diseño de soluciones para renovar el aire y extraerlo en viviendas, locales y espacios de trabajo.' },
      { title: 'Mantenimiento de equipos', copy: 'Revisión y mantenimiento de aire acondicionado, calefacción, aerotermia y placas solares.' },
      { title: 'Circuitos, depósitos y grupos de presión', copy: 'Consulta sobre limpieza de circuitos, depósitos, grupos de presión, instalaciones de gas y frío industrial.' },
    ],
    contextTitle: 'Confort térmico para cada espacio.',
    contextIntro: 'El catálogo incluye soluciones domésticas, de comunidad y de uso industrial; cada sistema requiere valorar las condiciones del inmueble.',
    contextItems: [
      { title: 'Vivienda', copy: 'Aire acondicionado, calefacción, suelo radiante y agua caliente según el espacio y su uso.' },
      { title: 'Comunidad', copy: 'Calefacción central, grupos de presión, mantenimiento de circuitos y revisión de equipos comunes.' },
      { title: 'Local o instalación industrial', copy: 'Climatización por conductos, ventilación, frío industrial y soluciones para espacios técnicos.' },
      { title: 'Eficiencia y renovables', copy: 'Aerotermia, geotermia y energía solar pueden estudiarse según el edificio. Consulta las ayudas que estén vigentes.' },
    ],
    steps: [
      { title: 'Cuéntanos el espacio', copy: 'Indica su tamaño aproximado, orientación y cómo se utiliza.' },
      { title: 'Revisamos las opciones', copy: 'Tenemos en cuenta el equipo actual, la instalación y las necesidades de confort.' },
      { title: 'Preparamos la propuesta', copy: 'La valoración concreta el sistema recomendado y los trabajos incluidos.' },
    ],
    questions: [
      { q: '¿Qué sistema de climatización me conviene?', a: 'Depende del espacio, el aislamiento, el uso y los equipos existentes. La visita permite comparar opciones de climatización y calefacción.' },
      { q: '¿Qué diferencia hay entre aerotermia y geotermia?', a: 'Ambas aprovechan energía renovable, pero la fuente es distinta: aire exterior en la aerotermia y terreno en la geotermia. El edificio y el tipo de obra condicionan la elección.' },
      { q: '¿Se puede instalar climatización por conductos?', a: 'Se revisa si hay espacio para los conductos, cómo se distribuye el aire y qué obras requiere cada estancia.' },
      { q: '¿Qué mantenimiento necesita el aire acondicionado?', a: 'La periodicidad depende del equipo y del uso. Conviene seguir las indicaciones del fabricante y revisar el sistema si pierde rendimiento o aparecen ruidos.' },
      { q: '¿Instaláis placas solares o suelo radiante?', a: 'La demo incluye fotovoltaica, solar térmica y suelo radiante dentro del catálogo de soluciones; el alcance depende del estudio del inmueble.' },
    ],
  },
];

const rise = {
  hidden: { opacity: 0, transform: 'translateY(28px)' },
  show: { opacity: 1, transform: 'translateY(0px)' },
};

function Brand({ href = basePath }: { href?: string }) {
  return <a href={href} className="zb-brand" aria-label="Zero Breakdown, página de especialidades"><span className="zb-brand__mark" aria-hidden="true">ZB</span><span>ZERO<b>BREAKDOWN</b></span></a>;
}

function Header({ active }: { active?: Trade }) {
  const [open, setOpen] = useState(false);
  const nav = active
    ? [['Servicios', '#servicios'], ['Cómo trabajamos', '#proceso'], ['Preguntas', '#preguntas']]
    : [['Fontanería', basePath + '/fontaneria'], ['Electricidad', basePath + '/electricidad'], ['Climatización', basePath + '/climatizacion']];
  return (
    <header className="zb-header">
      <Brand />
      <button className="zb-menu" type="button" aria-label={open ? 'Cerrar navegación' : 'Abrir navegación'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'zb-nav zb-nav--open' : 'zb-nav'} aria-label="Navegación principal">
        {active && <a className="zb-nav__back" href={basePath}><ArrowLeft size={16}/> Especialidades</a>}
        {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="zb-nav__action" href={active ? '#contacto' : basePath + '/fontaneria#contacto'} onClick={() => setOpen(false)}>Pedir presupuesto <ArrowUpRight size={16}/></a>
      </nav>
    </header>
  );
}

function LocalPreviewForm({ trade }: { trade: Trade }) {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }
  return (
    <form className="zb-form" onSubmit={submit}>
      {sent ? <div className="zb-form__success" role="status"><span><Check size={22}/></span><h3>Vista previa completada</h3><p>La solicitud no se ha enviado.</p><button type="button" onClick={() => setSent(false)}>Volver al formulario</button></div> : <>
        <p className="zb-form__notice">Formulario de demostración: no envía ni guarda tus datos.</p>
        <label htmlFor="zb-name">Nombre<input id="zb-name" name="nombre" autoComplete="name" placeholder="Tu nombre" required/></label>
        <label htmlFor="zb-phone">Teléfono<input id="zb-phone" name="telefono" type="tel" autoComplete="tel" placeholder="Tu teléfono" required/></label>
        <label htmlFor="zb-email">Correo electrónico<input id="zb-email" name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" required/></label>
        <label htmlFor="zb-location">Población<input id="zb-location" name="poblacion" autoComplete="address-level2" placeholder="Localidad del trabajo" required/></label>
        <label htmlFor="zb-work">Trabajo que necesitas<select id="zb-work" name="trabajo" defaultValue=""><option value="" disabled>Selecciona una opción</option>{trade.services.map((item) => <option key={item.title}>{item.title}</option>)}<option>Otro trabajo</option></select></label>
        <label htmlFor="zb-message">Cuéntanos un poco más<textarea id="zb-message" name="mensaje" rows={4} placeholder="¿Qué necesitas resolver?" required/></label>
        <button className="zb-button zb-button--submit" type="submit">Enviar solicitud <ArrowUpRight size={17}/></button>
      </>}
    </form>
  );
}

function LandingPage() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const selected = trades[active];
  return (
    <main className="zero-breakdown zb-home">
      <Seo title="Fontanería, electricidad y climatización | Zero Breakdown" description="Elige una especialidad y descubre servicios de fontanería, electricidad y climatización en Zero Breakdown." url="https://zerocode-devops.com/proyectos/zero-breakdown"/>
      <Header />
      <section className="zb-home-hero">
        <div className="zb-home-hero__copy">
          <p className="zb-home-hero__kicker">INSTALACIONES PARA CASA Y NEGOCIO</p>
          <motion.h1 initial={reduce ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>Todo en casa,<br/><em>en su punto.</em></motion.h1>
          <p className="zb-home-hero__lead">Agua, electricidad y climatización. Elige lo que necesitas y encuentra la solución adecuada para tu espacio.</p>
          <div className="zb-home-tabs" role="group" aria-label="Elegir especialidad">
            {trades.map((trade, index) => <button key={trade.slug} type="button" aria-pressed={active === index} className={active === index ? 'zb-home-tab is-active' : 'zb-home-tab'} onClick={() => setActive(index)}><span>{trade.name}</span><ArrowRight size={17}/></button>)}
          </div>
          <a className="zb-button" href={basePath + '/' + selected.slug}>Ver {selected.name.toLowerCase()} <ArrowUpRight size={17}/></a>
        </div>
        <motion.div key={selected.slug} className={'zb-home-photo zb-home-photo--' + selected.theme} initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0 round 42% 42% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 42% 42% 0 0)' }} transition={{ duration: .8, ease: [0.23, 1, 0.32, 1] }}>
          <img src={selected.image} alt={selected.alt}/>
          <span className="zb-home-photo__caption">{selected.code} <i/> {selected.short}</span>
          <span className="zb-home-photo__glow" aria-hidden="true"/>
        </motion.div>
        <svg className="zb-home-route" viewBox="0 0 460 400" fill="none" aria-hidden="true"><path className="zb-route-base" d="M26 342h122c42 0 56-24 56-58V168c0-35 20-55 56-55h56c30 0 50-20 50-49V20"/><path className="zb-route-flow" d="M26 342h122c42 0 56-24 56-58V168c0-35 20-55 56-55h56c30 0 50-20 50-49V20"/><circle cx="26" cy="342" r="8"/><circle cx="366" cy="20" r="8"/></svg>
      </section>
      <section className="zb-home-choices" aria-label="Servicios disponibles">
        <div className="zb-home-choices__intro"><h2>Tres oficios.<br/>Una buena solución.</h2><p>Reparaciones, instalaciones y mejoras para que cada espacio funcione como debe.</p></div>
        <div className="zb-choices">
          {trades.map((trade, index) => <motion.a key={trade.slug} href={basePath + '/' + trade.slug} className={'zb-choice zb-choice--' + trade.theme} initial={reduce ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .12, duration: .6 }}>
            <div className="zb-choice__image"><img src={trade.image} alt={trade.alt}/><span>{trade.code}</span></div>
            <div className="zb-choice__copy"><div><h3>{trade.name}</h3><p>{trade.cardCopy}</p></div><span className="zb-choice__arrow"><ArrowUpRight size={20}/></span></div>
          </motion.a>)}
        </div>
      </section>
      <footer className="zb-footer"><Brand/><span>AGUA · ENERGÍA · CONFORT</span><a href="/#contacto">Diseñada por ZeroCode DevOps <ArrowUpRight size={15}/></a></footer>
    </main>
  );
}

function PlumbingPage({ trade }: { trade: Trade }) {
  const homeServices = trade.services.slice(0, 6);
  const businessServices = trade.services.slice(6, 9);
  return <main className="zero-breakdown zb-independent zb-plumbing">
    <Seo title="Fontanería para viviendas y empresas | Zero Breakdown" description={trade.lead} url={'https://zerocode-devops.com' + basePath + '/fontaneria'}/>
    <div className="zp-topline"><span>FONTANERÍA PARA HOGARES, NEGOCIOS Y COMUNIDADES</span><a href="#contacto">Solicitar presupuesto <ArrowUpRight size={15}/></a></div>
    <header className="zp-header"><Brand/><nav aria-label="Navegación de fontanería"><a href="#nosotros">Conócenos</a><a href="#urgencias">Urgencias</a><a href="#servicios">Servicios</a><a href="#contacto">Contacto</a></nav><a className="zp-header__cta" href="#contacto">Pide presupuesto</a></header>
    <section className="zp-hero"><img src={trade.image} alt={trade.alt}/><div className="zp-hero__shade"/><div className="zp-hero__copy"><p>FONTANERÍA · REPARACIÓN · INSTALACIÓN</p><h1>Cuando el agua falla, necesitas una solución.</h1><span>Fugas, tuberías, desagües, grifería y trabajos de fontanería para tu vivienda o negocio.</span><a className="zp-button" href="#contacto">Cuéntanos qué ocurre <ArrowRight size={18}/></a></div><div className="zp-hero__stamp">AGUA<br/>EN ORDEN</div></section>
    <section className="zp-service-groups" id="servicios"><div className="zp-heading"><p>FONTANERÍA PARA CADA ESPACIO</p><h2>Hogar, negocio y comunidad.</h2></div><div className="zp-group-grid"><article className="zp-group zp-group--home"><span>01 / HOGAR</span><h3>Tu casa, en funcionamiento.</h3><p>Reparación e instalación de fontanería para baños, cocinas y redes de agua domésticas.</p><ul>{homeServices.map((service) => <li key={service.title}>{service.title}</li>)}</ul><a href="#contacto">Consultar trabajo <ArrowUpRight size={16}/></a></article><article className="zp-group zp-group--business"><span>02 / EMPRESAS Y COMUNIDADES</span><h3>Instalaciones que trabajan cada día.</h3><p>Fontanería comercial para locales, comunidades y espacios de actividad profesional.</p><ul>{businessServices.map((service) => <li key={service.title}>{service.title}</li>)}</ul><a href="#contacto">Pedir una valoración <ArrowUpRight size={16}/></a></article></div></section>
    <section className="zp-about" id="nosotros"><div className="zp-about__image"><img src={trade.image} alt="Detalle de una instalación de agua y desagüe"/><span>INSTALACIÓN Y REPARACIÓN</span></div><div><p className="zp-label">UN SERVICIO DE FONTANERÍA CERCANO</p><h2>Entender la avería es el primer paso para repararla.</h2><p>Una fuga, una evacuación atascada o un equipo que deja de funcionar necesitan respuestas distintas. Recogemos la información del problema, revisamos la instalación y explicamos las opciones antes de intervenir.</p><p>También puedes consultar trabajos de mejora en baños y cocinas, renovación de tuberías y sistemas de agua caliente.</p><a href="#contacto">Habla con nosotros <ArrowRight size={18}/></a></div></section>
    <section className="zp-urgent" id="urgencias"><div><p>¿UNA AVERÍA URGENTE?</p><h2>Cuéntanos qué ha pasado.</h2><span>Fugas, desbordamientos, latiguillos rotos o desagües bloqueados: describe el problema y dónde ocurre.</span></div><a href="#contacto">Solicitar atención <ArrowUpRight size={18}/></a></section>
    <section className="zp-steps"><div className="zp-heading"><p>ASÍ SE ABORDA UNA AVERÍA</p><h2>De la incidencia a la solución.</h2></div><div className="zp-steps__grid">{trade.steps.map((step, i) => <article key={step.title}><span>{i + 1}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div></section>
    <section className="zp-faq" id="preguntas"><div><p className="zp-label">DUDAS FRECUENTES</p><h2>Antes de pedir ayuda.</h2></div><div>{trade.questions.map((item) => <details key={item.q}><summary>{item.q}<ChevronDown size={18}/></summary><p>{item.a}</p></details>)}</div></section>
    <section className="zp-contact" id="contacto"><div><p>CONTACTO</p><h2>Solicita una valoración.</h2><span>Cuéntanos si se trata de una reparación, una instalación o una mejora para tu hogar o negocio.</span></div><LocalPreviewForm trade={trade}/></section>
    <footer className="zb-footer zb-footer--trade"><Brand/><a href={basePath}><ArrowLeft size={15}/> Volver a Zero Breakdown</a><span>Fontanería · Hogar · Empresa</span></footer>
  </main>;
}

function ElectricalPage({ trade }: { trade: Trade }) {
  return <main className="zero-breakdown zb-independent zb-electrical">
    <Seo title="Instalaciones eléctricas | Zero Breakdown" description={trade.lead} url={'https://zerocode-devops.com' + basePath + '/electricidad'}/>
    <header className="ze-header"><Brand/><nav aria-label="Navegación de electricidad"><a href="#servicios">Servicios</a><a href="#avisos">Cuándo revisar</a><a href="#alcance">El trabajo</a><a href="#preguntas">Preguntas</a></nav><a className="ze-header__cta" href="#contacto">Pedir presupuesto <ArrowUpRight size={16}/></a></header>
    <section className="ze-hero"><div className="ze-hero__grid" aria-hidden="true"/><div className="ze-hero__copy"><p>INSTALACIONES ELÉCTRICAS · VIVIENDA · NEGOCIO</p><h1>La instalación eléctrica, bien resuelta.</h1><span>Obra nueva, reformas, cuadros eléctricos, iluminación y averías. Cuéntanos qué necesitas revisar o instalar.</span><div><a className="ze-button" href="#contacto">Solicitar presupuesto <ArrowUpRight size={17}/></a><a href="#servicios">Ver instalaciones <ArrowDown size={16}/></a></div><small>INSTALACIONES · DOMÓTICA · DATOS</small></div><div className="ze-hero__image"><img src={trade.image} alt={trade.alt}/><span>CUADROS · CIRCUITOS · PROTECCIÓN</span></div></section>
    <section className="ze-services" id="servicios"><div className="ze-section-title"><p>QUÉ HACEMOS</p><h2>Instalaciones para cada etapa.</h2><span>Desde una instalación completa hasta una avería concreta.</span></div><div className="ze-service-list">{trade.services.slice(0, 6).map((item, i) => <article key={item.title}><b>0{i + 1}</b><div><h3>{item.title}</h3><p>{item.copy}</p></div><a href="#contacto" aria-label={'Consultar ' + item.title}><ArrowUpRight size={18}/></a></article>)}</div></section>
    <section className="ze-urgent"><div><p>¿LO TUYO ES URGENTE?</p><h2>Una avería eléctrica necesita una revisión segura.</h2><span>Si hay humo, chispas o riesgo de incendio, aléjate y llama a emergencias. Para el resto, describe el fallo y cuándo aparece.</span></div><a href="#contacto">Describir la avería <ArrowRight size={18}/></a></section>
    <section className="ze-signs" id="avisos"><div className="ze-section-title"><p>SEÑALES PARA PEDIR UNA REVISIÓN</p><h2>No ignores estos cambios.</h2></div><div className="ze-sign-list">{trade.contextItems.map((item) => <article key={item.title}><span aria-hidden="true">+</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div></section>
    <section className="ze-scope" id="alcance"><div><p>ANTES DE EMPEZAR</p><h2>El trabajo se define contigo.</h2><span>Revisar la instalación permite concretar qué hace falta y qué documentación podría corresponder.</span><a className="ze-button ze-button--light" href="#contacto">Cuéntanos tu caso <ArrowUpRight size={17}/></a></div><ul>{trade.services.slice(6).map((item) => <li key={item.title}><Check size={18}/><span><b>{item.title}</b>{item.copy}</span></li>)}<li><Check size={18}/><span><b>Presupuesto del trabajo</b>El alcance y las condiciones se detallan antes de aceptar la intervención.</span></li></ul></section>
    <section className="ze-faq" id="preguntas"><div><p>PREGUNTAS HABITUALES</p><h2>Electricidad en casa y negocio.</h2></div><div>{trade.questions.map((item) => <details key={item.q}><summary>{item.q}<ChevronDown size={18}/></summary><p>{item.a}</p></details>)}</div></section>
    <section className="ze-contact" id="contacto"><div><p>PRESUPUESTO DE INSTALACIÓN ELÉCTRICA</p><h2>Cuéntanos el trabajo.</h2><span>Indica el tipo de instalación, la población y qué necesitas resolver.</span></div><LocalPreviewForm trade={trade}/></section>
    <footer className="ze-footer"><Brand/><span>INSTALACIONES ELÉCTRICAS · DOMÓTICA · REDES</span><a href={basePath}><ArrowLeft size={15}/> Especialidades</a></footer>
  </main>;
}

function ClimatePage({ trade }: { trade: Trade }) {
  const categories = [
    { title: 'Aire acondicionado', text: 'Soluciones para climatizar viviendas, locales, oficinas e instalaciones por conductos.', image: trade.image, services: trade.services.slice(0, 2) },
    { title: 'Calefacción', text: 'Sistemas domésticos, centrales y alternativas de baja temperatura para cada edificio.', image: '/images/zero-breakdown/plumber.webp', services: trade.services.slice(2, 5) },
    { title: 'Energías renovables', text: 'Aerotermia, geotermia y soluciones solares sujetas al estudio de cada inmueble.', image: '/images/zero-breakdown/electric.webp', services: trade.services.slice(5, 7) },
  ];
  return <main className="zero-breakdown zb-independent zb-climate">
    <Seo title="Climatización y energías renovables | Zero Breakdown" description={trade.lead} url={'https://zerocode-devops.com' + basePath + '/climatizacion'}/>
    <div className="zc-topbar"><span>CLIMATIZACIÓN · CALEFACCIÓN · ENERGÍA</span><a href="#contacto">Contacto <ArrowUpRight size={15}/></a></div>
    <header className="zc-header"><Brand/><nav aria-label="Navegación de climatización"><a href="#empresa">Quiénes somos</a><a href="#aire">Aire acondicionado</a><a href="#calefaccion">Calefacción</a><a href="#renovables">Energías renovables</a><a href="#mantenimiento">Mantenimiento</a></nav><a className="zc-contact-link" href="#contacto">Hablemos <ArrowRight size={16}/></a></header>
    <section className="zc-hero"><div className="zc-hero__image"><img src={trade.image} alt={trade.alt}/></div><div className="zc-hero__copy"><p>SISTEMAS TÉRMICOS PARA CADA ESPACIO</p><h1>Climatización y energía para vivir mejor.</h1><span>Diseño de soluciones, instalación y mantenimiento de sistemas de aire acondicionado, calefacción y energías renovables.</span><a href="#servicios">Descubre los servicios <ArrowDown size={16}/></a></div><div className="zc-hero__rail">AIRE <i/> CALOR <i/> ENERGÍA</div></section>
    <section className="zc-intro" id="empresa"><h2>Confort en cada estación.<br/>Eficiencia en cada sistema.</h2><div><p>La solución térmica adecuada depende del edificio, el uso y las instalaciones existentes. Aquí puedes explorar opciones para hogares, comunidades, comercios y espacios de trabajo.</p><a href="#contacto">Consulta tu proyecto <ArrowRight size={17}/></a></div></section>
    <section className="zc-categories" id="servicios">{categories.map((category, index) => <article className={'zc-category zc-category--' + index} id={index === 0 ? 'aire' : index === 1 ? 'calefaccion' : 'renovables'} key={category.title}><div className="zc-category__photo"><img src={category.image} alt=""/><span>0{index + 1}</span></div><div className="zc-category__body"><p>CLIMATIZACIÓN Y ENERGÍA</p><h2>{category.title}</h2><span>{category.text}</span><ul>{category.services.map((service) => <li key={service.title}>{service.title}</li>)}</ul><a href="#contacto">Más información <ArrowUpRight size={16}/></a></div></article>)}</section>
    <section className="zc-maintenance" id="mantenimiento"><div><p>SERVICIO Y MANTENIMIENTO</p><h2>El sistema también necesita atención.</h2><span>Revisión de equipos e instalaciones térmicas para detectar necesidades de ajuste, limpieza o reparación.</span></div><div className="zc-maintenance__list">{trade.services.slice(7).map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>
    <section className="zc-values"><div><p>UNA VISIÓN INTEGRAL</p><h2>De la elección del sistema al cuidado de la instalación.</h2></div><div className="zc-values__list"><article><h3>Estudio del espacio</h3><p>Superficie, distribución, aislamiento y uso ayudan a definir qué alternativas merecen valorarse.</p></article><article><h3>Soluciones eficientes</h3><p>Aire acondicionado, calefacción y renovables se comparan según el edificio y las necesidades del proyecto.</p></article><article><h3>Atención postinstalación</h3><p>El mantenimiento previsto depende de los equipos instalados y de las indicaciones de cada fabricante.</p></article></div></section>
    <section className="zc-questions"><div><p>AYUDA PARA DECIDIR</p><h2>Preguntas sobre climatización.</h2></div><div>{trade.questions.map((item) => <details key={item.q}><summary>{item.q}<ChevronDown size={18}/></summary><p>{item.a}</p></details>)}</div></section>
    <section className="zc-contact" id="contacto"><div><p>HABLEMOS DE TU INSTALACIÓN</p><h2>¿Qué necesitas climatizar?</h2><span>Cuéntanos si es una vivienda, una comunidad, un local o una instalación de trabajo.</span></div><LocalPreviewForm trade={trade}/></section>
    <footer className="zc-footer"><Brand/><nav><a href="#aire">Aire acondicionado</a><a href="#calefaccion">Calefacción</a><a href="#renovables">Energías renovables</a><a href="#mantenimiento">Mantenimiento</a></nav><a href={basePath}><ArrowLeft size={15}/> Volver a Zero Breakdown</a></footer>
  </main>;
}

function TradePage({ trade }: { trade: Trade }) {
  if (trade.slug === 'fontaneria') return <PlumbingPage trade={trade}/>;
  if (trade.slug === 'electricidad') return <ElectricalPage trade={trade}/>;
  return <ClimatePage trade={trade}/>;
}

export default function ZeroBreakdownDemo() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1];
  const selectedTrade = trades.find((trade) => trade.slug === slug);
  return selectedTrade ? <TradePage trade={selectedTrade}/> : <LandingPage/>;
}
