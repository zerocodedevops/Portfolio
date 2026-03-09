# 🏗️ Architecture: ZeroCode Portfolio Monorepo

## Overview

Este repositorio ha sido configurado como un monorepo administrado a través de **npm workspaces**. La estructura consolida múltiples proyectos frontend aislados y un portfolio central, compartiendo configuración de calidad y dependencias allí donde tenga sentido.

## Directorios y Propósitos

### `/apps`

Contiene todas las aplicaciones independientes. Cada aplicación debe definir su propio `package.json` y dependencias específicas a menos de que compartan bibliotecas de infraestructura core.
Aplicaciones alojadas aquí:

- `portfolio`: Vista web principal (Punto de entrada: `/`).
- `devops-shop`: E-commerce implementado con Redux y Stripe.
- `crypto`: Rastreador cripto en tiempo real.
- `analytics`: Dashboard basado en Recharts.
- Y más. (zero-chaos, zerodelay, zerovanity).

### `/database`

Infraestructura base de datos.

- `migrations/`: Scripts SQL organizados (ej. esquemas iniciales y reglas de seguridad para Supabase, PostgreSQL, etc).
- `seeds/`: Scripts de inyección de datos para entornos locales de desarrollo.

### `/docs`

Documentación global del repositorio.

- `ARCHITECTURE.md`: Este archivo, contiene descripciones del propósito de cada capeta y el marco estructural.
- `SETUP.md`: Guía de herramientas, formateadores y linters.

### `/services` y `/specs`

Servicios que englobarán la interacción back-end unificada para varias aplicaciones si el sistema crece, incluyendo DataConnect y especificaciones OpenAPI.

## Continuous Integration

El código se regula con **ESLint** (reglas unificadas base y adaptadas vía frameworks donde sea necesario) y formato impuesto por **Prettier**. Biome se consideró pero fue descartado en favor de estandarizar una única cadena clásica antes de migrar todo progresivamente.
