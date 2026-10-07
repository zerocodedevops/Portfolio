# Registro interno de actividades de tratamiento — ZeroCode DevOps

**Documento interno de responsabilidad proactiva; no publicar en la web.** Revisión: 7 de octubre de 2026.

Este registro describe el tratamiento que se desprende del código revisado. El titular debe mantenerlo actualizado con la configuración real de EmailJS y Firebase, los buzones de destino y cualquier cambio de proveedor. La AEPD indica que el registro de actividades sustituye a la antigua inscripción de ficheros y se conserva internamente a disposición de la autoridad.

## Responsable

- **Titular:** David González - ZeroCode DevOps
- **NIF:** 51994535E
- **Dirección:** C/ José Manuel Caballero Bonald 2, Rivas-Vaciamadrid, Madrid, España
- **Contacto:** admin@zerocode-devops.com
- **Delegado de protección de datos:** no identificado como designado. Revisar si el tipo o escala futura de tratamientos obliga a nombrarlo.

## Tratamiento: consultas y solicitudes de presupuesto

| Elemento | Descripción |
|---|---|
| Finalidad | Responder consultas y preparar propuestas solicitadas por la persona interesada. Sin marketing ni suscripción comercial. |
| Interesados | Personas que escriben mediante el formulario, email o WhatsApp. |
| Datos | Nombre, email, asunto, mensaje y los datos que la persona incluya voluntariamente. |
| Base jurídica | Medidas precontractuales solicitadas por la persona (art. 6.1.b RGPD). Para gestionar la comunicación cuando no haya una solicitud precontractual, interés legítimo (art. 6.1.f), ponderado con las expectativas razonables de quien contacta. |
| Destinatarios / encargados | EmailJS transmite los campos del formulario al buzón de contacto. Google Firebase Hosting entrega el sitio y procesa IP de las solicitudes. Email y WhatsApp solo se usan cuando la persona elige esos canales; el proveedor de canal puede tratar sus datos bajo sus propios términos. |
| Transferencias | El DPA publicado por EmailJS contempla transferencias a EE. UU. con cláusulas contractuales tipo. Confirmar en la cuenta del titular que el DPA se aplica al plan activo y revisar ubicación, subencargados y mecanismos vigentes. Revisar también los términos de tratamiento y transferencias de Firebase/Google en la cuenta. |
| Conservación | Consulta: mientras se responde y gestiona una posible negociación; luego supresión o bloqueo cuando corresponda, salvo conservación necesaria para obligaciones legales o responsabilidades durante sus plazos de prescripción. El titular debe aplicar esta regla también a la bandeja de entrada y copias. EmailJS: verificar ajustes y retención efectivos de la cuenta. Firebase Hosting: Google publica retención de datos IP durante unos meses. |
| Medidas conocidas | Envío del sitio por HTTPS; no se solicita información sensible; envío del formulario a través de EmailJS; GTM y analítica desactivados; política y aviso de privacidad visibles. Revisar periódicamente permisos de cuentas, MFA, claves públicas de EmailJS, acceso al buzón y respuesta a incidentes. |

## Tratamiento: seguridad y prestación del alojamiento

Firebase Hosting procesa direcciones IP de solicitudes entrantes para detectar abuso y generar información de uso. Base del responsable: interés legítimo en seguridad y disponibilidad del sitio. Según la documentación de Google, la retención de estas IP es de unos meses. No se ha verificado la configuración de informes, exportaciones ni acceso a registros de la cuenta; el titular debe comprobarla.

## Almacenamiento local de preferencias

El código usa `i18nextLng` para recordar idioma y `zerocode-cookie-consent-v1` para recordar que la medición opcional está desactivada. No se cargan ahora GTM, Google Analytics, publicidad ni otras etiquetas de seguimiento. Si se incorporan más adelante tecnologías no necesarias, actualizar el inventario público antes de activarlas y bloquear su carga hasta obtener consentimiento válido.

## Comprobaciones operativas pendientes del titular

1. Confirmar que EmailJS solo envía los campos declarados y que el DPA publicado está incorporado al servicio/plan efectivo.
2. Revisar subencargados, ubicación y transferencias actuales de EmailJS y Google/Firebase en sus cuentas y conservar evidencia de los acuerdos aplicables.
3. Identificar y revisar el buzón que recibe consultas y sus copias, reenvíos y reglas de borrado.
4. Acordar un ciclo interno para borrar consultas cerradas cuando ya no sean necesarias, salvo bloqueos legales.
5. Mantener controles de acceso y autenticación reforzada en las cuentas de EmailJS y Firebase; no incluir credenciales en el repositorio.

No se ha enviado ni debe enviarse una antigua notificación de ficheros a la AEPD: el registro aquí documentado es interno. Revisar la aplicabilidad del RAT y las restantes obligaciones según el volumen y la naturaleza real del tratamiento.
