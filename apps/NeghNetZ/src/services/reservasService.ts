import {
  collection, doc, getDocs, query, runTransaction, serverTimestamp, where,
} from '../demo/demoStore';
import type {
  DemoDocumentData as DocumentData,
  DemoFirestore as Firestore,
  DemoTransaction as Transaction,
} from '../demo/demoTypes';
import type { ReservaData, ZonaComun } from '../types/domain';

export const RESERVATION_SLOT_STEP_MINUTES = 30;
export const MAX_RESERVATION_DAYS_AHEAD = 60;
export const PAYMENT_METHODS = [
  { id: 'transferencia', label: 'Transferencia', icon: 'account_balance' },
  { id: 'bizum', label: 'Bizum', icon: 'smartphone' },
  { id: 'tarjeta', label: 'Tarjeta', icon: 'credit_card' },
  { id: 'efectivo', label: 'Efectivo en conserjería', icon: 'payments' },
] as const;

export type ReservationPaymentMethod = typeof PAYMENT_METHODS[number]['id'];
export interface ReservationOccupancy {
  id: string;
  idComunidad: string;
  idZonaComun: string;
  fechaDia: string;
  inicioFranja: Date;
  bloqueada?: boolean;
  motivoBloqueo?: string;
  reservas?: Record<string, { uid: string; personas: number }>;
  personasOcupadas?: number;
  [field: string]: unknown;
}
export interface ReservationSlot {
  inicio: Date;
  fin: Date;
  duracionMinutos: number;
  idsOcupacion: string[];
  disponible: boolean;
  personasDisponibles: number;
  motivo?: string;
}

