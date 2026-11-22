import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from '../demo/demoStore';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { VecinoOutletContext } from '../types/domain';
import { canConveneOrPublish, hasAdministratorAccess, isPropertyAdministrator } from '../utils/residentRoles';
import { notifyCommunityMembers } from '../services/notificacionesService';

interface Meeting { id: string; idComunidad: string; titulo: string; tipo: 'junta'|'reunion'; estado: 'convocada'|'celebrada'|'cancelada'; inicio: { toDate?: () => Date }; ubicacion: string; ordenDelDia: string[]; puntosVotables?: number[]; convocatoria: string; documentoUrl?: string; creadaPorUid: string; creadaPorNombre: string; creadaPorCargo?: string; }
interface MeetingQuestion { id: string; autorUid: string; autorNombre: string; texto: string; creadaEn?: { toDate?: () => Date }; respuesta?: string; }
interface MeetingAgreement { id: string; texto: string; responsable: string; fechaLimite: string; estado: string; }
interface MeetingHome { id: string; idComunidad?: string; portal?: string; piso?: string; letra?: string; vivienda?: string; idVivienda?: string; }
interface MeetingSubmission { uid: string; viviendaId?: string; viviendaRefId?: string; viviendaLabel?: string; respuestas?: string[]; tipo?: 'voto' | 'delegacion'; enviadoEn?: { toDate?: () => Date }; actualizadoEn?: { toDate?: () => Date }; }
interface PublicResident { id?: string; idFicha?: string; uid?: string; portal?: string; piso?: string; letra?: string; datosPersonales?: { portal?: string; piso?: string; letra?: string; nombre?: string; apellidos?: string }; nombre?: string; apellidos?: string; }

function homeLabel(home: MeetingHome) {
  const portal = String(home.portal || '').replace(/^portal\s*/i, '').trim();
  const floor = String(home.piso || '').trim();
  const floorLabel = /^\d+$/.test(floor) ? `${floor}º` : floor;
  return String(home.vivienda || home.idVivienda || [portal && `Portal ${portal}`, floorLabel, home.letra].filter(Boolean).join(' · ') || home.id).trim();
}

function normalizedHome(value: unknown) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function residentHomeKey(resident: PublicResident) {
  const personal = resident.datosPersonales || {};
  const portal = String(resident.portal || personal.portal || '').replace(/^portal\s*/i, '').trim();
  const floor = resident.piso || personal.piso || '';
  const letter = resident.letra || personal.letra || '';
  return normalizedHome(`Portal ${portal} ${floor}${letter}`);
}

function homeIdentity(home: MeetingHome) {
  if (home.idVivienda || home.vivienda) return String(home.idVivienda || home.vivienda).trim();
  const portal = String(home.portal || '').replace(/^portal\s*/i, '').trim();
  const floor = String(home.piso || '').replace(/[º°]\s*$/, '').trim();
  return [`Portal ${portal}`, `${floor}${home.letra || ''}`].filter(Boolean).join(' ');
}

function residentHomeIdentity(resident: VecinoOutletContext[0]) {
  if (resident?.idVivienda || resident?.vivienda) return String(resident.idVivienda || resident.vivienda).trim();
  const personal = resident?.datosPersonales || {};
  const portal = String(resident?.portal || personal.portal || '').replace(/^portal\s*/i, '').trim();
  const floor = String(resident?.piso || personal.piso || '').replace(/[º°]\s*$/, '').trim();
  const letter = resident?.letra || personal.letra || '';
  return [`Portal ${portal}`, `${floor}${letter}`].filter(Boolean).join(' ');
}

function emptyAgenda() {
  return [{ texto: '', generarVotacion: false }];
}

function votingAgenda(meeting: Meeting) {
  return (meeting.puntosVotables || [])
    .filter((index) => Number.isInteger(index) && index >= 0 && index < (meeting.ordenDelDia || []).length)
    .map((index) => ({ index, texto: meeting.ordenDelDia[index] }));
}

function createEmptyMeetingForm() {
  return { titulo: '', tipo: 'junta', inicio: '', ubicacion: '', convocatoria: '', agenda: emptyAgenda(), documentoUrl: '' };
}

