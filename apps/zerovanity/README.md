# 💇‍♀️ ZeroVanity (Salón de Belleza)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Day.js](https://img.shields.io/badge/Day.js-FF5C4D?style=for-the-badge&logo=day.js&logoColor=white)

Ecosistema digital completo para la reserva de citas y administración de Salones de Belleza. Previamente implementado en Next.js, ahora completamente migrado a una SPA ultraligera impulsada por Vite.

## 📅 Componentes Core

- **Calendario Complejo:** Sistema de planificación interna para empleados renderizado con `react-big-calendar`.
- **Integración Base de Datos Sólida:** Acoplada directamente al SDK de `@supabase/supabase-js`.
- **Gestión Temporal Moderna:** Reemplazo de sintaxis anticuadas en favor de `date-fns` y `dayjs` posibilitando husos horarios perfectos.
- **Formularios Mágicos:** Checkout y gestión de perfiles impulsados por `react-hook-form` / `zod`.

## 🚀 Despliegue Local

```bash
cd apps/zerovanity
npm run dev
```