export function asDate(value: ReservaData['fechaInicio'] | unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

export function occupancyId(zoneId: string, date: Date, start: Date) {
  return `${zoneId}_${dateKey(date)}_${String(start.getHours()).padStart(2, '0')}${String(start.getMinutes()).padStart(2, '0')}`;
}

export function getZonePriceCents(zone: ZonaComun) {
  if (Number.isInteger(zone.precioCentimos) && Number(zone.precioCentimos) >= 0) return Number(zone.precioCentimos);
  const legacyHourlyPrice = Number(zone.costePorHora ?? zone.costoPorHora ?? 0);
  return Math.max(0, Math.round(legacyHourlyPrice * 100));
}

function dayRanges(zone: ZonaComun, date: Date) {
  return zone.horarioSemanal?.[String(date.getDay())] ?? [];
}

function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function makeDateAtMinute(date: Date, minute: number) {
  const result = new Date(date);
  result.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
  return result;
}

function allowedByHours(zone: ZonaComun, date: Date, startMinute: number, duration: number) {
  const endMinute = startMinute + duration;
  return dayRanges(zone, date).some((range) => {
    const from = Number(range.inicio.slice(0, 2)) * 60 + Number(range.inicio.slice(3, 5));
    const to = Number(range.fin.slice(0, 2)) * 60 + Number(range.fin.slice(3, 5));
    return startMinute >= from && endMinute <= to;
  });
}

function slotSegments(zone: ZonaComun, date: Date, start: Date, duration: number) {
  if (duration % RESERVATION_SLOT_STEP_MINUTES !== 0) throw new Error('La duración debe ser múltiplo de 30 minutos.');
  const ids: string[] = [];
  for (let offset = 0; offset < duration; offset += RESERVATION_SLOT_STEP_MINUTES) {
    const segmentStart = new Date(start.getTime() + offset * 60_000);
    ids.push(occupancyId(zone.id, date, segmentStart));
  }
  return ids;
}

export function buildReservationSlots(
  zone: ZonaComun,
  date: Date,
  duration: number,
  occupancies: ReservationOccupancy[],
  people = 1,
): ReservationSlot[] {
  if (!zone.reservaHabilitada || zone.modoDisponibilidad === 'sin_reserva') return [];
  if (!Number.isInteger(duration) || duration < 30 || duration % RESERVATION_SLOT_STEP_MINUTES !== 0) return [];
  if (zone.duracionesReservaMinutos?.length && !zone.duracionesReservaMinutos.includes(duration)) return [];

  const byId = new Map(occupancies.map((entry) => [entry.id, entry]));
  const step = Math.max(RESERVATION_SLOT_STEP_MINUTES, zone.pasoReservaMinutos || RESERVATION_SLOT_STEP_MINUTES);
  const slots: ReservationSlot[] = [];
  for (const range of dayRanges(zone, date)) {
    const rangeStart = Number(range.inicio.slice(0, 2)) * 60 + Number(range.inicio.slice(3, 5));
    const rangeEnd = Number(range.fin.slice(0, 2)) * 60 + Number(range.fin.slice(3, 5));
    for (let startMinute = rangeStart; startMinute + duration <= rangeEnd; startMinute += step) {
      const start = makeDateAtMinute(date, startMinute);
      if (start.getTime() <= Date.now()) continue;
      const end = new Date(start.getTime() + duration * 60_000);
      const ids = slotSegments(zone, date, start, duration);
      const segmentDocs = ids.map((id) => byId.get(id));
      const blocked = segmentDocs.some((entry) => entry?.bloqueada);
      const reservedPeople = segmentDocs.map((entry) => entry?.personasOcupadas ?? Object.values(entry?.reservas ?? {}).reduce((sum, item) => sum + Number(item.personas || 0), 0));
      const freePeople = zone.modoDisponibilidad === 'aforo'
        ? Math.max(0, (zone.capacidadMaxima || 0) - Math.max(0, ...reservedPeople))
        : reservedPeople.some((count) => count > 0) ? 0 : (zone.capacidadMaxima || 1);
      slots.push({
        inicio: start,
        fin: end,
        duracionMinutos: duration,
        idsOcupacion: ids,
        disponible: !blocked && freePeople >= people,
        personasDisponibles: freePeople,
        motivo: blocked ? segmentDocs.find((entry) => entry?.bloqueada)?.motivoBloqueo || 'Bloqueada por mantenimiento' : freePeople < people ? 'Aforo completo' : undefined,
      });
    }
  }
  return slots;
}

function makeDayLimitId(householdId: string, zoneId: string, date: Date) {
  return `${householdId}_${zoneId}_${dateKey(date)}`;
}

function activeReservationData(zone: ZonaComun, uid: string, householdId: string, communityId: string, requesterName: string, slot: ReservationSlot, people: number, method?: ReservationPaymentMethod) {
  const price = getZonePriceCents(zone);
  const free = price === 0;
  return {
    idVecino: uid,
    solicitanteNombre: requesterName,
    viviendaId: householdId,
    idComunidad: communityId,
    idZonaComun: zone.id,
    nombreZona: zone.nombre,
    fechaInicio: slot.inicio,
    fechaFin: slot.fin,
    fechaDia: dateKey(slot.inicio),
    duracionMinutos: slot.duracionMinutos,
    slotIds: slot.idsOcupacion,
    numeroPersonas: people,
    horasCancelacionMinima: Math.max(0, Number(zone.horasCancelacionMinima || 0)),
    costeTotalCentimos: price,
    costeTotal: price / 100,
    metodoPago: free ? 'no_aplica' : method,
    estado: free ? 'confirmada' : 'pendiente_confirmacion',
    estadoPago: free ? 'no_aplica' : 'simulado_pendiente_validacion',
    pagoSimulado: !free,
    creadoEn: serverTimestamp(),
  };
}

export async function createReservation(input: {
  db: Firestore;
  uid: string;
  householdId: string;
  communityId: string;
  requesterName: string;
  zone: ZonaComun;
  slot: ReservationSlot;
  people: number;
  paymentMethod?: ReservationPaymentMethod;
}) {
  const { db, uid, householdId, communityId, requesterName, zone, slot, people, paymentMethod } = input;
  const reservationRef = doc(collection(db, 'reservas'));
  const zoneRef = doc(db, 'zonasComunes', zone.id);
  // Never trust client-provided lock IDs: derive the complete interval again.
  const canonicalSlot = { ...slot, idsOcupacion: slotSegments(zone, slot.inicio, slot.inicio, slot.duracionMinutos) };
  const occupancyRefs = canonicalSlot.idsOcupacion.map((id) => doc(db, 'ocupacionesReservas', id));
  const profileRef = doc(db, 'vecinos', uid);

  await runTransaction(db, async (transaction) => {
    const zoneSnapshot = await transaction.get(zoneRef);
    const profileSnapshot = await transaction.get(profileRef);
    const residentData = profileSnapshot.data();
    const personal = (residentData?.datosPersonales || {}) as Record<string, unknown>;
    const canonicalHouseholdId = String(residentData?.idVivienda || residentData?.viviendaId || [personal.portal, personal.piso, personal.letra].filter(Boolean).join('-') || uid);
    if (!profileSnapshot.exists() || residentData?.idComunidad !== communityId || canonicalHouseholdId !== householdId) throw new Error('No hemos podido verificar la vivienda de tu perfil. Actualiza los datos e inténtalo de nuevo.');
    const zoneData = zoneSnapshot.data() as ZonaComun | undefined;
    if (!zoneSnapshot.exists() || !zoneData || zoneData.idComunidad !== communityId || zoneData.activa === false || !zoneData.reservaHabilitada || zoneData.modoDisponibilidad === 'sin_reserva') {
      throw new Error('Esta zona ya no admite reservas. Actualiza la página e inténtalo de nuevo.');
    }
    const occupancySnapshots = await Promise.all(occupancyRefs.map((ref) => transaction.get(ref)));
    const limitRef = doc(db, 'limitesReservas', makeDayLimitId(canonicalHouseholdId, zone.id, slot.inicio));
    const limitSnapshot = limitRef ? await transaction.get(limitRef) : null;
    const price = getZonePriceCents(zoneData);
    if (price > 0 && !paymentMethod) throw new Error('Selecciona un método de pago para continuar.');
    if (!Number.isInteger(people) || people < 1 || people > (zoneData.maxPersonasPorReserva || zoneData.capacidadMaxima || 1)) throw new Error('El número de asistentes supera el máximo de esta zona.');
    if (!allowedByHours(zoneData, slot.inicio, minutesOfDay(slot.inicio), slot.duracionMinutos)) throw new Error('La franja seleccionada está fuera del horario configurado.');
    if (!(zoneData.duracionesReservaMinutos || [slot.duracionMinutos]).includes(slot.duracionMinutos)) throw new Error('La duración elegida ya no está disponible.');
    if (slot.inicio.getTime() <= Date.now()) throw new Error('La hora seleccionada ya ha pasado.');
    const data = activeReservationData(zoneData, uid, householdId, communityId, requesterName, canonicalSlot, people, paymentMethod);

    if (limitSnapshot) {
      const usedMinutes = Number(limitSnapshot.get('minutosReservados') || 0);
      const usedPeople = Number(limitSnapshot.get('personasReservadas') || 0);
      if (zoneData.limiteDiarioMinutos && usedMinutes + slot.duracionMinutos > zoneData.limiteDiarioMinutos) throw new Error('Has alcanzado el límite diario de tiempo para esta zona.');
      if (zoneData.limiteDiarioPersonas && usedPeople + people > zoneData.limiteDiarioPersonas) throw new Error(`Esta vivienda solo puede reservar ${zoneData.limiteDiarioPersonas} pases al día.`);
    }

    const currentCounts = occupancySnapshots.map((snapshot) => {
      if (!snapshot.exists()) return 0;
      if (snapshot.get('bloqueada') === true) throw new Error('La franja acaba de bloquearse por mantenimiento. Elige otra.');
      const count = Number(snapshot.get('personasOcupadas') || 0);
      if (zoneData.modoDisponibilidad !== 'aforo' && count > 0) throw new Error('La franja acaba de reservarse. Elige otra.');
      if (zoneData.modoDisponibilidad === 'aforo' && count + people > (zoneData.capacidadMaxima || 0)) throw new Error('Ya no quedan plazas suficientes en ese horario.');
      return count;
    });
    const peak = Math.max(0, ...currentCounts);
    if (zoneData.modoDisponibilidad === 'aforo' && peak + people > (zoneData.capacidadMaxima || 0)) throw new Error('Ya no quedan plazas suficientes en ese horario.');

    transaction.set(reservationRef, data);
    occupancySnapshots.forEach((snapshot, index) => {
      const existingReservations = (snapshot.data()?.reservas || {}) as Record<string, { uid: string; personas: number }>;
      transaction.set(occupancyRefs[index], {
        idComunidad: communityId,
        idZonaComun: zone.id,
        fechaDia: dateKey(slot.inicio),
        inicioFranja: new Date(slot.inicio.getTime() + index * RESERVATION_SLOT_STEP_MINUTES * 60_000),
        personasOcupadas: (Number(snapshot.get('personasOcupadas') || 0) + people),
        reservas: { ...existingReservations, [reservationRef.id]: { uid, personas: people } },
        actualizadaEn: serverTimestamp(),
      });
    });
    {
      transaction.set(limitRef, {
        idComunidad: communityId,
        uid,
        viviendaId: canonicalHouseholdId,
        idZonaComun: zone.id,
        fechaDia: dateKey(slot.inicio),
        minutosReservados: Number(limitSnapshot?.get('minutosReservados') || 0) + slot.duracionMinutos,
        personasReservadas: Number(limitSnapshot?.get('personasReservadas') || 0) + people,
        reservas: { ...(limitSnapshot?.data()?.reservas as Record<string, number> || {}), [reservationRef.id]: slot.duracionMinutos },
        personasPorReserva: { ...(limitSnapshot?.data()?.personasPorReserva as Record<string, number> || {}), [reservationRef.id]: people },
      });
    }
  });

  return { id: reservationRef.id, costCents: getZonePriceCents(zone), status: getZonePriceCents(zone) === 0 ? 'confirmada' : 'pendiente_confirmacion' };
}

async function releaseReservationLocks(transaction: Transaction, db: Firestore, reservation: ReservaData & DocumentData, reservationId: string) {
  const slotIds = Array.isArray(reservation.slotIds) ? reservation.slotIds : [];
  const refs = slotIds.map((id) => doc(db, 'ocupacionesReservas', id));
  const quotaRef = reservation.fechaInicio && reservation.fechaDia && reservation.idZonaComun && reservation.viviendaId
    ? doc(db, 'limitesReservas', makeDayLimitId(String(reservation.viviendaId), String(reservation.idZonaComun), asDate(reservation.fechaInicio) || new Date()))
    : null;
  const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));
  const quotaSnapshot = quotaRef ? await transaction.get(quotaRef) : null;
  snapshots.forEach((snapshot, index) => {
    if (!snapshot.exists()) return;
    const reservations = { ...(snapshot.data().reservas || {}) } as Record<string, { uid: string; personas: number }>;
    const removed = reservations[reservationId];
    if (!removed) return;
    delete reservations[reservationId];
    const count = Math.max(0, Number(snapshot.get('personasOcupadas') || 0) - Number(removed.personas || 0));
    transaction.update(refs[index], { reservas: reservations, personasOcupadas: count, actualizadaEn: serverTimestamp() });
  });
  if (quotaRef && quotaSnapshot?.exists()) {
    const reservations = { ...(quotaSnapshot.data().reservas || {}) } as Record<string, number>;
    const released = Number(reservations[reservationId] || 0);
    delete reservations[reservationId];
    const peopleByReservation = { ...(quotaSnapshot.data().personasPorReserva || {}) } as Record<string, number>;
    const peopleReleased = Number(peopleByReservation[reservationId] || 0);
    delete peopleByReservation[reservationId];
    const minutes = Math.max(0, Number(quotaSnapshot.get('minutosReservados') || 0) - released);
    const people = Math.max(0, Number(quotaSnapshot.get('personasReservadas') || 0) - peopleReleased);
    transaction.update(quotaRef, { reservas: reservations, personasPorReserva: peopleByReservation, minutosReservados: minutes, personasReservadas: people });
  }
}