function Reuniones() {
  const [resident] = useOutletContext<VecinoOutletContext>();
  const uid = auth.currentUser?.uid || resident?.uid || '';
  const communityId = resident?.idComunidad || '';
  const isAdmin = hasAdministratorAccess(resident);
  const canConvene = canConveneOrPublish(resident, auth.currentUser?.email);
  const canViewBallots = isPropertyAdministrator(resident);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [questions, setQuestions] = useState<MeetingQuestion[]>([]);
  const [agreements, setAgreements] = useState<MeetingAgreement[]>([]);
  const [myAttendance, setMyAttendance] = useState('');
  const [myVotes, setMyVotes] = useState<string[]>([]);
  const [voteDrafts, setVoteDrafts] = useState<string[]>([]);
  const [myDelegation, setMyDelegation] = useState('');
  const [delegationSearch, setDelegationSearch] = useState('');
  const [delegationTarget, setDelegationTarget] = useState('');
  const [homes, setHomes] = useState<MeetingHome[]>([]);
  const [occupiedHomeKeys, setOccupiedHomeKeys] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<MeetingSubmission[]>([]);
  const [incomingDelegations, setIncomingDelegations] = useState<MeetingSubmission[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [agreementText, setAgreementText] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(createEmptyMeetingForm);
  const [agreementResponsible, setAgreementResponsible] = useState('');
  const [agreementDue, setAgreementDue] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!communityId) return undefined;
    return onSnapshot(query(collection(db, 'reuniones'), where('idComunidad', '==', communityId)), (snapshot) => {
      const list = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Meeting)
        .sort((a, b) => (b.inicio?.toDate?.().getTime() || 0) - (a.inicio?.toDate?.().getTime() || 0));
      setMeetings(list);
      setSelectedId((current) => current && list.some((meeting) => meeting.id === current) ? current : list.find((meeting) => meeting.estado !== 'cancelada')?.id || list[0]?.id || '');
    }, (listenError) => { console.error(listenError); setError('No se pudieron cargar las reuniones.'); });
  }, [communityId]);

  useEffect(() => {
    if (!communityId) { setOccupiedHomeKeys([]); return undefined; }
    return onSnapshot(query(collection(db, 'vecinosPublicos'), where('idComunidad', '==', communityId), where('activo', '==', true)), (snapshot) => {
      const keys = snapshot.docs.map((entry) => residentHomeKey(entry.data() as PublicResident)).filter(Boolean);
      setOccupiedHomeKeys([...new Set(keys)]);
    }, (listenError) => { console.error('No se pudieron consultar las viviendas ocupadas:', listenError); });
  }, [communityId]);

  useEffect(() => {
    if (!communityId) { setHomes([]); return undefined; }
    return onSnapshot(query(collection(db, 'viviendas'), where('idComunidad', '==', communityId)), (snapshot) => {
      setHomes(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MeetingHome));
    }, (listenError) => { console.error('No se pudieron cargar las viviendas:', listenError); });
  }, [communityId]);

  const selected = meetings.find((meeting) => meeting.id === selectedId);
  useEffect(() => {
    if (!selected || !uid) { setQuestions([]); setAgreements([]); setMyAttendance(''); setMyVotes([]); setVoteDrafts([]); setMyDelegation(''); setDelegationTarget(''); return undefined; }
    const stopQuestions = onSnapshot(query(collection(db, 'reuniones', selected.id, 'preguntas'), orderBy('creadaEn', 'asc')), (snapshot) => setQuestions(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MeetingQuestion)), (listenError) => { console.error(listenError); });
    const stopAgreements = onSnapshot(query(collection(db, 'reuniones', selected.id, 'acuerdos'), orderBy('fechaLimite', 'asc')), (snapshot) => setAgreements(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MeetingAgreement)), (listenError) => { console.error(listenError); });
    const stopAttendance = onSnapshot(doc(db, 'reuniones', selected.id, 'asistencias', uid), (snapshot) => setMyAttendance(String(snapshot.get('respuesta') || '')));
    const stopVotes = onSnapshot(doc(db, 'reuniones', selected.id, 'votos', uid), (snapshot) => {
      const answers = snapshot.get('respuestas');
      setMyVotes(Array.isArray(answers) ? answers : []);
      const voteCount = votingAgenda(selected).length;
      setVoteDrafts(Array.isArray(answers) ? answers.slice(0, voteCount) : Array(voteCount).fill(''));
    });
    const stopDelegation = onSnapshot(doc(db, 'reuniones', selected.id, 'delegaciones', uid), (snapshot) => {
      const homeId = String(snapshot.get('viviendaRefId') || '');
      setMyDelegation(homeId);
      setDelegationTarget(homeId);
    });
    // Abrir una convocatoria registra su lectura por vecino y convocatoria.
    void setDoc(doc(db, 'reuniones', selected.id, 'lecturas', uid), { uid, leidaEn: serverTimestamp() }, { merge: true })
      .catch((readError) => { console.error('No se pudo registrar la lectura:', readError); });
    return () => { stopQuestions(); stopAgreements(); stopAttendance(); stopVotes(); stopDelegation(); };
  }, [selected?.id, selected?.puntosVotables?.join(','), uid]);

  useEffect(() => {
    if (!selected || !canViewBallots) { setSubmissions([]); return undefined; }
    let votes: MeetingSubmission[] = [];
    let delegations: MeetingSubmission[] = [];
    const refresh = () => setSubmissions([...votes, ...delegations]);
    const stopVotes = onSnapshot(collection(db, 'reuniones', selected.id, 'votos'), (snapshot) => {
      votes = snapshot.docs.map((entry) => ({ uid: entry.id, ...entry.data(), tipo: 'voto' }) as MeetingSubmission);
      refresh();
    }, (loadError) => { console.error('No se pudieron cargar los votos:', loadError); });
    const stopDelegations = onSnapshot(collection(db, 'reuniones', selected.id, 'delegaciones'), (snapshot) => {
      delegations = snapshot.docs.map((entry) => ({ uid: entry.id, ...entry.data(), tipo: 'delegacion' }) as MeetingSubmission);
      refresh();
    }, (loadError) => { console.error('No se pudieron cargar las delegaciones:', loadError); });
    return () => { stopVotes(); stopDelegations(); };
  }, [selected?.id, canViewBallots]);

  useEffect(() => {
    if (!selected || !uid) { setIncomingDelegations([]); return undefined; }
    const household = residentHomeIdentity(resident);
    if (!household) { setIncomingDelegations([]); return undefined; }
    return onSnapshot(query(collection(db, 'reuniones', selected.id, 'delegaciones'), where('viviendaId', '==', household)), (snapshot) => {
      setIncomingDelegations(snapshot.docs.map((entry) => ({ uid: entry.id, ...entry.data() }) as MeetingSubmission));
    }, (listenError) => { console.error('No se pudieron cargar las delegaciones recibidas:', listenError); });
  }, [selected?.id, uid, resident]);

  const upcoming = useMemo(() => meetings.filter((meeting) => meeting.estado === 'convocada' && (meeting.inicio?.toDate?.().getTime() || 0) >= Date.now()).reverse(), [meetings]);
  const history = meetings.filter((meeting) => !upcoming.some((entry) => entry.id === meeting.id));

  async function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingMeetingId ? !isAdmin : !canConvene) { setError('Solo Administración, Presidencia y Vicepresidencia pueden convocar reuniones.'); return; }
    if (!uid || !communityId || !form.titulo.trim() || !form.inicio) return;
    if (form.agenda.length > 1000) { setError('La convocatoria admite hasta 1.000 puntos del orden del día.'); return; }
    setSaving(true); setError('');
    try {
      const name = [resident?.datosPersonales?.nombre, resident?.datosPersonales?.apellidos].filter(Boolean).join(' ') || auth.currentUser?.displayName || 'Administración';
      const start = new Date(form.inicio);
      const agendaItems = form.agenda.map((item) => ({ texto: item.texto.trim(), generarVotacion: item.generarVotacion }))
        .filter((item) => item.texto.length > 0);
      const meetingData = {
        titulo: form.titulo.trim(), tipo: form.tipo, inicio: start,
        ubicacion: form.ubicacion.trim(), convocatoria: form.convocatoria.trim(), documentoUrl: form.documentoUrl.trim(),
        ordenDelDia: agendaItems.map((item) => item.texto),
        puntosVotables: agendaItems.flatMap((item, index) => item.generarVotacion ? [index] : []),
        actualizadaEn: serverTimestamp(),
      };
      if (editingMeetingId) {
        await updateDoc(doc(db, 'reuniones', editingMeetingId), meetingData);
        setSelectedId(editingMeetingId); setShowForm(false); setEditingMeetingId('');
        setForm(createEmptyMeetingForm());
        return;
      }
      const meeting = await addDoc(collection(db, 'reuniones'), {
        idComunidad: communityId, ...meetingData, estado: 'convocada',
        creadaPorUid: uid, creadaPorNombre: name, creadaPorCargo: resident?.cargo || (isAdmin ? 'Administrador de fincas' : ''), creadaEn: serverTimestamp(), actualizadaEn: serverTimestamp(),
      });
      await notifyCommunityMembers({ communityId, actorUid: uid, actorName: name, type: 'reunion', title: 'Nueva convocatoria', description: form.titulo.trim(), route: '/dashboard/reuniones', sourceId: meeting.id, excludeActor: true }).catch((notificationError) => { console.error('No se pudo notificar la convocatoria:', notificationError); setError('La convocatoria se guardó, pero no se pudieron enviar las notificaciones.'); });
      setSelectedId(meeting.id); setShowForm(false); setForm(createEmptyMeetingForm());
    } catch (saveError) { console.error(saveError); setError('No se pudo guardar la convocatoria.'); }
    finally { setSaving(false); }
  }

  async function respondAttendance(answer: string) {
    if (!selected || !uid) return;
    try {
      const attendanceRef = doc(db, 'reuniones', selected.id, 'asistencias', uid);
      if (answer !== 'no-asistire') {
        const revocations: Promise<void>[] = [];
        if (myVotes.length) revocations.push(deleteDoc(doc(db, 'reuniones', selected.id, 'votos', uid)));
        if (myDelegation) revocations.push(deleteDoc(doc(db, 'reuniones', selected.id, 'delegaciones', uid)));
        await Promise.all(revocations);
      }
      if (!answer) await deleteDoc(attendanceRef);
      else await setDoc(attendanceRef, { uid, respuesta: answer, actualizadoEn: serverTimestamp() });
    }
    catch (saveError) { console.error(saveError); setError('No se pudo guardar tu respuesta.'); }
  }

  async function submitVotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pointsToVote = selected ? votingAgenda(selected) : [];
    if (!selected || !uid || myAttendance !== 'no-asistire' || !pointsToVote.length || voteDrafts.length !== pointsToVote.length || voteDrafts.some((answer) => !answer)) return;
    setSubmitting(true); setError('');
    try {
      const currentHome = String(resident?.idVivienda || resident?.vivienda || '').trim();
      const batch = writeBatch(db);
      if (myDelegation) batch.delete(doc(db, 'reuniones', selected.id, 'delegaciones', uid));
      batch.set(doc(db, 'reuniones', selected.id, 'votos', uid), {
        uid, viviendaId: currentHome, viviendaLabel: currentHome || 'Vivienda sin especificar', respuestas: voteDrafts,
        enviadoEn: serverTimestamp(),
      });
      await batch.commit();
    } catch (saveError) { console.error(saveError); setError('No se pudieron enviar tus votos a la Administración.'); }
    finally { setSubmitting(false); }
  }

  async function submitDelegation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !uid || myAttendance !== 'no-asistire' || !delegationTarget) return;
    const chosenHome = homes.find((home) => home.id === delegationTarget);
    if (!chosenHome) { setError('Elige una vivienda de la lista.'); return; }
    setSubmitting(true); setError('');
    try {
      const residentsSnapshot = await getDocs(query(collection(db, 'vecinosPublicos'), where('idComunidad', '==', communityId), where('activo', '==', true)));
      const residentsForHome = residentsSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as PublicResident)
        .filter((candidate) => residentHomeKey(candidate) === normalizedHome(homeIdentity(chosenHome)));
      if (!residentsForHome.length) { setError('La vivienda seleccionada no tiene vecinos activos asociados para recibir la delegación.'); setSubmitting(false); return; }
      const batch = writeBatch(db);
      if (myVotes.length) batch.delete(doc(db, 'reuniones', selected.id, 'votos', uid));
      batch.set(doc(db, 'reuniones', selected.id, 'delegaciones', uid), {
        uid, viviendaId: homeIdentity(chosenHome), viviendaRefId: chosenHome.id, viviendaLabel: homeLabel(chosenHome),
        actualizadoEn: serverTimestamp(),
      });
      await batch.commit();
    } catch (saveError) { console.error(saveError); setError('No se pudo registrar la delegación de voto.'); }
    finally { setSubmitting(false); }
  }

  const ownHome = String(resident?.idVivienda || resident?.vivienda || '').trim();
  const ownHomeIdentity = residentHomeIdentity(resident);
  const otherHomes = homes.filter((home) => occupiedHomeKeys.includes(normalizedHome(homeIdentity(home)))
    && normalizedHome(homeIdentity(home)) !== normalizedHome(ownHome) && normalizedHome(homeIdentity(home)) !== normalizedHome(ownHomeIdentity));
  const filteredHomes = otherHomes.filter((home) => normalizedHome(homeLabel(home)).includes(normalizedHome(delegationSearch)) || normalizedHome(home.id).includes(normalizedHome(delegationSearch)));

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !uid || !questionText.trim()) return;
    try {
      await addDoc(collection(db, 'reuniones', selected.id, 'preguntas'), { autorUid: uid, autorNombre: [resident?.datosPersonales?.nombre, resident?.datosPersonales?.apellidos].filter(Boolean).join(' ') || auth.currentUser?.displayName || 'Vecino', texto: questionText.trim(), creadaEn: serverTimestamp() });
      setQuestionText('');
    } catch (saveError) { console.error(saveError); setError('No se pudo enviar la pregunta.'); }
  }

  async function updateMeetingStatus(status: Meeting['estado']) {
    if (!selected) return;
    try { await updateDoc(doc(db, 'reuniones', selected.id), { estado: status, actualizadaEn: serverTimestamp() }); }
    catch (saveError) { console.error(saveError); setError('No se pudo actualizar la reunión.'); }
  }

  function editMeeting(meeting: Meeting) {
    const start = meeting.inicio?.toDate?.();
    const localStart = start ? new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
    const agenda = (meeting.ordenDelDia || []).map((texto, index) => ({ texto, generarVotacion: meeting.puntosVotables?.includes(index) === true }));
    setForm({ titulo: meeting.titulo, tipo: meeting.tipo, inicio: localStart, ubicacion: meeting.ubicacion || '', convocatoria: meeting.convocatoria || '', agenda: agenda.length ? agenda : emptyAgenda(), documentoUrl: meeting.documentoUrl || '' });
    setEditingMeetingId(meeting.id);
    setShowForm(true);
  }

  async function addAgreement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !agreementText.trim()) return;
    try { await addDoc(collection(db, 'reuniones', selected.id, 'acuerdos'), { texto: agreementText.trim(), responsable: agreementResponsible.trim(), fechaLimite: agreementDue, estado: 'pendiente', creadoPorUid: uid, creadaEn: serverTimestamp() }); setAgreementText(''); setAgreementResponsible(''); setAgreementDue(''); }
    catch (saveError) { console.error(saveError); setError('No se pudo guardar el acuerdo.'); }
  }

  async function answerQuestion(question: MeetingQuestion) {
    if (!selected || !answerDrafts[question.id]?.trim()) return;
    try { await updateDoc(doc(db, 'reuniones', selected.id, 'preguntas', question.id), { respuesta: answerDrafts[question.id].trim(), respondidaPorUid: uid, respondidaEn: serverTimestamp() }); setAnswerDrafts((current) => ({ ...current, [question.id]: '' })); }
    catch (saveError) { console.error(saveError); setError('No se pudo guardar la respuesta.'); }
  }

  async function toggleAgreement(agreement: MeetingAgreement) {
    if (!selected || !isAdmin) return;
    try { await updateDoc(doc(db, 'reuniones', selected.id, 'acuerdos', agreement.id), { estado: agreement.estado === 'completado' ? 'pendiente' : 'completado' }); }
    catch (saveError) { console.error(saveError); setError('No se pudo actualizar el acuerdo.'); }
  }

  const dateText = (meeting: Meeting) => meeting.inicio?.toDate?.() ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(meeting.inicio.toDate!()) : 'Fecha pendiente';
  const votingPoints = selected ? votingAgenda(selected) : [];
  return <div className="mx-auto max-w-6xl space-y-6 text-slate-900 dark:text-white">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Gobierno de la comunidad</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Juntas y reuniones</h1><p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">Convocatorias, orden del día, preguntas de vecinos y seguimiento de acuerdos.</p></div>{canConvene && <button type="button" onClick={() => setShowForm((current) => !current)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><PlusIcon className="h-4 w-4" />Convocar reunión</button>}</header>
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
    {showForm && <form onSubmit={createMeeting} className="grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20 md:grid-cols-2"><h2 className="md:col-span-2 text-lg font-bold">{editingMeetingId ? 'Editar convocatoria' : 'Nueva convocatoria'}</h2><label className="text-sm font-semibold">Título<input required maxLength={120} value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900" /></label><label className="text-sm font-semibold">Tipo<select value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900"><option value="junta">Junta</option><option value="reunion">Reunión</option></select></label><label className="text-sm font-semibold">Fecha y hora<input required type="datetime-local" value={form.inicio} onChange={(event) => setForm({ ...form, inicio: event.target.value })} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900" /></label><label className="text-sm font-semibold">Lugar<input maxLength={120} value={form.ubicacion} onChange={(event) => setForm({ ...form, ubicacion: event.target.value })} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900" /></label><label className="text-sm font-semibold md:col-span-2">Convocatoria<textarea maxLength={2000} rows={3} value={form.convocatoria} onChange={(event) => setForm({ ...form, convocatoria: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900" /></label><div className="md:col-span-2 space-y-3"><div><h3 className="text-sm font-semibold">Orden del día</h3><p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">Añade los puntos por separado. Marca «Generar votación» solo en los que deban votarse.</p></div>{form.agenda.map((item, index) => <div key={`agenda-${index}`} className="grid items-end gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"><label htmlFor={`agenda-point-${index}`} className="text-sm font-medium">Punto {index + 1}<input id={`agenda-point-${index}`} maxLength={500} value={item.texto} onChange={(event) => setForm((current) => ({ ...current, agenda: current.agenda.map((point, pointIndex) => pointIndex === index ? { ...point, texto: event.target.value } : point) }))} placeholder="Escribe el punto del orden del día…" className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-zinc-700 dark:bg-zinc-800" /></label><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={item.generarVotacion} onChange={(event) => setForm((current) => ({ ...current, agenda: current.agenda.map((point, pointIndex) => pointIndex === index ? { ...point, generarVotacion: event.target.checked } : point) }))} className="h-4 w-4 accent-emerald-700" />Generar votación</label><button type="button" aria-label={`Eliminar punto ${index + 1}`} onClick={() => setForm((current) => ({ ...current, agenda: current.agenda.filter((_, pointIndex) => pointIndex !== index) }))} className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Eliminar</button></div>)}<button type="button" onClick={() => setForm((current) => ({ ...current, agenda: [...current.agenda, { texto: '', generarVotacion: false }] }))} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-700 px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/30"><PlusIcon className="h-4 w-4" />Añadir Orden del Día</button></div><label className="text-sm font-semibold md:col-span-2">Documento de convocatoria (enlace opcional)<input type="url" maxLength={1000} value={form.documentoUrl} onChange={(event) => setForm({ ...form, documentoUrl: event.target.value })} placeholder="https://…" className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900" /></label><div className="flex gap-2 md:col-span-2"><button disabled={saving} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Guardando…' : editingMeetingId ? 'Guardar cambios' : 'Publicar convocatoria'}</button><button type="button" onClick={() => { setShowForm(false); setEditingMeetingId(''); setForm(createEmptyMeetingForm()); }} className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-white/70 dark:hover:bg-zinc-800">Cancelar</button></div></form>}
    <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="space-y-5"><section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400">Próximas</h2>{upcoming.length ? upcoming.map((meeting) => <button key={meeting.id} type="button" onClick={() => setSelectedId(meeting.id)} className={`mb-2 w-full rounded-xl border p-3 text-left ${selectedId === meeting.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-100 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800'}`}><span className="block text-sm font-bold">{meeting.titulo}</span><span className="mt-1 block text-xs text-slate-500 dark:text-zinc-400">{meeting.inicio?.toDate?.() ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(meeting.inicio.toDate()) : 'Fecha pendiente'}</span></button>) : <p className="text-sm text-slate-500">No hay reuniones convocadas.</p>}</section><section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400">Celebradas y canceladas</h2>{history.slice(0, 10).map((meeting) => <button key={meeting.id} type="button" onClick={() => setSelectedId(meeting.id)} className={`mb-2 w-full rounded-xl border p-3 text-left ${selectedId === meeting.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-100 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800'}`}><span className="block text-sm font-bold">{meeting.titulo}</span><span className="mt-1 block text-xs capitalize text-slate-500 dark:text-zinc-400">{meeting.estado} · {meeting.inicio?.toDate?.() ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(meeting.inicio.toDate()) : ''}</span></button>)}</section></aside>
      {selected ? <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{selected.tipo === 'junta' ? 'Junta' : 'Reunión'} · {selected.estado}</span><h2 className="mt-3 text-2xl font-bold">{selected.titulo}</h2><p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Convocada por {selected.creadaPorNombre || 'Administración'}{selected.creadaPorCargo ? ` · ${selected.creadaPorCargo}` : ''}</p></div>{isAdmin && selected.estado === 'convocada' && <button type="button" onClick={() => editMeeting(selected)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Editar</button>}{isAdmin && selected.estado === 'convocada' && <button type="button" onClick={() => void updateMeetingStatus('cancelada')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Cancelar convocatoria</button>}{isAdmin && selected.estado === 'convocada' && <button type="button" onClick={() => void updateMeetingStatus('celebrada')} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black">Marcar celebrada</button>}</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-zinc-300"><span className="inline-flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" />{dateText(selected)}</span>{selected.ubicacion && <span className="inline-flex items-center gap-1.5"><MapPinIcon className="h-4 w-4" />{selected.ubicacion}</span>}</div>
        {selected.convocatoria && <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 dark:bg-zinc-800">{selected.convocatoria}</p>}{selected.documentoUrl && /^https:\/\//i.test(selected.documentoUrl) && <a href={selected.documentoUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-emerald-800 underline dark:text-emerald-300">Abrir documento de convocatoria</a>}
        {incomingDelegations.length > 0 && <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30"><h3 className="font-bold">Derecho de voto delegado a tu vivienda</h3><ul className="mt-2 space-y-1 text-sm">{incomingDelegations.map((delegation) => <li key={delegation.uid}>Una delegación de voto está asignada a esta vivienda ({delegation.viviendaLabel || 'vivienda'}).</li>)}</ul></section>}
        <section><h3 className="font-bold">Orden del día</h3>{selected.ordenDelDia?.length ? <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-zinc-300">{selected.ordenDelDia.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ol> : <p className="mt-2 text-sm text-slate-500">No se han añadido puntos.</p>}</section>
        {selected.estado === 'convocada' && <section className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30"><h3 className="font-bold">Asistencia</h3><div className="mt-3 flex flex-wrap items-center gap-4"><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-sm font-semibold dark:border-emerald-900 dark:bg-zinc-900"><input type="checkbox" checked={myAttendance === 'asistire'} onChange={(event) => void respondAttendance(event.target.checked ? 'asistire' : '')} className="h-4 w-4 accent-emerald-700" />Confirmo que asistiré</label><button type="button" aria-pressed={myAttendance === 'no-asistire'} onClick={() => void respondAttendance(myAttendance === 'no-asistire' ? '' : 'no-asistire')} className={`min-h-10 rounded-lg border px-3 text-sm font-semibold ${myAttendance === 'no-asistire' ? 'border-emerald-700 bg-emerald-800 text-white' : 'border-emerald-200 bg-white hover:bg-emerald-100 dark:border-emerald-900 dark:bg-zinc-900'}`}>No podré asistir</button>{myAttendance && <span className="text-xs text-emerald-900 dark:text-emerald-200">Respuesta guardada</span>}</div></section>}
        {selected.estado === 'convocada' && myAttendance === 'no-asistire' && <section className="grid gap-4 rounded-xl border border-slate-200 p-4 dark:border-zinc-700"><div><h3 className="font-bold">Si no puedes asistir</h3><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Puedes enviar tu voto de cada punto a la Administración o delegar el derecho de voto a una vivienda. La delegación se asignará a todos los vecinos activos registrados en ella.</p></div>
          {votingPoints.length ? <form onSubmit={submitVotes} className="space-y-3 rounded-lg bg-slate-50 p-3 dark:bg-zinc-800"><h4 className="text-sm font-bold">Enviar mis votos a la Administración</h4>{votingPoints.map(({ index, texto: point }, voteIndex) => <fieldset key={`${index}-${point}`} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"><legend className="px-1 text-sm font-semibold">{index + 1}. {point}</legend><div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">{[['favor','A favor'],['contra','En contra'],['abstencion','Abstención']].map(([value,label]) => <label key={value} className="inline-flex cursor-pointer items-center gap-2"><input type="radio" name={`vote-${voteIndex}`} value={value} checked={voteDrafts[voteIndex] === value} onChange={() => setVoteDrafts((current) => current.map((answer, answerIndex) => answerIndex === voteIndex ? value : answer))} className="accent-emerald-700" />{label}</label>)}</div></fieldset>)}<button disabled={submitting || voteDrafts.length !== votingPoints.length || voteDrafts.some((answer) => !answer)} className="min-h-10 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Enviando…' : myVotes.length ? 'Actualizar votos enviados' : 'Enviar votos'}</button>{myVotes.length > 0 && <span className="ml-3 text-xs text-emerald-800 dark:text-emerald-300">Tus votos están registrados.</span>}</form> : <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">No se han marcado puntos del orden del día que requieran votación.</p>}
          <form onSubmit={submitDelegation} className="space-y-3 rounded-lg bg-slate-50 p-3 dark:bg-zinc-800"><h4 className="text-sm font-bold">Delegar mi derecho de voto</h4><label className="block text-sm font-medium">Busca una vivienda<input type="search" value={delegationSearch} onChange={(event) => setDelegationSearch(event.target.value)} placeholder="Portal, planta o letra…" className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900" /></label><label className="block text-sm font-medium">Vivienda de destino<select required value={delegationTarget} onChange={(event) => setDelegationTarget(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900"><option value="">Selecciona una vivienda</option>{filteredHomes.map((home) => <option key={home.id} value={home.id}>{homeLabel(home)}</option>)}</select></label>{!filteredHomes.length && <p className="text-xs text-slate-500">No se encontraron viviendas con esa búsqueda.</p>}<button disabled={submitting || !delegationTarget} className="min-h-10 rounded-lg border border-emerald-700 px-4 text-sm font-semibold text-emerald-800 disabled:opacity-50 dark:text-emerald-200">{submitting ? 'Guardando…' : 'Delegar a esta vivienda'}</button>{myDelegation && <span className="ml-3 text-xs text-emerald-800 dark:text-emerald-300">Delegación registrada en {homes.find((home) => home.id === myDelegation) ? homeLabel(homes.find((home) => home.id === myDelegation)!) : 'la vivienda elegida'}.</span>}</form>
        </section>}
         {canViewBallots && submissions.length > 0 && <section className="rounded-xl border border-slate-200 p-4 dark:border-zinc-700"><h3 className="font-bold">Respuestas recibidas por Administración</h3><ul className="mt-2 space-y-2">{submissions.map((submission) => <li key={`${submission.tipo}-${submission.uid}`} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-zinc-800"><strong>{submission.tipo === 'voto' ? 'Voto' : 'Delegación'}</strong> · {submission.viviendaLabel || 'Vivienda sin especificar'}{submission.respuestas && <ol className="mt-2 list-decimal pl-5">{submission.respuestas.map((answer, index) => <li key={index}>{votingPoints[index]?.texto || `Punto votable ${index + 1}`}: {answer === 'favor' ? 'A favor' : answer === 'contra' ? 'En contra' : 'Abstención'}</li>)}</ol>}</li>)}</ul></section>}
        <section><h3 className="flex items-center gap-2 font-bold"><QuestionMarkCircleIcon className="h-5 w-5 text-emerald-700" />Preguntas de vecinos</h3><form onSubmit={submitQuestion} className="mt-3 flex gap-2"><label className="sr-only" htmlFor="meeting-question">Escribe una pregunta</label><input id="meeting-question" maxLength={500} value={questionText} onChange={(event) => setQuestionText(event.target.value)} placeholder="Escribe una pregunta para la reunión…" className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" /><button disabled={!questionText.trim()} className="rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-black">Enviar</button></form><ul className="mt-3 space-y-2">{questions.map((question) => <li key={question.id} className="rounded-xl border border-slate-100 p-3 dark:border-zinc-800"><p className="text-sm">{question.texto}</p><p className="mt-1 text-xs text-slate-500">{question.autorNombre}</p>{question.respuesta && <p className="mt-2 border-l-2 border-emerald-600 pl-3 text-sm">Respuesta: {question.respuesta}</p>}{isAdmin && <form onSubmit={(event) => { event.preventDefault(); void answerQuestion(question); }} className="mt-2 flex gap-2"><label className="sr-only" htmlFor={`answer-${question.id}`}>Responder a {question.autorNombre}</label><input id={`answer-${question.id}`} value={answerDrafts[question.id] ?? question.respuesta ?? ''} onChange={(event) => setAnswerDrafts((current) => ({ ...current, [question.id]: event.target.value }))} maxLength={500} placeholder="Respuesta de Administración…" className="min-h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-zinc-700 dark:bg-zinc-950" /><button className="rounded-lg border border-slate-200 px-3 text-xs font-semibold dark:border-zinc-700">Responder</button></form>}</li>)}</ul></section>
        {selected.estado === 'celebrada' && <section><h3 className="font-bold">Acuerdos y tareas</h3><ul className="mt-2 space-y-2">{agreements.map((agreement) => <li key={agreement.id} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-zinc-800"><span>{agreement.texto}</span>{agreement.responsable && <span className="ml-2 text-xs text-slate-500">· {agreement.responsable}</span>}{agreement.fechaLimite && <span className="ml-2 text-xs text-slate-500">· Límite: {agreement.fechaLimite}</span>}{isAdmin && <button type="button" onClick={() => void toggleAgreement(agreement)} className="ml-3 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold dark:border-zinc-700">{agreement.estado === 'completado' ? 'Reabrir' : 'Completar'}</button>}</li>)}</ul>{isAdmin && <form onSubmit={addAgreement} className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem_9rem_auto]"><label className="sr-only" htmlFor="meeting-agreement">Añadir acuerdo o tarea</label><input id="meeting-agreement" maxLength={500} value={agreementText} onChange={(event) => setAgreementText(event.target.value)} placeholder="Añadir acuerdo o tarea…" className="min-h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" /><label className="sr-only" htmlFor="meeting-owner">Responsable de la tarea</label><input id="meeting-owner" maxLength={120} value={agreementResponsible} onChange={(event) => setAgreementResponsible(event.target.value)} placeholder="Responsable" className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" /><label className="sr-only" htmlFor="meeting-due">Fecha límite de la tarea</label><input id="meeting-due" type="date" value={agreementDue} onChange={(event) => setAgreementDue(event.target.value)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" /><button disabled={!agreementText.trim()} className="rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white disabled:opacity-40">Añadir</button></form>}</section>}
      </article> : <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-center dark:border-zinc-700 dark:bg-zinc-900"><div><ClockIcon className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 font-semibold">Aún no hay juntas o reuniones</p><p className="mt-1 text-sm text-slate-500">Las próximas convocatorias aparecerán aquí.</p></div></div>}
    </div>
  </div>;
}

export default Reuniones;


