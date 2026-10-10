# Revisión de seguridad y captación — 8 de octubre de 2026

## Alcance y límites

Revisión estática del repositorio, sus dependencias npm, la aplicación `apps/portfolio`, configuración de Firebase Hosting, textos legales, formularios, metadatos y artefactos generados. Se ejecutaron comprobaciones locales de tipos, lint, pruebas y build. No es una prueba de penetración ni una verificación de la configuración de Firebase, Google reCAPTCHA o EmailJS en sus paneles; tampoco se ha desplegado ni se ha enviado un correo real.

## Cambios cerrados en el repositorio

- **Formulario y spam:** validación de campos con límites de longitud, honeypot y reCAPTCHA v2 de casilla. El token se remite a EmailJS como `g-recaptcha-response`. El formulario falla de forma cerrada si falta la clave pública o no se valida el captcha y presenta las alternativas de contacto.
- **Configuración necesaria para activarlo:** definir `VITE_RECAPTCHA_SITE_KEY` en el entorno de compilación; crear la clave v2 con los dominios definitivos y localhost; y habilitar reCAPTCHA v2 en la plantilla EmailJS con la clave secreta. La clave secreta no debe ponerse en el frontend ni en variables `VITE_`. Los pasos están en `apps/portfolio/RECAPTCHA_SETUP.md`.
- **Cookies y privacidad:** textos legales y aviso actualizados para declarar que no hay analítica, publicidad ni GTM, describir almacenamiento local y reCAPTCHA, y mencionar `_GRECAPTCHA`. reCAPTCHA se solicita al empezar el formulario, no al entrar en la web. La red `recaptcha.net` evita usar el dominio principal `google.com`, aunque Google sigue siendo el proveedor del captcha.
- **SEO/rutas:** metadatos y canonical específicos de ZeroVanity, inclusión de su ruta de demo en sitemap, eliminación de `lastmod` artificial por build, redirecciones para las rutas históricas de DevOps Shop y tratamiento de rutas desconocidas.
- **Oferta:** página de precios alineada con 400 € + IVA, alcance de una página y aclaración sobre renovación de dominio/hosting y mantenimiento tras el primer año.
- **CSP:** allowlist limitada para cargar y mostrar reCAPTCHA y comunicarse con EmailJS. Debe confirmarse en cabeceras una vez publicado.
- **Código y dependencias:** Vite config migrada a `.mts`; reglas ESLint trasladadas a configuración plana; tipado mejorado en pricing/SEO; dependencia de tipografía no usada retirada; fuente Inter rota sustituida por archivo local válido y licencia incluida.
- **Higiene:** `apps/zero-chaos/build_debug.txt` se retiró del índice de Git para que no se publique; el archivo local se conservó. No se borraron datos de proyectos ni se modificó Supabase.
- **Artefactos:** `apps/portfolio/dist` se compiló y sus archivos se copiaron sobre el `dist` raíz sin limpiar el directorio, para conservar los artefactos de otros proyectos. No se ejecutó un comando de despliegue.

## Verificación ejecutada

- `npm run type-check --workspace=portfolio-app`: correcto.
- `npm run lint --workspace=portfolio-app`: correcto, sin avisos.
- `npm test --workspace=portfolio-app`: 3 pruebas correctas.
- `npm run build --workspace=portfolio-app`: correcto; se generaron metadatos para 8 rutas.
- `npm audit`: 0 vulnerabilidades conocidas en el árbol instalado al ejecutar la auditoría.
- `git diff --check`: correcto; Git solo informó diferencias de finales de línea esperadas en Windows.
- Verificación local de salida: CSS/fuente referenciados existen, sitemap incluye ZeroVanity, hay redirecciones de DevOps Shop y la clave del captcha no quedó incrustada en el HTML generado.

## Pendiente para cierre completo

