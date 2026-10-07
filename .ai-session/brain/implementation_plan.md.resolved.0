# Mi Casa Domótica — Plan de Implementación

## Descripción

Construcción desde cero de una app domótica personal con React + Vite. Diseño oscuro, mobile-first, con navegación inferior y soporte para múltiples plataformas smart home.

---

## Estructura de archivos propuesta

```
src/
├── main.jsx                    # Punto de entrada
├── App.jsx                     # Router principal
├── index.css                   # Design system global (tokens CSS)
│
├── store/
│   └── devicesStore.js         # Estado global con Zustand (dispositivos, escenas)
│
├── data/
│   └── devices.js              # Datos mock de dispositivos por habitación y plataforma
│
├── components/
│   ├── layout/
│   │   ├── BottomNav.jsx       # Navegación inferior con iconos
│   │   └── StatusBar.jsx       # Barra de conexión (verde/rojo por plataforma)
│   ├── ui/
│   │   ├── DeviceCard.jsx      # Card de dispositivo con toggle, badge, icono
│   │   ├── SceneCard.jsx       # Card de escena rápida
│   │   └── PlatformBadge.jsx   # Badge de color por plataforma
│   └── dashboard/
│       ├── Greeting.jsx        # Saludo dinámico según hora del día
│       └── RoomSection.jsx     # Sección de habitación con grid de dispositivos
│
└── pages/
    ├── Dashboard.jsx           # Pantalla principal
    ├── Cameras.jsx             # Pantalla de cámaras (Tapo x2)
    ├── Scenes.jsx              # Pantalla de gestión de escenas
    └── Settings.jsx            # Ajustes / configuración
```

---

## Plataformas y colores de badge

| Plataforma | Color | Dispositivos |
|---|---|---|
| Tuya | #FF6B35 | Interruptores, enchufes, IR |
| SmartThings | #1E88E5 | Lavavajillas Bosch |
| Ring | #1DB954 | Telefonillo / doorbell |
| Netatmo | #00BCD4 | Calefacción / termostato |
| Tapo | #26A69A | 2 Cámaras IP |
| App directa | #9E9E9E | Conga, Proscenic, Xiaomi Mi Home |

---

## Habitaciones y dispositivos

### Salón
- Luz principal (Tuya)
- Enchufe TV (Tuya)
- Calefacción salón (Netatmo)
- Control IR TV/AC (Tuya)

### Dormitorio
- Luz dormitorio (Tuya)
- Enchufe mesilla (Tuya)
- Calefacción dormitorio (Netatmo)

### Cocina
- Luz cocina (Tuya)
- Lavavajillas Bosch (SmartThings)
- Enchufe cocina (Tuya)

### Entrada
- Telefonillo (Ring)
- Cámara entrada (Tapo)
- Acceso directo Conga (App)

---

## Escenas rápidas
1. 🌅 Buenos días — Enciende luces + calefacción
2. 🎬 Modo cine — Atenúa luces + enciende TV
3. 🌙 Buenas noches — Apaga todo excepto seguridad
4. 🚪 Salgo de casa — Apaga todos los dispositivos

---

## Diseño

- **Fondo**: `#0f0f13`
- **Cards**: `#1a1a24`
- **Acento**: `#6c63ff`
- **Tipografía**: Inter (Google Fonts)
- **Bordes cards**: `1px solid rgba(255,255,255,0.06)`
- **Sombras**: Glow morado sutil en elementos activos
- **Animaciones**: Transiciones suaves en toggles, hover en cards

---

## Pantallas

### Dashboard
- Saludo con hora del día ("Buenos días", "Buenas tardes", "Buenas noches")
- Barra de estado de conexión por plataforma (pings mock)
- Grid de dispositivos agrupados por habitación
- Sección de escenas rápidas

### Cámaras
- Vista de las 2 cámaras Tapo
- Estado (online/offline)
- Access links / placeholder de stream

### Escenas
- Lista completa de escenas con botón de activación
- Estado activo de cada escena

### Ajustes
- Secciones por plataforma
- Toggle de notificaciones, tema, info de versión

---

## Verificación
- App arranca con `npm run dev` sin errores
- Navegación entre las 4 pantallas funciona
- Toggle de dispositivos actualiza estado global (Zustand)
- Diseño correcto en móvil (375px) y desktop
