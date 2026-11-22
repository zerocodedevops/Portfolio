import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { doc, onSnapshot, setDoc } from '../demo/demoStore';
import { BellIcon, CheckIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { NotificacionData, VecinoOutletContext } from '../types/domain';
import { DEFAULT_NOTIFICATION_PREFERENCES, isNotificationCategoryVisible, markAllNotificationsRead, markNotificationRead, notificationRoute, subscribeNotifications, type NotificationPreferences } from '../services/notificacionesService';

const categories: Array<{ id: keyof NotificationPreferences; type: NotificacionData['tipo']; label: string }> = [
  { id: 'mensajes', type: 'mensaje', label: 'Mensajes' }, { id: 'incidencias', type: 'incidencia', label: 'Incidencias' },
  { id: 'reservas', type: 'reserva', label: 'Reservas' }, { id: 'votaciones', type: 'votacion', label: 'Votaciones' },
  { id: 'documentos', type: 'documento', label: 'Documentos' }, { id: 'reuniones', type: 'reunion', label: 'Juntas y reuniones' },
  { id: 'comunidad', type: 'comunidad', label: 'Comunidad' },
];

function dateValue(value?: NotificacionData['creadaEn']) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return value.toDate?.() || null;
}

function Notificaciones() {
  const [resident] = useOutletContext<VecinoOutletContext>();
  const uid = auth.currentUser?.uid || resident?.uid || '';
  const communityId = resident?.idComunidad || '';
  const [items, setItems] = useState<NotificacionData[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [filter, setFilter] = useState<'todas' | 'no-leidas'>('todas');
  const [selectedType, setSelectedType] = useState('todas');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid || !communityId) return undefined;
    const unsubscribeItems = subscribeNotifications(uid, communityId, setItems, (listenError) => {
      console.error('Notificaciones:', listenError);
      setError('No se pudieron cargar las notificaciones. Comprueba tus permisos y la conexión.');
    });
    const unsubscribePreferences = onSnapshot(doc(db, 'preferenciasNotificaciones', uid), (snapshot) => {
      if (snapshot.exists() && snapshot.get('idComunidad') === communityId) {
        setPreferences({ ...DEFAULT_NOTIFICATION_PREFERENCES, ...snapshot.data().preferencias });
      }
    });
    return () => { unsubscribeItems(); unsubscribePreferences(); };
  }, [uid, communityId]);

  const filtered = useMemo(() => items.filter((item) => isNotificationCategoryVisible(item.tipo, preferences)
    && (filter === 'todas' || !item.leida)
    && (selectedType === 'todas' || item.tipo === selectedType)), [items, filter, selectedType, preferences]);

  async function openItem(item: NotificacionData) {
    try {
      setError('');
      if (!item.leida) await markNotificationRead(item.id);
      navigate(notificationRoute(item));
    } catch (actionError) {
      console.error(actionError);
      setError('No se pudo actualizar la notificación.');
    }
  }

  async function markAll() {
    setBusy(true);
    try { await markAllNotificationsRead(items); setError(''); }
    catch (actionError) { console.error(actionError); setError('No se pudieron marcar como leídas.'); }
    finally { setBusy(false); }
  }

  async function togglePreference(key: keyof NotificationPreferences) {
    if (!uid || !communityId) return;
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    try {
      await setDoc(doc(db, 'preferenciasNotificaciones', uid), {
        uid, idComunidad: communityId, preferencias: next, actualizadoEn: new Date(),
      }, { merge: true });
    } catch (actionError) {
      console.error(actionError);
      setPreferences(preferences);
      setError('No se pudo guardar la preferencia.');
    }
  }

  const residentName = [resident?.datosPersonales?.nombre, resident?.datosPersonales?.apellidos].filter(Boolean).join(' ') || auth.currentUser?.displayName || 'Vecino';
  return <div className="mx-auto max-w-5xl space-y-6 text-slate-900 dark:text-white">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Comunidad · {residentName}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Centro de notificaciones</h1><p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">Avisos de actividad de tu comunidad, con control de lectura y preferencias.</p></div>
      <button type="button" disabled={busy || !items.some((item) => !item.leida)} onClick={() => void markAll()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"><CheckIcon className="h-4 w-4" />Marcar todas como leídas</button>
    </header>
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2"><FunnelIcon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" /><div className="flex rounded-lg bg-slate-100 p-1 dark:bg-zinc-800"><button type="button" aria-pressed={filter === 'todas'} onClick={() => setFilter('todas')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === 'todas' ? 'bg-white shadow-sm dark:bg-zinc-700' : ''}`}>Todas</button><button type="button" aria-pressed={filter === 'no-leidas'} onClick={() => setFilter('no-leidas')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === 'no-leidas' ? 'bg-white shadow-sm dark:bg-zinc-700' : ''}`}>No leídas</button></div></div>
          <label className="sr-only" htmlFor="notification-type">Tipo de aviso</label><select id="notification-type" value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"><option value="todas">Todos los tipos</option>{categories.map((category) => <option key={category.id} value={category.type}>{category.label}</option>)}</select>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
          {filtered.map((item) => { const date = dateValue(item.creadaEn); return <li key={item.id}><button type="button" onClick={() => void openItem(item)} className="flex w-full gap-4 p-4 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-700 dark:hover:bg-zinc-800/70"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.leida ? 'bg-slate-200 dark:bg-zinc-700' : 'bg-emerald-600'}`} aria-hidden="true" /><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="font-semibold">{item.titulo}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{categories.find((category) => category.type === item.tipo)?.label || item.tipo}</span>{!item.leida && <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Nueva</span>}</span><span className="mt-1 block text-sm text-slate-600 dark:text-zinc-300">{item.descripcion}</span><span className="mt-2 block text-xs text-slate-400">{date ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : 'Ahora'}</span></span></button></li>; })}
          {!filtered.length && <li className="px-6 py-14 text-center"><BellIcon className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-700" /><p className="mt-3 text-sm font-semibold">{items.length ? 'No hay avisos con estos filtros' : 'Aún no hay notificaciones'}</p><p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Cuando haya actividad relevante en la comunidad, aparecerá aquí.</p></li>}
        </ul>
      </section>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><h2 className="font-bold">Preferencias</h2><p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Elige qué categorías mostrar en la campana y en este centro. Los avisos se conservan en el historial.</p><div className="mt-4 space-y-3">{categories.map((category) => <label key={category.id} className="flex cursor-pointer items-center justify-between gap-3 text-sm"><span>{category.label}</span><input type="checkbox" checked={preferences[category.id]} onChange={() => void togglePreference(category.id)} className="h-4 w-4 accent-emerald-700" /></label>)}</div></aside>
    </div>
  </div>;
}

export default Notificaciones;
