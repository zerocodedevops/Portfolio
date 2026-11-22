import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, runTransaction, serverTimestamp, setDoc, where } from '../demo/demoStore';
import { BuildingStorefrontIcon, CheckIcon, EnvelopeIcon, GlobeAltIcon, MagnifyingGlassIcon, PhoneIcon, PlusIcon, TrashIcon, WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useOutletContext } from 'react-router-dom';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { VecinoOutletContext } from '../types/domain';
import { hasAdministratorAccess, isDeveloperEmail } from '../utils/residentRoles';

const categories = ['Administración de fincas', 'Albañilería y reformas', 'Ascensores', 'Calderas, gas y climatización', 'Cerrajería', 'Cerrajería de seguridad', 'CCTV y alarmas', 'Control de plagas', 'Conserjería y auxiliares de finca', 'Electricidad', 'Electricidad e iluminación', 'Fontanería', 'Fontanería común y desatascos', 'Inspecciones técnicas y rehabilitación', 'Impermeabilización y tejados', 'Jardinería', 'Jardinería y zonas verdes', 'Limpieza', 'Limpieza de zonas comunes', 'Mantenimiento de piscinas', 'Mudanzas', 'Pintura', 'Pintura y albañilería de mantenimiento', 'Protección contra incendios', 'Puertas automáticas de garaje', 'Seguros y gestión de siniestros', 'Socorrismo de piscinas', 'Telecomunicaciones, antenas y videoporteros', 'Otros'] as const;
type ProfessionalCategory = typeof categories[number];
type ProposalStatus = 'pendiente' | 'aprobada' | 'rechazada';
interface Professional { id: string; idComunidad: string; nombre: string; categoria: ProfessionalCategory; descripcion: string; telefono: string; email: string; web: string; recomendadoPorNombre: string; propuestaId: string; publicadoEn?: { toDate?: () => Date }; }
interface Proposal extends Omit<Professional, 'id' | 'recomendadoPorNombre' | 'propuestaId' | 'publicadoEn'> { id: string; propuestoPorUid: string; propuestoPorNombre: string; estado: ProposalStatus; creadaEn?: { toDate?: () => Date }; revisadaEn?: { toDate?: () => Date }; }
interface FormState { nombre: string; categoria: ProfessionalCategory; descripcion: string; telefono: string; email: string; web: string; aceptaCompartirContacto: boolean; }

const initialForm: FormState = { nombre: '', categoria: 'Fontanería', descripcion: '', telefono: '', email: '', web: '', aceptaCompartirContacto: false };

function dateLabel(value?: Professional['publicadoEn']) {
  const date = value?.toDate?.();
  return date ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(date) : '';
}

