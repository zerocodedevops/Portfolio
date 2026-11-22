import { useEffect, useState, type FormEvent } from 'react';
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from '../../demo/demoStore';
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { auth } from '../../demo/demoAuth';
import { db } from '../../demo/demoStore';
import type { VecinoData, ZonaComun } from '../../types/domain';
import { canManageReservations } from '../../utils/residentRoles';
import { removeReservationZonePhoto, resolveReservationZonePhoto, uploadReservationZonePhoto } from '../../services/reservasStorage';

const days = [
  { id: 1, label: 'Lunes' }, { id: 2, label: 'Martes' }, { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' }, { id: 5, label: 'Viernes' }, { id: 6, label: 'Sábado' }, { id: 0, label: 'Domingo' },
];
type Range = { inicio: string; fin: string };
type Schedule = Record<string, Range[]>;

function defaultSchedule(from = '08:00', to = '22:00'): Schedule {
  return Object.fromEntries(days.map(({ id }) => [String(id), [{ inicio: from, fin: to }]]));
}

function normalizeSchedule(zone?: ZonaComun): Schedule {
  const current = zone?.horarioSemanal;
  return Object.fromEntries(days.map(({ id }) => [String(id), current?.[String(id)]?.length ? current[String(id)].map((item) => ({ inicio: item.inicio, fin: item.fin })) : []]));
}

function ZoneEditor({ communityId, zone, onClose }: { communityId: string; zone: ZonaComun | null; onClose: () => void }) {
  const uid = auth.currentUser?.uid || '';
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [schedule, setSchedule] = useState<Schedule>(() => normalizeSchedule(zone || undefined));
  const [name, setName] = useState(zone?.nombre || '');
  const [description, setDescription] = useState(zone?.descripcion || '');
  const [location, setLocation] = useState(zone?.ubicacion || '');
  const [capacity, setCapacity] = useState(String(zone?.capacidadMaxima || ''));
  const [maxPerBooking, setMaxPerBooking] = useState(String(zone?.maxPersonasPorReserva || zone?.capacidadMaxima || ''));
  const [features, setFeatures] = useState((zone?.caracteristicas || []).join('\n'));
  const [rules, setRules] = useState(zone?.reglasUso || '');
  const [durationText, setDurationText] = useState((zone?.duracionesReservaMinutos || [Number(zone?.franjaMinutos || 60)]).join(', '));
  const [step, setStep] = useState(String(zone?.pasoReservaMinutos || 30));
  const [mode, setMode] = useState<NonNullable<ZonaComun['modoDisponibilidad']>>(zone?.modoDisponibilidad || 'exclusiva');
  const [bookable, setBookable] = useState(zone?.reservaHabilitada !== false);
  const [active, setActive] = useState(zone?.activa !== false);
  const [price, setPrice] = useState(String((Number(zone?.precioCentimos ?? Math.round(Number(zone?.costePorHora || zone?.costoPorHora || 0) * 100)) / 100).toFixed(2)));
  const [priceType, setPriceType] = useState<NonNullable<ZonaComun['tipoPrecio']>>(zone?.tipoPrecio || (Number(zone?.precioCentimos || 0) ? 'fianza' : 'gratis'));
  const [cancelHours, setCancelHours] = useState(String(zone?.horasCancelacionMinima ?? 2));
  const [dailyLimit, setDailyLimit] = useState(String(zone?.limiteDiarioMinutos ?? ''));
  const [dailyPeopleLimit, setDailyPeopleLimit] = useState(String(zone?.limiteDiarioPersonas ?? ''));

  function changeDay(dayId: number, enabled: boolean) {
    setSchedule((current) => ({ ...current, [String(dayId)]: enabled ? [{ inicio: '08:00', fin: '22:00' }] : [] }));
  }

  function changeRange(dayId: number, field: keyof Range, value: string) {
    setSchedule((current) => ({ ...current, [String(dayId)]: current[String(dayId)].map((range, index) => index === 0 ? { ...range, [field]: value } : range) }));
  }

  function toggleSplitHours(dayId: number) {
    setSchedule((current) => {
      const ranges = current[String(dayId)];
      return { ...current, [String(dayId)]: ranges.length > 1 ? [ranges[0]] : [...ranges, { inicio: '16:00', fin: '22:00' }] };
    });
  }

  function changeSecondRange(dayId: number, field: keyof Range, value: string) {
    setSchedule((current) => ({ ...current, [String(dayId)]: current[String(dayId)].map((range, index) => index === 1 ? { ...range, [field]: value } : range) }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!communityId || !uid) { toast.error('La cuenta no está vinculada a esta comunidad.'); return; }
    const durations = durationText.split(',').map((value) => Number(value.trim())).filter((value) => Number.isInteger(value) && value >= 30 && value <= 720);
    const cents = Math.max(0, Math.round(Number(price.replace(',', '.')) * 100));
    const maxCapacity = Number(capacity);
    const maxPeople = Number(maxPerBooking);
    const slotStep = Number(step);
    if (!name.trim() || !description.trim() || !Number.isInteger(maxCapacity) || maxCapacity < 1 || !Number.isInteger(maxPeople) || maxPeople < 1) { toast.error('Completa el nombre, la descripción y los aforos.'); return; }
    if (durations.length < 1 || !Number.isInteger(slotStep) || slotStep < 30 || slotStep % 30 !== 0) { toast.error('Configura duraciones y pasos de franja múltiplos de 30 minutos.'); return; }
    if (!Number.isFinite(cents) || cents > 10_000_000 || (cents > 0 && priceType === 'gratis')) { toast.error('Indica un precio válido y el tipo de importe correspondiente.'); return; }
    if (Object.values(schedule).some((ranges) => ranges.some((range) => range.fin <= range.inicio || [range.inicio, range.fin].some((time) => { const [hours, minutes] = time.split(':').map(Number); return (hours * 60 + minutes) % 30 !== 0; }) || ranges.length > 1 && ranges[0].fin > ranges[1].inicio))) { toast.error('Revisa los horarios: usa intervalos de 30 minutos y evita que los tramos se solapen.'); return; }
    setSaving(true);
    let uploadedPhoto = '';
    try {
      const zoneRef = zone ? doc(db, 'zonasComunes', zone.id) : doc(collection(db, 'zonasComunes'));
      if (photo) uploadedPhoto = await uploadReservationZonePhoto(photo, uid, communityId, zoneRef.id);
      const activeHours = Object.values(schedule).some((ranges) => ranges.length > 0);
      const data = {
        idComunidad: communityId,
        nombre: name.trim(),
        descripcion: description.trim(),
        ubicacion: location.trim(),
        capacidadMaxima: maxCapacity,
        maxPersonasPorReserva: Math.min(maxPeople, maxCapacity),
        caracteristicas: features.split('\n').map((feature) => feature.trim()).filter(Boolean).slice(0, 12),
        reglasUso: rules.trim(),
        fotoUrl: uploadedPhoto || zone?.fotoUrl || '',
        horarioSemanal: schedule,
        duracionesReservaMinutos: durations,
        pasoReservaMinutos: slotStep,
        franjaMinutos: durations[0],
        modoDisponibilidad: mode,
        reservaHabilitada: mode !== 'sin_reserva' && bookable && activeHours,
        activa: active,
        precioCentimos: mode === 'sin_reserva' || !bookable ? 0 : cents,
        tipoPrecio: cents === 0 ? 'gratis' : priceType,
        horasCancelacionMinima: Math.max(0, Number(cancelHours) || 0),
        ...(dailyLimit.trim() ? { limiteDiarioMinutos: Math.max(30, Number(dailyLimit)) } : { limiteDiarioMinutos: null }),
        ...(dailyPeopleLimit.trim() ? { limiteDiarioPersonas: Math.max(1, Number(dailyPeopleLimit)) } : { limiteDiarioPersonas: null }),
        actualizadoPorUid: uid,
        fechaActualizacion: serverTimestamp(),
      };
      if (zone) await updateDoc(zoneRef, data);
      else await setDoc(zoneRef, { ...data, creadoPorUid: uid, fechaCreacion: serverTimestamp() });
      if (uploadedPhoto && zone?.fotoUrl && zone.fotoUrl !== uploadedPhoto) {
        await removeReservationZonePhoto(zone.fotoUrl).catch((error) => console.warn('La zona se guardó, pero no se pudo retirar la foto anterior:', error));
      }
      toast.success(zone ? 'Zona actualizada.' : 'Zona añadida al catálogo.');
      onClose();
    } catch (error) {
      console.error('No se pudo guardar la zona:', error);
      if (uploadedPhoto) {
        await removeReservationZonePhoto(uploadedPhoto).catch(() => undefined);
      }
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar la zona.');
    } finally { setSaving(false); }
  }

  return <form onSubmit={(event) => void submit(event)} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Catálogo de zonas</p><h3 className="mt-1 text-xl font-bold">{zone ? 'Editar zona reservable' : 'Añadir zona reservable'}</h3></div><button type="button" onClick={onClose} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold dark:border-zinc-700">Cerrar</button></div>
    <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Nombre<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-sm font-semibold">Ubicación<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Exterior, planta -1…" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-sm font-semibold md:col-span-2">Descripción<textarea required maxLength={800} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950" /></label>
      <label className="text-sm font-semibold">Aforo del recurso<input type="number" min="1" max="500" required value={capacity} onChange={(event) => setCapacity(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-sm font-semibold">Máximo por reserva<input type="number" min="1" required value={maxPerBooking} onChange={(event) => setMaxPerBooking(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label>
      <label className="text-sm font-semibold">Control de disponibilidad<select value={mode} onChange={(event) => setMode(event.target.value as NonNullable<ZonaComun['modoDisponibilidad']>)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950"><option value="exclusiva">Una reserva por franja</option><option value="aforo">Aforo compartido</option><option value="sin_reserva">Acceso libre, sin reserva</option></select></label><label className="text-sm font-semibold">Precio por reserva (€)<input type="number" min="0" step="0.01" value={price} disabled={mode === 'sin_reserva'} onChange={(event) => setPrice(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950" /></label>
      <label className="text-sm font-semibold">Tipo de importe<select value={priceType} onChange={(event) => setPriceType(event.target.value as NonNullable<ZonaComun['tipoPrecio']>)} disabled={Number(price.replace(',', '.')) === 0} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"><option value="reserva">Precio de reserva</option><option value="fianza">Fianza</option><option value="gratis">Gratuito</option></select></label><label className="text-sm font-semibold">Duraciones permitidas (minutos)<input value={durationText} onChange={(event) => setDurationText(event.target.value)} placeholder="60, 90, 120" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /><span className="mt-1 block text-xs font-normal text-slate-500">Separadas por comas, múltiplos de 30.</span></label>
      <label className="text-sm font-semibold">Paso de las franjas (minutos)<select value={step} onChange={(event) => setStep(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950">{[30, 60, 90, 120].map((value) => <option key={value}>{value}</option>)}</select></label><label className="text-sm font-semibold">Cancelación gratuita hasta (horas)<input type="number" min="0" max="72" value={cancelHours} onChange={(event) => setCancelHours(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-sm font-semibold">Límite diario por vivienda (minutos)<input type="number" min="0" value={dailyLimit} onChange={(event) => setDailyLimit(event.target.value)} placeholder="Sin límite" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-sm font-semibold">Límite diario por vivienda (personas o pases)<input type="number" min="0" value={dailyPeopleLimit} onChange={(event) => setDailyPeopleLimit(event.target.value)} placeholder="Sin límite" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" /></label>
      <label className="text-sm font-semibold md:col-span-2">Características<textarea rows={3} value={features} onChange={(event) => setFeatures(event.target.value)} placeholder={'Cocina equipada\nIluminación LED\nAcceso adaptado'} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950" /><span className="mt-1 block text-xs font-normal text-slate-500">Una característica por línea.</span></label><label className="text-sm font-semibold md:col-span-2">Normas y condiciones<textarea rows={3} value={rules} onChange={(event) => setRules(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950" /></label>
      <div className="md:col-span-2"><p className="text-sm font-semibold">Fotografía de la zona</p><label className="mt-1 flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-400 px-3 text-sm hover:bg-slate-50 dark:border-zinc-600 dark:hover:bg-zinc-800"><PhotoIcon aria-hidden="true" className="h-5 w-5" /><span>{photo?.name || 'Subir JPG, PNG o WebP (máximo 8 MB)'}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] || null)} className="sr-only" /></label><p className="mt-1 text-xs text-slate-500">La foto se almacena de forma privada en Supabase Storage.</p></div>
    </div>
    <fieldset><legend className="text-sm font-bold">Horario semanal</legend><div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-zinc-800 dark:border-zinc-800">{days.map(({ id, label }) => { const ranges = schedule[String(id)] || []; return <div key={id} className="grid gap-2 p-3 sm:grid-cols-[7rem_1fr_1fr_1fr] sm:items-center"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={ranges.length > 0} onChange={(event) => changeDay(id, event.target.checked)} className="h-4 w-4 accent-emerald-800" />{label}</label>{ranges.length > 0 ? <><label className="text-xs text-slate-600 dark:text-zinc-400">Desde<input type="time" value={ranges[0].inicio} onChange={(event) => changeRange(id, 'inicio', event.target.value)} className="mt-1 min-h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-xs text-slate-600 dark:text-zinc-400">Hasta<input type="time" value={ranges[0].fin} onChange={(event) => changeRange(id, 'fin', event.target.value)} className="mt-1 min-h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" /></label><div>{ranges.length > 1 ? <div className="grid grid-cols-2 gap-2"><label className="text-xs">Pausa desde<input type="time" value={ranges[1].inicio} onChange={(event) => changeSecondRange(id, 'inicio', event.target.value)} className="mt-1 min-h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" /></label><label className="text-xs">Reabre hasta<input type="time" value={ranges[1].fin} onChange={(event) => changeSecondRange(id, 'fin', event.target.value)} className="mt-1 min-h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" /></label><button type="button" onClick={() => toggleSplitHours(id)} className="col-span-2 text-left text-xs font-semibold text-slate-600 underline dark:text-zinc-400">Quitar segundo tramo</button></div> : <button type="button" onClick={() => toggleSplitHours(id)} className="min-h-9 text-left text-xs font-semibold text-emerald-800 underline dark:text-emerald-300">Añadir segundo tramo</button>}</div></> : <span className="text-sm text-slate-500 dark:text-zinc-400">Cerrado</span>}</div>; })}</div></fieldset>
    <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={bookable} onChange={(event) => setBookable(event.target.checked)} className="h-4 w-4 accent-emerald-800" />Permitir reservas vecinales</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="h-4 w-4 accent-emerald-800" />Zona activa y visible</label></div>
    <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold dark:border-zinc-700">Cancelar</button><button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-emerald-800 px-4 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50">{saving ? 'Guardando…' : zone ? 'Guardar cambios' : 'Añadir zona'}</button></div>
  </form>;
}

function readZoneSchedule(zone?: ZonaComun) {
  return zone?.horarioSemanal || defaultSchedule('08:00', '22:00');
}

export default function GestionZonasReservables({ communityId, resident }: { communityId: string; resident: VecinoData | null }) {
  const uid = auth.currentUser?.uid || resident?.uid || '';
  const canManage = canManageReservations(resident, auth.currentUser?.email);
  const [zones, setZones] = useState<ZonaComun[]>([]);
  const [editing, setEditing] = useState<ZonaComun | null | undefined>(undefined);
  const [photos, setPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!communityId) { setZones([]); return undefined; }
    return onSnapshot(query(collection(db, 'zonasComunes'), where('idComunidad', '==', communityId)), (snapshot) => {
      setZones(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ZonaComun).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
    }, (error) => { console.error('No se pudieron cargar las zonas para Administración:', error); toast.error('No se pudo cargar el catálogo de zonas.'); });
  }, [communityId]);

  useEffect(() => {
    let mounted = true;
    void Promise.all(zones.filter((zone) => zone.fotoUrl).map(async (zone) => {
      try { return [zone.id, await resolveReservationZonePhoto(String(zone.fotoUrl))] as const; }
      catch { return [zone.id, ''] as const; }
    })).then((entries) => { if (mounted) setPhotos(Object.fromEntries(entries)); });
    return () => { mounted = false; };
  }, [zones]);

  async function retire(zone: ZonaComun) {
    if (!canManage || !uid) return;
    const next = zone.activa === false;
    if (!next && !window.confirm(`¿Retirar «${zone.nombre}» del catálogo? Las reservas anteriores se conservarán.`)) return;
    try { await updateDoc(doc(db, 'zonasComunes', zone.id), { activa: next, reservaHabilitada: next && zone.reservaHabilitada !== false, actualizadoPorUid: uid, fechaActualizacion: serverTimestamp() }); toast.success(next ? 'Zona reactivada.' : 'Zona retirada del catálogo.'); }
    catch (error) { console.error('No se pudo cambiar el estado de la zona:', error); toast.error('No se pudo actualizar la zona.'); }
  }

  if (!canManage) return <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">No tienes permiso para gestionar zonas. Esta sección está disponible para Administración, Presidencia y Vicepresidencia.</p>;
  return <section aria-labelledby="manage-zones-title" className="space-y-4">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Inventario comunitario</p><h2 id="manage-zones-title" className="mt-1 text-2xl font-bold">Zonas reservables</h2><p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">Administra fotos, características, aforo, horarios, franjas, precios y condiciones. Retirar una zona conserva el historial de reservas.</p></div>{editing === undefined && <button type="button" onClick={() => setEditing(null)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-black"><PlusIcon aria-hidden="true" className="h-5 w-5" />Añadir zona</button>}</div>
    {editing !== undefined && <ZoneEditor communityId={communityId} zone={editing} onClose={() => setEditing(undefined)} />}
    {zones.length === 0 ? <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">Aún no hay zonas registradas.</p> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{zones.map((zone) => { const price = Number(zone.precioCentimos || 0); const schedule = readZoneSchedule(zone); return <article key={zone.id} className={`overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 ${zone.activa === false ? 'border-dashed border-slate-300 opacity-75 dark:border-zinc-700' : 'border-slate-200 dark:border-zinc-800'}`}>
      <div className="relative h-44 bg-slate-100 dark:bg-zinc-800">{photos[zone.id] && <img src={photos[zone.id]} alt={zone.nombre} className="h-full w-full object-cover" />}<span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${zone.activa === false ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>{zone.activa === false ? 'Retirada' : 'Activa'}</span></div>
      <div className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{zone.nombre}</h3><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{zone.ubicacion || 'Ubicación sin especificar'}</p></div><span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{price ? `${(price / 100).toFixed(2)} €${zone.tipoPrecio === 'fianza' ? ' · fianza' : ''}` : 'Gratuito'}</span></div>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-zinc-300">{zone.descripcion}</p><p className="text-xs text-slate-500 dark:text-zinc-400">Aforo {zone.capacidadMaxima || '—'} · {zone.modoDisponibilidad === 'aforo' ? 'Aforo compartido' : zone.modoDisponibilidad === 'sin_reserva' ? 'Acceso libre' : 'Franja exclusiva'}</p>
        <div className="flex flex-wrap gap-1">{days.map(({ id, label }) => { const ranges = schedule[String(id)] || []; return <span key={id} className={`rounded-md px-1.5 py-1 text-[10px] ${ranges.length ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300' : 'text-slate-400 dark:text-zinc-600'}`}>{label.slice(0, 2)}{ranges.length ? ` ${ranges.map((range) => `${range.inicio}-${range.fin}`).join('/')}` : ' —'}</span>; })}</div>
        <div className="flex gap-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><button type="button" onClick={() => setEditing(zone)} className="min-h-10 flex-1 rounded-lg border border-slate-300 text-sm font-semibold hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Editar</button><button type="button" onClick={() => void retire(zone)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800">{zone.activa === false ? 'Reactivar' : 'Retirar'}</button></div>
      </div></article>; })}</div>}
  </section>;
}
