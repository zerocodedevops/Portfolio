import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout/Layout';
import { openCookieSettings } from '@/components/CookieConsent';

const controller = 'David González - ZeroCode DevOps';
const taxId = '51994535E';
const address = 'C/ José Manuel Caballero Bonald 2, Rivas-Vaciamadrid, Madrid, España';
const contactEmail = 'admin@zerocode-devops.com';

function LegalShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const location = useLocation();
  return (
    <Layout>
      <Seo title={title} description={description} url={`https://zerocode-devops.com${location.pathname}`} />
      <article className="container-custom mx-auto max-w-4xl px-5 py-16 text-slate-800">
        <h1 className="mb-8 text-3xl font-bold text-slate-950">{title}</h1>
        <div className="space-y-5 leading-7">{children}</div>
        <p className="mt-10 border-t pt-5 text-sm"><Link className="underline" to="/">Volver al inicio</Link></p>
      </article>
    </Layout>
  );
}

export function LegalNoticePage() {
  return <LegalShell title="Aviso legal" description="Información legal y datos de contacto de ZeroCode DevOps.">
    <h2 className="text-xl font-semibold">Titular del sitio</h2>
    <p><strong>Titular:</strong> {controller}<br /><strong>NIF:</strong> {taxId}<br /><strong>Domicilio:</strong> {address}<br /><strong>Correo:</strong> <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
    <p>Este sitio ofrece información sobre servicios de diseño y desarrollo web y muestra demostraciones de proyectos. Para consultas sobre el sitio, puedes escribir al correo indicado.</p>
    <p><strong>Precios:</strong> servicio desde 400 €, más IVA; el presupuesto final depende del alcance acordado.</p>
    <h2 className="text-xl font-semibold">Propiedad intelectual y responsabilidad</h2>
    <p>Los contenidos propios del sitio están protegidos por la normativa aplicable. Las marcas, nombres e imágenes de proyectos de terceros pertenecen a sus respectivos titulares. Las demostraciones se identifican como tales y pueden usar datos ficticios.</p>
    <p>El titular procura mantener la información actualizada, pero no garantiza la ausencia de errores o interrupciones. Los enlaces externos se ofrecen como referencia y se rigen por las condiciones de sus respectivos sitios.</p>
  </LegalShell>;
}

export function PrivacyPolicyPage() {
  return <LegalShell title="Política de privacidad" description="Cómo ZeroCode DevOps trata los datos enviados por formulario y otros canales.">
    <p><strong>Responsable:</strong> {controller}, NIF {taxId}. <strong>Dirección:</strong> {address}. <strong>Contacto:</strong> <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
    <h2 className="text-xl font-semibold">Qué datos y para qué</h2>
    <p>Si envías una consulta mediante el formulario, tratamos nombre, correo electrónico, asunto y mensaje para responderte y, si procede, preparar una propuesta solicitada. La base jurídica para preparar la propuesta es la aplicación de medidas precontractuales a petición tuya; la gestión de la comunicación se apoya en el interés legítimo. No usamos estos datos para enviarte publicidad no solicitada.</p>
    <p>Al navegar, Firebase Hosting recibe direcciones IP de las solicitudes para prestar el alojamiento, detectar abusos y generar información de uso. Google indica que Hosting conserva datos IP durante unos meses. La base del tratamiento por el responsable es el interés legítimo en mantener la seguridad y disponibilidad del sitio; el proveedor gestiona sus registros conforme a sus condiciones.</p>
    <p>Si contactas por WhatsApp o correo, se tratarán los datos que incluyas en el mensaje a través del proveedor de ese canal. En WhatsApp, los chats de consultas se conservarán hasta 90 días desde la última interacción y después se eliminarán, salvo que la conversación siga abierta o deba conservarse por una obligación legal o para gestionar un contrato. No es necesario incluir información sensible.</p>
    <h2 className="text-xl font-semibold">Destinatarios y proveedores</h2>
    <p>El formulario transmite nombre, email, asunto y mensaje mediante EmailJS a la cuenta de correo del responsable, <a className="underline" href="mailto:zerocode.devops@gmail.com">zerocode.devops@gmail.com</a>. EmailJS informa de que almacena actividad y metadatos de las solicitudes en sus servicios, y que los metadatos pueden aparecer en el panel de eventos. En la plantilla Contact Us está activada la opción “Do not save private data”: los valores de los parámetros enviados no se guardan en el historial de esa plantilla y se desactiva la opción de reenviar desde dicho historial. En la cuenta de ZeroCode se usa el plan gratuito, cuyo historial detallado EmailJS conserva durante 7 días según la información pública vigente; este plazo puede cambiar. EmailJS indica que sus servidores están en EE. UU. y que pueden existir transferencias internacionales protegidas mediante cláusulas contractuales tipo. Sus condiciones indican que su acuerdo de tratamiento de datos (DPA) se incorpora por referencia para tratamientos sujetos al RGPD. Consulta la <a className="underline" href="https://www.emailjs.com/legal/privacy-policy/" rel="noreferrer" target="_blank">política de privacidad</a>, los <a className="underline" href="https://www.emailjs.com/legal/terms-of-service/" rel="noreferrer" target="_blank">términos</a>, el <a className="underline" href="https://www.emailjs.com/legal/data-protection-agreement/" rel="noreferrer" target="_blank">acuerdo de tratamiento de EmailJS</a> y sus <a className="underline" href="https://www.emailjs.com/pricing/" rel="noreferrer" target="_blank">plazos de conservación por plan</a>.</p>
    <p>Si eliges contactar por WhatsApp, Meta/WhatsApp tratará la información que envíes conforme a su <a className="underline" href="https://www.whatsapp.com/legal/privacy-policy-eea" rel="noreferrer" target="_blank">política de privacidad aplicable en el Espacio Económico Europeo</a>. El correo de recepción usa Gmail, sujeto a la <a className="underline" href="https://policies.google.com/privacy?hl=es-es" rel="noreferrer" target="_blank">política de privacidad de Google</a>. Al empezar a rellenar el formulario se carga reCAPTCHA (Google Cloud Fraud Defense) para prevenir envíos automatizados, fraude y abusos. Google indica que, desde el 2 de abril de 2026, actúa como encargado del tratamiento respecto a los datos de reCAPTCHA y los trata conforme a sus condiciones específicas y a su <a className="underline" href="https://cloud.google.com/terms/data-processing-addendum" rel="noreferrer" target="_blank">acuerdo de tratamiento de datos</a>; puede establecer la cookie técnica <code>_GRECAPTCHA</code> para el análisis de riesgos.</p>
    <p>El sitio se aloja en Firebase Hosting, de Google, que trata direcciones IP y datos técnicos para prestar, mantener y proteger el servicio; Google indica que conserva datos IP de Hosting durante unos meses. No se venden datos ni se usan para publicidad.</p>
    <p>La web no utiliza autenticación ni una base de datos para recoger datos de visitantes. Firebase se mantiene para alojar el sitio mientras se use el servicio.</p>
    <h2 className="text-xl font-semibold">Conservación y derechos</h2>
    <p>Las consultas recibidas por formulario o correo que no den lugar a una contratación se conservarán hasta 90 días desde la última interacción y después se eliminarán, salvo que la conversación siga abierta o exista una obligación legal o una reclamación que justifique conservarlas durante más tiempo. Si se inicia una relación contractual, los datos necesarios se conservarán durante los plazos legales aplicables. El plazo de 90 días también se aplica a los chats de WhatsApp conforme a lo indicado arriba. El historial técnico que EmailJS conserve en su plataforma puede estar sujeto a los ajustes y plazos propios de ese proveedor; el responsable revisará y eliminará esos registros desde su panel cuando corresponda.</p>
    <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a {contactEmail}; también puedes retirar un consentimiento cuando el tratamiento se base en él. Puedes reclamar ante la Agencia Española de Protección de Datos (<a className="underline" href="https://www.aepd.es/" rel="noreferrer" target="_blank">AEPD</a>).</p>
    <p>El envío del formulario no te suscribe a comunicaciones comerciales. La política podrá actualizarse si cambian las finalidades, proveedores o servicios.</p>
  </LegalShell>;
}

