import {
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

interface ProductOption {
  name: string;
  description: string;
}

interface ProductCategory {
  name: string;
  description: string;
  icon: LucideIcon;
  options: ProductOption[];
}

const categories: ProductCategory[] = [
  {
    name: 'Secciones básicas',
    description: 'Contenido para explicar tu negocio y facilitar el contacto.',
    icon: LayoutGrid,
    options: [
      { name: 'Página de inicio', description: 'Presentación de negocio, propuesta de valor y llamadas a la acción.' },
      { name: 'Servicios', description: 'Páginas para explicar con claridad cada servicio.' },
      { name: 'Galería de trabajos', description: 'Muestra proyectos, productos o trabajos realizados.' },
      { name: 'Nuestro equipo', description: 'Presenta a las personas que forman parte del negocio.' },
      { name: 'Contacto', description: 'Formulario y vías de contacto adaptadas a tu actividad.' },
      { name: 'Ubicación y horarios', description: 'Dirección, mapa y horarios de atención.' },
      { name: 'Reseñas y testimonios', description: 'Publica opiniones reales facilitadas o autorizadas por tu negocio.' },
      { name: 'Blog y consejos', description: 'Sección de artículos para compartir novedades e información útil.' },
      { name: 'Preguntas frecuentes', description: 'Respuestas a las dudas habituales de tus clientes.' },
      { name: 'Ofertas y promociones', description: 'Presenta campañas y ofertas vigentes.' },
    ],
  },
  {
    name: 'Reservas y citas',
    description: 'Herramientas para gestionar citas y disponibilidad.',
    icon: CalendarDays,
    options: [
      { name: 'Reserva de citas online', description: 'Calendario para consultar, solicitar y/o reservar citas.' },
      { name: 'Recordatorios automáticos', description: 'Avisos por los canales disponibles.' },
      { name: 'Cancelación y reprogramación online', description: 'Permite gestionar cambios de citas.' },
      { name: 'Lista de espera', description: 'Recoge solicitudes para cubrir huecos que queden disponibles.' },
      { name: 'Pago anticipado online', description: 'Cobros mediante un proveedor de pagos.' },
      { name: 'Historial de citas del cliente', description: 'Consulta citas anteriores.' },
    ],
  },
  {
    name: 'Características avanzadas',
    description: 'Funciones adicionales.',
    icon: Sparkles,
    options: [
      { name: 'Sitio multiidioma', description: 'Presenta el contenido en los idiomas que necesite tu público.' },
      { name: 'Programa de fidelización', description: 'Recompensas o ventajas para clientes recurrentes.' },
      { name: 'Botón de contacto por WhatsApp o Telegram', description: 'Acceso rápido a chat desde la web.' },
      { name: 'Valoración después del servicio', description: 'Recoge valoraciones tras una compra, cita o servicio.' },
      { name: 'Versión tipo app móvil', description: 'Experiencia instalable o aplicación a medida, según las necesidades y el alcance.' },
    ],
  },
  {
    name: 'Marketing y redes sociales',
    description: 'Recursos para comunicar novedades y campañas.',
    icon: Megaphone,
    options: [
      { name: 'Newsletter y email marketing', description: 'Formularios y conexión con una plataforma de correo.' },
      { name: 'Integración con redes sociales', description: 'Enlaces y funciones de conexión con los perfiles de tu negocio.' },
      { name: 'Cupones de descuento', description: 'Códigos promocionales para tu negocio.' },
      { name: 'Programa de referidos', description: 'Incentivos para clientes que recomiendan tus servicios.' },
      { name: 'Ventanas promocionales', description: 'Avisos de campañas personalizados.' },
    ],
  },
  {
    name: 'Diseño y experiencia',
    description: 'Diseño visual y recursos adaptados a tu negocio.',
    icon: Palette,
    options: [
      { name: 'Diseño personalizado a medida', description: 'Diseño visual creado para tu marca, contenido y objetivos.' },
      { name: 'Diseño adaptable a móviles', description: 'Presentación y uso cómodos en móvil, tableta y ordenador.' },
      { name: 'Animaciones y microinteracciones', description: 'Detalles de movimiento que acompañan la navegación.' },
      { name: 'Comparador antes y después', description: 'Control visual para comparar dos imágenes de un trabajo.' },
    ],
  },
  {
    name: 'SEO y rendimiento',
    description: 'Configuración técnica y medición.',
    icon: Search,
    options: [
      { name: 'SEO básico', description: 'Estructura, metadatos y fundamentos técnicos de indexación.' },
      { name: 'Perfil de Empresa en Google', description: 'Ayuda para configurar o enlazar la ficha de tu negocio, con acceso de su titular.' },
      { name: 'Google Analytics 4', description: 'Configuración de medición.' },
      { name: 'Optimización de velocidad', description: 'Revisión y mejoras de carga según la tecnología y el contenido de la web.' },
      { name: 'Certificado SSL', description: 'Configuración de HTTPS cuando el hosting lo permita.' },
    ],
  },
  {
    name: 'Mantenimiento y soporte',
    description: 'Servicios acordados antes de empezar.',
    icon: Wrench,
    options: [
      { name: 'Hosting', description: 'Alojamiento web con proveedor.' },
      { name: 'Dominio', description: 'Registro o gestión del dominio.' },
      { name: 'Correo corporativo', description: 'Configuración de cuentas con el dominio de tu negocio.' },
      { name: 'Actualizaciones de contenido', description: 'Cambios de textos, imágenes y datos.' },
      { name: 'Soporte técnico', description: 'Asistencia técnica.' },
      { name: 'Copias de seguridad automáticas', description: 'Configuración y comprobación de copias.' },
    ],
  },
  {
    name: 'Legal y protección de datos',
    description: 'Implementación técnica; los textos y criterios legales deben validarse para cada negocio.',
    icon: ShieldCheck,
    options: [
      { name: 'Banner de cookies', description: 'Configuración del consentimiento y bloqueo de tecnologías.' },
      { name: 'Política de privacidad', description: 'Publicación e integración del texto validado para tu actividad y proveedores.' },
      { name: 'Aviso legal', description: 'Publicación e integración de la información legal facilitada y validada.' },
      { name: 'Medidas técnicas de protección de datos', description: 'Ajustes técnicos de formularios, accesos y servicios según el proyecto.' },
    ],
  },
];

export function ProductOptions() {
  return (
    <section id="catalogo-opciones" className="mx-auto mt-20 scroll-mt-24 max-w-5xl" aria-labelledby="product-options-title">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[#087cae]">Opciones para ampliar tu web</p>
        <h2 id="product-options-title" className="font-outfit text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">
          Añade lo que tu negocio necesita
        </h2>
        <div className="mt-4 space-y-3 leading-7 text-[#586a80]">
          <p>Desde nuevas secciones hasta reservas, campañas o mantenimiento.</p>
          <p>El precio de 400 € + IVA corresponde únicamente a la web de una página descrita arriba; estas opciones se presupuestan según el alcance, las integraciones y los proveedores necesarios.</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(({ name, description, icon: Icon, options }) => (
          <details key={name} className="group border border-[#dce4eb] bg-white p-5 shadow-sm transition-colors open:border-[#a8d8e8] sm:p-6">
            <summary className="flex cursor-pointer list-none items-start gap-4 marker:hidden">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f7fc] text-[#0789bd]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-outfit text-lg font-semibold text-[#0b294a]">{name}</span>
                <span className="mt-1 block text-sm leading-6 text-[#718197]">{description}</span>
                <span className="mt-2 block text-xs font-semibold text-[#087cae]">{options.length} opciones</span>
              </span>
              <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-[#718197] transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-5 space-y-4 border-t border-[#e7eef3] pt-5">
              {options.map(({ name: optionName, description: optionDescription }) => (
                <li key={optionName} className="border-l-2 border-[#b9eaf5] pl-3">
                  <h3 className="text-sm font-semibold text-[#0b294a]">{optionName}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#586a80]">{optionDescription}</p>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-2 text-center text-xs leading-5 text-[#718197]">
        <p>Algunas opciones requieren cuentas, licencias o servicios de terceros.</p>
        <p>Los costes externos, límites y condiciones se detallarán en cada presupuesto.</p>
        <p>Los textos legales se publicarán con la información que facilite el cliente y conviene validarlos con un profesional.</p>
      </div>
    </section>
  );
}