1. La revisión legal profesional de los textos, bases jurídicas y transferencias internacionales sigue pendiente; la implementación técnica no equivale a certificación legal ni a una gestión ante la AEPD.
2. Ninguna acción técnica pendiente para este punto: el usuario confirma que ya aplicó en Gmail y WhatsApp la regla operativa de supresión a 90 días. El sitio no elimina esos mensajes automáticamente.
3. Operación de EmailJS cerrada según confirmación del usuario: ha cancelado/desactivado el historial y tiene activa “Do not save private data” en Contact Us. La opción evita guardar los valores de parámetros en el historial de la plantilla y desactiva el reenvío desde dicho historial. Esto no permite afirmar que se hayan eliminado registros anteriores ni que no queden metadatos técnicos; no queda una acción operativa pendiente para el usuario en este punto.

## Riesgos/deuda residual observada

- `apps/portfolio/src/components/ui/Button.tsx` conserva un `as any` en una unión de props de botón/enlace; eliminarlo requiere rediseñar ese componente común y no se forzó una conversión que rompía TypeScript.
- Existe renderizado con `dangerouslySetInnerHTML` en entradas de artículos (`BlogPost.tsx`). El contenido parece ser editorial estático versionado; mantenerlo así y no introducir contenido de usuarios sin sanitización.
- El repositorio conserva componentes y datos antiguos sin uso en las rutas activas (incluidos configurador/paquetes antiguos y páginas comerciales con textos de Madrid/SEO/tienda online). Las rutas comerciales antiguas están redirigidas y estos módulos no se incluyen en el flujo principal; conviene retirarlos en una limpieza posterior con revisión del historial/uso antes de borrar archivos. No se borraron para evitar pérdida irreversible.
- `dist` raíz conserva posibles archivos antiguos no referenciados, porque no se limpió de forma destructiva. La página de entrada actual apunta a los recursos nuevos; una publicación basada en un build limpio del flujo oficial puede retirar esos huérfanos.
- Los resultados de npm audit reflejan advisories conocidos en el momento de la revisión y no descartan errores de lógica ni vulnerabilidades no publicadas.

## Referencias oficiales consultadas