export async function cancelReservation(db: Firestore, reservationId: string, actorUid: string, isManager: boolean) {
  const reservationRef = doc(db, 'reservas', reservationId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reservationRef);
    if (!snapshot.exists()) throw new Error('La reserva ya no existe.');
    const reservation = { id: snapshot.id, ...snapshot.data() } as ReservaData & DocumentData;
    if (!isManager && reservation.idVecino !== actorUid) throw new Error('No puedes cancelar esta reserva.');
    if (!['confirmada', 'pendiente_confirmacion', 'pendiente_pago'].includes(String(reservation.estado))) throw new Error('Esta reserva ya no se puede cancelar.');
    if (!isManager && Number(reservation.horasCancelacionMinima || 0) > 0) {
      const start = asDate(reservation.fechaInicio);
      if (start && start.getTime() - Date.now() < Number(reservation.horasCancelacionMinima) * 60 * 60_000) throw new Error('Ya no se puede cancelar con tan poca antelación.');
    }
    await releaseReservationLocks(transaction, db, reservation, reservationId);
    transaction.update(reservationRef, { estado: 'cancelada', canceladaPorUid: actorUid, fechaActualizacion: serverTimestamp() });
  });
}

export async function confirmReservationPayment(db: Firestore, reservationId: string, managerUid: string, approve: boolean) {
  const reservationRef = doc(db, 'reservas', reservationId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reservationRef);
    if (!snapshot.exists()) throw new Error('La solicitud de reserva ya no existe.');
    const reservation = { id: snapshot.id, ...snapshot.data() } as ReservaData & DocumentData;
    if (reservation.estado !== 'pendiente_confirmacion') throw new Error('Esta solicitud ya fue revisada.');
    if (!approve) await releaseReservationLocks(transaction, db, reservation, reservationId);
    transaction.update(reservationRef, {
      estado: approve ? 'confirmada' : 'rechazada',
      estadoPago: approve ? 'simulado_confirmado' : 'simulado_rechazado',
      pagoConfirmadoPorUid: managerUid,
      pagoConfirmadoEn: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
    });
  });
}

