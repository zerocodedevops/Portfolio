# 🛒 DevOps Shop

<div align="center">

![DevOps Shop Banner](https://img.shields.io/badge/DevOps-Shop-0ea5e9?style=for-the-badge&logo=shopify&logoColor=white)

**E-commerce moderno y completo con React, Redux Toolkit, Stripe y
funcionalidades AI**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🚀 Demo en Vivo](https://zerocode-devops.web.app/#/proyectos/ecommerce) •
[📖 Documentación](#-características) •
[🐛 Reportar Bug](https://github.com/zerocodedevops/DevOps.Shop/issues)

</div>

---

## 📸 Preview

<div align="center">

**✨ Catálogo de Productos**

El proyecto incluye:

- 🛍️ Catálogo completo con productos
- 🔍 Búsqueda en tiempo real
- 🎤 Voice Search (español)
- 🌙 Dark Mode
- 🛒 Carrito persistente
- 💳 Checkout con Stripe

> **Nota**: Para ver el proyecto en acción, ejecuta `npm run dev` y abre
> `http://localhost:3000`

</div>

---

## ✨ Características

### 🛍️ **E-commerce Core**

- ✅ **Catálogo de productos** con filtros por categoría y búsqueda en tiempo
  real
- ✅ **Carrito de compras** persistente (LocalStorage)
- ✅ **Checkout** con integración de Stripe (Test Mode)
- ✅ **Página de detalle** de producto con reseñas y breadcrumbs
- ✅ **API REST** con RTK Query (FakeStore API)

### 🔐 **Autenticación**

- ✅ **Login/Registro simulado** con validación de formularios
- ✅ **Persistencia de sesión** (LocalStorage)
- ✅ **Gestión de usuario** en navbar con dropdown

### 🎨 **UX/UI Premium**

- ✅ **Dark Mode** completo con toggle y persistencia
- ✅ **Voice Search** 🎤 (Web Speech API en español)
- ✅ **Toast Notifications** animadas con Framer Motion
- ✅ **Breadcrumbs** para navegación contextual
- ✅ **ScrollToTop** automático al cambiar de ruta
- ✅ **Lazy Loading** de imágenes para mejor rendimiento
- ✅ **Responsive Design** 100% mobile-first
- ✅ **Skeleton Loading** durante carga de datos

### 🧪 **Calidad & Testing**

- ✅ **Tests unitarios** (Redux slices)
- ✅ **Tests de integración** (Vitest + Testing Library)
- ✅ **TypeScript strict mode**
- ✅ **ESLint + Prettier** configurados
- ✅ **Cobertura de tests** > 80%

---

## 🚀 Demo en Vivo

**URL**:
[https://zerocode-devops.web.app/#/proyectos/ecommerce](https://zerocode-devops.web.app/#/proyectos/ecommerce)

### Credenciales de Prueba

- **Usuario**: `demo@devopsshop.com`
- **Contraseña**: `demo123`

### Tarjeta de Prueba Stripe

- **Número**: `4242 4242 4242 4242`
- **Fecha**: Cualquier fecha futura
- **CVC**: Cualquier 3 dígitos

---

## 📦 Instalación Rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/zerocodedevops/DevOps.Shop.git
cd DevOps.Shop

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y añadir tu VITE_STRIPE_PUBLIC_KEY

# 4. Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

---

## 🛠️ Stack Tecnológico

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 18
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
      <br>Vite
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=redux" width="48" height="48" alt="Redux" />
      <br>Redux Toolkit
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind CSS
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vitest" width="48" height="48" alt="Vitest" />
      <br>Vitest
    </td>
    <td align="center" width="96">
      <img src="https://framerusercontent.com/images/48ha9ZR9FZQGLSiGGxGfElP3T0A.png" width="48" height="48" alt="Framer Motion" />
      <br>Framer Motion
    </td>
    <td align="center" width="96">
      <img src="https://avatars.githubusercontent.com/u/856813?s=200&v=4" width="48" height="48" alt="Stripe" />
      <br>Stripe
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=git" width="48" height="48" alt="Git" />
      <br>Git
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=github" width="48" height="48" alt="GitHub" />
      <br>GitHub
    </td>
  </tr>
</table>

### Dependencias Principales

```json
{
  "react": "^18.2.0",
  "@reduxjs/toolkit": "^2.11.2",
  "@stripe/react-stripe-js": "^5.4.1",
  "framer-motion": "^12.23.26",
  "react-router-dom": "^7.11.0",
  "lucide-react": "^0.562.0"
}
```

---

## 📁 Estructura del Proyecto

```
DevOps.Shop/
├── 📂 src/
│   ├── 📂 components/          # Componentes reutilizables
│   │   ├── AuthModal.tsx       # Modal de login/registro
│   │   ├── CartSidebar.tsx     # Sidebar del carrito
│   │   ├── ProductCard.tsx     # Tarjeta de producto
│   │   └── Toast.tsx           # Notificaciones toast
│   ├── 📂 pages/               # Páginas principales
│   │   ├── CatalogPage.tsx     # Catálogo con filtros
│   │   ├── ProductDetailPage.tsx # Detalle de producto
│   │   └── CheckoutPage.tsx    # Checkout con Stripe
│   ├── 📂 store/               # Redux store
│   │   ├── store.ts            # Configuración del store
│   │   ├── cartSlice.ts        # Slice del carrito
│   │   ├── authSlice.ts        # Slice de autenticación
│   │   └── 📂 __tests__/       # Tests unitarios
│   ├── 📂 services/            # API services (RTK Query)
│   │   └── productsApi.ts      # API de productos
│   ├── 📂 layout/              # Layout components
│   │   └── EcommerceLayout.tsx # Layout principal
│   ├── 📂 data/                # Datos mock
│   │   └── mockProducts.ts     # Productos de ejemplo
│   ├── 📂 __tests__/           # Tests de integración
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Entry point
│   ├── routes.tsx              # Configuración de rutas
│   └── index.css               # Estilos globales
├── 📂 public/                  # Assets estáticos
├── 📄 index.html               # HTML base
├── 📄 vite.config.ts           # Configuración Vite
├── 📄 tailwind.config.js       # Configuración Tailwind
├── 📄 tsconfig.json            # Configuración TypeScript
├── 📄 package.json             # Dependencias
├── 📄 .env.example             # Variables de entorno ejemplo
├── 📄 .gitignore               # Git ignore
└── 📄 README.md                # Este archivo
```

---

## 🎨 Características Destacadas

### 🎤 Voice Search (AI)

Búsqueda por voz usando Web Speech API con reconocimiento en español:

```typescript
const handleVoiceSearch = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setSearchTerm(transcript);
  };

  recognition.start();
};
```

**Uso**: Click en el icono del micrófono 🎤 y di el nombre del producto que
buscas.

---

### 🌙 Dark Mode

Toggle completo con persistencia en LocalStorage:

```typescript
const toggleTheme = () => {
  const newDark = !isDark;
  setIsDark(newDark);
  localStorage.setItem("theme", newDark ? "dark" : "light");
  document.documentElement.classList.toggle("dark", newDark);
};
```

**Uso**: Click en el icono de sol/luna en el navbar.

---

### 🔔 Toast Notifications

Notificaciones elegantes con Framer Motion:

```tsx
<Toast
  message="¡Producto añadido al carrito!"
  type="success"
  isVisible={showToast}
  onClose={() => setShowToast(false)}
/>
```

**Tipos**: `success`, `error`, `info`

---

### 🛒 Carrito Persistente

El carrito se guarda automáticamente en LocalStorage:

```typescript
// En cartSlice.ts
const saveToLocalStorage = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state.items));
};

// Se ejecuta en cada acción del carrito
addToCart: (state, action) => {
  // ... lógica
  saveToLocalStorage(state);
};
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests con UI interactiva
npm run test:ui

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Estructura de Tests

```
src/
├── store/__tests__/
│   └── slices.test.ts      # Tests de Redux slices
└── __tests__/
    └── integration.test.tsx # Tests de integración
```

### Ejemplo de Test

```typescript
describe("Cart Slice", () => {
  it("should add item to cart", () => {
    const initialState = { items: [], total: 0 };
    const product = { id: 1, title: "Test", price: 100 };

    const newState = cartReducer(initialState, addToCart(product));

    expect(newState.items).toHaveLength(1);
    expect(newState.total).toBe(100);
  });
});
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Stripe Public Key (Test Mode)
VITE_STRIPE_PUBLIC_KEY=pk_test_51...

# Opcional: API URL personalizada
VITE_API_URL=https://fakestoreapi.com
```

### Obtener Stripe Key

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Ve a Developers → API Keys
3. Copia la **Publishable key** (Test mode)
4. Pégala en `.env`

---

## 📝 Scripts Disponibles

| Script            | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia servidor de desarrollo (Vite) |
| `npm run build`   | Build de producción                  |
| `npm run preview` | Preview del build de producción      |
| `npm test`        | Ejecuta tests con Vitest             |
| `npm run test:ui` | Tests con interfaz visual            |
| `npm run lint`    | Ejecuta ESLint                       |

---

## 🚢 Deployment

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
npm run build
vercel --prod
```

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

### Opción 3: Firebase Hosting

```bash
# Instalar Firebase CLI
npm i -g firebase-tools

# Login y configurar
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

---

## 🎯 Roadmap

### ✅ Completado

- [x] Catálogo de productos con filtros
- [x] Carrito de compras persistente
- [x] Checkout con Stripe
- [x] Autenticación simulada
- [x] Dark Mode
- [x] Voice Search
- [x] Tests unitarios e integración
- [x] Responsive design

### 🚧 En Progreso

- [ ] Backend real con Node.js + Express
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación real (JWT)
- [ ] Panel de administración
- [ ] Gestión de inventario

### 📋 Planeado

- [ ] Wishlist (lista de deseos)
- [ ] Comparador de productos
- [ ] Reseñas de usuarios
- [ ] Sistema de cupones
- [ ] Múltiples métodos de pago
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guía de Contribución

- Usa **TypeScript** para todo el código
- Sigue las convenciones de **ESLint** y **Prettier**
- Escribe **tests** para nuevas funcionalidades
- Actualiza la **documentación** si es necesario
- Usa **commits semánticos** (feat, fix, docs, etc.)

---

## 🐛 Reportar Bugs

Si encuentras un bug, por favor:

1. Verifica que no esté ya reportado en
   [Issues](https://github.com/zerocodedevops/DevOps.Shop/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del entorno (OS, navegador, etc.)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver [LICENSE](LICENSE) para más
detalles.

```
MIT License

Copyright (c) 2026 ZeroCode DevOps

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Autor

<div align="center">

**David G. (ZeroCode)**

[![GitHub](https://img.shields.io/badge/GitHub-zerocodedevops-181717?style=for-the-badge&logo=github)](https://github.com/zerocodedevops)
[![Portfolio](https://img.shields.io/badge/Portfolio-zerocode--devops.web.app-0ea5e9?style=for-the-badge&logo=google-chrome&logoColor=white)](https://zerocode-devops.web.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/zerocodedevops)

</div>

---

## 🙏 Agradecimientos

- **Imágenes de productos**: Generadas con IA (DALL-E)
- **Iconos**: [Lucide React](https://lucide.dev)
- **API de productos**: [FakeStore API](https://fakestoreapi.com)
- **Inspiración de diseño**: Shopify, Stripe, Vercel
- **Comunidad**: React, Redux, Vite

---

## 📊 Estadísticas del Proyecto

![GitHub stars](https://img.shields.io/github/stars/zerocodedevops/DevOps.Shop?style=social)
![GitHub forks](https://img.shields.io/github/forks/zerocodedevops/DevOps.Shop?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/zerocodedevops/DevOps.Shop?style=social)

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**

**Made with ❤️ by [ZeroCode DevOps](https://github.com/zerocodedevops)**

</div>
