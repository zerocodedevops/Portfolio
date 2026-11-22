import { DEMO_ADMIN_UID, DEMO_COMMUNITY_ID, DEMO_COMMUNITY_NAME, DEMO_OWNER_UID } from './demoConstants';
import { DemoTimestamp } from './demoTypes';

export type DemoSeedCollections = Record<string, Record<string, Record<string, unknown>>>;

function daysAgo(days: number): DemoTimestamp {
  return DemoTimestamp.fromDate(new Date(Date.now() - days * 86_400_000));
}

function daysFromNow(days: number, hour = 10, minute = 0): DemoTimestamp {
  const date = new Date(Date.now() + days * 86_400_000);
  date.setHours(hour, minute, 0, 0);
  return DemoTimestamp.fromDate(date);
}

function buildDateKey(daysOffset: number): string {
  const date = new Date(Date.now() + daysOffset * 86_400_000);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function makeResident(input: {
  uid: string;
  nombre?: string;
  apellidos: string;
  portal: string;
  piso: string;
  letra: string;
  email: string;
  dni: string;
  rol: 'propietario' | 'administrador' | 'conserje';
  cargo: string;
  estado?: string;
  coeficiente?: number;
  plazaGaraje?: string;
  trastero?: string;
}) {
  const nombre = input.nombre || 'Vecino';
  const vivienda = input.portal === 'Oficina' ? `${input.portal} ${input.letra}` : `${input.portal} ${input.piso}${input.letra}`;
  return {
    id: input.uid,
    uid: input.uid,
    idComunidad: DEMO_COMMUNITY_ID,
    tieneAdministradorFincas: false,
    nombre,
    apellidos: input.apellidos,
    email: input.email,
    telefono: 'TELÉFONO DEMO',
    dni: input.dni,
    portal: input.portal,
    piso: input.piso,
    letra: input.letra,
    vivienda,
    rol: input.rol,
    cargo: input.cargo,
    estado: input.estado || 'aprobado',
    activo: (input.estado || 'aprobado') === 'aprobado',
    chatEnabled: true,
    estadoCuotas: 'Al corriente',
    coeficiente: input.coeficiente ?? 1.23,
    plazaGaraje: input.plazaGaraje ?? '',
    trastero: input.trastero ?? '',
    datosPersonales: {
      nombre,
      apellidos: input.apellidos,
      dni: input.dni,
      telefono: 'TELÉFONO DEMO',
      movil: 'TELÉFONO DEMO',
      email: input.email,
      autorizaTelefonoDirectorio: true,
      portal: input.portal,
      piso: input.piso,
      letra: input.letra,
      coeficiente: input.coeficiente ?? 1.23,
      plazaGaraje: input.plazaGaraje ?? '',
      trastero: input.trastero ?? '',
    },
    creadoEn: daysAgo(60),
  };
}

function toPublicResidentRecord(resident: Record<string, unknown>) {
  const dp = (resident.datosPersonales || {}) as Record<string, unknown>;
  return {
    id: resident.uid,
    uid: resident.uid,
    idComunidad: resident.idComunidad,
    nombre: resident.nombre,
    apellidos: resident.apellidos,
    portal: resident.portal,
    piso: resident.piso,
    letra: resident.letra,
    vivienda: resident.vivienda,
    rol: resident.rol,
    cargo: resident.cargo,
    activo: resident.activo,
    chatEnabled: true,
    coeficiente: resident.coeficiente,
    plazaGaraje: resident.plazaGaraje,
    trastero: resident.trastero,
    datosPersonales: {
      nombre: dp.nombre,
      apellidos: dp.apellidos,
      portal: dp.portal,
      piso: dp.piso,
      letra: dp.letra,
      telefono: dp.autorizaTelefonoDirectorio ? dp.telefono : undefined,
      autorizaTelefonoDirectorio: dp.autorizaTelefonoDirectorio,
      coeficiente: dp.coeficiente,
    },
  };
}

export function createInitialDemoState(): DemoSeedCollections {
  const viviendas: Record<string, Record<string, unknown>> = {};
  const allResidents: Array<ReturnType<typeof makeResident>> = [];

  const firstNames = [
    'Carlos', 'Lucía', 'Javier', 'Marta', 'Alejandro', 'Sofía', 'Daniel', 'Paula',
    'Miguel', 'Elena', 'David', 'Carmen', 'Pablo', 'Laura', 'Sergio', 'Ana',
    'Adrián', 'Clara', 'Hugo', 'Alba', 'Marcos', 'Irene', 'Álvaro', 'Nuria',
    'Raúl', 'Beatriz', 'Rubén', 'Patricia', 'Iván', 'Rocío',
  ];
  const lastNames = [
    'Mendoza Ruiz', 'Gómez Navarro', 'López Serrano', 'Martín Castro', 'Sánchez Gil',
    'Fernández Torres', 'Díaz Molina', 'Moreno Blanco', 'Romero Ortega', 'Álvarez Delgado',
    'Vázquez Morales', 'Domínguez Ramos', 'Muñoz Herrera', 'Jiménez Cortés', 'Pérez Lozano',
    'García Prieto', 'Hernández Vega', 'Suárez Campos', 'Castro Reyes', 'Ramos Medina',
  ];

  const standardFloors = [
    { floor: '1', doors: ['A', 'B'] },
    { floor: '2', doors: ['A', 'B', 'C'] },
    { floor: '3', doors: ['A', 'B', 'C'] },
    { floor: '4', doors: ['A', 'B', 'C'] },
    { floor: '5', doors: ['A', 'B', 'C'] },
    { floor: '6', doors: ['A', 'B', 'C'] },
    { floor: 'Ático', doors: ['A', 'B'] },
  ];

  // Exact 75-unit building structure matching StitchPage.tsx standardFloors
  // Correlative garage & storage assignment 1..75
  let correlativeIndex = 1;
  for (let portalNumber = 1; portalNumber <= 4; portalNumber += 1) {
    const portal = `Portal ${portalNumber}`;
    const portalNum = String(portalNumber);
    for (const { floor, doors } of standardFloors) {
      const portalDoors = portalNumber === 1 && floor === '1' ? ['A'] : doors;
      for (const door of portalDoors) {
        const floorSlug = floor === 'Ático' ? 'atico' : floor;
        const slug = `portal${portalNum}-${floorSlug}${door.toLowerCase()}`;
        const garageNum = String(correlativeIndex);
        const storageNum = String(correlativeIndex);
        const unitKey = `${portal}_${floorSlug}_${door}`;

        viviendas[unitKey] = {
          idComunidad: DEMO_COMMUNITY_ID,
          portal: portalNum,
          piso: floor,
          letra: door,
          plazaGaraje: garageNum,
          trastero: storageNum,
          coeficiente: 1.23,
        };

        let uid = `demo-uid-${slug}`;
        let cargo = 'Propietario';
        if (portalNumber === 1 && floor === '1' && door === 'A') {
          uid = DEMO_ADMIN_UID;
          cargo = 'Presidente';
        } else if (portalNumber === 2 && floor === '1' && door === 'A') {
          uid = DEMO_OWNER_UID;
          cargo = 'Propietario';
        } else if (portalNumber === 3 && floor === '1' && door === 'B') {
          cargo = 'Vicepresidente';
        } else if ((portalNumber === 2 && floor === '2' && door === 'A') || (portalNumber === 4 && floor === '1' && door === 'B')) {
          cargo = 'Vocal';
        }

        const primaryName = firstNames[(correlativeIndex * 3) % firstNames.length];
        const primarySurname = lastNames[(correlativeIndex * 5) % lastNames.length];

        allResidents.push(
          makeResident({
            uid,
            nombre: primaryName,
            apellidos: primarySurname,
            portal,
            piso: floor,
            letra: door,
            email: `vecino.${slug.replace('-', '.')}@neighnet.com`,
            dni: `DEMO-PORTAL${portalNum}-${floorSlug.toUpperCase()}${door}`,
            rol: 'propietario',
            cargo,
            coeficiente: 1.23,
            plazaGaraje: garageNum,
            trastero: storageNum,
          })
        );

        // Deterministically assign 1 or 2 residents per home (every flat has 1 or 2)
        if (correlativeIndex % 3 !== 0) {
          const secondName = firstNames[(correlativeIndex * 3 + 7) % firstNames.length];
          const secondSurname = lastNames[(correlativeIndex * 5 + 3) % lastNames.length];
          allResidents.push(
            makeResident({
              uid: `demo-uid-${slug}-2`,
              nombre: secondName,
              apellidos: secondSurname,
              portal,
              piso: floor,
              letra: door,
              email: `vecino2.${slug.replace('-', '.')}@neighnet.com`,
              dni: `DEMO-PORTAL${portalNum}-${floorSlug.toUpperCase()}${door}-2`,
              rol: 'propietario',
              cargo: 'Propietario',
              coeficiente: 1.23,
              plazaGaraje: garageNum,
              trastero: storageNum,
            })
          );
        }

        correlativeIndex += 1;
      }
    }
  }

  // Staff & External Administration recovered from operational project (restaurar-emails-neighnetz.cts)
  allResidents.push(
    makeResident({
      uid: 'demo-uid-conserje',
      nombre: 'Conserje',
      apellidos: 'Comunidad',
      portal: 'Oficina',
      piso: 'PB',
      letra: 'Conserjería',
      email: 'conserje@neighnetz.com',
      dni: 'DEMO-CONSERJE',
      rol: 'conserje',
      cargo: 'Conserje',
    }),
    makeResident({
      uid: 'demo-uid-admin-fincas',
      nombre: 'Administrador',
      apellidos: 'de Fincas',
      portal: 'Oficina',
      piso: 'PB',
      letra: 'Administración',
      email: 'admin@neighnetz.com',
      dni: 'DEMO-ADMIN-FINCAS',
      rol: 'administrador',
      cargo: 'Administrador de Fincas',
    })
  );

  // Pending validation request for /admin/usuarios
  const pendingNeighbor = makeResident({
    uid: 'demo-uid-solicitud-portal4-3a',
    nombre: 'Vecino Solicitud',
    apellidos: 'Portal 4 3A',
    portal: 'Portal 4',
    piso: '3',
    letra: 'A',
    email: 'solicitud.portal4.3a@neighnet.com',
    dni: 'DEMO-SOLICITUD-P4-3A',
    rol: 'propietario',
    cargo: 'Propietario',
    estado: 'pendiente',
    plazaGaraje: '63',
    trastero: '63',
  });
  allResidents.push(pendingNeighbor);

  const vecinos: Record<string, Record<string, unknown>> = {};
  const vecinosPublicos: Record<string, Record<string, unknown>> = {};
  const vecinoIdentidades: Record<string, Record<string, unknown>> = {};
  const usuariosAcceso: Record<string, Record<string, unknown>> = {};
  const membresiasComunidad: Record<string, Record<string, unknown>> = {};

  for (const resident of allResidents) {
    vecinos[resident.uid] = resident;
    if (resident.activo) {
      vecinosPublicos[resident.uid] = toPublicResidentRecord(resident);
    }
    vecinoIdentidades[resident.email] = {
      idFicha: resident.uid,
      idComunidad: DEMO_COMMUNITY_ID,
      email: resident.email,
      correo: resident.email,
      uid: resident.uid,
    };
    usuariosAcceso[resident.uid] = {
      uid: resident.uid,
      email: resident.email,
      idFicha: resident.uid,
      idFichaActiva: resident.uid,
      idComunidad: DEMO_COMMUNITY_ID,
      idComunidadActiva: DEMO_COMMUNITY_ID,
    };
    membresiasComunidad[`${resident.uid}_${DEMO_COMMUNITY_ID}`] = {
      uid: resident.uid,
      idComunidad: DEMO_COMMUNITY_ID,
      nombreComunidad: DEMO_COMMUNITY_NAME,
      idFicha: resident.uid,
      vivienda: resident.vivienda,
      estado: resident.estado === 'aprobado' ? 'aprobada' : 'pendiente',
      creadaEn: daysAgo(50),
    };
  }

  const tomorrowKey = buildDateKey(1);

  return {
    comunidades: {
      [DEMO_COMMUNITY_ID]: {
        id: DEMO_COMMUNITY_ID,
        nombre: DEMO_COMMUNITY_NAME,
        direccion: 'Avenida de la Demo, 10',
        ciudad: 'Madrid',
        codigoPostal: '28001',
        tieneAdministradorFincas: false,
        portales: ['Portal 1', 'Portal 2', 'Portal 3', 'Portal 4'],
        estado: 'activa',
        creadaEn: daysAgo(120),
      },
    },
    vecinos,
    vecinosPublicos,
    vecinoIdentidades,
    usuariosAcceso,
    membresiasComunidad,
    viviendas,
    incidencias: {
      'inc-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        titulo: 'Luminaria fundida en rellano Portal 2',
        descripcion: 'La lámpara LED de la primera planta parpadea desde ayer por la tarde.',
        categoria: 'Electricidad',
        prioridad: 'Media',
        estado: 'En proceso',
        ubicacion: 'Portal 2 · Planta 1',
        autorUid: DEMO_OWNER_UID,
        autorId: DEMO_OWNER_UID,
        autorNombre: 'Vecino Portal 2 1A',
        vivienda: 'Portal 2 1A',
        fechaCreacion: daysAgo(3),
        fechaActualizacion: daysAgo(1),
        imagenes: [],
        comentarios: [
          {
            autor: 'Vecino Portal 1 1A (Presidente)',
            texto: 'Aviso trasladado al servicio de mantenimiento eléctrico.',
            fecha: daysAgo(1).toDate().toISOString(),
          },
        ],
      },
      'inc-demo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        titulo: 'Puerta de acceso al garaje con cierre lento',
        descripcion: 'La puerta automática tarda más de lo habitual en completar el cierre.',
        categoria: 'Garaje',
        prioridad: 'Alta',
        estado: 'Abierta',
        ubicacion: 'Acceso Garaje Planta -1',
        autorUid: 'demo-uid-portal3-1b',
        autorId: 'demo-uid-portal3-1b',
        autorNombre: 'Vecino Portal 3 1B',
        vivienda: 'Portal 3 1B',
        fechaCreacion: daysAgo(2),
        fechaActualizacion: daysAgo(2),
        imagenes: [],
        comentarios: [],
      },
      'inc-demo-3': {
        idComunidad: DEMO_COMMUNITY_ID,
        titulo: 'Revisión filtro piscina comunitaria',
        descripcion: 'Comprobación rutinaria realizada antes de la apertura de temporada.',
        categoria: 'Zonas Comunes',
        prioridad: 'Baja',
        estado: 'Resuelta',
        ubicacion: 'Zona Piscina',
        autorUid: DEMO_ADMIN_UID,
        autorId: DEMO_ADMIN_UID,
        autorNombre: 'Vecino Portal 1 1A',
        vivienda: 'Portal 1 1A',
        fechaCreacion: daysAgo(10),
        fechaActualizacion: daysAgo(5),
        imagenes: [],
        comentarios: [],
      },
    },
    gastos: {
      'gasto-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        concepto: 'Mantenimiento mensual de ascensores',
        categoria: 'Mantenimiento',
        tipo: 'Fijo',
        periodicidad: 'Mensual',
        importe: 420.5,
        fecha: daysAgo(12),
        estado: 'Pagado',
        proveedor: 'Elevadores Demo S.L.',
      },
      'gasto-demo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        concepto: 'Limpieza de portales y zonas comunes',
        categoria: 'Limpieza',
        tipo: 'Fijo',
        periodicidad: 'Mensual',
        importe: 680.0,
        fecha: daysAgo(8),
        estado: 'Pagado',
        proveedor: 'Limpiezas Integrales Demo',
      },
      'gasto-demo-3': {
        idComunidad: DEMO_COMMUNITY_ID,
        concepto: 'Suministro eléctrico zonas comunes',
        categoria: 'Suministros',
        tipo: 'Variable',
        periodicidad: 'Mensual',
        importe: 315.75,
        fecha: daysAgo(4),
        estado: 'Pendiente',
        proveedor: 'Energía Comunitaria Demo',
      },
      'gasto-demo-4': {
        idComunidad: DEMO_COMMUNITY_ID,
        concepto: 'Cuotas ordinarias mensuales (75 viviendas)',
        categoria: 'Cuotas',
        tipo: 'Fijo',
        periodicidad: 'Mensual',
        importe: 1893.6,
        fecha: daysAgo(15),
        estado: 'Cobrado',
        proveedor: 'Comunidad Demo NeighNet',
      },
    },
    zonasComunes: {
      'zona-padel': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Pista de Pádel',
        descripcion: 'Pista de cristal con iluminación LED. Reserva exclusiva por vivienda.',
        ubicacion: 'Zona Deportiva Exterior',
        capacidadMaxima: 4,
        maxPersonasPorReserva: 4,
        modoDisponibilidad: 'exclusiva',
        reservaHabilitada: true,
        activa: true,
        duracionesReservaMinutos: [60, 90],
        pasoReservaMinutos: 30,
        tipoPrecio: 'gratis',
        precioCentimos: 0,
        horasCancelacionMinima: 2,
        limiteDiarioMinutos: 90,
        fotoUrl: '/images/zonas/padel.svg',
        reglasUso: 'Calzado deportivo adecuado. Respetar horario nocturno hasta las 22:00.',
        horarioSemanal: {
          lunes: [{ inicio: '09:00', fin: '22:00' }],
          martes: [{ inicio: '09:00', fin: '22:00' }],
          miercoles: [{ inicio: '09:00', fin: '22:00' }],
          jueves: [{ inicio: '09:00', fin: '22:00' }],
          viernes: [{ inicio: '09:00', fin: '22:00' }],
          sabado: [{ inicio: '09:00', fin: '22:00' }],
          domingo: [{ inicio: '09:00', fin: '22:00' }],
        },
      },
      'zona-piscina': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Piscina Comunitaria',
        descripcion: 'Acceso controlado por aforo de personas por turno.',
        ubicacion: 'Jardín Central',
        capacidadMaxima: 25,
        maxPersonasPorReserva: 4,
        modoDisponibilidad: 'aforo',
        reservaHabilitada: true,
        activa: true,
        duracionesReservaMinutos: [120],
        pasoReservaMinutos: 60,
        tipoPrecio: 'gratis',
        precioCentimos: 0,
        horasCancelacionMinima: 1,
        limiteDiarioPersonas: 4,
        fotoUrl: '/images/zonas/piscina.svg',
        reglasUso: 'Ducha obligatoria antes del baño. Menores acompañados.',
        horarioSemanal: {
          lunes: [{ inicio: '10:00', fin: '21:00' }],
          martes: [{ inicio: '10:00', fin: '21:00' }],
          miercoles: [{ inicio: '10:00', fin: '21:00' }],
          jueves: [{ inicio: '10:00', fin: '21:00' }],
          viernes: [{ inicio: '10:00', fin: '21:00' }],
          sabado: [{ inicio: '10:00', fin: '21:00' }],
          domingo: [{ inicio: '10:00', fin: '21:00' }],
        },
      },
      'zona-sala': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Sala Social y Reuniones',
        descripcion: 'Espacio polivalente equipado con mesas, proyector y cocina auxiliar.',
        ubicacion: 'Planta Baja · Portal 1',
        capacidadMaxima: 20,
        maxPersonasPorReserva: 20,
        modoDisponibilidad: 'exclusiva',
        reservaHabilitada: true,
        activa: true,
        duracionesReservaMinutos: [120, 240],
        pasoReservaMinutos: 60,
        tipoPrecio: 'fianza',
        precioCentimos: 3000,
        horasCancelacionMinima: 12,
        fotoUrl: '/images/zonas/sala-social.svg',
        reglasUso: 'Dejar la sala limpia y recogida tras el uso.',
        horarioSemanal: {
          lunes: [{ inicio: '10:00', fin: '22:00' }],
          martes: [{ inicio: '10:00', fin: '22:00' }],
          miercoles: [{ inicio: '10:00', fin: '22:00' }],
          jueves: [{ inicio: '10:00', fin: '22:00' }],
          viernes: [{ inicio: '10:00', fin: '23:00' }],
          sabado: [{ inicio: '10:00', fin: '23:00' }],
          domingo: [{ inicio: '10:00', fin: '22:00' }],
        },
      },
    },
    reservas: {
      'res-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        idZonaComun: 'zona-padel',
        nombreZona: 'Pista de Pádel',
        idVecino: DEMO_OWNER_UID,
        viviendaId: 'Portal 2 1A',
        nombreVecino: 'Vecino Portal 2 1A',
        fechaDia: tomorrowKey,
        fechaInicio: daysFromNow(1, 18, 0),
        fechaFin: daysFromNow(1, 19, 0),
        personas: 4,
        estado: 'confirmada',
        precioCentimos: 0,
        creadaEn: daysAgo(1),
      },
    },
    ocupacionesReservas: {},
    limitesReservas: {},
    votaciones: {
      'vot-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        titulo: 'Instalación de puntos de recarga en garaje',
        descripcion: 'Aprobación de preinstalación común para vehículos eléctricos en planta -1.',
        estado: 'activa',
        fechaInicio: daysAgo(4),
        fechaFin: daysFromNow(7),
        opciones: ['A favor', 'En contra', 'Abstención'],
        votos: {
          [DEMO_ADMIN_UID]: 'A favor',
          'demo-uid-portal3-1b': 'A favor',
        },
        creadaPor: DEMO_ADMIN_UID,
        creadaEn: daysAgo(4),
      },
      'vot-demo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        titulo: 'Ampliación horario de iluminación en jardín',
        descripcion: 'Extender el encendido del jardín central hasta las 23:30 en verano.',
        estado: 'finalizada',
        fechaInicio: daysAgo(30),
        fechaFin: daysAgo(15),
        opciones: ['Sí, ampliar hasta 23:30', 'Mantener horario actual'],
        votos: {
          [DEMO_OWNER_UID]: 'Sí, ampliar hasta 23:30',
          [DEMO_ADMIN_UID]: 'Sí, ampliar hasta 23:30',
          'demo-uid-portal2-1b': 'Sí, ampliar hasta 23:30',
          'demo-uid-portal4-2b': 'Mantener horario actual',
        },
        creadaPor: DEMO_ADMIN_UID,
        creadaEn: daysAgo(30),
      },
    },
    reuniones: {
      'reu-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        titulo: 'Junta Ordinaria Trimestral',
        tipo: 'Ordinaria',
        estado: 'convocada',
        fecha: daysFromNow(5, 19, 0),
        lugar: 'Sala Social · Portal 1',
        ordenDelDia: [
          '1. Lectura y aprobación del acta anterior.',
          '2. Estado de cuentas y presupuesto del trimestre.',
          '3. Seguimiento de incidencias y mantenimiento.',
          '4. Ruegos y preguntas.',
        ],
        creadaPorUid: DEMO_ADMIN_UID,
        creadaEn: daysAgo(5),
      },
    },
    'reuniones/reu-demo-1/preguntas': {
      'preg-demo-1': {
        autorUid: DEMO_OWNER_UID,
        autorNombre: 'Vecino Portal 2 1A',
        texto: '¿Se incluirá la limpieza de canalones antes de otoño?',
        creadaEn: daysAgo(2),
      },
    },
    'reuniones/reu-demo-1/acuerdos': {
      'acu-demo-1': {
        texto: 'Solicitar dos presupuestos adicionales para puertas automáticas del garaje.',
        responsable: 'Vecino Portal 1 1A (Presidente)',
        fechaLimite: buildDateKey(14),
        estado: 'pendiente',
        creadoPorUid: DEMO_ADMIN_UID,
        creadaEn: daysAgo(3),
      },
    },
    documentos: {
      'doc-carpeta-actas': {
        idComunidad: DEMO_COMMUNITY_ID,
        tipo: 'carpeta',
        nombre: 'Actas de Juntas',
        descripcion: 'Actas oficiales aprobadas por la comunidad',
        creadoEn: daysAgo(90),
      },
      'doc-carpeta-normas': {
        idComunidad: DEMO_COMMUNITY_ID,
        tipo: 'carpeta',
        nombre: 'Estatutos y Normas',
        descripcion: 'Reglamento de régimen interior y normas de zonas comunes',
        creadoEn: daysAgo(90),
      },
      'doc-archivo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        tipo: 'archivo',
        idCarpeta: 'doc-carpeta-actas',
        nombre: 'Acta_Junta_Anterior_Demo.pdf',
        url: 'demo-doc-acta.pdf',
        urlDescarga: 'demo-doc-acta.pdf',
        tamano: 245000,
        fechaSubida: daysAgo(25),
        subidoPor: 'Vecino Portal 1 1A',
      },
      'doc-archivo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        tipo: 'archivo',
        idCarpeta: 'doc-carpeta-normas',
        nombre: 'Normas_Convivencia_Demo.pdf',
        url: 'demo-doc-normas.pdf',
        urlDescarga: 'demo-doc-normas.pdf',
        tamano: 180000,
        fechaSubida: daysAgo(45),
        subidoPor: 'Vecino Portal 1 1A',
      },
    },
    zonasDocumentales: {
      'zdoc-1': { idComunidad: DEMO_COMMUNITY_ID, nombre: 'Secretaría y Actas', descripcion: 'Documentación de juntas' },
      'zdoc-2': { idComunidad: DEMO_COMMUNITY_ID, nombre: 'Normativa Interna', descripcion: 'Reglamentos vigentes' },
    },
    carpetasDocumentales: {
      'cdoc-1': { idComunidad: DEMO_COMMUNITY_ID, idZona: 'zdoc-1', nombre: 'Juntas 2026', descripcion: 'Convocatorias y actas' },
      'cdoc-2': { idComunidad: DEMO_COMMUNITY_ID, idZona: 'zdoc-2', nombre: 'Zonas Comunes', descripcion: 'Normas de uso' },
    },
    documentosComunidad: {
      'dcom-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        idCarpeta: 'cdoc-1',
        nombre: 'Convocatoria_Junta_Demo.pdf',
        url: 'demo-doc-convocatoria.pdf',
        tamano: 142000,
        creadoEn: daysAgo(5),
      },
    },
    publicaciones: {
      'pub-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        autorUid: DEMO_ADMIN_UID,
        autorNombre: 'Vecino Portal 1 1A',
        autorVivienda: 'Portal 1 1A',
        autorCargo: 'Presidente',
        titulo: 'Bienvenidos al Tablón de Comunidad Demo',
        texto: 'Recordamos que la próxima semana se realizará la revisión preventiva de extintores en todos los portales.',
        etiqueta: 'Aviso',
        fijada: true,
        imagenes: [],
        creadaEn: daysAgo(3),
      },
      'pub-demo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        autorUid: 'demo-uid-portal2-1b',
        autorNombre: 'Vecino Portal 2 1B',
        autorVivienda: 'Portal 2 1B',
        texto: '¿Alguien interesado en organizar partido de pádel este sábado por la mañana?',
        etiqueta: 'Vecinos',
        fijada: false,
        imagenes: [],
        creadaEn: daysAgo(1),
      },
    },
    'publicaciones/pub-demo-1/comentarios': {
      'com-demo-1': {
        autorUid: DEMO_OWNER_UID,
        autorNombre: 'Vecino Portal 2 1A',
        texto: 'Gracias por el aviso, estaremos pendientes.',
        creadaEn: daysAgo(2),
      },
    },
    'publicaciones/pub-demo-1/reacciones': {
      [DEMO_OWNER_UID]: { tipo: 'like', uid: DEMO_OWNER_UID },
    },
    profesionalesRecomendados: {
      'prof-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Fontanería Rápida Demo',
        categoria: 'Fontanería',
        telefono: 'TELÉFONO DEMO',
        email: 'fontaneria.demo@neighnet.com',
        web: '',
        descripcion: 'Reparaciones de urgencia, desatascos y mantenimiento preventivo de bajantes comunitarias.',
        recomendadoPorNombre: 'Vecino Portal 1 1A',
        propuestaId: 'prop-1',
        publicadoEn: daysAgo(40),
      },
      'prof-demo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Electricidad Central Demo',
        categoria: 'Electricidad',
        telefono: 'TELÉFONO DEMO',
        email: 'electricidad.demo@neighnet.com',
        web: '',
        descripcion: 'Instalaciones LED en garajes y portales, porteros automáticos y revisión de cuadros eléctricos.',
        recomendadoPorNombre: 'Vecino Portal 3 1B',
        propuestaId: 'prop-2',
        publicadoEn: daysAgo(25),
      },
      'prof-demo-3': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Cerrajería Seguridad 24h Demo',
        categoria: 'Cerrajería de seguridad',
        telefono: 'TELÉFONO DEMO',
        email: 'cerrajeria.demo@neighnet.com',
        web: '',
        descripcion: 'Amaestramiento de bombines comunitarios, muelles cierra-puertas y duplicado de llaves de seguridad.',
        recomendadoPorNombre: 'Vecino Portal 2 1A',
        propuestaId: 'prop-3',
        publicadoEn: daysAgo(18),
      },
      'prof-demo-4': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Jardines del Sur Demo',
        categoria: 'Jardinería y zonas verdes',
        telefono: 'TELÉFONO DEMO',
        email: 'jardineria.demo@neighnet.com',
        web: '',
        descripcion: 'Mantenimiento de praderas, poda estacional, riego automático y cuidado de zonas comunes ajardinadas.',
        recomendadoPorNombre: 'Vecino Portal 2 2A',
        propuestaId: 'prop-4',
        publicadoEn: daysAgo(12),
      },
      'prof-demo-5': {
        idComunidad: DEMO_COMMUNITY_ID,
        nombre: 'Clima & Calderas Demo',
        categoria: 'Calderas, gas y climatización',
        telefono: 'TELÉFONO DEMO',
        email: 'clima.demo@neighnet.com',
        web: '',
        descripcion: 'Revisión anual de calderas comunitarias, aerotermia y mantenimiento de circuitos de calefacción.',
        recomendadoPorNombre: 'Vecino Portal 4 1B',
        propuestaId: 'prop-5',
        publicadoEn: daysAgo(7),
      },
    },
    propuestasProfesionales: {},
    conversaciones: {
      'conv-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        participantes: [DEMO_OWNER_UID, DEMO_ADMIN_UID],
        participantesInfo: {
          [DEMO_OWNER_UID]: { nombre: 'Vecino Portal 2 1A', vivienda: 'Portal 2 1A' },
          [DEMO_ADMIN_UID]: { nombre: 'Vecino Portal 1 1A', vivienda: 'Portal 1 1A' },
        },
        ultimoMensaje: 'Aviso trasladado al técnico de electricidad.',
        ultimoMensajePor: DEMO_ADMIN_UID,
        actualizadoEn: daysAgo(1),
        leidoEn: {
          [DEMO_ADMIN_UID]: daysAgo(1),
        },
      },
    },
    'conversaciones/conv-demo-1/mensajes': {
      'msg-demo-1': {
        remitenteUid: DEMO_OWNER_UID,
        remitenteNombre: 'Vecino Portal 2 1A',
        texto: 'Hola, he registrado la incidencia de la luz del rellano.',
        creadoEn: daysAgo(2),
      },
      'msg-demo-2': {
        remitenteUid: DEMO_ADMIN_UID,
        remitenteNombre: 'Vecino Portal 1 1A',
        texto: 'Aviso trasladado al técnico de electricidad.',
        creadoEn: daysAgo(1),
      },
    },
    notificaciones: {
      'notif-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        destinatarioUid: DEMO_OWNER_UID,
        titulo: 'Convocatoria de Junta Ordinaria',
        descripcion: 'Se ha convocado Junta Ordinaria para dentro de 5 días en la Sala Social.',
        tipo: 'reunion',
        leida: false,
        enlace: '/dashboard/reuniones',
        creadaEn: daysAgo(2),
      },
      'notif-demo-2': {
        idComunidad: DEMO_COMMUNITY_ID,
        destinatarioUid: DEMO_ADMIN_UID,
        titulo: 'Solicitud de acceso pendiente',
        descripcion: 'Vecino Portal 4 3A ha solicitado validación en la comunidad.',
        tipo: 'inscripcion',
        leida: false,
        enlace: '/admin/usuarios',
        creadaEn: daysAgo(1),
      },
    },
    preferenciasNotificaciones: {
      [DEMO_OWNER_UID]: { idComunidad: DEMO_COMMUNITY_ID, preferencias: { incidencias: true, reservas: true, reuniones: true, votaciones: true, comunidad: true, mensajes: true, documentos: true } },
      [DEMO_ADMIN_UID]: { idComunidad: DEMO_COMMUNITY_ID, preferencias: { incidencias: true, reservas: true, reuniones: true, votaciones: true, comunidad: true, mensajes: true, documentos: true } },
    },
    solicitudesInscripcion: {
      'sol-demo-1': {
        idComunidad: DEMO_COMMUNITY_ID,
        uid: 'demo-uid-portal4-3a',
        nombre: 'Vecino',
        apellidos: 'Portal 4 3A',
        email: 'vecino.portal4.3a@neighnet.com',
        dni: 'DEMO-PORTAL4-3A',
        telefono: 'TELÉFONO DEMO',
        portal: 'Portal 4',
        piso: '3',
        letra: 'A',
        vivienda: 'Portal 4 3A',
        estado: 'pendiente',
        creadaEn: daysAgo(1),
      },
    },
    codigosAccesoComunidad: {},
  };
}
