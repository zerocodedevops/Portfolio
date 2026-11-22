import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { collection, onSnapshot, query, where } from '../demo/demoStore';
import { useOutletContext } from 'react-router-dom';
import { BanknotesIcon, BuildingLibraryIcon, CalendarDaysIcon, CheckCircleIcon, ClockIcon, CreditCardIcon, DevicePhoneMobileIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { ReservaData, VecinoOutletContext, ZonaComun } from '../types/domain';
import { notifyAdministrators, notifyReservationOwner } from '../services/notificacionesService';
import { asDate, buildReservationSlots, cancelReservation, confirmReservationPayment, createReservation, dateKey, MAX_RESERVATION_DAYS_AHEAD, PAYMENT_METHODS, type ReservationOccupancy, type ReservationPaymentMethod, type ReservationSlot } from '../services/reservasService';
import { resolveReservationZonePhoto } from '../services/reservasStorage';
import { canManageReservations } from '../utils/residentRoles';
import GestionZonasReservables from '../components/reservas/GestionZonasReservables';

const twoDigits = (value: number) => String(value).padStart(2, '0');
const localDateValue = (date: Date) => `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
const money = (cents: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const formatTime = (date: Date) => `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
const formatDateTime = (value: ReservaData['fechaInicio']) => {
  const date = asDate(value);
  return date ? new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(date) : 'Fecha pendiente';
};

function paymentIcon(method: ReservationPaymentMethod) {
  if (method === 'transferencia') return <BuildingLibraryIcon aria-hidden="true" className="h-5 w-5" />;
  if (method === 'bizum') return <DevicePhoneMobileIcon aria-hidden="true" className="h-5 w-5" />;
  if (method === 'tarjeta') return <CreditCardIcon aria-hidden="true" className="h-5 w-5" />;
  return <BanknotesIcon aria-hidden="true" className="h-5 w-5" />;
}

function stateLabel(reservation: ReservaData) {
  const state = String(reservation.estado || '').toLocaleLowerCase('es');
  if (state === 'confirmada') return 'Confirmada';
  if (state === 'pendiente_confirmacion' || state === 'pendiente_pago') return 'Pendiente de Administración';
  if (state === 'cancelada' || state === 'cancelado') return 'Cancelada';
  if (state === 'rechazada') return 'No aprobada';
  if (state === 'completada') return 'Completada';
  return 'Pendiente de revisión';
}

function stateTone(reservation: ReservaData) {
  const state = String(reservation.estado || '').toLocaleLowerCase('es');
  if (state === 'confirmada' || state === 'completada') return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200';
  if (state === 'cancelada' || state === 'rechazada') return 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200';
  return 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200';
}

function readErrorMessage(error: unknown, context: 'own' | 'management') {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (code === 'permission-denied') return context === 'management'
    ? 'Firestore aún no permite a la Junta revisar las reservas de toda la comunidad. Hay que publicar las reglas actualizadas.'
    : 'Firestore ha rechazado la lectura de tus reservas. Comprueba que tu cuenta siga vinculada a esta comunidad.';
  if (code === 'failed-precondition') return 'Falta publicar el índice de Firestore necesario para esta consulta.';
  return 'No se pudieron cargar los datos. Comprueba la conexión e inténtalo de nuevo.';
}

function Reservas() {
  const [resident] = useOutletContext<VecinoOutletContext>();
  const uid = auth.currentUser?.uid || resident?.uid || '';
  const communityId = resident?.idComunidad || '';
  const personal = resident?.datosPersonales;
  const canManage = canManageReservations(resident, auth.currentUser?.email);
  const householdId = String(resident?.idVivienda || resident?.viviendaId || [personal?.portal, personal?.piso, personal?.letra].filter(Boolean).join('-') || uid);
  const [zones, setZones] = useState<ZonaComun[]>([]);
  const [reservations, setReservations] = useState<ReservaData[]>([]);
  const [communityReservations, setCommunityReservations] = useState<ReservaData[]>([]);
  const [reservationsError, setReservationsError] = useState('');
  const [managementError, setManagementError] = useState('');
  const [occupancies, setOccupancies] = useState<ReservationOccupancy[]>([]);
  const [zonePhotos, setZonePhotos] = useState<Record<string, string>>({});
  const [selectedZone, setSelectedZone] = useState<ZonaComun | null>(null);
  const [selectedDateValue, setSelectedDateValue] = useState(localDateValue(new Date()));
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<ReservationSlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<ReservationPaymentMethod | ''>('');
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!communityId) { setZones([]); setLoadingZones(false); return undefined; }
    setLoadingZones(true);
    return onSnapshot(query(collection(db, 'zonasComunes'), where('idComunidad', '==', communityId)), (snapshot) => {
      setZones(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ZonaComun).filter((zone) => zone.activa !== false).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
      setLoadingZones(false);
    }, (error) => { console.error('No se pudieron cargar los espacios comunitarios:', error); setLoadingZones(false); toast.error('No se pudieron cargar las zonas comunitarias.'); });
  }, [communityId]);

  useEffect(() => {
    if (!communityId || !uid) { setReservations([]); setLoadingReservations(false); return undefined; }
    setLoadingReservations(true);
    return onSnapshot(query(collection(db, 'reservas'), where('idComunidad', '==', communityId), where('idVecino', '==', uid)), (snapshot) => {
      setReservations(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ReservaData).sort((a, b) => (asDate(b.fechaInicio)?.getTime() || 0) - (asDate(a.fechaInicio)?.getTime() || 0)));
      setReservationsError('');
      setLoadingReservations(false);
    }, (error) => { console.error('No se pudieron cargar tus reservas:', error); setReservationsError(readErrorMessage(error, 'own')); setLoadingReservations(false); });
  }, [communityId, uid]);

  useEffect(() => {
    if (!communityId || !canManage) { setCommunityReservations([]); return undefined; }
    setManagementError('');
    return onSnapshot(query(collection(db, 'reservas'), where('idComunidad', '==', communityId)), (snapshot) => {
      setCommunityReservations(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ReservaData));
      setManagementError('');
    }, (error) => { console.error('No se pudieron cargar las solicitudes de reserva:', error); setManagementError(readErrorMessage(error, 'management')); });
  }, [communityId, canManage]);

  useEffect(() => {
    let mounted = true;
    const entries = zones.filter((zone) => zone.fotoUrl);
    void Promise.all(entries.map(async (zone) => {
      try { return [zone.id, await resolveReservationZonePhoto(String(zone.fotoUrl))] as const; }
      catch (error) { console.warn(`No se pudo abrir la foto de ${zone.nombre}:`, error); return [zone.id, ''] as const; }
    })).then((resolved) => { if (mounted) setZonePhotos(Object.fromEntries(resolved)); });
    return () => { mounted = false; };
  }, [zones]);

  const selectedDate = useMemo(() => new Date(`${selectedDateValue}T00:00:00`), [selectedDateValue]);
  useEffect(() => {
    if (!communityId || !selectedZone || !selectedDateValue) { setOccupancies([]); return undefined; }
    const day = new Date(`${selectedDateValue}T00:00:00`);
    const q = query(collection(db, 'ocupacionesReservas'), where('idComunidad', '==', communityId), where('idZonaComun', '==', selectedZone.id), where('fechaDia', '==', dateKey(day)));
    return onSnapshot(q, (snapshot) => setOccupancies(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ReservationOccupancy)), (error) => { console.error('No se pudo consultar la disponibilidad:', error); toast.error('No se pudo consultar la disponibilidad de esa fecha.'); });
  }, [communityId, selectedZone, selectedDateValue]);

  const durations = selectedZone?.duracionesReservaMinutos?.length ? selectedZone.duracionesReservaMinutos : [selectedZone?.franjaMinutos as number || 60];
  const priceCents = Math.max(0, Number(selectedZone?.precioCentimos ?? Math.round(Number(selectedZone?.costePorHora || selectedZone?.costoPorHora || 0) * 100)));
  const candidates = useMemo(() => selectedZone ? buildReservationSlots(selectedZone, selectedDate, selectedDuration, occupancies, selectedPeople) : [], [selectedZone, selectedDate, selectedDuration, occupancies, selectedPeople]);
  const availableSlots = candidates.filter((slot) => slot.disponible);
  const today = localDateValue(new Date());
  const lastReservableDate = new Date();
  lastReservableDate.setDate(lastReservableDate.getDate() + MAX_RESERVATION_DAYS_AHEAD);
  const maxDate = localDateValue(lastReservableDate);

  function chooseZone(zone: ZonaComun) {
    setSelectedZone(zone);
    setSelectedSlot(null);
    const firstDuration = zone.duracionesReservaMinutos?.[0] || Number(zone.franjaMinutos || 60);
    setSelectedDuration(firstDuration);
    setSelectedPeople(1);
    setPaymentMethod('');
  }

  async function handleCreateReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid || !communityId || !selectedZone || !selectedSlot) { toast.error('Selecciona una zona y una franja disponible.'); return; }
    if (priceCents > 0 && !paymentMethod) { toast.error('Elige cómo quieres simular el pago.'); return; }
    setSaving(true);
    try {
      const requesterName = [personal?.nombre, personal?.apellidos].filter(Boolean).join(' ').trim() || 'Vecino';
      const created = await createReservation({ db, uid, householdId, communityId, requesterName, zone: selectedZone, slot: selectedSlot, people: selectedPeople, paymentMethod: paymentMethod || undefined });
      if (created.status === 'pendiente_confirmacion') {
        void notifyAdministrators({
          communityId, actorUid: uid, title: 'Nueva solicitud de reserva',
          description: `${selectedZone.nombre} · ${formatDateTime(selectedSlot.inicio)} · ${money(created.costCents)} · pago simulado pendiente de validación`,
          route: '/dashboard/reservas', sourceId: created.id,
        }).catch((error) => console.error('No se pudo notificar la solicitud de reserva:', error));
        toast.success('Solicitud enviada. El pago queda simulado y Administración debe validar la reserva.');
      } else {
        toast.success('Reserva gratuita confirmada al instante.');
      }
      setSelectedSlot(null);
      setSelectedZone(null);
    } catch (error) {
      console.error('No se pudo crear la reserva:', error);
      toast.error(error instanceof Error ? error.message : 'No se pudo completar la reserva. Actualiza la disponibilidad e inténtalo de nuevo.');
    } finally { setSaving(false); }
  }

  async function reviewPayment(reservation: ReservaData, approve: boolean) {
    if (!uid) return;
    try {
      await confirmReservationPayment(db, reservation.id, uid, approve);
      toast.success(approve ? 'Pago simulado validado y reserva confirmada.' : 'Solicitud rechazada y franja liberada.');
      void notifyReservationOwner({
        communityId,
        actorUid: uid,
        recipientUid: String(reservation.idVecino || ''),
        reservationId: reservation.id,
        title: approve ? 'Reserva confirmada' : 'Solicitud de reserva no aprobada',
        description: approve ? `${reservation.nombreZona || 'La zona reservada'}: pago simulado validado y reserva confirmada.` : `${reservation.nombreZona || 'La zona solicitada'}: la Administración no ha validado el pago; la franja vuelve a estar disponible.`,
      }).catch((error) => console.error('La reserva se revisó, pero no se pudo enviar la notificación al vecino:', error));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo revisar la solicitud.');
    }
  }

  return <div className="reservas-page mx-auto w-full max-w-7xl space-y-8 p-4 text-slate-900 dark:text-zinc-100 sm:p-6 lg:p-8">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-300">Comunidad · Espacios compartidos</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Reservas comunitarias</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">Consulta disponibilidad real y reserva una franja. Los espacios gratuitos se confirman al instante; los de pago requieren validación de la Junta o Administración.</p></div>
      <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800"><CalendarDaysIcon aria-hidden="true" className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /><span>Reserva con hasta {MAX_RESERVATION_DAYS_AHEAD} días de antelación</span></div>
    </header>

    <section aria-labelledby="reservable-zones-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 id="reservable-zones-title" className="text-xl font-bold">Espacios de la comunidad</h2><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Fotos y condiciones del recurso activo.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">{zones.length} {zones.length === 1 ? 'espacio' : 'espacios'}</span></div>
      {loadingZones ? <p className="rounded-2xl bg-white p-8 text-center text-sm dark:bg-zinc-900">Cargando espacios…</p> : zones.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-300">Todavía no hay zonas configuradas para esta comunidad.</p> : <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {zones.map((zone) => {
          const cents = Math.max(0, Number(zone.precioCentimos ?? Math.round(Number(zone.costePorHora || zone.costoPorHora || 0) * 100)));
          const bookingEnabled = zone.reservaHabilitada !== false && zone.modoDisponibilidad !== 'sin_reserva';
          const ranges = zone.horarioSemanal?.[String(new Date(`${today}T12:00:00`).getDay())] || [];
          return <article key={zone.id} className={`flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-zinc-900 sm:rounded-2xl ${selectedZone?.id === zone.id ? 'border-emerald-700 ring-2 ring-emerald-100 dark:border-emerald-400 dark:ring-emerald-950' : 'border-slate-200 dark:border-zinc-800'}`}>
            <div className="relative h-32 bg-slate-100 dark:bg-zinc-800 sm:h-40 xl:h-48">{zonePhotos[zone.id] ? <img src={zonePhotos[zone.id]} alt={zone.nombre} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-400"><MapPinIcon aria-hidden="true" className="h-10 w-10 sm:h-12 sm:w-12" /></div>}<span className="absolute left-2 top-2 max-w-[58%] truncate rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-900 shadow sm:left-3 sm:top-3 sm:max-w-none sm:px-3 sm:text-xs">{cents ? `${money(cents)}${zone.tipoPrecio === 'fianza' ? ' · fianza' : ''}` : 'Gratuito'}</span><span className="absolute right-2 top-2 rounded-full bg-emerald-950/85 px-2 py-1 text-[10px] font-semibold text-white sm:right-3 sm:top-3 sm:px-3 sm:text-xs">{bookingEnabled ? <><span className="sm:hidden">Reserva</span><span className="hidden sm:inline">Reserva disponible</span></> : <><span className="sm:hidden">Libre</span><span className="hidden sm:inline">Acceso libre</span></>}</span></div>
            <div className="flex flex-1 flex-col p-3 sm:p-4"><h3 className="text-base font-bold leading-5 sm:text-lg sm:leading-6">{zone.nombre}</h3>{zone.ubicacion && <p className="mt-1 flex items-start gap-1 text-[11px] leading-4 text-slate-500 dark:text-zinc-400 sm:text-xs"><MapPinIcon aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />{zone.ubicacion}</p>}<p className="mt-2 line-clamp-3 flex-1 text-xs leading-4 text-slate-600 dark:text-zinc-300 sm:mt-3 sm:text-sm sm:leading-5">{zone.descripcion}</p><p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 sm:mt-3 sm:text-xs">Aforo total: {zone.capacidadMaxima || '—'}</p>{Array.isArray(zone.caracteristicas) && zone.caracteristicas.length > 0 && <ul className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">{zone.caracteristicas.slice(0, 2).map((feature) => <li key={feature} className="max-w-full truncate rounded-md bg-slate-100 px-1.5 py-1 text-[10px] leading-3 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 sm:px-2 sm:text-xs">{feature}</li>)}</ul>}<div className="mt-2 grid gap-1 border-t border-slate-100 pt-2 text-[11px] text-slate-600 dark:border-zinc-800 dark:text-zinc-400 sm:mt-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1 sm:pt-3 sm:text-xs"><span className="inline-flex min-w-0 items-center gap-1"><ClockIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" /><span className="truncate">{ranges.length ? ranges.map((range) => `${range.inicio}–${range.fin}`).join(' · ') : 'Horario por consultar'}</span></span><span className="inline-flex items-center gap-1"><UsersIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />Hasta {zone.maxPersonasPorReserva || zone.capacidadMaxima || '—'} personas</span></div>{zone.reglasUso && <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-zinc-400 sm:text-xs sm:leading-5">{zone.reglasUso}</p>}<button type="button" disabled={!bookingEnabled} onClick={() => chooseZone(zone)} className="mt-3 min-h-10 w-full rounded-lg bg-slate-950 px-2 text-xs font-bold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 sm:mt-4 sm:min-h-11 sm:px-4 sm:text-sm">{bookingEnabled ? <><span className="sm:hidden">Reservar</span><span className="hidden sm:inline">Elegir día y hora</span></> : <><span className="sm:hidden">Acceso libre</span><span className="hidden sm:inline">No requiere reserva</span></>}</button></div>
          </article>;
        })}
      </div>}
    </section>

    {selectedZone && <section aria-labelledby="availability-title" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Disponibilidad en tiempo real</p><h2 id="availability-title" className="mt-1 text-2xl font-bold">{selectedZone.nombre}</h2><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Las franjas ocupadas o bloqueadas se retiran de la selección. La reserva se verifica de nuevo al confirmarla.</p></div><button type="button" onClick={() => { setSelectedZone(null); setSelectedSlot(null); }} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-zinc-700 dark:hover:bg-zinc-800">Cerrar</button></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">Día<input type="date" min={today} max={maxDate} value={selectedDateValue} onChange={(event) => { setSelectedDateValue(event.target.value); setSelectedSlot(null); }} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" /></label>
        <label className="text-sm font-semibold">Duración<select value={selectedDuration} onChange={(event) => { setSelectedDuration(Number(event.target.value)); setSelectedSlot(null); }} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950">{durations.map((duration) => <option key={duration} value={duration}>{duration >= 60 ? `${Math.floor(duration / 60)} h${duration % 60 ? ` ${duration % 60} min` : ''}` : `${duration} min`}</option>)}</select></label>
        {selectedZone.modoDisponibilidad === 'aforo' && <label className="text-sm font-semibold">Personas<select value={selectedPeople} onChange={(event) => { setSelectedPeople(Number(event.target.value)); setSelectedSlot(null); }} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950">{Array.from({ length: Math.max(1, Math.min(selectedZone.maxPersonasPorReserva || selectedZone.capacidadMaxima || 1, 12)) }, (_, index) => index + 1).map((number) => <option key={number} value={number}>{number}</option>)}</select></label>}
      </div>
      <div className="mt-5"><h3 className="font-bold">Franjas del {new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate)}</h3>{availableSlots.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{availableSlots.map((slot) => <button key={slot.inicio.toISOString()} type="button" aria-pressed={selectedSlot?.inicio.getTime() === slot.inicio.getTime()} onClick={() => setSelectedSlot(slot)} className={`flex min-h-12 items-center justify-between rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 ${selectedSlot?.inicio.getTime() === slot.inicio.getTime() ? 'border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-300 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 hover:border-emerald-600 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800'}`}><span>{formatTime(slot.inicio)}–{formatTime(slot.fin)}</span><span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{selectedZone.modoDisponibilidad === 'aforo' ? `${slot.personasDisponibles} plazas` : 'Disponible'}</span></button>)}</div> : <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-zinc-950 dark:text-zinc-400">No hay franjas disponibles para este día, duración y aforo. Prueba otra fecha.</p>}</div>
      {selectedSlot && <form onSubmit={(event) => void handleCreateReservation(event)} className="mt-6 border-t border-slate-200 pt-5 dark:border-zinc-800"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">{formatTime(selectedSlot.inicio)}–{formatTime(selectedSlot.fin)} · {selectedPeople} {selectedPeople === 1 ? 'persona' : 'personas'}</p><p className="mt-1 text-lg font-bold">{priceCents ? `${money(priceCents)}${selectedZone.tipoPrecio === 'fianza' ? ' de fianza' : ''}` : 'Sin coste'}</p></div><CheckCircleIcon aria-hidden="true" className="h-7 w-7 text-emerald-700 dark:text-emerald-300" /></div>
        {priceCents > 0 && <fieldset className="mt-5"><legend className="text-sm font-bold">Método de pago de demostración</legend><p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">No se realizará ningún cobro real. Administración confirmará el pago y la reserva.</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{PAYMENT_METHODS.map((method) => <label key={method.id} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${paymentMethod === method.id ? 'border-emerald-700 bg-emerald-50 dark:border-emerald-300 dark:bg-emerald-950' : 'border-slate-200 dark:border-zinc-700'}`}><input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="h-4 w-4 accent-emerald-800" />{paymentIcon(method.id)}<span>{method.label}</span></label>)}</div><p className="sr-only">Iconos de métodos de pago: transferencia bancaria, Bizum, tarjeta y efectivo en conserjería.</p></fieldset>}
        <button type="submit" disabled={saving || (priceCents > 0 && !paymentMethod)} className="mt-5 min-h-12 w-full rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{saving ? 'Comprobando disponibilidad…' : priceCents ? 'Enviar solicitud y simular pago' : 'Confirmar reserva gratuita'}</button>
      </form>}
    </section>}

    <section aria-labelledby="my-reservations-title" className="space-y-3">
      <div className="flex items-end justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Tu actividad</p><h2 id="my-reservations-title" className="mt-1 text-xl font-bold">Mis reservas</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-zinc-800">{reservations.length}</span></div>
      {reservationsError ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{reservationsError}</p> : loadingReservations ? <p className="rounded-xl bg-white p-5 text-sm dark:bg-zinc-900">Cargando tus reservas…</p> : reservations.length === 0 ? <p className="rounded-xl bg-white p-5 text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">Aún no tienes reservas registradas.</p> : <div className="grid gap-3 lg:grid-cols-2">{reservations.map((reservation) => {
        const canCancel = ['confirmada', 'pendiente_confirmacion', 'pendiente_pago'].includes(String(reservation.estado));
        const start = asDate(reservation.fechaInicio);
        const noticeHours = Number(reservation.horasCancelacionMinima || 0);
        const cancellationWindowPassed = Boolean(start && noticeHours > 0 && start.getTime() - Date.now() < noticeHours * 60 * 60_000);
        return <article key={reservation.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{reservation.nombreZona || zones.find((zone) => zone.id === reservation.idZonaComun)?.nombre || 'Espacio comunitario'}</h3><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{formatDateTime(reservation.fechaInicio)} · {formatTime(asDate(reservation.fechaFin) || new Date())}</p><p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{Number(reservation.numeroPersonas || 1)} {Number(reservation.numeroPersonas || 1) === 1 ? 'persona' : 'personas'} · {Number(reservation.costeTotalCentimos ?? Math.round(Number(reservation.costeTotal || 0) * 100)) ? money(Number(reservation.costeTotalCentimos ?? Math.round(Number(reservation.costeTotal || 0) * 100))) : 'Gratuita'}{reservation.metodoPago && reservation.metodoPago !== 'no_aplica' ? ` · ${PAYMENT_METHODS.find((item) => item.id === reservation.metodoPago)?.label || reservation.metodoPago}` : ''}</p>{reservation.pagoSimulado && <p className="mt-1 text-xs font-semibold text-amber-800 dark:text-amber-300">Pago simulado; pendiente de confirmación, sin cobro real.</p>}</div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${stateTone(reservation)}`}>{stateLabel(reservation)}</span></div>{canCancel && <button type="button" disabled={cancellationWindowPassed} onClick={async () => { if (!window.confirm('¿Cancelar esta reserva? La franja se liberará para el resto de vecinos.')) return; try { await cancelReservation(db, reservation.id, uid, false); toast.success('Reserva cancelada y franja liberada.'); } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo cancelar la reserva.'); } }} className="mt-3 min-h-9 rounded-lg border border-rose-300 px-3 text-xs font-bold text-rose-800 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950">{cancellationWindowPassed ? `Cancelación cerrada (${noticeHours} h antes)` : 'Cancelar reserva'}</button>}</article>;
      })}</div>}
    </section>
    <p className="text-xs leading-5 text-slate-500 dark:text-zinc-500">Las reservas de pago quedan pendientes hasta que Administración o la Junta valide el pago simulado. Los cobros reales se integrarán más adelante.</p>
    {canManage && <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><summary className="cursor-pointer list-none text-lg font-bold marker:hidden"><span>Gestionar zonas y solicitudes</span><span className="ml-2 text-sm font-medium text-slate-500 dark:text-zinc-400">{communityReservations.filter((item) => item.estado === 'pendiente_confirmacion').length} pagos pendientes</span></summary><div className="mt-5 space-y-6">{managementError ? <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">{managementError}</p> : <section aria-labelledby="pending-reservations-title" className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/70 dark:bg-amber-950/20"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">Revisión de pagos simulados</p><h2 id="pending-reservations-title" className="mt-1 text-xl font-bold">Solicitudes pendientes</h2></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold dark:bg-zinc-900">{communityReservations.filter((item) => item.estado === 'pendiente_confirmacion').length}</span></div>{communityReservations.filter((item) => item.estado === 'pendiente_confirmacion').length === 0 ? <p className="text-sm text-slate-600 dark:text-zinc-300">No hay pagos pendientes de validar.</p> : <div className="grid gap-3 lg:grid-cols-2">{communityReservations.filter((item) => item.estado === 'pendiente_confirmacion').map((reservation) => <article key={reservation.id} className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900 dark:bg-zinc-900"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{reservation.nombreZona || 'Zona comunitaria'}</h3><p className="mt-1 text-sm">{formatDateTime(reservation.fechaInicio)} · {money(Number(reservation.costeTotalCentimos || 0))}</p><p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">Solicita: {reservation.solicitanteNombre || 'Vecino'} · Vivienda: {reservation.viviendaId || 'No indicada'} · {PAYMENT_METHODS.find((item) => item.id === reservation.metodoPago)?.label || reservation.metodoPago}</p><p className="mt-1 text-xs text-amber-800 dark:text-amber-300">Simulación sin cobro real: valida el pago recibido por el medio indicado.</p></div><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-100">Pendiente</span></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void reviewPayment(reservation, true)} className="min-h-10 rounded-lg bg-emerald-800 px-3 text-sm font-bold text-white hover:bg-emerald-900">Validar pago y confirmar</button><button type="button" onClick={() => void reviewPayment(reservation, false)} className="min-h-10 rounded-lg border border-rose-300 px-3 text-sm font-bold text-rose-800 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950">Rechazar y liberar franja</button></div></article>)}</div>}</section>}<GestionZonasReservables communityId={communityId} resident={resident} /></div></details>}
  </div>;
}

export default Reservas;
