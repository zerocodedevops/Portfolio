# 📊 Dashboard Analítico (Project 2)

Un dashboard profesional diseñado con enfoque en visualización de datos,
rendimiento y arquitectura limpia.

## ⚙️ Stack & Herramientas

- **Visualización**: `recharts` (Gráficas responsivas y customizables).
- **Data Fetching**: `@tanstack/react-query` v5 (Caché, Auto-refetch, Loading
  states).
- **Mocking**: `msw` (Mock Service Worker) interceptando peticiones a nivel de
  red (browser & node).
- **Utilities**: `date-fns` para manipulación de fechas.

## 🚀 Funcionalidades

### 1. Visualizaciones Clave

- **KPI Cards**: Métricas principales con indicadores de tendencia (↑/↓).
- **Sales Trend**: Gráfico de líneas doble (Ventas vs Ingresos).
- **Revenue Distribution**: Gráfico de tarta interactivo.
- **Conversion Funnel**: Gráfico de barras horizontal/vertical.

### 2. Interactividad

- **Filtros Globales**: Control de Rango de Fechas (7d/30d/90d) y Segmento
  (Mobile/Desktop).
- **Loading Skeletons**: Feedback visual durante la carga de datos.
- **Error Handling**: Gestión robusta de fallos de API.

## 🛠️ Endpoints Mock simulados (MSW)

| Endpoint                   | Método | Descripción                              | Params             |
| -------------------------- | ------ | ---------------------------------------- | ------------------ |
| `/api/analytics/dashboard` | GET    | Retorna todas las métricas del dashboard | `range`, `segment` |

### Ejemplo de Respuesta Mock

```json
{
  "kpi": { "totalSales": { "value": "$12k", "trend": "up" } },
  "salesTrend": [{ "date": "2024-01-01", "sales": 1200 }],
  "revenueByDevice": [{ "device": "Mobile", "value": 45 }]
}
```

## 🧪 Testing (Strict Mode)

- **Unit**: Renderizado de componentes aislados (`vitest` + `testing-library`).
- **Integration**: `dashboard.test.tsx` verifica que:
  - Los datos se cargan y muestran correctamente.
  - Los filtros disparan nuevas peticiones.
  - El manejo de errores funciona (simulando 500 con MSW).

## 📦 Cómo ejecutar

El worker de MSW se inicia automáticamente en modo desarrollo (`npm run dev`).
No requiere backend real.

Para producción, simplemente reemplaza la URL en `useDashboardMetrics.ts`.
