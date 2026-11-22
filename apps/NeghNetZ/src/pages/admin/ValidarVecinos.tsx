import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { collection, doc, onSnapshot, query, serverTimestamp, writeBatch, where } from '../../demo/demoStore';
import { auth } from '../../demo/demoAuth';
import { db } from '../../demo/demoStore';
import { toPublicResident } from '../../firebase/publicResident';
import type { VecinoData, VecinoOutletContext } from '../../types/domain';
import { approveMembershipRequest, deferMembershipRequest, subscribeMembershipRequests, type MembershipRequest } from '../../services/membershipService';

const ESTADOS_PENDIENTES = ['pendiente_de_confirmacion', 'pendienteValidacion', 'pendiente', 'en_revision'];

function ValidarVecinos() {
  const [datosAdministrador] = useOutletContext<VecinoOutletContext>();
  const [vecinosPendientes, setVecinosPendientes] = useState<VecinoData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [processingMembershipId, setProcessingMembershipId] = useState<string | null>(null);

  useEffect(() => {
    const pendientesQuery = query(
      collection(db, 'vecinos'),
      where('estado', 'in', ESTADOS_PENDIENTES),
    );

    return onSnapshot(pendientesQuery, (snapshot) => {
      const currentUids = new Set([datosAdministrador?.uid, auth.currentUser?.uid].filter(Boolean));
      const currentEmails = new Set([datosAdministrador?.email, auth.currentUser?.email]
        .filter((email): email is string => Boolean(email))
        .map((email) => email.trim().toLowerCase()));
      setVecinosPendientes(snapshot.docs
        .filter((item) => {
          const data = item.data();
          const itemEmail = String(data.email || data.datosPersonales?.email || '').trim().toLowerCase();
          return !currentUids.has(item.id)
            && (!itemEmail || !currentEmails.has(itemEmail))
            && data.rol?.toLowerCase() !== 'administrador';
        })
        .map((item) => ({ id: item.id, ...item.data() }) as VecinoData));
      setError('');
      setCargando(false);
    }, (snapshotError) => {
      console.error('Error al obtener solicitudes pendientes:', snapshotError);
      setError('No se pudieron cargar las solicitudes. Comprueba tu conexión y los permisos de administración.');
      setCargando(false);
    });
  }, [datosAdministrador?.uid, datosAdministrador?.email]);

  useEffect(() => {
    const communityId = datosAdministrador?.idComunidad;
    if (!communityId) { setMembershipRequests([]); return undefined; }
    return subscribeMembershipRequests(communityId, setMembershipRequests, (requestError) => {
      console.error('No se pudieron cargar las solicitudes de inscripción:', requestError);
      setError('No se pudieron cargar las solicitudes de inscripción en esta comunidad.');
    });
  }, [datosAdministrador?.idComunidad]);

  const handleMembershipApproval = async (request: MembershipRequest) => {
    setProcessingMembershipId(request.id); setError('');
    try { await approveMembershipRequest(request, datosAdministrador!); }
    catch (approvalError) {
      console.error('No se pudo aprobar la inscripción:', approvalError);
      setError(approvalError instanceof Error ? approvalError.message : 'No se pudo aprobar la inscripción.');
    } finally { setProcessingMembershipId(null); }
  };

  const handleMembershipDeferral = async (request: MembershipRequest) => {
    setProcessingMembershipId(request.id); setError('');
    try { await deferMembershipRequest(request, 'Pendiente de comprobar que la persona pertenece a la vivienda indicada y confirmar su rango.'); }
    catch (deferralError) {
      console.error('No se pudo dejar pendiente la inscripción:', deferralError);
      setError('No se pudo actualizar el estado de la solicitud.');
    } finally { setProcessingMembershipId(null); }
  };

  const handleAprobar = async (uid: string) => {
    setProcesandoId(uid);
    setError('');
    try {
      const resident = vecinosPendientes.find((entry) => entry.id === uid);
      if (!resident?.id || !resident.uid || !resident.idComunidad) throw new Error('La ficha no tiene la vinculación necesaria para aprobarla.');
      const publicProfile = { ...toPublicResident(resident), chatEnabled: true, actualizadoEn: serverTimestamp() };
      const batch = writeBatch(db);
      batch.update(doc(db, 'vecinos', uid), { estado: 'confirmado' });
      batch.update(doc(db, 'usuariosAcceso', resident.uid), {
        idFicha: resident.id,
        idComunidad: resident.idComunidad,
        activo: true,
        administrador: resident.rol?.toLocaleLowerCase('es') === 'administrador',
      });
      batch.set(doc(db, 'vecinosPublicos', resident.id), publicProfile);
      await batch.commit();
    } catch (approvalError) {
      console.error('Error al aprobar la solicitud:', approvalError);
      setError('No se pudo aprobar la solicitud. Comprueba los permisos de Firestore e inténtalo de nuevo.');
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de vecinos</h1>
        <p className="mt-1 text-sm text-gray-600">Solicitudes reales recibidas en la comunidad.</p>
      </header>

      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Solicitudes de inscripción a esta comunidad</h2><p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">Se actualizan en tiempo real. Hasta aprobarlas, las personas solicitantes no pueden acceder a la comunidad.</p></div>
          {membershipRequests.filter((request) => request.estado !== 'aceptada').length > 0 && <span className="rounded-full bg-emerald-800 px-3 py-1 text-sm font-bold text-white">{membershipRequests.filter((request) => request.estado !== 'aceptada').length} pendientes</span>}
        </div>
        {membershipRequests.filter((request) => request.estado !== 'aceptada').length === 0 ? <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600 dark:bg-zinc-900 dark:text-zinc-300">No hay solicitudes de inscripción pendientes.</p> : <ul className="mt-4 space-y-3">
          {membershipRequests.filter((request) => request.estado !== 'aceptada').map((request) => {
            const isProcessing = processingMembershipId === request.id;
            const home = request.viviendaSolicitada;
            const isAccreditation = request.estado === 'pendiente_acreditacion';
            return <li key={request.id} className="rounded-xl bg-white p-4 dark:bg-zinc-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-950 dark:text-white">{request.nombre}</h3>
                  <p className="mt-0.5 break-all text-sm text-slate-600 dark:text-zinc-300">{request.email}</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-zinc-200">{request.rolSolicitado === 'inquilino' ? 'Inquilino' : 'Propietario'} · Portal {home?.portal || '—'}, {home?.piso || '—'}{home?.letra ? ` ${home.letra}` : ''}</p>
                  {isAccreditation && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">Pendiente de acreditación{request.acreditacionNota ? `: ${request.acreditacionNota}` : '.'}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void handleMembershipApproval(request)} disabled={isProcessing} className="min-h-10 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50">{isProcessing ? 'Guardando…' : 'Aceptar inscripción'}</button>
                  {!isAccreditation && <button type="button" onClick={() => void handleMembershipDeferral(request)} disabled={isProcessing} className="min-h-10 rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 disabled:opacity-50 dark:border-amber-900 dark:text-amber-200 dark:hover:bg-amber-950/40">Pendiente de acreditación</button>}
                </div>
              </div>
            </li>;
          })}
        </ul>}
      </section>
      {cargando ? (
        <p role="status" className="rounded-lg bg-white p-6 text-gray-600">Cargando solicitudes…</p>
      ) : vecinosPendientes.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-gray-600">No hay solicitudes pendientes de validación.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-600" aria-live="polite">{vecinosPendientes.length} {vecinosPendientes.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}</p>
          <ul className="space-y-3">
            {vecinosPendientes.map((vecino) => {
              const personal = vecino.datosPersonales;
              const nombre = [personal?.nombre || vecino.nombre, personal?.apellidos || vecino.apellidos].filter(Boolean).join(' ') || 'Nombre no registrado';
              const vivienda = [personal?.portal || vecino.portal, personal?.piso || vecino.piso, personal?.letra || vecino.letra].filter(Boolean).join(' · ');
              const procesando = procesandoId === vecino.id;

              return (
                <li key={vecino.id} className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900">{nombre}</h2>
                    <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-gray-600 sm:grid-cols-2">
                      <div><dt className="inline font-medium">Correo: </dt><dd className="inline break-all">{personal?.email || vecino.email || 'No registrado'}</dd></div>
                      <div><dt className="inline font-medium">Vivienda: </dt><dd className="inline">{vivienda || 'No registrada'}</dd></div>
                      <div><dt className="inline font-medium">DNI: </dt><dd className="inline">{personal?.dni || vecino.dni || 'No registrado'}</dd></div>
                      <div><dt className="inline font-medium">Perfil solicitado: </dt><dd className="inline">{vecino.rol || 'No indicado'}</dd></div>
                      <div><dt className="inline font-medium">Estado: </dt><dd className="inline">{vecino.estado}</dd></div>
                    </dl>
                  </div>
                  <button
                    type="button"
                    onClick={() => vecino.id && handleAprobar(vecino.id)}
                    disabled={!vecino.id || procesandoId !== null}
                    className="shrink-0 rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {procesando ? 'Aprobando…' : 'Aprobar solicitud'}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}

export default ValidarVecinos;
