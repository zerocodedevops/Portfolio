import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from '../demo/demoStore';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { VecinoData, VecinoOutletContext } from '../types/domain';

interface ConversationData {
  id: string;
  participantes: string[];
  idComunidad: string;
  creadoPor: string;
  creadoEn?: { toDate?: () => Date };
  ultimoMensaje?: string;
  ultimoMensajeId?: string;
  ultimoMensajePor?: string;
  actualizadoEn?: { toDate?: () => Date };
  leidoEn?: Record<string, { toDate?: () => Date }>;
  ocultadaPara?: Record<string, boolean>;
  borradaDesde?: Record<string, { toDate?: () => Date }>;
}

interface MessageData {
  id: string;
  autorUid: string;
  autorNombre: string;
  texto: string;
  creadoEn?: { toDate?: () => Date };
}

function timestamp(value?: { toDate?: () => Date }) {
  const date = value?.toDate?.();
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function timeLabel(value?: { toDate?: () => Date }) {
  const date = timestamp(value);
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function dayLabel(value?: { toDate?: () => Date }) {
  const date = timestamp(value);
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(date);
}

function residentName(resident?: VecinoData) {
  if (!resident) return 'Vecino';
  const personal = resident.datosPersonales || {};
  return [personal.nombre || resident.nombre, personal.apellidos || resident.apellidos].filter(Boolean).join(' ') || 'Vecino';
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('es');
}

export default function Mensajes() {
  const [currentUser] = useOutletContext<VecinoOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const uid = auth.currentUser?.uid || currentUser?.uid;
  const communityId = currentUser?.idComunidad;
  const [directory, setDirectory] = useState<VecinoData[]>([]);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [messages, setMessages] = useState<MessageData[]>([]);
  const initialConversationSelected = useRef(false);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!uid || !communityId) { setLoading(false); return; }
    return onSnapshot(query(
      collection(db, 'vecinosPublicos'),
      where('idComunidad', '==', communityId),
      where('activo', '==', true),
    ), (snapshot) => {
      setDirectory(snapshot.docs.map((entry) => ({ id: String(entry.get('idFicha') || entry.id), ...entry.data() }) as VecinoData));
    }, (snapshotError) => {
      console.error('No se pudo cargar el directorio para mensajería:', snapshotError);
      setError('No se pudo cargar el directorio de vecinos.');
    });
  }, [uid, communityId]);

  useEffect(() => {
    if (!uid || !communityId) { setLoading(false); return; }
    return onSnapshot(query(
      collection(db, 'conversaciones'),
      where('participantes', 'array-contains', uid),
      where('idComunidad', '==', communityId),
    ), (snapshot) => {
      const records = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ConversationData);
      records.sort((left, right) => (timestamp(right.actualizadoEn)?.getTime() || 0) - (timestamp(left.actualizadoEn)?.getTime() || 0));
      setConversations(records);
      setLoading(false);
    }, (snapshotError) => {
      console.error('No se pudieron cargar las conversaciones:', snapshotError);
      setError(snapshotError.code === 'permission-denied'
        ? 'No tienes permiso para cargar las conversaciones de esta comunidad. Contacta con la administración.'
        : 'No se pudieron cargar tus conversaciones. Comprueba tu conexión e inténtalo de nuevo.');
      setLoading(false);
    });
  }, [uid, communityId]);

  useEffect(() => {
    if (!uid || !selectedId) { setMessages([]); return; }
    const messagesQuery = query(collection(db, 'conversaciones', selectedId, 'mensajes'), orderBy('creadoEn', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MessageData));
    }, (snapshotError) => {
      console.error('No se pudieron cargar los mensajes:', snapshotError);
      setError('No se pudieron cargar los mensajes de esta conversación.');
    });
    void updateDoc(doc(db, 'conversaciones', selectedId), { [`leidoEn.${uid}`]: serverTimestamp() }).catch((readError) => {
      console.error('No se pudo actualizar la lectura de la conversación:', readError);
    });
    return unsubscribe;
  }, [uid, selectedId]);

  const visibleConversations = conversations.filter((entry) => !entry.ocultadaPara?.[uid || '']);
  const selected = visibleConversations.find((entry) => entry.id === selectedId);
  const historyCutoff = timestamp(selected?.borradaDesde?.[uid || '']);
  const visibleMessages = historyCutoff
    ? messages.filter((message) => {
      const createdAt = timestamp(message.creadoEn);
      return createdAt && createdAt.getTime() > historyCutoff.getTime();
    })
    : messages;
  const selectedResident = directory.find((entry) => selected?.participantes.some((participant) => participant !== uid && participant === entry.uid));
  const availableResidents = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es');
    return directory
      .filter((resident) => resident.uid && resident.uid !== uid && resident.chatEnabled === true)
      .filter((resident) => !normalizedSearch || residentName(resident).toLocaleLowerCase('es').includes(normalizedSearch)
        || `${resident.portal || ''} ${resident.piso || ''} ${resident.letra || ''}`.toLocaleLowerCase('es').includes(normalizedSearch))
      .sort((left, right) => residentName(left).localeCompare(residentName(right), 'es'));
  }, [directory, search, uid]);

  useEffect(() => {
    if (initialConversationSelected.current || selectedId || visibleConversations.length === 0) return;
    initialConversationSelected.current = true;
    setSelectedId(visibleConversations[0].id);
  }, [visibleConversations, selectedId]);

  async function openConversation(targetUid: string) {
    if (!uid || !communityId || !targetUid || targetUid === uid) return;
    setCreating(true);
    setError('');
    try {
      const participants = [uid, targetUid].sort();
      const conversationId = participants.join('__');
      const conversationRef = doc(db, 'conversaciones', conversationId);
      const existing = await getDoc(conversationRef);
      if (!existing.exists()) {
        await setDoc(conversationRef, {
          participantes: participants,
          idComunidad: communityId,
          creadoPor: uid,
          creadoEn: serverTimestamp(),
          ultimoMensaje: '',
          ultimoMensajeId: '',
          ultimoMensajePor: '',
          leidoEn: { [uid]: serverTimestamp() },
        });
      } else if (existing.get(`ocultadaPara.${uid}`) === true) {
        const restoreFields: Record<string, unknown> = { [`ocultadaPara.${uid}`]: false };
        if (!existing.get(`borradaDesde.${uid}`)) restoreFields[`borradaDesde.${uid}`] = serverTimestamp();
        await updateDoc(conversationRef, restoreFields);
      }
      initialConversationSelected.current = true;
      setSelectedId(conversationId);
      setSearchParams({}, { replace: true });
    } catch (openError) {
      console.error('No se pudo abrir la conversación:', openError);
      setError('No se pudo iniciar el chat. Comprueba que ambos usuarios tengan una cuenta vecinal activa.');
    } finally {
      setCreating(false);
    }
  }

  async function hideConversation(conversation: ConversationData) {
    if (!uid) return;
    setError('');
    setNotice('');
    try {
      await updateDoc(doc(db, 'conversaciones', conversation.id), {
        [`ocultadaPara.${uid}`]: true,
        [`borradaDesde.${uid}`]: serverTimestamp(),
      });
      if (selectedId === conversation.id) setSelectedId('');
      setNotice('Historial borrado para ti. La otra persona conserva su conversación.');
    } catch (hideError) {
      console.error('No se pudo borrar la conversación de tu lista:', hideError);
      setError('No se pudo borrar la conversación de tu lista. Inténtalo de nuevo.');
    }
  }

  useEffect(() => {
    const targetUid = searchParams.get('with');
    if (!targetUid || !directory.some((entry) => entry.uid === targetUid && entry.chatEnabled === true)) return;
    if (!creating) void openConversation(targetUid);
    // The query parameter is consumed once a valid directory profile is available.
  }, [searchParams, directory, creating]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!uid || !selected || !text || text.length > 2000 || sending) return;
    setSending(true);
    setError('');
    try {
      const messageRef = doc(collection(db, 'conversaciones', selected.id, 'mensajes'));
      const batch = writeBatch(db);
      batch.set(messageRef, {
        autorUid: uid,
        autorNombre: residentName(currentUser || undefined),
        texto: text,
        creadoEn: serverTimestamp(),
      });
      const recipientUid = selected.participantes.find((participant) => participant !== uid);
      if (recipientUid) {
        batch.set(doc(db, 'notificaciones', `mensaje_${messageRef.id}_${recipientUid}`), {
          destinatarioUid: recipientUid,
          idComunidad: communityId,
          tipo: 'mensaje',
          titulo: `Nuevo mensaje de ${residentName(currentUser || undefined)}`,
          descripcion: text.slice(0, 180),
          creadaPorUid: uid,
          creadaEn: serverTimestamp(),
          leida: false,
          enlace: `/dashboard/mensajes?with=${recipientUid}`,
          sourceId: messageRef.id,
          conversacionId: selected.id,
        });
      }
      batch.update(doc(db, 'conversaciones', selected.id), {
        ultimoMensaje: text,
        ultimoMensajeId: messageRef.id,
        ultimoMensajePor: uid,
        actualizadoEn: serverTimestamp(),
        [`leidoEn.${uid}`]: serverTimestamp(),
      });
      await batch.commit();
      setDraft('');
    } catch (sendError) {
      console.error('No se pudo enviar el mensaje:', sendError);
      setError('No se pudo enviar el mensaje. Comprueba la conexión e inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  }

  const conversationItems = visibleConversations.map((conversation) => {
    const participantUid = conversation.participantes.find((participant) => participant !== uid);
    const lastActivity = timestamp(conversation.actualizadoEn);
    const cutoff = timestamp(conversation.borradaDesde?.[uid || '']);
    const lastRead = timestamp(conversation.leidoEn?.[uid || '']);
    const unread = Boolean(conversation.ultimoMensajeId)
      && conversation.ultimoMensajePor !== uid
      && Boolean(lastActivity)
      && (!lastRead || lastRead.getTime() < lastActivity!.getTime());
    const preview = cutoff && (!lastActivity || lastActivity.getTime() <= cutoff.getTime())
      ? 'Inicia la conversación'
      : conversation.ultimoMensaje || 'Inicia la conversación';
    return { conversation, resident: directory.find((entry) => entry.uid === participantUid), unread, preview };
  });
  const normalizedSearch = search.trim().toLocaleLowerCase('es');
  const displayedConversationItems = conversationItems.filter(({ resident, preview, conversation }) => {
    if (!normalizedSearch) return true;
    const unit = [resident?.portal ? `Portal ${resident.portal}` : '', resident?.piso || '', resident?.letra || ''].filter(Boolean).join(' ');
    return `${residentName(resident)} ${preview} ${conversation.ultimoMensaje || ''} ${unit}`
      .toLocaleLowerCase('es')
      .includes(normalizedSearch);
  });
  const otherParticipantUid = selected?.participantes.find((participant) => participant !== uid);
  const otherReadAt = timestamp(otherParticipantUid ? selected?.leidoEn?.[otherParticipantUid] : undefined);

  return (
    <section className="mx-auto flex h-[calc(100vh-9rem)] min-h-[34rem] max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900" aria-label="Mensajes privados">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-gray-700">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Comunidad · privado</p>
          <h1 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">Mensajes</h1>
        </div>
        <span className="hidden text-sm text-slate-500 sm:inline dark:text-gray-400">Habla sin compartir tu teléfono ni tu correo</span>
      </header>

      {error && <p role="alert" className="border-b border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className={`${selectedId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-slate-200 dark:border-gray-700`} aria-label="Conversaciones y vecinos">
          <div className="border-b border-slate-100 p-4 dark:border-gray-800">
            <label htmlFor="message-search" className="sr-only">Buscar vecino para iniciar conversación</label>
            <input id="message-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar vecino…" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">Conversaciones</div>
            {loading ? <p className="px-4 py-3 text-sm text-slate-500" role="status">Cargando mensajes…</p>
              : displayedConversationItems.length === 0 ? <p className="px-4 py-3 text-sm leading-6 text-slate-500 dark:text-gray-400">{normalizedSearch ? 'No hay conversaciones que coincidan. Puedes buscar un vecino para iniciar otra.' : 'Aún no tienes conversaciones. Busca un vecino para iniciar una.'}</p>
                : <ul className="space-y-1 px-2">
                  {displayedConversationItems.map(({ conversation, resident, unread, preview }) => {
                    const name = residentName(resident);
                    const active = selectedId === conversation.id;
                    return <li key={conversation.id} className="flex items-center gap-1">
                      <button type="button" onClick={() => { initialConversationSelected.current = true; setSelectedId(conversation.id); }} aria-current={active ? 'true' : undefined} aria-label={`${name}${unread ? ', mensaje nuevo' : ''}`} className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${active ? 'bg-emerald-50 dark:bg-emerald-950' : 'hover:bg-slate-50 dark:hover:bg-gray-800'}`}>
                        <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 font-semibold text-slate-700 dark:bg-gray-700 dark:text-gray-100">{initials(name)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{name}</span>
                          <span className="mt-1 block truncate text-xs text-slate-500 dark:text-gray-400">{preview}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <span className="text-[11px] text-slate-400">{timeLabel(conversation.actualizadoEn)}</span>
                          {unread && <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">Nuevo</span>}
                        </span>
                      </button>
                      <button type="button" onClick={() => void hideConversation(conversation)} aria-label={`Borrar conversación con ${name}`} title="Borrar conversación de mi historial" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-700 dark:text-gray-400 dark:hover:bg-rose-950 dark:hover:text-rose-300">
                        <span aria-hidden="true">🗑️</span>
                      </button>
                    </li>;
                  })}
                </ul>}

            {search.trim() && <>
              <div className="px-4 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">Iniciar conversación</div>
              {availableResidents.length ? <ul className="space-y-1 px-2 pb-3">
                {availableResidents.map((resident) => {
                  const name = residentName(resident);
                  const unit = [resident.portal ? `Portal ${resident.portal}` : '', resident.piso, resident.letra].filter(Boolean).join(' · ');
                  return <li key={resident.uid}>
                    <button type="button" disabled={creating} onClick={() => void openConversation(resident.uid!)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-60 dark:hover:bg-gray-800">
                      <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 font-semibold text-slate-700 dark:bg-gray-700 dark:text-gray-100">{initials(name)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{name}</span>
                        <span className="mt-1 block truncate text-xs text-slate-500 dark:text-gray-400">{unit || 'Vecino de la comunidad'}</span>
                      </span>
                    </button>
                  </li>;
                })}
              </ul> : <p className="px-4 pb-4 text-sm text-slate-500 dark:text-gray-400">No hay vecinos activos que coincidan con la búsqueda.</p>}
            </>}
          </div>
        </aside>

        <div className={`${selectedId ? 'flex' : 'hidden md:flex'} min-h-0 flex-col`}>
          {selected ? <>
            <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-gray-700 sm:px-6">
              <button type="button" onClick={() => setSelectedId('')} className="rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 md:hidden dark:text-gray-300 dark:hover:bg-gray-800">Volver</button>
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{initials(residentName(selectedResident))}</span>
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-slate-950 dark:text-white">{residentName(selectedResident)}</h2>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">Vecino de tu comunidad</p>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-slate-50/70 px-4 py-5 dark:bg-gray-950/60 sm:px-6" aria-live="polite" aria-label="Mensajes de la conversación">
              {visibleMessages.length === 0 ? <div className="m-auto max-w-sm text-center">
                <p className="font-semibold text-slate-800 dark:text-gray-100">Conversación privada</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">Los mensajes sólo están disponibles para las dos personas de este chat.</p>
              </div> : visibleMessages.map((message, index) => {
                const own = message.autorUid === uid;
                const createdAt = timestamp(message.creadoEn);
                const date = dayLabel(message.creadoEn);
                const previousDate = dayLabel(visibleMessages[index - 1]?.creadoEn);
                return <div key={message.id}>
                  {date && date !== previousDate && <p className="my-3 text-center text-xs text-slate-400">{date}</p>}
                  <div className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[75%] ${own ? 'rounded-br-md bg-emerald-800 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}`}>
                      {!own && <p className="mb-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">{message.autorNombre}</p>}
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.texto}</p>
                      <p className={`mt-1 text-right text-[10px] ${own ? 'text-emerald-100/80' : 'text-slate-400'}`}>
                        {timeLabel(message.creadoEn)}{own && <span className="ml-1">· {otherReadAt && createdAt && createdAt.getTime() <= otherReadAt.getTime() ? 'Leído' : 'Enviado'}</span>}
                      </p>
                    </div>
                  </div>
                </div>;
              })}
            </div>

            <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 sm:p-4">
              <label htmlFor="message-draft" className="sr-only">Escribe un mensaje</label>
              <div className="flex items-end gap-2">
                <textarea id="message-draft" value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} maxLength={2000} placeholder="Escribe tu mensaje…" className="max-h-36 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
                <button type="submit" disabled={!draft.trim() || sending || draft.length > 2000} className="min-h-11 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{sending ? 'Enviando…' : 'Enviar'}</button>
              </div>
              <p className="mt-2 text-right text-[11px] text-slate-400">{draft.length}/2000 · Intro para enviar, Mayús+Intro para nueva línea</p>
            </form>
          </> : <div className="m-auto max-w-sm px-6 text-center">
            <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl dark:bg-emerald-950">✉</span>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Tu conversación vecinal</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">Busca un vecino activo para escribirle en privado. No hace falta compartir teléfonos ni correos.</p>
          </div>}
        </div>
      </div>
    </section>
  );
}
