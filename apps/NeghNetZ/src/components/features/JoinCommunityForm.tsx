import { useState, type FormEvent } from 'react';
import type { VecinoData } from '../../types/domain';
import { submitMembershipRequest, verifyCommunityAccessCode } from '../../services/membershipService';

export default function JoinCommunityForm({ resident }: { resident: VecinoData }) {
  const personal = resident.datosPersonales || {};
  const [code, setCode] = useState('');
  const [role, setRole] = useState<'propietario' | 'inquilino'>(String(resident.rol || '').toLowerCase() === 'inquilino' ? 'inquilino' : 'propietario');
  const [portal, setPortal] = useState(String(personal.portal || resident.portal || ''));
  const [floor, setFloor] = useState(String(personal.piso || resident.piso || ''));
  const [door, setDoor] = useState(String(personal.letra || resident.letra || ''));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [verifiedCommunity, setVerifiedCommunity] = useState('');

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(''); setNotice('');
    try {
      const result = await verifyCommunityAccessCode(code);
      setCode(result.code);
      setVerifiedCommunity(result.nombreComunidad);
    } catch (verifyError) {
      setVerifiedCommunity('');
      setError(verifyError instanceof Error ? verifyError.message : 'El código de su comunidad no es correcto');
    } finally { setSaving(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(''); setNotice('');
    try {
      const result = await submitMembershipRequest({ code, role, home: { portal, piso: floor, letra: door }, resident });
      setNotice(`Solicitud enviada a ${result.communityName}. No podrás acceder a esa comunidad hasta que la administración apruebe la inscripción.`);
      setCode('');
      setVerifiedCommunity('');
    } catch (submitError) {
      console.error('No se pudo enviar la solicitud de inscripción:', submitError);
      setError(submitError instanceof Error ? submitError.message : 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally { setSaving(false); }
  }

  return <section className="mx-auto mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-950 dark:text-white">Inscribirme en otra comunidad</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">Introduce el código de acceso y la vivienda donde resides o eres propietario. La comunidad se añadirá a tu cuenta cuando su administración apruebe la solicitud.</p>
    </div>
    <form onSubmit={verifiedCommunity ? submit : verify} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="text-sm font-semibold text-slate-800 dark:text-zinc-100 sm:col-span-2 lg:col-span-1">Ingresar su Código de Comunidad
        <input value={code} onChange={(event) => { setCode(event.target.value.replace(/[^a-zA-Z0-9]/g, '')); setVerifiedCommunity(''); }} minLength={8} maxLength={8} required autoComplete="off" placeholder="8 caracteres" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 tracking-[.18em] text-slate-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
      </label>
      {!verifiedCommunity && <button type="submit" disabled={saving || code.length !== 8} className="min-h-11 self-end rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:col-span-2 lg:col-span-2 lg:justify-self-start">{saving ? 'Comprobando…' : 'Comprobar'}</button>}
      {verifiedCommunity && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 sm:col-span-2 lg:col-span-3">Comunidad encontrada: <strong>{verifiedCommunity}</strong>. Completa tus datos para enviar la solicitud.</p>}
      {verifiedCommunity && <>
      <label className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Rango solicitado
        <select value={role} onChange={(event) => setRole(event.target.value as 'propietario' | 'inquilino')} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-slate-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"><option value="propietario">Propietario</option><option value="inquilino">Inquilino</option></select>
      </label>
      <div className="grid grid-cols-3 gap-2 sm:col-span-2 lg:col-span-1">
        <label className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Portal<input value={portal} onChange={(event) => setPortal(event.target.value)} required maxLength={24} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-slate-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></label>
        <label className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Planta<input value={floor} onChange={(event) => setFloor(event.target.value)} required maxLength={24} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-slate-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></label>
        <label className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Puerta<input value={door} onChange={(event) => setDoor(event.target.value)} maxLength={12} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-slate-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></label>
      </div>
      </>}
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 sm:col-span-2 lg:col-span-3">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 sm:col-span-2 lg:col-span-3">{notice}</p>}
      {verifiedCommunity && <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:col-span-2 lg:col-span-3 lg:justify-self-start">{saving ? 'Enviando solicitud…' : 'Solicitar inscripción'}</button>}
    </form>
  </section>;
}
