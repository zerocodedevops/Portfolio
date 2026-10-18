# Auditoría forense de ZeroCode y sus demos

**Fecha:** 18 de octubre de 2026  
**Alcance:** estado local del monorepo `ZeroCode`, portfolio y demos activas ZeroChaos, ZeroDelay, ZeroVanity y ZeroBreakdown (páginas principal, Fontanería, Electricidad y Climatización).  
**Tipo:** auditoría estática y visual, de solo lectura. No se han editado fuentes de producto, creado cambios de código, desplegado ni publicado nada.

## Resumen ejecutivo

La web principal tiene una propuesta comprensible, precio y alcance visibles, acceso al catálogo y contacto directo. Las demos ofrecen direcciones visuales diferenciadas y el portfolio las identifica como demostraciones. La revisión local comprobó ocho rutas a 390 px: no encontró desbordamientos horizontales ni imágenes rotas.

La web todavía no está lista para presentar todas las demos como ejemplos reales sin una pasada de fiabilidad. El principal riesgo no es un paquete con vulnerabilidades conocidas: `npm audit` no encontró vulnerabilidades, pero hay interacciones que fallan, formularios que confirman envíos ficticios, referencias a servicios y credenciales sin verificar y datos de contacto que parecen ser los de ZeroCode en marcas ficticias. El trabajo local tiene además cambios sin commit; por tanto, esta auditoría describe el estado del directorio de trabajo y no certifica qué está publicado.

### Hallazgos prioritarios

| Prioridad | Hallazgo | Efecto |
|---|---|---|
| P1 | Carga de JavaScript de Fontanería termina con error de sintaxis. | El manejador del formulario y parte de las interacciones no se inicializan. |
| P1 | Formulario de contacto de ZeroChaos muestra éxito sin enviar el mensaje. | Puede hacer creer al visitante que se recibió una consulta. |
| P1 | Demos ZeroDelay y ZeroBreakdown incluyen cifras, certificaciones, garantías y disponibilidad muy concretas sin respaldo visible. | Riesgo de confianza y de presentar como reales datos de una empresa ficticia. |
| P1 | Varias demos solicitan datos personales, pero carecen de etiquetas asociadas y/o de un envío real y aviso de tratamiento propio de la marca. | Fricción de accesibilidad y expectativas incorrectas sobre el destino de los datos. |
| P2 | Enlaces `#contacto` de ZeroBreakdown no resuelven a un elemento con ese id. | Los CTA de contacto no llevan al formulario esperado. |
| P2 | ZeroDelay muestra nombres de iconos Material Symbols como texto literal. | Acabado visual roto y ruido de lectura. |
| P2 | Falta `<h1>` en la demo ZeroVanity y el aviso de privacidad enlaza a `/privacidad`, ruta inexistente. | Estructura semántica y navegación legal deficientes. |
| P2 | Lint de portfolio falla por `fontaneria.js`; typecheck de ZeroChaos falla por tipos generados/rutas. | La validación automática no está verde. |
| P2 | Varias salidas de despliegue independientes carecen de los encabezados de seguridad configurados para el hosting principal. | Un despliegue separado puede perder defensas HTTP presentes en el portfolio. |

## Alcance y método

- Se inspeccionaron el router, las páginas activas, componentes, HTML de referencia, scripts públicos, configuración de hosting y estado Git.
- Se abrió la web local y se recorrieron las ocho rutas indicadas a un viewport de 390 × 844 px. Se revisaron headings, enlaces internos, imágenes, nombres de controles y capturas de pantalla.
- Se ejecutaron typecheck, lint, pruebas existentes y `npm audit` para los workspaces disponibles.
- Se consultaron las skills de diseño Taste, ECC Security Review, Production Audit, Frontend Accessibility, React performance y Differential Review. Se eligieron por la combinación de crítica visual, controles de seguridad, calidad de producción, semántica y trazabilidad de hallazgos. Las skills no relevantes para este sitio se excluyeron deliberadamente.
- El navegador mostró `http://localhost:5173/` con respuesta HTTP 200. No se usaron credenciales ni se enviaron formularios reales.

## Hallazgos técnicos detallados

### P1 — ZeroBreakdown Fontanería: JavaScript con error de sintaxis

