import type { IncidenciaData } from '../types/domain';

export type EstadoIncidencia = 'pendiente' | 'en_progreso' | 'resuelta' | 'descartada';

export function normalizarEstadoIncidencia(estado?: string): EstadoIncidencia {
  const value = (estado || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s-]+/g, '_');
  if (['en_progreso', 'enproceso', 'en_proceso', 'en_reparacion', 'en_reparación', 'en_tramite', 'en_trámite'].includes(value)) return 'en_progreso';
  if (['resuelta', 'resuelto', 'cerrada', 'cerrado', 'finalizada', 'finalizado'].includes(value)) return 'resuelta';
  if (['descartada', 'descartado', 'cancelada', 'cancelado', 'rechazada', 'rechazado'].includes(value)) return 'descartada';
  return 'pendiente';
}

export function normalizarPrioridadIncidencia(prioridad?: string) {
  const value = (prioridad || '').toLowerCase();
  if (['alta', 'high', 'urgente', 'urgent'].includes(value)) return 'alta';
  if (['baja', 'low'].includes(value)) return 'baja';
  return 'media';
}

export function contarIncidencias(incidencias: IncidenciaData[], uidActual?: string) {
  const counts = { total: incidencias.length, pendientes: 0, enProgreso: 0, resueltas: 0, descartadas: 0, prioridadAlta: 0, activas: 0, activasPropias: 0, propiasTotal: 0, datosDemostracion: incidencias.some((incidencia) => incidencia.esDatoDemo === true) };
  for (const incidencia of incidencias) {
    const estado = normalizarEstadoIncidencia(incidencia.estado);
    if (uidActual && (incidencia.idVecino === uidActual || incidencia.creador === uidActual)) counts.propiasTotal += 1;
    if (estado === 'pendiente') counts.pendientes += 1;
    if (estado === 'en_progreso') counts.enProgreso += 1;
    if (estado === 'resuelta') counts.resueltas += 1;
    if (estado === 'descartada') counts.descartadas += 1;
    if (estado === 'pendiente' || estado === 'en_progreso') {
      counts.activas += 1;
      if (uidActual && (incidencia.idVecino === uidActual || incidencia.creador === uidActual)) counts.activasPropias += 1;
    }
    if (normalizarPrioridadIncidencia(incidencia.prioridad) === 'alta') counts.prioridadAlta += 1;
  }
  return counts;
}

export function etiquetaEstadoIncidencia(estado?: string) {
  const labels: Record<EstadoIncidencia, string> = { pendiente: 'Pendiente', en_progreso: 'En reparación', resuelta: 'Resuelta', descartada: 'Descartada' };
  return labels[normalizarEstadoIncidencia(estado)];
}
