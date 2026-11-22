import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpeakerWaveIcon, SpeakerXMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import type { NotificacionData } from '../types/domain';
import { auth } from '../demo/demoAuth';
import { isMessageSoundEnabled, setMessageSoundEnabled, unlockMessageSound } from '../services/notificationSound';
import { markNotificationRead, notificationRoute } from '../services/notificacionesService';

interface Props { notificaciones: NotificacionData[]; error?: string; }

function dateLabel(value?: NotificacionData['creadaEn']) {
  if (!value) return 'Ahora';
  const date = value instanceof Date ? value : typeof value === 'string' ? new Date(value) : value.toDate?.();
  return date ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(date) : 'Ahora';
}

export default function CampanaNotificaciones({ notificaciones, error }: Props) {
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid || '';
  const [open, setOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(isMessageSoundEnabled);
  const [actionError, setActionError] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const unread = notificaciones.filter((item) => !item.leida).length;

  useEffect(() => {
    const outside = (event: MouseEvent) => { if (root.current && event.target instanceof Node && !root.current.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  async function openNotification(item: NotificacionData) {
    try {
      setActionError('');
      if (!item.leida) await markNotificationRead(item.id);
      setOpen(false);
      navigate(item.tipo === 'inscripcion' && item.solicitudUid === uid ? '/validacion' : notificationRoute(item));
    } catch (error) {
      console.error('No se pudo actualizar la notificación:', error);
      setActionError('No se pudo actualizar. Inténtalo de nuevo.');
    }
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setMessageSoundEnabled(next);
    if (next) unlockMessageSound();
  }

  return <div ref={root} className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label={unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'} aria-expanded={open} className="relative grid h-10 w-10 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
      <BellIcon aria-hidden="true" className="h-5 w-5" />
      {unread > 0 && <span className="absolute right-0 top-0 min-w-4 rounded-full bg-rose-500 px-1 text-center text-[10px] font-bold leading-4 text-white">{unread > 99 ? '99+' : unread}</span>}
    </button>
    {open && <section aria-label="Notificaciones recientes" className="absolute right-0 z-50 mt-2 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-zinc-800">
        <div><h2 className="text-sm font-bold">Notificaciones</h2><p className="text-xs text-slate-500 dark:text-zinc-400">{unread ? `${unread} sin leer` : 'Todo al día'}</p></div>
        <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? 'Silenciar notificaciones' : 'Activar sonido de notificaciones'} title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{soundEnabled ? <SpeakerWaveIcon className="h-4 w-4" /> : <SpeakerXMarkIcon className="h-4 w-4" />}</button>
      </header>
      {(error || actionError) && <p role="alert" className="px-4 py-2 text-xs text-rose-700 dark:text-rose-300">{actionError || error}</p>}
      <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
        {notificaciones.slice(0, 6).map((item) => <li key={item.id}>
          <button type="button" onClick={() => void openNotification(item)} className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-700 dark:hover:bg-zinc-800">
            <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.leida ? 'bg-slate-200 dark:bg-zinc-700' : 'bg-emerald-600'}`} />
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.titulo}</span><span className="mt-0.5 block truncate text-xs text-slate-600 dark:text-zinc-300">{item.descripcion}</span><span className="mt-1 block text-[11px] text-slate-400">{dateLabel(item.creadaEn)}</span></span>
          </button>
        </li>)}
      </ul>
      {!notificaciones.length && <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-zinc-400">Aún no tienes notificaciones.</p>}
      <footer className="border-t border-slate-100 p-2 text-center dark:border-zinc-800"><button type="button" onClick={() => { setOpen(false); navigate('/dashboard/notificaciones'); }} className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-emerald-300 dark:hover:bg-zinc-800">Ver todas</button></footer>
    </section>}
  </div>;
}