`apps/portfolio/public/zero-breakdown/fontaneria.js` contiene, después de declarar `handleFormSubmit`, una línea truncada que empieza con `document.getElementById('modal-diagnostico');if(action...` y termina con cierres incompatibles. El navegador registra `SyntaxError: Unexpected token '}'` al cargar la ruta. La propia tarea ESLint del portfolio detecta el parse error en la línea 48.

El formulario del modal depende de este script para interceptar el submit. En el estado actual no hay una transmisión real; tampoco debe mostrarse una confirmación como si se hubiera enviado. El ajuste prioritario es restaurar un handler válido y decidir de manera explícita si el formulario debe abrir WhatsApp, enviar correo o quedar claramente marcado como demostración.

### P1 — ZeroChaos: confirmación de formulario falsa

`apps/zero-chaos/src/core/components/ContactForm.tsx` registra los valores mediante `console.log` y presenta una alerta de éxito con promesa de respuesta en menos de 24 horas. No hay una solicitud a un servicio de envío en ese flujo. En una demo es aceptable simular, pero el mensaje actual sugiere que el negocio recibió la consulta. La ruta carece de un aviso tan visible como el de ZeroVanity que explique que el flujo no guarda ni transmite información.

**Recomendación:** en modo demo, no pedir datos reales o mostrar un estado de simulación explícito antes de enviar; no decir «enviado» ni prometer una respuesta. Si se vuelve un formulario real, integrar el servicio y mostrar fallos reales.

### P1 — Afirmaciones comerciales concretas sin respaldo visible

- **ZeroDelay** (`apps/zerodelay/src/pages/ZeroDelayMarkup.ts`) afirma, entre otros, puntualidad del 99,4 %, cargas aseguradas, seguimiento 24/7, respuesta en menos de 15 minutos, interrupción cero, guardamuebles climatizados/vigilados y disponibilidad 24/7. También emplea la razón social «Zero Delay Logistics S.L.». Son afirmaciones que no deberían atribuirse a un negocio real sin verificación. La página permite abrir WhatsApp con origen, destino y servicio que introduzca el visitante; no aclara de forma destacada que sea una demo y el número de destino no está verificado como contacto de ese negocio.
- **ZeroBreakdown** (`apps/portfolio/src/features/zero-breakdown/reference-pages/*.html`) presenta guardia 24/7/365, intervención en menos de 30/45 minutos, años de experiencia, volumen de proyectos, certificaciones ISO/RITE/REBT y garantías de cumplimiento. No hay prueba ni aviso de que estos datos sean ficticios en las páginas de cada nicho.
- **ZeroVanity** sí tiene aviso de demo y recomienda no introducir datos personales, lo cual reduce el riesgo; aun así, quedan frases de “equipo de expertos”, productos de gama alta y ubicación de salón que funcionan como contenido ficticio y requieren señalización o revisión.

**Recomendación:** mantener las demos visualmente realistas, pero sustituir métricas, certificados, tiempos de llegada, garantías y razón social por texto claramente ilustrativo, o incluir una banda visible que diga que los datos son ficticios y que el contacto no pertenece a un proveedor real. No convertir las demos en ejemplos de resultados realizados.

### P1 — Formularios de ZeroBreakdown: accesibilidad y destino incierto

La navegación automatizada encontró campos sin nombre accesible en los tres formularios de nicho: Fontanería (4 controles), Electricidad (1) y Climatización (6). En el HTML, varios `<label>` no tienen `for` relacionado con el `id` del campo; el texto visual no basta para asociarlos al control. También hay consentimientos con copy genérico sobre “protección de datos” sin una política específica de esas marcas. Las páginas piden nombre/teléfono y, según la sección, detalles de vivienda o instalación, pero el handler de Fontanería falla y los demás se sirven como HTML de referencia con scripts removidos y no hay backend confirmado.

**Recomendación:** para demos, evitar la recolección de datos personales o usar datos de ejemplo sin persistencia y explicar qué ocurre al pulsar. Asociar todos los labels, revisar consentimiento y enlazar información legal apropiada antes de una publicación real.

### P2 — Enlaces de contacto sin destino en ZeroBreakdown

En las cuatro páginas ZeroBreakdown, la revisión de rutas detectó dos enlaces `href="#contacto"` sin un elemento `id="contacto"` resoluble en la página. Se incluyen en botones de cabecera/pie como “Contactar”, “Urgencias” o “Activar Guardia Técnica”.

