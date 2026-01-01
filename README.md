# 🚀 Portfolio Moderno y Futurista

Portfolio de desarrollador profesional con diseño futurista, animaciones
fluidas, dark mode y despliegue automático en GitHub Pages.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## ✨ Características

- 🎨 **Diseño Futurista**: Gradientes oscuros con acentos brillantes
  (cyan/purple)
- 🌙 **Dark Mode**: Toggle con persistencia en localStorage
- 🎭 **Animaciones**: Framer Motion para transiciones fluidas
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- ♿ **Accesible**: ARIA labels, navegación por teclado
- 📧 **Formulario de Contacto**: Integración con EmailJS
- 🧪 **Tests**: Vitest + Testing Library
- 🚀 **CI/CD**: GitHub Actions + GitHub Pages

## 📂 Estructura del Proyecto

```
ZeroCode/
├── .env.example                 # Variables de entorno
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD para GitHub Pages
├── index.html
├── package.json
├── tailwind.config.ts           # Tema personalizado
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── providers.tsx        # React Query + Theme
│   │   └── router.tsx           # HashRouter para GH Pages
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── sections/
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── FeaturedProject.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Skills.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── SectionTitle.tsx
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── features/
│   │   └── home/
│   │       └── Home.tsx
│   ├── hooks/
│   │   └── useScrollAnimation.ts
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── index.css
└── tests/
    ├── accessibility.test.tsx
    ├── home.test.tsx
    ├── sections.test.tsx
    └── setup.ts
```

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/portfolio.git
cd portfolio

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de EmailJS
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Build
npm run build        # Crear build de producción
npm run preview      # Previsualizar build

# Tests
npm run test         # Ejecutar tests en modo watch
npm run test -- --run # Ejecutar tests una vez

# Linting
npm run lint         # Verificar código
npm run format       # Formatear código
```

## ⚙️ Configuración de EmailJS

1. Crear cuenta en [EmailJS](https://www.emailjs.com/)
2. Crear un servicio de email
3. Crear un template con las variables: `from_name`, `from_email`, `subject`,
   `message`
4. Copiar los IDs y añadir al archivo `.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

## 🚀 Despliegue en GitHub Pages

### Configuración Automática (Recomendado)

1. **Habilitar GitHub Pages** en tu repositorio:
   - Ve a `Settings > Pages`
   - En "Build and deployment", selecciona `GitHub Actions`

2. **Push a main**:
   ```bash
   git add .
   git commit -m "Deploy portfolio"
   git push origin main
   ```

3. El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente:
   - Instala dependencias
   - Ejecuta tests
   - Crea build de producción
   - Despliega a GitHub Pages

4. Tu portfolio estará disponible en:
   ```
   https://tu-usuario.github.io/nombre-repo/
   ```

### Configuración Manual (Alternativa)

Si prefieres un despliegue manual:

```bash
# Build
npm run build

# El contenido de /dist está listo para subir a cualquier hosting
```

## 🧪 Tests

El proyecto incluye 3 tipos de tests:

1. **Render Tests** (`sections.test.tsx`): Verifican que todas las secciones se
   renderizan correctamente
2. **Accessibility Tests** (`accessibility.test.tsx`): Verifican aria-labels,
   labels de formularios
3. **Dark Mode Tests** (`home.test.tsx`): Verifican toggle y persistencia del
   tema

```bash
# Ejecutar todos los tests
npm run test -- --run

# Ver cobertura
npm run test -- --coverage
```

## 🎨 Personalización

### Colores

Edita `tailwind.config.ts`:

```ts
colors: {
  primary: { /* tus colores */ },
  accent: { /* tus colores */ },
}
```

### Contenido

- **Hero**: `src/components/sections/Hero.tsx`
- **About**: `src/components/sections/About.tsx`
- **Skills**: `src/components/sections/Skills.tsx`
- **Projects**: `src/components/sections/Projects.tsx`
- **Featured**: `src/components/sections/FeaturedProject.tsx`
- **Contact**: `src/components/sections/Contact.tsx`

### Social Links

Edita los arrays `socialLinks` en:

- `Navbar.tsx`
- `Footer.tsx`
- `Hero.tsx`

## 📝 Licencia

MIT © 2024

---

Hecho con ❤️ y mucho código ☕