- EmailJS: [Integración de CAPTCHA](https://www.emailjs.com/docs/user-guide/adding-captcha-verification/).
- Google reCAPTCHA: [FAQ sobre cookies, `recaptcha.net` y configuración CSP](https://developers.google.com/recaptcha/docs/faq).
- Firebase: [Privacidad y tratamiento de datos, incluido Hosting e IP](https://firebase.google.com/support/privacy).
- EmailJS: [Política de privacidad](https://www.emailjs.com/legal/privacy-policy/), [Términos](https://www.emailjs.com/legal/terms-of-service/), [DPA](https://www.emailjs.com/legal/data-protection-agreement/) y [retención por plan](https://www.emailjs.com/pricing/).
- AEPD: [principios del tratamiento, incluido el plazo de conservación](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/4-los-principios-del-tratamiento/FAQ-0207-que-principios-debo-cumplir).
- AEPD: [información por capas al recoger datos directamente](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-de-informacion/FAQ-0217-que-informacion-debe-facilitarse-cuando-los-datos-se-obtengan-directamente-del-afectado).
- BOE: [LSSI, artículo 10 (identificación, contacto y precios con impuestos)](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
- Google Cloud: [actualización de funciones de Google como encargado de reCAPTCHA desde el 2 de abril de 2026](https://docs.cloud.google.com/recaptcha/docs/faq), [condiciones de servicio](https://cloud.google.com/terms/service-terms) y [DPA](https://cloud.google.com/terms/data-processing-addendum).

## Actualización — 10 de octubre de 2026

- El usuario confirmó que completó una prueba real del formulario y recibió el correo.
- Se corrigió el renderizado del widget para esperar a que la API Enterprise de Google esté lista. El build usa la URL oficial de Google.
- En producción se verificaron la cabecera CSP, `robots.txt`, `sitemap.xml`, canonicals de portada y páginas legales, y redirecciones HTTP 301 para las rutas antiguas comprobadas.
- La política de privacidad identifica el buzón receptor `zerocode.devops@gmail.com`, explica la cancelación del historial de EmailJS confirmada por el usuario, advierte que pueden persistir metadatos técnicos y describe su DPA/transferencias según la documentación vigente; también explica Gmail y WhatsApp.
- Se fija como regla de ZeroCode eliminar consultas sin contratación a los 90 días de la última interacción. Este es un plazo operativo elegido para este tratamiento, no un período legal predeterminado por la AEPD. Se aplica también a chats de WhatsApp, salvo negociación abierta, obligaciones legales o reclamaciones.
- El usuario confirma que la cuenta usa el plan gratuito de EmailJS y que canceló/desactivó su historial. Se retiró de la política el plazo genérico de 7 días, porque la configuración actual declarada es que el historial está desactivado; se mantiene la precisión de que pueden existir metadatos de servicio.
- El usuario confirma que aplicó en Gmail y WhatsApp la regla de 90 días para consultas que no generan contratación.
- El usuario confirma que activó “Do not save private data” en la plantilla EmailJS Contact Us. La política describe que los valores de parámetros no se guardan en el historial de esa plantilla y que se desactiva el reenvío desde el historial.
- Se amplió la primera capa informativa del formulario con responsable, finalidad, base precontractual, conservación, derechos, AEPD y enlace a la política completa. La AEPD recomienda información por capas, concisa y accesible, y diferencia el deber de informar de pedir consentimiento.
- Se actualizó la información de reCAPTCHA: desde el 2 de abril de 2026, Google declara que actúa como encargado del tratamiento para datos de reCAPTCHA; se quitaron las referencias a la política general de Google en ese contexto y se enlazaron las condiciones específicas y el DPA de Google Cloud. La política general se mantiene para Gmail.
- El usuario confirma que `admin@zerocode-devops.com` está operativo y revisado para solicitudes de derechos. El correo de recepción del formulario se mantiene identificado por separado como `zerocode.devops@gmail.com`.
- En producción se observó que reCAPTCHA se cargaba al enfocar un campo del formulario. En el código local se cambió para solicitarlo solo después de un intento de envío válido: el usuario completa la casilla y pulsa Enviar de nuevo. Este cambio aún requiere build y publicación para comprobarse en producción.
- El aviso de cookies y su enlace en el pie ahora se describen como información sobre cookies/almacenamiento, no como configuración o registro de consentimiento. La política distingue que `zerocode-cookie-consent-v1` recuerda el cierre del aviso y no una elección de consentimiento. La sección de reCAPTCHA ya indica carga tras el intento válido de envío y no afirma un plazo fijo de `_GRECAPTCHA`.
- El usuario confirma que WhatsApp Business elimina todo el historial a los 90 días y que la copia automática en su cuenta de Google está activada y cifrada de extremo a extremo. Las acciones operativas de retención/borrado se consideran cerradas según su confirmación. WhatsApp documenta que Google administra el almacenamiento y que una nueva copia sobrescribe la anterior.
- El usuario confirma que canceló el historial de EmailJS y mantiene activa “Do not save private data”. Se considera cerrada la acción operativa; la política solo advierte que podrían existir metadatos técnicos, sin afirmar que persistan registros de contenido.
- Se creó `REVISION-LEGAL-PARA-PROFESIONAL.md` con estados de evidencia, pendientes técnicos/contractuales y cuestiones para validación profesional. No certifica cumplimiento.
- La validación profesional pendiente debe confirmar la exención de consentimiento de `_GRECAPTCHA` en este caso concreto, los términos y transferencias para las cuentas/servicios específicos Google usados (Firebase, Gmail y reCAPTCHA) y la redacción de las excepciones de conservación. Esta revisión técnica no constituye asesoramiento jurídico.
- El usuario confirmó que subió el paquete. Se verificaron en producción las páginas `/politica-de-privacidad` y `/politica-de-cookies` (HTTP 200), y que la página de inicio sirve el bundle de privacidad actualizado con la opción EmailJS, los 7 días y los 90 días. El bundle de contacto actualizado también se sirve en producción, con la primera capa de información y el correo de derechos.
- No se realizó el despliegue desde el agente; la publicación fue realizada por el usuario.