**Recomendación:** enlazar al formulario real con id estable, a un `tel:`/WhatsApp verificado o quitar el CTA mientras no tenga destino. Verificar también en móvil después del cambio.

### P2 — ZeroDelay: glifos de icono aparecen como palabras

En la captura móvil se observan literalmente `person`, `north_east`, `expand_more` e `info`. El markup usa `material-symbols-outlined`, pero en la implementación activa `ZeroDelaySite.tsx` no se incluye la hoja de estilo de Material Symbols que convierte esos nombres en glifos. Esto hace que partes de cabecera, botones y avisos parezcan contenido duplicado.

**Recomendación:** cargar la fuente/estilos correspondientes o sustituir esos nombres por iconos locales accesibles. Añadir fallback visual y marcar los iconos decorativos como `aria-hidden="true"`.

### P2 — ZeroVanity: falta un encabezado principal

En la ruta `/proyectos/zerovanity`, el DOM no tiene ningún `<h1>`. La marca y el texto principal se presentan con elementos visuales, pero no como título semántico. Esto empeora la navegación con lector de pantalla y la estructura del contenido.

**Recomendación:** añadir un `<h1>` único con el nombre del salón o su propuesta y mantener el estilo visual actual.

### P2 — Preferencias de privacidad: enlace legal roto y diálogo sin gestión de foco

`apps/portfolio/src/components/CookieConsent.tsx` enlaza la “política de privacidad” a `/privacidad`, mientras el router ofrece `/politica-de-privacidad`. El wildcard devuelve a inicio, por lo que el enlace no lleva al documento prometido.

El panel se marca `role="dialog"` y `aria-modal="true"`, pero no hay gestión visible de foco inicial, confinamiento del tabulador ni retorno del foco al cerrar. Un diálogo modal que no implementa ese comportamiento puede atrapar o perder a usuarios de teclado/lector de pantalla.

**Recomendación:** corregir la ruta y usar un diálogo accesible ya probado o implementar el ciclo de foco y Escape. Confirmar que el botón “Rechazar” sigue siendo igual de fácil de localizar que aceptar.

### P2 — Metadatos de ZeroChaos heredan el título del portfolio

El wrapper de ZeroChaos en `apps/portfolio/src/app/router.tsx` no configura `Seo`, y la página propia no lo hace en la integración activa. En la inspección local la pestaña conservó el título general de ZeroCode en la ruta de ZeroChaos. Los metadatos sociales y el canonical pueden, por tanto, describir el portfolio en vez de la demo.

**Recomendación:** definir título, descripción, imagen Open Graph y canonical por ruta de demo; comprobar el HTML renderizado y no solo el estado React después de la navegación.

### P2 — Encabezados HTTP inconsistentes en despliegues separados

