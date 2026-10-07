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
    <p>Si envías una consulta mediante el formulario, tratamos nombre, correo electrónico, asunto y mensaje para responderte y, si procede, preparar una propuesta solicitada. La base jurídica es atender medidas precontractuales a petición tuya y el interés legítimo en gestionar la comunicación. No usamos estos datos para enviarte publicidad no solicitada.</p>
    <p>Al navegar, Firebase Hosting recibe direcciones IP de las solicitudes para prestar el alojamiento, detectar abusos y generar información de uso. Google indica que Hosting conserva datos IP durante unos meses. La base del tratamiento por el responsable es el interés legítimo en mantener la seguridad y disponibilidad del sitio; el proveedor gestiona sus registros conforme a sus condiciones.</p>
    <p>Si contactas por WhatsApp o correo, se tratarán los datos que incluyas en el mensaje a través del proveedor de ese canal. No es necesario incluir información sensible.</p>
    <h2 className="text-xl font-semibold">Destinatarios y proveedores</h2>
    <p>El formulario se envía mediante EmailJS, que trata los datos necesarios para transmitir la consulta al correo del responsable. El sitio se aloja en Firebase Hosting, de Google, que trata direcciones IP y datos técnicos para prestar, mantener y proteger el servicio; Google indica que conserva datos IP de Hosting durante unos meses. EmailJS publica un acuerdo de tratamiento que contempla transferencias a EE. UU. y cláusulas contractuales tipo. El responsable debe comprobar en su cuenta que el acuerdo está incorporado al servicio y revisar allí los subencargados y ajustes vigentes. No se venden datos ni se usan para publicidad.</p>
    <p>La web no utiliza autenticación ni una base de datos para recoger datos de visitantes. Firebase se mantiene para alojar el sitio mientras se use el servicio.</p>
    <h2 className="text-xl font-semibold">Conservación y derechos</h2>
    <p>Las consultas se conservarán mientras se responden y, si hay negociación, durante el tiempo necesario para gestionarla. Después se suprimirán o bloquearán cuando proceda, salvo los datos que deban conservarse para cumplir obligaciones legales o atender posibles responsabilidades, durante sus plazos de prescripción. Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a {contactEmail}; también puedes retirar un consentimiento cuando el tratamiento se base en él. Puedes reclamar ante la Agencia Española de Protección de Datos (<a className="underline" href="https://www.aepd.es/" rel="noreferrer" target="_blank">AEPD</a>).</p>
    <p>El envío del formulario no te suscribe a comunicaciones comerciales. La política podrá actualizarse si cambian las finalidades, proveedores o servicios.</p>
  </LegalShell>;
}

export function CookiesPolicyPage() {
  return <LegalShell title="Política de cookies" description="Información sobre cookies y almacenamiento local utilizado en ZeroCode DevOps.">
    <p>Este sitio no instala actualmente cookies de analítica, publicidad ni seguimiento. Google Tag Manager (GTM) y las etiquetas asociadas están desactivados. No se hacen solicitudes al contenedor GTM-P8CDP9X6. Si se activan en el futuro, se actualizará esta política y se solicitará consentimiento antes de cargar cualquier tecnología no necesaria.</p>
    <h2 className="text-xl font-semibold">Almacenamiento necesario</h2>
    <ul className="list-disc space-y-2 pl-6">
      <li><code>zerocode-cookie-consent-v1</code> (almacenamiento local): recuerda que la medición opcional está desactivada hasta que borres los datos del sitio.</li>
      <li><code>i18nextLng</code> (almacenamiento local): recuerda el idioma escogido hasta que borres los datos del sitio.</li>
    </ul>
    <p>Son claves propias y no son cookies de seguimiento. Firebase Hosting también recibe direcciones IP para entregar el sitio, detectar abusos y generar información de uso; Google informa que conserva esas IP durante unos meses.</p>
    <h2 className="text-xl font-semibold">Enlaces externos</h2>
    <p>El sitio puede enlazar a WhatsApp y otros servicios externos. No se cargan sus contenidos incrustados dentro de esta página. Al abrir un enlace, el proveedor externo podrá tratar datos conforme a su propia política.</p>
    <h2 className="text-xl font-semibold">Cambiar tu elección</h2>
    <p>La medición opcional está desactivada y no hay permiso de analítica activo. Puedes revisar la preferencia guardada con este botón:</p>
    <button className="border border-slate-500 px-4 py-2 font-semibold hover:bg-slate-100" onClick={openCookieSettings} type="button">Configurar cookies</button>
    <p>También puedes borrar el almacenamiento del sitio desde la configuración del navegador. Los enlaces externos, como WhatsApp, pueden usar sus propias cookies al abrirse y están sujetos a las políticas del proveedor.</p>
  </LegalShell>;
}