function ProfesionalCard({ professional, canManage, onDelete }: { professional: Professional; canManage: boolean; onDelete: (professional: Professional) => void }) {
  return <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"><WrenchScrewdriverIcon className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{professional.categoria}</p><h2 className="mt-1 break-words text-lg font-bold leading-snug">{professional.nombre}</h2></div>
      {canManage && <button type="button" onClick={() => onDelete(professional)} aria-label={`Retirar a ${professional.nombre} del directorio`} title="Retirar del directorio" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-700 dark:hover:bg-rose-950"><TrashIcon className="h-5 w-5" /></button>}
    </div>
    <p className="mt-4 flex-1 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-zinc-300">{professional.descripcion}</p>
    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-zinc-800">
      {professional.telefono && <a href={`tel:${professional.telefono.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"><PhoneIcon className="h-4 w-4" />Llamar</a>}
      {professional.email && <a href={`mailto:${professional.email}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"><EnvelopeIcon className="h-4 w-4" />Email</a>}
      {professional.web && <a href={professional.web} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"><GlobeAltIcon className="h-4 w-4" />Web</a>}
    </div>
    <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400">Recomendado por {professional.recomendadoPorNombre}{dateLabel(professional.publicadoEn) ? ` · ${dateLabel(professional.publicadoEn)}` : ''}</p>
  </article>;
}

function Profesionales() {
  const [resident] = useOutletContext<VecinoOutletContext>();
  const uid = auth.currentUser?.uid || resident?.uid || '';
  const communityId = resident?.idComunidad || '';
  const residentName = [resident?.datosPersonales?.nombre, resident?.datosPersonales?.apellidos].filter(Boolean).join(' ') || auth.currentUser?.displayName || 'Vecino';
  const canManage = hasAdministratorAccess(resident) || isDeveloperEmail(auth.currentUser?.email);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [myProposals, setMyProposals] = useState<Proposal[]>([]);
  const [pendingProposals, setPendingProposals] = useState<Proposal[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyProposal, setBusyProposal] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!communityId) { setProfessionals([]); setLoading(false); setDirectoryError(''); return undefined; }
    setProfessionals([]); setLoading(true); setDirectoryError('');
    return onSnapshot(query(collection(db, 'profesionalesRecomendados'), where('idComunidad', '==', communityId)), (snapshot) => {
      setProfessionals(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Professional).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
      setLoading(false); setDirectoryError('');
    }, (listenError) => { console.error('No se pudo cargar el directorio profesional:', listenError); setDirectoryError('No se pudo cargar el directorio. Comprueba tus permisos y la conexión.'); setLoading(false); });
  }, [communityId]);

  useEffect(() => {
    if (!communityId || !uid) { setMyProposals([]); return undefined; }
    return onSnapshot(query(collection(db, 'propuestasProfesionales'), where('idComunidad', '==', communityId), where('propuestoPorUid', '==', uid)), (snapshot) => {
      setMyProposals(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Proposal).sort((a, b) => (b.creadaEn?.toDate?.().getTime() || 0) - (a.creadaEn?.toDate?.().getTime() || 0)));
    }, (listenError) => console.error('No se pudieron cargar tus propuestas:', listenError));
  }, [communityId, uid]);

  useEffect(() => {
    if (!communityId || !canManage) { setPendingProposals([]); return undefined; }
    return onSnapshot(query(collection(db, 'propuestasProfesionales'), where('idComunidad', '==', communityId), where('estado', '==', 'pendiente')), (snapshot) => {
      setPendingProposals(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Proposal).sort((a, b) => (a.creadaEn?.toDate?.().getTime() || 0) - (b.creadaEn?.toDate?.().getTime() || 0)));
    }, (listenError) => { console.error('No se pudieron cargar las propuestas pendientes:', listenError); setError('No se pudieron cargar las propuestas pendientes de revisión.'); });
  }, [communityId, canManage]);

  const visibleProfessionals = useMemo(() => professionals.filter((professional) => {
    const needle = search.trim().toLocaleLowerCase('es');
    const matchesSearch = !needle || [professional.nombre, professional.categoria, professional.descripcion, professional.recomendadoPorNombre].some((value) => value?.toLocaleLowerCase('es').includes(needle));
    return matchesSearch && (categoryFilter === 'Todas' || professional.categoria === categoryFilter);
  }), [professionals, search, categoryFilter]);

  async function submitProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setNotice('');
    if (!uid || !communityId) { setError('Tu cuenta todavía no está vinculada a una comunidad activa.'); return; }
    if (!form.telefono.trim() && !form.email.trim() && !form.web.trim()) { setError('Añade al menos una forma de contacto profesional.'); return; }
    if (form.web.trim() && !/^https:\/\//i.test(form.web.trim())) { setError('La página web debe comenzar por https://.'); return; }
    if (!form.aceptaCompartirContacto) { setError('Confirma que el contacto es profesional y puede compartirse con tu comunidad.'); return; }
    setSaving(true);
    try {
      await setDoc(doc(collection(db, 'propuestasProfesionales')), {
        idComunidad: communityId, nombre: form.nombre.trim(), categoria: form.categoria,
        descripcion: form.descripcion.trim(), telefono: form.telefono.trim(), email: form.email.trim(), web: form.web.trim(),
        autorizaCompartirContacto: form.aceptaCompartirContacto,
        propuestoPorUid: uid, propuestoPorNombre: residentName, estado: 'pendiente', creadaEn: serverTimestamp(),
      });
      setForm(initialForm);
      setNotice('Gracias. La propuesta se ha enviado y solo aparecerá en el directorio cuando la Administración la apruebe.');
    } catch (submitError) { console.error('No se pudo enviar la propuesta:', submitError); setError('No se pudo enviar la propuesta. Comprueba tu conexión e inténtalo de nuevo.'); }
    finally { setSaving(false); }
  }

  async function reviewProposal(proposal: Proposal, approve: boolean) {
    if (!canManage || !uid || busyProposal) return;
    setBusyProposal(proposal.id); setError(''); setNotice('');
    try {
      await runTransaction(db, async (transaction) => {
        const proposalRef = doc(db, 'propuestasProfesionales', proposal.id);
        const current = await transaction.get(proposalRef);
        if (!current.exists() || current.get('idComunidad') !== communityId || current.get('estado') !== 'pendiente') throw new Error('La propuesta ya no está pendiente de revisión.');
        if (approve) {
          const listingRef = doc(collection(db, 'profesionalesRecomendados'));
          transaction.set(listingRef, {
            idComunidad: communityId, nombre: current.get('nombre'), categoria: current.get('categoria'),
            descripcion: current.get('descripcion'), telefono: current.get('telefono'), email: current.get('email'), web: current.get('web'),
            recomendadoPorNombre: current.get('propuestoPorNombre'), propuestaId: proposal.id,
            publicadoPorUid: uid, publicadoEn: serverTimestamp(),
          });
          transaction.update(proposalRef, { estado: 'aprobada', idProfesional: listingRef.id, revisadaPorUid: uid, revisadaPorNombre: residentName, revisadaEn: serverTimestamp() });
        } else {
          transaction.update(proposalRef, { estado: 'rechazada', revisadaPorUid: uid, revisadaPorNombre: residentName, revisadaEn: serverTimestamp() });
        }
      });
      setNotice(approve ? 'El profesional ya está publicado en el directorio.' : 'La propuesta se ha marcado como rechazada.');
    } catch (reviewError) { console.error('No se pudo revisar la propuesta:', reviewError); setError(reviewError instanceof Error ? reviewError.message : 'No se pudo revisar la propuesta.'); }
    finally { setBusyProposal(''); }
  }

  async function removeProfessional(professional: Professional) {
    if (!canManage || !window.confirm(`¿Retirar a ${professional.nombre} del directorio?`)) return;
    try { await deleteDoc(doc(db, 'profesionalesRecomendados', professional.id)); setNotice('Se ha retirado el profesional del directorio.'); }
    catch (deleteError) { console.error('No se pudo retirar el profesional:', deleteError); setError('No se pudo retirar del directorio.'); }
  }

  return <main className="mx-auto max-w-6xl space-y-6 text-slate-900 dark:text-white">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Servicios recomendados por vecinos</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Directorio de Servicios</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">Encuentra contactos útiles para tu vivienda. Las nuevas recomendaciones se revisan antes de publicarse.</p></div>
      <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 dark:bg-zinc-900"><BuildingStorefrontIcon className="h-5 w-5 text-emerald-800 dark:text-emerald-300" /><div><p className="text-xl font-bold tabular-nums">{professionals.length}</p><p className="text-xs text-slate-600 dark:text-zinc-400">en el directorio</p></div></div>
    </header>

    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}

    <section className="rounded-2xl bg-slate-100 p-5 dark:bg-zinc-900 sm:p-6" aria-labelledby="recommend-professional-title">
      <div className="mb-4 flex items-start gap-3"><span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-800 dark:bg-zinc-800 dark:text-emerald-300"><PlusIcon className="h-5 w-5" /></span><div><h2 id="recommend-professional-title" className="text-lg font-bold">Recomendar un profesional</h2><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">La propuesta queda privada hasta que la revise la Administración.</p></div></div>
      <form onSubmit={(event) => void submitProposal(event)} className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Nombre del profesional o negocio<input required minLength={2} maxLength={120} value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-emerald-950" /></label>
        <label className="text-sm font-semibold">Especialidad<select value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value as ProfessionalCategory })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-emerald-950">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="text-sm font-semibold sm:col-span-2">¿Por qué lo recomiendas?<textarea required minLength={10} maxLength={700} rows={3} value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} placeholder="Describe brevemente el trabajo o servicio que puede ofrecer." className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-emerald-950" /></label>
        <label className="text-sm font-semibold">Teléfono profesional<input type="tel" maxLength={30} value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} autoComplete="tel" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-emerald-950" /></label>
        <label className="text-sm font-semibold">Correo profesional<input type="email" maxLength={160} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-emerald-950" /></label>
        <label className="text-sm font-semibold sm:col-span-2">Página web<input type="url" maxLength={500} value={form.web} onChange={(event) => setForm({ ...form, web: event.target.value })} placeholder="https://…" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-emerald-950" /></label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 text-sm leading-5 dark:bg-zinc-950 sm:col-span-2"><input required type="checkbox" checked={form.aceptaCompartirContacto} onChange={(event) => setForm({ ...form, aceptaCompartirContacto: event.target.checked })} className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-800" /><span>Confirmo que los datos de contacto facilitados son profesionales y pueden compartirse con los vecinos de mi comunidad si se aprueba la recomendación.</span></label>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2"><p className="text-xs text-slate-500 dark:text-zinc-400">Incluye al menos un teléfono, correo o web. No añadas datos privados.</p><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60"><PlusIcon className="h-4 w-4" />{saving ? 'Enviando…' : 'Enviar recomendación'}</button></div>
      </form>
    </section>

    {canManage && <section className="space-y-3" aria-labelledby="pending-professionals-title"><div className="flex items-center justify-between gap-3"><div><h2 id="pending-professionals-title" className="text-xl font-bold">Pendientes de revisión</h2><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Solo los cargos con permisos de gestión pueden aprobar o rechazar propuestas.</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">{pendingProposals.length}</span></div>
      {pendingProposals.length === 0 && <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">No hay recomendaciones pendientes.</p>}
      {pendingProposals.length > 0 && <ul className="space-y-3">{pendingProposals.map((proposal) => <li key={proposal.id} className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/20"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-amber-900 dark:text-amber-200">{proposal.categoria} · Propuesto por {proposal.propuestoPorNombre}</p><h3 className="mt-1 text-lg font-bold">{proposal.nombre}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{proposal.descripcion}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700 dark:text-zinc-300">{proposal.telefono && <span>Tel. {proposal.telefono}</span>}{proposal.email && <span>{proposal.email}</span>}{proposal.web && <a href={proposal.web} target="_blank" rel="noreferrer" className="underline">Web</a>}</div></div><div className="flex gap-2"><button type="button" disabled={Boolean(busyProposal)} onClick={() => void reviewProposal(proposal, true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-800 px-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"><CheckIcon className="h-4 w-4" />Aprobar</button><button type="button" disabled={Boolean(busyProposal)} onClick={() => void reviewProposal(proposal, false)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-300 px-3 text-sm font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950"><XMarkIcon className="h-4 w-4" />Rechazar</button></div></div></li>)}</ul>}
    </section>}

    {myProposals.length > 0 && <section aria-labelledby="my-professional-proposals-title"><h2 id="my-professional-proposals-title" className="mb-3 text-xl font-bold">Mis propuestas</h2><ul className="flex flex-wrap gap-2">{myProposals.map((proposal) => <li key={proposal.id} className="flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm dark:bg-zinc-900"><span>{proposal.nombre}</span><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${proposal.estado === 'aprobada' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : proposal.estado === 'rechazada' ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200' : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'}`}>{proposal.estado === 'aprobada' ? 'Publicada' : proposal.estado === 'rechazada' ? 'Rechazada' : 'Pendiente'}</span></li>)}</ul></section>}

    <section aria-labelledby="professionals-list-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 id="professionals-list-title" className="text-xl font-bold">Directorio de la comunidad</h2><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Contactos publicados tras la revisión de Administración.</p></div><div className="flex w-full flex-wrap gap-2 sm:w-auto"><label className="relative min-w-[min(100%,15rem)] flex-1 sm:flex-none"><span className="sr-only">Buscar profesional</span><MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar profesional…" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-emerald-950" /></label><label><span className="sr-only">Filtrar por especialidad</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-emerald-950"><option>Todas</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div></div>
      {loading ? <p className="rounded-xl bg-slate-100 p-8 text-center text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-300">Cargando el directorio…</p> : directoryError ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{directoryError}</p> : !communityId ? <p className="rounded-xl bg-slate-100 p-8 text-center text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-300">Selecciona una comunidad para ver sus profesionales.</p> : visibleProfessionals.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleProfessionals.map((professional) => <ProfesionalCard key={professional.id} professional={professional} canManage={canManage} onDelete={(item) => void removeProfessional(item)} />)}</div> : <div className="rounded-xl bg-slate-100 px-5 py-10 text-center dark:bg-zinc-900"><BuildingStorefrontIcon className="mx-auto h-8 w-8 text-slate-400" /><h3 className="mt-3 font-semibold">{professionals.length ? 'No hay resultados para esa búsqueda' : 'Todavía no hay profesionales recomendados'}</h3><p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{professionals.length ? 'Prueba con otro nombre o especialidad.' : 'Envía una recomendación para que la Administración la revise.'}</p></div>}
    </section>
    <p className="text-xs leading-5 text-slate-500 dark:text-zinc-400">Las recomendaciones reflejan experiencias compartidas por vecinos; no constituyen una certificación o garantía de los servicios. Comprueba las condiciones con cada profesional.</p>
  </main>;
}

export default Profesionales;