El `firebase.json` raíz define CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`. Las configuraciones `apps/zero-chaos/firebase.json` y `apps/zerodelay/firebase.json` solo muestran rewrites SPA y no replican dichos encabezados. `apps/zerodelay/netlify.toml` tampoco define encabezados. Hoy las demos están incluidas en el portfolio, pero un despliegue independiente puede quedar con una política más débil.

**Recomendación:** unificar los headers en cada destino que se vaya a publicar por separado o retirar/configurar esos destinos para que no se usen accidentalmente. Verificar encabezados HTTP de los hosts de producción después del despliegue.

### P2 — HTML de referencia montado con `dangerouslySetInnerHTML`

ZeroBreakdown importa cuatro páginas HTML como texto, elimina `<script>` y ciertos atributos inline y las inserta en el DOM con `dangerouslySetInnerHTML` (`ZeroBreakdownDemo.tsx`). El contenido actual está versionado localmente, así que no se observó una vía de XSS alimentada por visitantes. Aun así, la eliminación por regex no es un sanitizador: no cubre todas las formas de atributos de evento ni URLs `javascript:`. Es una frontera frágil si luego el HTML se edita desde un CMS o se genera con datos externos.

**Recomendación:** mantener las fuentes estrictamente confiables y en repositorio, migrar a componentes React cuando sea viable o usar sanitización basada en parser y allowlist si el contenido pasa a ser dinámico.

### P3 — Usos de `any` y aserciones que esconden contratos

Se localizaron cuatro usos significativos:

- `apps/portfolio/src/components/ui/Button.tsx`: `commonProps as any` al propagar atributos.
- `apps/zero-chaos/src/hooks/useTracking.ts`: firma `gtag?: (...args: any[]) => void`.
- `apps/zero-chaos/src/core/components/ContactForm.tsx`: `contactSchema as any` para satisfacer el resolver.
- `apps/zerovanity/src/components/booking/steps/DateStep.tsx`: `useState<any[]>([])` para los slots.

También hay una aserción no nula en el flujo de reserva de ZeroVanity. No son por sí mismos vulnerabilidades, pero silencian errores de contrato y reducen la ayuda del compilador.

**Recomendación:** tipar los atributos del botón a partir de los tipos React, definir una firma de evento para `gtag`, alinear el esquema y tipos del formulario Zod, y modelar slots con una interfaz concreta. Validar la invariancia antes de quitar `!`.

### P3 — Código y documentación obsoletos

- `apps/zerovanity/README.md` documenta `cd apps/zerovanity && npm run dev`, pero esa carpeta no tiene `package.json` independiente y la demo activa se ejecuta desde el workspace del portfolio. El README puede llevar a una instalación imposible.
- ZeroDelay conserva componentes antiguos bajo `src/components`/páginas, mientras `src/App.tsx` solo monta `ZeroDelaySite`. Confirmar por búsqueda de imports qué módulos son huérfanos antes de eliminarlos.
- Existe un segundo catálogo legado en `apps/portfolio/src/components/sections/Projects.tsx`; el home activo usa `HomeProjectGallery`. Confirmar si rutas o tests aún lo requieren antes de retirarlo.
- Hay contenido placeholder en ZeroVanity: `[Mapa Ubicación]`, footer “Zero Salon. The Art of Coding.” y algunos reclamos de salón no verificados.
- El copy de proceso del portfolio tiene un error visible: “necesidadesb.” en `HomeOfferSections.tsx`.

## Resultados de validación automática

| Comprobación | Resultado |
|---|---|
| Portfolio `type-check` | PASS |
| Portfolio `lint` | FAIL: parse error en `apps/portfolio/public/zero-breakdown/fontaneria.js:48` |
| Portfolio tests | PASS: 2 archivos, 3 tests |
| ZeroDelay `type-check` | PASS |
| ZeroDelay `lint` | PASS con aviso de `.eslintignore` obsoleto en ESLint 10 |
| ZeroDelay tests | Proceso exitoso, pero 2 archivos / 5 tests están omitidos; no hay cobertura ejecutada para esos casos |
| ZeroChaos `typecheck` | FAIL: imports generados de React Router no resuelven en `.react-router/types` |
| ZeroChaos `lint` | PASS |
| ZeroVanity aislado | No tiene `package.json`; se compila como parte del portfolio, sin test aislado detectado |
| `npm audit` (completo y `--omit=dev`) | PASS: 0 vulnerabilidades conocidas encontradas por el audit local |
| `git diff --check` | PASS; solo avisos de conversión LF/CRLF |
| Vista móvil 390 × 844, ocho rutas | Sin overflow horizontal ni imágenes rotas; sí hallazgos de semántica, anchors e iconos detallados arriba |

El resultado de `npm audit` solo cubre vulnerabilidades conocidas en el inventario local de dependencias. No demuestra que el sitio sea seguro en producción ni cubre secretos, configuración remota, servicios externos o lógica propia.

## Experiencia desde la perspectiva de un posible cliente

### Lo que funciona

- La propuesta principal se entiende en pocos segundos: diseño web para autónomos y pymes, precio de entrada de 400 € y formas directas de contacto.
- El alcance de la oferta básica se enumera, lo cual reduce confusión sobre lo que incluye el precio.
- La galería ofrece ejemplos para sectores diferentes. El portfolio distingue las demos en sus tarjetas.
- ZeroVanity informa que la reserva y el panel son simulados y pide no introducir datos personales.
- Las cuatro demos tienen personalidades visuales diferentes; no parecen la misma plantilla con otra paleta.
- Las imágenes observadas cargan bien en las rutas inspeccionadas y la composición no desborda en móvil.

### Eliminaría

- Métricas, certificados, rapidez, seguros y garantías no verificables de ZeroDelay y ZeroBreakdown, hasta recibir datos reales o etiquetarlos como ficticios.
- Mensajes de “enviado con éxito” que solo muestran una alerta o registran los datos localmente.
- Texto placeholder (`[Mapa Ubicación]`, footer “The Art of Coding.”) y nombres de icono visibles.
- Formularios que aparentan ser operativos sin explicar el destino de sus datos.
- Duplicación de proyecto/catálogos no usados, después de confirmar referencias y rutas.

### Modificaría

- Haría que todos los CTA de contacto terminen en una acción real y verificable: teléfono/WhatsApp correcto, formulario que envía de verdad, o aviso explícito de simulación.
- Pondría un aviso visible y consistente al inicio de cada demo: “Demo conceptual · negocio, cifras y contacto ficticios”. ZeroVanity ya ofrece una base útil para este patrón.
- Convertiría los testimonios, ubicaciones, logos, licencias y cifras ficticios en contenido de ejemplo claramente distinguible, en vez de presentarlos con tono de prueba social.
- Revisaría las demos desde móvil con el contenido real: ZeroDelay apila llamadas y métricas densas; ZeroBreakdown coloca CTAs de contacto muy largos y algunas secciones de formulario pueden ser intimidantes.
- Corregiría la política de privacidad del panel de cookies, el foco del diálogo, labels de formularios, el título de página de ZeroVanity y las metas SEO por demo.
- Simplificaría promesas comerciales: explicar proceso, servicios, zonas y qué ocurrirá al contactar, sin prometer respuesta en un plazo fijo si no está comprometida.

### Añadiría

- Un indicador persistente “Demo interactiva” en cada sitio y una nota breve de que la marca, el contacto y cualquier dato de resultados son ejemplos.
- Estados de envío honestos: preparando mensaje, abrir WhatsApp, enviado por el proveedor, error/reintentar; evitar un único estado que finja confirmación.
- Un CTA alternativo accesible si un formulario no está conectado (email o WhatsApp) y confirmación de qué información se comparte.
- Una ficha bajo cada miniatura explicando qué se puede explorar, qué es simulado y cuál es el objetivo de la demo.
- Prueba visual automatizada de rutas desktop/móvil y una revisión manual de teclado/lector de pantalla antes de publicar.
- Datos de contacto reales y específicos por demo cuando se conviertan en proyectos de clientes; ahora el uso repetido de `+34 912 622 712` y `admin@zerocode-devops.com` puede hacer pensar que las marcas son servicios de ZeroCode.

## Estado del árbol y límites

El checkout estaba en la rama `feature/massive-update-prep-` con numerosos archivos modificados y nuevos sin commit antes de comenzar esta auditoría. Incluye cambios recientes del usuario en ZeroBreakdown, ZeroDelay, portfolio, fotos y SEO. No se intentó atribuir todo el estado actual a un commit concreto. El informe también es un archivo nuevo no versionado.

La revisión no auditó el servicio externo de J.Barranco, ni el contenido de las cuentas de Google/Metricool, ni la infraestructura desplegada. No prueba que los cambios locales estén publicados, que formularios externos acepten mensajes, que dominios/WhatsApp pertenezcan a las demos, ni el cumplimiento legal de textos/consentimientos. Para eso se requiere validar titulares, políticas y endpoints reales.

## Orden de trabajo recomendado

1. Reparar el script de Fontanería y eliminar mensajes falsos de envío de ZeroChaos.
2. Decidir qué formularios son simulación y señalarlo; asociar labels y revisar el consentimiento de los tres nichos.
3. Confirmar o retirar métricas, licencias, seguros, tiempos y disponibilidad de ZeroDelay/ZeroBreakdown; corregir contactos/razones sociales de ejemplo.
4. Corregir anchors de ZeroBreakdown, los iconos de ZeroDelay, el H1 de ZeroVanity y el enlace legal del consentimiento.
5. Definir metadata de ZeroChaos y proteger cada destino de hosting independiente.
6. Reemplazar `any`, actualizar el README de ZeroVanity y decidir el destino del código huérfano.
7. Volver a ejecutar lint, typecheck y pruebas tras los cambios y revisar las ocho rutas en escritorio/móvil/teclado.

