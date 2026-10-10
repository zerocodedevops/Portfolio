# Información para revisión profesional de privacidad y comercio electrónico

**Sitio:** https://zerocode-devops.com  
**Responsable indicado:** David González – ZeroCode DevOps, NIF 51994535E  
**Domicilio indicado:** C/ José Manuel Caballero Bonald 2, Rivas-Vaciamadrid, Madrid  
**Contacto para derechos:** admin@zerocode-devops.com (el responsable confirma que funciona y lo revisa)  
**Correo receptor de formularios:** zerocode.devops@gmail.com  
**Fecha de preparación:** 10 de octubre de 2026

## Qué hace el sitio y cómo leer el estado

- Web de captación para diseño y desarrollo web; el formulario recoge nombre, correo, asunto y mensaje.
- EmailJS Free transmite formularios a Gmail. El responsable confirma que desactivó/canceló el historial de EmailJS y activó “Do not save private data” en la plantilla Contact Us. Son medidas operativas cerradas según confirmación del responsable. Para no sobreprometer, la política aclara que la desactivación del historial no permite afirmar que EmailJS no procese metadatos técnicos; la revisión profesional puede valorar si la información publicada y las condiciones del proveedor son suficientes.
- reCAPTCHA v2 checkbox se carga después del primer intento de enviar un formulario válido para prevenir automatización, fraude y abuso. Esta activación diferida está implementada en el código local, pero queda por confirmar tras la publicación. Puede instalar _GRECAPTCHA. Google Cloud indica que, desde el 2 de abril de 2026, actúa como encargado para los datos de Fraud Defense/reCAPTCHA y remite al Cloud DPA y a las condiciones específicas.
- Firebase Hosting aloja la web y recibe IP de solicitudes para abuso y análisis operativo; la documentación de Firebase indica que conserva IP durante unos meses.
- Gmail y WhatsApp Business se usan para recibir y gestionar consultas. El responsable confirma que aplica supresión a los 90 días desde la última interacción a consultas sin contratación y confirma que WhatsApp elimina el historial al cumplir ese plazo. También declara que la copia automática de WhatsApp Business en su cuenta de Google está activada y cifrada de extremo a extremo. No se inspeccionaron los paneles; estas medidas se registran como confirmadas por el responsable, no como verificación independiente. WhatsApp documenta que Google administra el almacenamiento y que una nueva copia sobrescribe la anterior.
- No se declaran activos GTM, analítica ni publicidad. El idioma y el cierre del aviso informativo se guardan en localStorage; el aviso no representa una elección de consentimiento.

### Convenciones de evidencia

- **Verificado en producción:** observación directa del sitio publicado en la fecha indicada.
- **Declarado por el responsable:** confirmado en conversación o panel mostrado, pero no comprobado de forma independiente.
- **Verificado en código local:** confirmado en los archivos de trabajo; requiere publicación para comprobar el efecto en producción.
- **Pendiente:** falta evidencia técnica, contractual o una decisión del responsable/profesional.

## Puntos concretos para validar

1. **Bases jurídicas — pendiente de validación profesional:** el texto separa solicitud de propuesta/medidas precontractuales de otras consultas y expresa interés legítimo para responder consultas generales y proteger el formulario. Confirmar que esta distinción es correcta y si documentar una ponderación para seguridad, reCAPTCHA y Hosting.
2. **Google reCAPTCHA y _GRECAPTCHA:** confirmar la caracterización como encargado y suficiencia del Cloud DPA/condiciones para la cuenta y proyecto concretos; revisar transferencias internacionales y medidas complementarias, si aplican. Evaluar si la cookie de seguridad está exenta de consentimiento previo bajo art. 22.2 LSSI en esta implementación concreta. No se ha localizado una duración fija publicada por Google para _GRECAPTCHA; confirmar duración observable y su declaración.
3. **Firebase Hosting:** comprobar acuerdo y cuenta contractual de Google, DPA/CDPA aplicable, ubicación/transferencias, uso o no de Cloud Logging, BigQuery o Analytics, retención real de logs y si la política debe distinguir datos de servicio de Google de datos de visitantes.
4. **Gmail personal/gratuito:** aclarar el rol y las condiciones aplicables al uso del buzón zerocode.devops@gmail.com para datos de clientes, si existe encargo de tratamiento o si Google puede tratar parte de los datos bajo su política de consumo; aconsejar si es adecuado o recomendar Workspace empresarial. No asumir que el Cloud DPA de Firebase cubre Gmail personal.
5. **EmailJS — operación cerrada por confirmación del responsable:** plan Free, historial desactivado/cancelado y “Do not save private data” habilitado en Contact Us. No se inspeccionó el panel en esta revisión; no se afirma que se hayan eliminado registros previos ni que ningún metadato sobreviva. Solo queda para revisión profesional valorar DPA, subencargados/ubicación en EE. UU., transferencias y si la información sobre metadatos residuales es suficiente.
6. **WhatsApp — operación cerrada por confirmación del responsable:** WhatsApp Business, eliminación de todo el historial a los 90 días y copia automática cifrada de extremo a extremo en la cuenta de Google. La revisión profesional puede valorar la descripción de proveedores/transferencias y las excepciones legales o contractuales, pero no se deja pendiente ninguna tarea operativa de borrado. WhatsApp informa que Google proporciona y administra el almacenamiento y que una copia nueva sobrescribe la anterior. Fuentes: [copias de Google Account](https://faq.whatsapp.com/407643231403807/?locale=es_LA) y [cifrado de extremo a extremo de copias](https://faq.whatsapp.com/490592613091019/?locale=es_ES).
7. **Conservación — operación cerrada por confirmación del responsable:** aplica supresión a los 90 días en Gmail y WhatsApp para consultas sin contratación. El profesional puede valorar si el plazo es proporcionado, si las excepciones están bien delimitadas y qué datos contractuales/fiscales se conservan por obligación legal.
8. **Cookies/transparencia:** en producción se observó que el captcha se cargaba al enfocar un campo del formulario; el código local ahora espera a un intento válido de envío. Falta comprobar en un navegador limpio qué cookies, almacenamiento y solicitudes se producen antes/después del envío y tras resolver el captcha. La política ahora presenta el cierre como aviso informativo, no como consentimiento, y no atribuye un TTL fijo a _GRECAPTCHA. Confirmar inventario, duración observable, finalidad, proveedor, ausencia de GTM/analítica y valoración del art. 22.2 LSSI para esta implementación concreta.
9. **Aviso legal y precio:** confirmar datos identificativos publicados bajo LSSI art. 10 (titular, NIF, domicilio, contacto directo y precio desde 400 € más IVA) y si debe indicarse alguna inscripción o condición profesional adicional según la situación concreta.
10. **Derechos y procedimiento:** el responsable confirma que admin@zerocode-devops.com funciona y se revisa. La cancelación del historial de EmailJS y la supresión del historial de WhatsApp a 90 días están cerradas según confirmación del responsable; no queda pendiente una acción de borrado en esos dos puntos. Como mejora documental independiente, el profesional puede recomendar un procedimiento sencillo de respuesta a derechos/incidentes y un registro básico de actividades proporcionado al negocio.

## Estado de publicación

Los textos y la primera capa informativa previos se subieron por el responsable y se comprobaron en producción el 10 de octubre de 2026. Los cambios de esta revisión local ya compilaron y requieren publicación del responsable para comprobarse en producción. Este documento es un resumen para validar configuración y redacción; no constituye una opinión jurídica ni certifica cumplimiento.
