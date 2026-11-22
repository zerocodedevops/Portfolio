# 🏢 NeighNetZ — Plataforma de Gestión de Comunidades de Propietarios

**NeighNetZ** es una aplicación web interactiva diseñada para la administración integral, moderna y transparente de fincas y comunidades de vecinos. Facilita la comunicación bidireccional entre la **administración / junta de gobierno** y los **residentes**, centralizando la gestión de incidencias, reservas de áreas comunes, votaciones telemáticas, contabilidad y repositorio documental en una única plataforma digital en tiempo real.

---

## 📑 Tabla de Contenidos

1. [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Modelo de Datos y Colecciones en Firestore](#-modelo-de-datos-y-colecciones-en-firestore)
4. [Control de Acceso, Autenticación y Flujo de Registro](#-control-de-acceso-autenticación-y-flujo-de-registro)
5. [Módulos y Funcionamiento Detallado por Usuario](#-módulos-y-funcionamiento-detallado-por-usuario)
   - [Panel del Vecino / Residente (`/dashboard`)](#1-panel-del-vecino--residente-dashboard)
   - [Panel de Administración (`/admin`)](#2-panel-de-administración-admin)
6. [Scripts de Migración, Sanitización y Mantenimiento](#-scripts-de-migración-sanitización-y-mantenimiento)
7. [Instalación, Configuración y Puesta en Marcha](#-instalación-configuración-y-puesta-en-marcha)
8. [Plantilla y Configuración de Vite/React (Histórico)](#-plantilla-y-configuración-de-vitereact-histórico)

---

## 🧱 Arquitectura y Stack Tecnológico

NeighNetZ se estructura como una Single Page Application (SPA) modular y reactiva sobre el ecosistema de **Google Firebase**:

- **Frontend Core**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) con división de código mediante `React.lazy` y `Suspense` para una carga ultrarrápida.
- **Enrutamiento**: [React Router DOM v6](https://reactrouter.com/) con control de guardas mediante `ProtectedRoute` y enrutador condicional (`Redirector`).
- **Diseño y Estilos**: [TailwindCSS v3](https://tailwindcss.com/) + PostCSS + Iconografía de [@heroicons/react](https://github.com/tailwindlabs/heroicons).
- **Animaciones e Interactividad**: [Framer Motion](https://www.framer.com/motion/) para transiciones fluidas de paneles y microanimaciones de entrada.
- **Gráficos y Analítica**: [Recharts](https://recharts.org/) para métricas de incidencias, presupuestos y actividad comunitaria.
- **Backend Serverless (Firebase)**:
  - **Firebase Authentication**: Autenticación segura mediante Email/Contraseña y proveedor Google OAuth.
  - **Cloud Firestore**: Base de datos documental NoSQL con sincronización en tiempo real (`onSnapshot`) y operaciones atómicas por lotes (`batch`).
  - **Firebase Storage**: Almacenamiento en la nube para fotos de perfil, imágenes adjuntas de incidencias y archivos documentales (PDFs, actas).
- **Herramientas de servidor y scripts**: TypeScript CommonJS (`.cts`) con `firebase-admin`, ejecutados con `tsx`.

---

## 📂 Estructura del Proyecto

```text
NeighNetZ/
├── .firebase/                 # Configuración y caché de despliegue Firebase
├── dataconnect/               # Esquemas y conectores de Firebase Data Connect
├── app-comunidad/             # Código fuente de la aplicación web
│   ├── public/                # Activos estáticos públicos
│   ├── src/
│   │   ├── assets/            # Logotipos e imágenes estáticas (NeighNet.png)
│   │   ├── components/        # Componentes UI reutilizables
│   │   │   ├── charts/        # Gráficos analíticos (DashboardCharts.tsx)
│   │   │   ├── common/        # ConfirmDialog, ProtectedRoute, Redirector, SkeletonLoader
│   │   │   ├── features/      # FichaVecino.tsx y vistas de detalle
│   │   │   ├── layouts/       # Estructura de cabeceras, menús y envoltorios de página
│   │   │   ├── CampanaNotificaciones.tsx
│   │   │   ├── FormularioIncidencia.tsx
│   │   │   ├── GestionDocumentos.tsx
│   │   │   ├── GestionDocumentosAdmin.tsx
│   │   │   └── GestionZonas.tsx
│   │   ├── context/           # Proveedores de estado global (AuthContext, etc.)
│   │   ├── firebase/          # Inicialización y exportación de SDKs de Firebase (config.ts)
│   │   ├── pages/             # Vistas de la aplicación
│   │   │   ├── auth/          # Login.tsx, RegistroDatos.tsx
│   │   │   ├── admin/         # AdminPanel.tsx, GestionIncidencias.tsx, GestionReservasAdmin.tsx, ValidarVecinos.tsx
│   │   │   ├── Documentos.tsx # Repositorio de actas y carpetas comunitarias
│   │   │   ├── Gastos.tsx     # Gestión y visualización de partidas y presupuestos
│   │   │   ├── Incidencias.tsx# Reporte y seguimiento de desperfectos
│   │   │   ├── StitchPage.tsx # Pantallas de la referencia visual integradas
│   │   │   ├── Notificaciones.jsx
│   │   │   ├── Perfil.tsx     # Datos personales, vivienda y cambio de contraseña
│   │   │   ├── Reservas.tsx   # Reserva de zonas comunes (piscina, pádel, salas)
│   │   │   ├── Vecinos.tsx    # Directorio de propietarios y residentes
│   │   │   └── Votaciones.tsx # Sistema de votaciones y actas de acuerdos
│   │   ├── App.tsx            # Definición principal de rutas y división por roles
│   │   └── main.tsx           # Punto de entrada de React en el DOM
│   ├── anonimizar-datos.cts   # Script de anonimización de apellidos y teléfonos ficticios
│   ├── anonimizar-emails.cts  # Reemplazo de correos por formato estructurado @neighnetz.com
│   ├── cambiar-dominio-emails.cts # Normalizador masivo de dominios de correo
│   ├── corregir-acentos.cts   # Saneamiento de caracteres corruptos Unicode (\uFFFD)
│   ├── escanear-caracteres.cts# Verificador de integridad de codificación de Firestore
│   ├── migrar-archivos.cts    # Utilidad para vincular archivos a carpetas en Storage/Firestore
│   ├── migrar-carpetas.cts    # Inicializador de categorías documentales
│   ├── migrar-datos.cts       # Parseador de idVivienda a portal, piso y letra
│   └── serviceAccountKey.json # Clave de servicio privada de Firebase Admin (no publicar)
```

---

## 🗄️ Modelo de Datos y Colecciones en Firestore

| Colección | Descripción | Campos Clave |
|---|---|---|
| `vecinos` | Registro de residentes, propietarios y administradores | `uid`, `email`, `rol` (`administrador`, `propietario`, `inquilino`), `estado` (`Activo`, `pendiente_de_confirmacion`, `pendienteValidacion`), `portal`, `piso`, `letra`, `idVivienda`, `datosPersonales` (`nombre`, `apellidos`, `dni`, `telefono`, `email`). |
| `incidencias` | Desperfectos y tareas de mantenimiento | `idComunidad`, `titulo`, `descripcion`, `ubicacion`, `prioridad` (`baja`, `media`, `alta`), `estado` (`recibida`, `enProceso`, `resuelta`, `cancelada`), `creador` (UID), `fechaCreacion`, `fotos` (URLs), `observaciones` (historial de notas). |
| `zonasComunes` | Áreas reservables de la finca | `nombre`, `descripcion`, `capacidadMaxima`, `costePorHora`, `fotoUrl`, `reglasUso`. |
| `reservas` | Bloqueos de horarios en zonas comunes | `idComunidad`, `idZonaComun`, `idUsuario`, `fechaInicio`, `fechaFin`, `estado` (`pre-reservada`, `confirmada`, `cancelada`, `completada`), `fechaCreacion`. |
| `carpetas` | Organización del repositorio documental | `nombre`, `descripcion`, `idComunidad`, `fechaCreacion`. |
| `documentos` | Archivos oficiales, facturas y actas | `nombre`, `url`, `tamano`, `tipo`, `idCarpeta`, `idComunidad`, `fechaSubida`, `subidoPor`. |
| `votaciones` | Consultas y acuerdos de juntas | `titulo`, `descripcion`, `idComunidad`, `estado` (`activa`, `finalizada`, `cancelada`), `opciones` (array de opciones), `votos` (mapa de opciones y conteo acumulado), `notificarA`. |
| `gastos` | Contabilidad y partidas presupuestarias | `idComunidad`, `concepto`, `importe`, `categoria`, `fecha`, `proveedor`, `facturaUrl`. |
| `comunidades` | Información general de la finca o portal | `nombre`, `direccion`, `cif`, `idAdministrador`. |
| `eventosCalendario`, `foros`, `favores` | Módulos colaborativos adicionales entre vecinos | Tablón vecinal, avisos puntuales e intercambio de ayuda comunitaria. |

---

## 🔐 Control de Acceso, Autenticación y Flujo de Registro

### 1. Inicio de Sesión (`/login`)
- Permite acceso mediante correo y contraseña o con cuenta de Google.
- Cuenta con recuperación de clave mediante `sendPasswordResetEmail`.
- Al autenticarse, consulta el documento en `vecinos/{uid}`:
  - Si el rol es `administrador`, redirige a `/admin`.
  - Si el documento no existe o carece de datos de vivienda, redirige a `/registro-datos`.
  - En cualquier otro caso confirmado, redirige a `/dashboard`.

### 2. Formulario de Primer Registro (`/registro-datos`)
- Si un usuario se registra por primera vez mediante Google u otro medio, completa su ficha inicial: Nombre, Apellidos, DNI, Teléfono, Portal, Piso y Letra.
- Su estado queda marcado como `pendiente_de_confirmacion` hasta ser validado por la administración.

### 3. Redirección Inteligente (`/`)
- El componente `Redirector` analiza la sesión activa:
  - Sin sesión activa: Redirige a `/login`.
  - Administrador autenticado: Redirige a `/admin`.
  - Vecino autenticado: Redirige a `/dashboard`.

---

## 🖥️ Módulos y Funcionamiento Detallado por Usuario

### 1. Panel del Vecino / Residente (`/dashboard`)

- **Inicio (`/dashboard`)**:
  - Saludo personalizado con el nombre del residente.
  - Tarjetas de estadísticas de la comunidad (incidencias activas, próximas reservas, documentos nuevos).
  - Gráfico interactivo de estado de incidencias (Recharts) y accesos directos rápidos.
- **Incidencias (`/dashboard/incidencias`)**:
  - Vista en cuadrícula o lista de todos los partes de la comunidad.
  - Filtro por estado: *Todas*, *Pendientes*, *En proceso*, *Resueltas*.
  - Modal para dar de alta una nueva incidencia indicando título, descripción detallada, ubicación física en la finca y nivel de prioridad.
  - Sincronización instantánea de comentarios y cambios de estado ejecutados por el conserje/administrador.
- **Reservas (`/dashboard/reservas`)**:
  - Catálogo de zonas comunes con fotografía, descripción, aforo máximo y coste por hora.
  - Calendario para seleccionar tramos horarios disponibles.
  - Sección "Mis Reservas" para consultar el estado (`confirmada`, `pre-reservada`) y cancelar reservas previas.
- **Documentos (`/dashboard/documentos`)**:
  - Explorador categorizado por carpetas (Actas de Juntas, Estatutos, Contratos de Mantenimiento, Presupuestos).
  - Visualización y descarga directa de archivos protegidos en Firebase Storage con skeleton loaders durante la carga.
- **Votaciones (`/dashboard/votaciones`)**:
  - Listado de encuestas y votaciones activas de la comunidad.
  - Emisión de voto individual con protección para evitar doble voto por vivienda/UID.
  - Visualización del histórico de votaciones cerradas con cómputo de porcentajes y decisiones aprobadas.
- **Vecinos (`/dashboard/vecinos`)**:
  - Directorio organizado y ordenado numéricamente por Portal, Piso y Letra.
  - Visualización de datos de contacto de vecinos que han autorizado su visibilidad para emergencias o avisos.
  - Acceso a la ficha individual del vecino (`/dashboard/vecinos/:vecinoId`).
- **Gastos (`/dashboard/gastos`)**:
  - Listado transparente de movimientos contables y facturas de proveedores de la comunidad ordenados cronológicamente.
- **Perfil (`/dashboard/perfil`)**:
  - Actualización de teléfono y datos personales.
  - Subida y recorte/redimensionado de foto de perfil con compresión previa en el cliente.
  - Actualización directa de la contraseña de acceso.

---

### 2. Panel de Administración (`/admin`)

Acceso restringido exclusivamente a usuarios con rol `administrador`.

- **Panel de Control Principal (`/admin`)**:
  - Dashboard ejecutivo con indicadores en tiempo real:
    - Usuarios pendientes de validación.
    - Incidencias abiertas y urgentes.
    - Reservas del día actual en las diferentes instalaciones.
- **Validar Vecinos (`/admin/usuarios`)**:
  - Cola de aprobación de solicitudes de registro. Permite verificar que el residente pertenece a la vivienda solicitada antes de habilitar su cuenta (cambio de estado a `confirmado`).
- **Gestión de Incidencias (`/admin/incidencias`)**:
  - Control de estados del ciclo de vida de la avería (`recibida` → `enProceso` → `resuelta` / `cancelada`).
  - Asignación de notas técnicas, observaciones y presupuestos de reparación.
- **Gestión de Reservas (`/admin/reservas`)**:
  - Vista de todas las reservas de la comunidad con cruce de datos de vecino solicitante y zona reservada.
  - Capacidad de anular, confirmar o bloquear franjas horarias para mantenimiento.
- **Gestión Documental (`/admin/documentos`)**:
  - Capacidad para crear nuevas carpetas y subir documentos PDF oficiales al Storage de la comunidad.

---

## 🛠️ Scripts de Migración, Sanitización y Mantenimiento

En el directorio `app-comunidad/` se incluyen utilidades CLI escritas en TypeScript CommonJS (`.cts`) y ejecutadas mediante `tsx`:

1. `corregir-acentos.cts`:
   - Escanea todas las colecciones de Firestore y repara caracteres corruptos de importaciones externas (por ejemplo el carácter de reemplazo Unicode `\uFFFD`). Normaliza nombres propios (ej. `Mara` → `Maria`, `ngeles` → `Angeles`) y sanea correos eliminando tildes y caracteres especiales.
2. `escanear-caracteres.cts`:
   - Herramienta de solo lectura para auditar la base de datos y verificar que no existen codificaciones erróneas ni caracteres extraños en ningún campo de texto.
3. `anonimizar-datos.cts`:
   - Anonimiza los apellidos de los vecinos sustituyéndolos por `"Vecino"` y genera números de teléfono ficticios que comienzan por `1` con fines de demostración pública y privacidad.
4. `cambiar-dominio-emails.cts` y `anonimizar-emails.cts`:
   - Normaliza los correos electrónicos ficticios de los vecinos al dominio estándar `@neighnetz.com` preservando las cuentas de servicio (`admin@`, `conserje@`, `test@`) y la cuenta del desarrollador.
5. `migrar-datos.cts`, `migrar-carpetas.cts` y `migrar-archivos.cts`:
   - Scripts de soporte para descomponer `idVivienda` en campos estructurados (`portal`, `piso`, `letra`) y configurar las carpetas iniciales del gestor documental.

---

## 🚀 Instalación, Configuración y Puesta en Marcha

### Prerrequisitos
- Node.js (v18 o superior).
- Un proyecto en Firebase con Firestore, Authentication y Storage habilitados.

### 1. Variables de Entorno
Crear el archivo `app-comunidad/.env` tomando como base `.env.example`:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 2. Instalación de dependencias
```bash
cd app-comunidad
npm install
```

### 3. Ejecución en desarrollo
```bash
npm run dev
```
La aplicación quedará disponible en el puerto local asignado por Vite (habitualmente `http://localhost:5173`).

### 4. Compilación para producción
```bash
npm run build
```

---

## 📝 Plantilla y Configuración de Vite/React (Histórico)

*(Sección preservada íntegramente del README original del proyecto)*

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