export async function setReservationSlotBlock(input: {
  db: Firestore;
  communityId: string;
  zone: ZonaComun;
  slot: ReservationSlot;
  actorUid: string;
  reason: string;
  blocked: boolean;
}) {
  const { db, communityId, zone, slot, actorUid, reason, blocked } = input;
  const refs = slot.idsOcupacion.map((id) => doc(db, 'ocupacionesReservas', id));
  await runTransaction(db, async (transaction) => {
    const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));
    if (blocked && snapshots.some((snapshot) => snapshot.exists() && Number(snapshot.get('personasOcupadas') || 0) > 0)) {
      throw new Error('No se puede bloquear una franja que ya tiene reservas activas.');
    }
    snapshots.forEach((snapshot, index) => {
      if (!blocked && (!snapshot.exists() || snapshot.get('bloqueada') !== true)) return;
      const start = new Date(slot.inicio.getTime() + index * RESERVATION_SLOT_STEP_MINUTES * 60_000);
      if (blocked) transaction.set(refs[index], {
        idComunidad: communityId, idZonaComun: zone.id, fechaDia: dateKey(slot.inicio), inicioFranja: start,
        personasOcupadas: 0, reservas: {}, bloqueada: true, motivoBloqueo: reason.trim(),
        bloqueadaPorUid: actorUid, actualizadaEn: serverTimestamp(),
      });
      else transaction.delete(refs[index]);
    });
  });
}

export async function loadDailyOccupancies(db: Firestore, communityId: string, zoneId: string, date: Date) {
  const snapshot = await getDocs(query(
    collection(db, 'ocupacionesReservas'),
    where('idComunidad', '==', communityId),
    where('idZonaComun', '==', zoneId),
    where('fechaDia', '==', dateKey(date)),
  ));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as ReservationOccupancy));
}
