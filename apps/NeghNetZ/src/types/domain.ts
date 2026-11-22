export interface DatosPersonalesVecino {
  nombre?: string;
  apellidos?: string;
  dni?: string;
  telefono?: string;
  movil?: string;
  email?: string;
  autorizaTelefonoDirectorio?: boolean;
  portal?: string;
  piso?: string;
  letra?: string;
  fotoPerfil?: string;
  photoURL?: string;
  coeficiente?: number | string;
  coeficienteEstimado?: number | string;
  plazaGaraje?: string;
  trastero?: string;
}

export type FirestoreDate = Date | string | { toDate: () => Date; seconds?: number };

export interface VecinoData {
  uid?: string;
  id?: string;
  nombre?: string;
  idComunidad?: string;
  tieneAdministradorFincas?: boolean;
  email?: string;
  apellidos?: string;
  tipo?: string;
  cargo?: string;
  telefono?: string;
  rol?: string;
  estado?: string;
  portal?: string;
  piso?: string;
  letra?: string;
  dni?: string;
  vivienda?: string;
  fotoPerfil?: string;
  coeficiente?: number | string;
  coeficienteEstimado?: number | string;
  plazaGaraje?: string;
  trastero?: string;
  matricula?: string;
  estadoCuotas?: string;
  aceptacionLegal?: {
    condicionesVersion?: string;
    privacidadVersion?: string;
    aceptadoEn?: FirestoreDate;
  };
  datosPersonales?: DatosPersonalesVecino;
  [field: string]: unknown;
}

export interface ZonaComun {
  id: string;
  idComunidad?: string;
  nombre: string;
  descripcion?: string;
  capacidadMaxima?: number;
  costoPorHora?: number;
  costePorHora?: number;
  reglasUso?: string;
  fotoUrl?: string;
  ubicacion?: string;
  caracteristicas?: string[];
  horarioSemanal?: Record<string, Array<{ inicio: string; fin: string }>>;
  duracionesReservaMinutos?: number[];
  pasoReservaMinutos?: number;
  maxPersonasPorReserva?: number;
  modoDisponibilidad?: 'exclusiva' | 'aforo' | 'sin_reserva';
  reservaHabilitada?: boolean;
  activa?: boolean;
  precioCentimos?: number;
  tipoPrecio?: 'gratis' | 'reserva' | 'fianza';
  horasCancelacionMinima?: number;
  limiteDiarioMinutos?: number;
  limiteDiarioPersonas?: number;
  [field: string]: unknown;
}

export interface CarpetaDocumento {
  id: string;
  nombre: string;
  descripcion?: string;
  [field: string]: unknown;
}

export interface ArchivoDocumento {
  id: string;
  nombre?: string;
  name?: string;
  descripcion?: string;
  urlDescarga?: string;
  subidoPor?: string;
  fechaSubida?: string | Date | { toDate: () => Date };
  [field: string]: unknown;
}

export interface IncidenciaData {
  id: string;
  titulo?: string;
  descripcion?: string;
  estado?: string;
  prioridad?: string;
  esDatoDemo?: boolean;
  ubicacion?: string;
  fechaCreacion?: FirestoreDate;
  creador?: string | null;
  idVecino?: string;
  idComunidad?: string;
  categoria?: string;
    nombreCreador?: string;
    imagenes?: string[];
  zona?: string;
  historial?: Array<{
    id?: string;
    autor?: string;
    autorUid?: string;
    autorNombre?: string;
    detalle?: string;
    fecha?: FirestoreDate;
    editadoPorUid?: string;
    fechaEdicion?: FirestoreDate;
    eliminado?: boolean;
    eliminadoPorUid?: string;
    eliminadoPorNombre?: string;
    eliminadoPorCargo?: string;
    fechaEliminacion?: FirestoreDate;
  }>;
  [field: string]: unknown;
}

export interface GastoData {
  id: string;
  concepto?: string;
  importe?: number;
  tipo?: string;
  periodicidad?: string;
  fecha?: FirestoreDate;
  [field: string]: unknown;
}

export interface ReservaData {
  id: string;
  idZonaComun?: string;
  idVecino?: string;
  solicitanteNombre?: string;
  idComunidad?: string;
  fecha?: FirestoreDate;
  fechaInicio?: FirestoreDate;
  fechaFin?: FirestoreDate;
  costeTotal?: number;
  costeTotalCentimos?: number;
  metodoPago?: string;
  estado?: string;
  estadoPago?: string;
  pagoSimulado?: boolean;
  numeroPersonas?: number;
  duracionMinutos?: number;
  fechaDia?: string;
  slotIds?: string[];
  viviendaId?: string;
  nombreZona?: string;
  creadoEn?: FirestoreDate;
  [field: string]: unknown;
  uidVecino?: string;
}

export interface OpcionVotacion {
  texto?: string;
  nombre?: string;
  votos?: number;
}

export interface VotacionData {
  id: string;
  titulo?: string;
  descripcion?: string;
  estado?: string;
  opciones?: Array<OpcionVotacion | string>;
  fechaFin?: Date | string;
  [field: string]: unknown;
}

export type VecinoOutletContext = [VecinoData | null];

export interface NotificacionData {
  id: string;
  destinatarioUid: string;
  idComunidad: string;
    tipo: 'mensaje' | 'incidencia' | 'reserva' | 'votacion' | 'documento' | 'reunion' | 'comunidad' | 'inscripcion';
  titulo: string;
  descripcion: string;
  creadaPorUid: string;
  creadaEn?: FirestoreDate;
  leida: boolean;
  leidaEn?: FirestoreDate;
  enlace: string;
  sourceId: string;
  solicitudUid?: string;
  conversacionId?: string;
  actividadId?: string;
  actividadTipo?: 'comentario' | 'reaccion';
}