export function CookiesPolicyPage() {
  return <LegalShell title="Política de cookies" description="Información sobre cookies y almacenamiento local utilizado en ZeroCode DevOps.">
    <p>Este sitio no utiliza cookies de analítica, publicidad ni seguimiento. Google Tag Manager (GTM) y las etiquetas asociadas están desactivados. reCAPTCHA (Google Cloud Fraud Defense) se carga solo cuando empiezas a rellenar el formulario de contacto y puede establecer la cookie técnica <code>_GRECAPTCHA</code> para analizar riesgos y prevenir envíos automatizados, fraude y abusos. Google indica que actúa como encargado para esta función y que trata los datos conforme a sus <a className="underline" href="https://cloud.google.com/terms/service-terms" rel="noreferrer" target="_blank">condiciones específicas</a> y a su <a className="underline" href="https://cloud.google.com/terms/data-processing-addendum" rel="noreferrer" target="_blank">acuerdo de tratamiento de datos</a>. Si en el futuro se activan etiquetas de medición o publicidad, se actualizará esta política y se solicitará consentimiento antes de cargarlas.</p>
    <h2 className="text-xl font-semibold">Almacenamiento necesario</h2>
    <ul className="list-disc space-y-2 pl-6">
      <li><code>zerocode-cookie-consent-v1</code> (almacenamiento local): recuerda que no hay categorías opcionales activas hasta que borres los datos del sitio.</li>
      <li><code>i18nextLng</code> (almacenamiento local): recuerda el idioma escogido hasta que borres los datos del sitio.</li>
      <li><code>_GRECAPTCHA</code> (cookie de Google reCAPTCHA): se crea al empezar a rellenar el formulario y sirve para el análisis de riesgos y la prevención de envíos automatizados. Su duración la determina Google.</li>
    </ul>
    <p>Las dos claves de almacenamiento local son propias y no son cookies de seguimiento. Firebase Hosting también recibe direcciones IP para entregar el sitio, detectar abusos y generar información de uso; Google informa que conserva esas IP durante unos meses.</p>
    <h2 className="text-xl font-semibold">Enlaces externos</h2>
    <p>El sitio puede enlazar a WhatsApp y otros servicios externos. No se cargan sus contenidos incrustados dentro de esta página. Al abrir un enlace, el proveedor externo podrá tratar datos conforme a su propia política.</p>
    <h2 className="text-xl font-semibold">Cambiar tu elección</h2>
    <p>No hay categorías opcionales de analítica o publicidad activas. Puedes revisar la preferencia guardada con este botón:</p>
    <button className="border border-slate-500 px-4 py-2 font-semibold hover:bg-slate-100" onClick={openCookieSettings} type="button">Configurar cookies</button>
    <p>También puedes borrar el almacenamiento del sitio desde la configuración del navegador. Los enlaces externos, como WhatsApp, pueden usar sus propias cookies al abrirse y están sujetos a las políticas del proveedor.</p>
  </LegalShell>;
}
