import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where, writeBatch, db } from '../demo/demoStore';
import { auth } from '../demo/demoAuth';
import type { DemoUnsubscribe as Unsubscribe } from '../demo/demoTypes';
import type { VecinoData } from '../types/domain';
import { toPublicResident } from '../firebase/publicResident';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export interface MembershipRequest {
  id: string;
  uid: string;
  email: string;
  nombre: string;
  idComunidad: string;
  nombreComunidad: string;
  rolSolicitado: 'propietario' | 'inquilino';
  viviendaSolicitada: { portal: string; piso: string; letra: string };
  datosPersonales: Record<string, string>;
  estado: 'pendiente' | 'pendiente_acreditacion' | 'aceptada';
  fechaSolicitud?: unknown;
  acreditacionNota?: string;
  emailAviso?: 'pendiente_configuracion';
  codigoAcceso?: string;
}

export interface MembershipNotice {
  id: string;
  uid: string;
  idComunidad: string;
  solicitudId: string;
  estado: 'pendiente' | 'pendiente_acreditacion' | 'aceptada';
  nombreComunidad: string;
  creadaEn?: unknown;
  revisadaEn?: unknown;
  leidaEn?: unknown;
}

export interface CommunityMembership {
  id: string;
  uid: string;
  idComunidad: string;
  idFicha: string;
  nombreComunidad: string;
  rol: string;
  estado: 'aprobada';
}

export function normalizeAccessCode(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9]/g, '');
}

export async function verifyCommunityAccessCode(value: string) {
  const code = normalizeAccessCode(value);
  if (code.length !== 8) throw new Error('El código de su comunidad no es correcto');
  const snapshot = await getDoc(doc(db, 'codigosAccesoComunidad', code));
  if (!snapshot.exists() || snapshot.get('activo') !== true || !snapshot.get('idComunidad')) {
    throw new Error('El código de su comunidad no es correcto');
  }
  return { code, idComunidad: String(snapshot.get('idComunidad')), nombreComunidad: String(snapshot.get('nombreComunidad') || snapshot.get('idComunidad')) };
}

export function generateCommunityAccessCode() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('');
}

export function subscribeMemberships(uid: string, onChange: (memberships: CommunityMembership[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(query(collection(db, 'membresiasComunidad'), where('uid', '==', uid), where('estado', '==', 'aprobada')),
    (snapshot) => onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CommunityMembership)),
    (error) => onError?.(error));
}

export async function switchActiveCommunity(membership: CommunityMembership) {
  const user = auth.currentUser;
  if (!user || user.uid !== membership.uid) throw new Error('Inicia sesión con la cuenta correspondiente.');
  if (membership.estado !== 'aprobada' || !membership.idComunidad || !membership.idFicha) throw new Error('La inscripción a esa comunidad aún no está aprobada.');
  const membershipSnapshot = await getDoc(doc(db, 'membresiasComunidad', membership.id));
  if (!membershipSnapshot.exists() || membershipSnapshot.get('uid') !== user.uid || membershipSnapshot.get('estado') !== 'aprobada') {
    throw new Error('No se pudo verificar tu inscripción aprobada.');
  }
  const profileSnapshot = await getDoc(doc(db, 'vecinos', membership.idFicha));
  if (!profileSnapshot.exists() || profileSnapshot.get('uid') !== user.uid || profileSnapshot.get('idComunidad') !== membership.idComunidad) {
    throw new Error('No se encontró una ficha activa para esa comunidad. Contacta con la administración.');
  }
  const role = String(profileSnapshot.get('rol') || '').toLowerCase();
  const position = String(profileSnapshot.get('cargo') || '').toLowerCase();
  await updateDoc(doc(db, 'usuariosAcceso', user.uid), {
    idFicha: membership.idFicha,
    idComunidad: membership.idComunidad,
    activo: true,
    administrador: role === 'administrador' && !position.includes('vocal'),
  });
}

export async function submitMembershipRequest(input: {
  code: string;
  role: 'propietario' | 'inquilino';
  home: { portal: string; piso: string; letra: string };
  resident?: VecinoData | null;
}) {
  const user = auth.currentUser;
  if (!user?.email || !user.emailVerified) throw new Error('Verifica tu correo electrónico antes de solicitar la inscripción.');
  const verifiedCode = await verifyCommunityAccessCode(input.code);
  const { code, idComunidad: communityId, nombreComunidad: communityName } = verifiedCode;

  const requestId = `${user.uid}_${communityId}`;
  const requestRef = doc(db, 'solicitudesInscripcion', requestId);
  const previousRequest = await getDoc(requestRef);
  if (previousRequest.exists()) {
    const state = String(previousRequest.get('estado') || '');
    if (state === 'aceptada') throw new Error('Ya tienes una inscripción aprobada en esta comunidad.');
    if (state === 'pendiente' || state === 'pendiente_acreditacion') throw new Error('Ya existe una solicitud pendiente para esta comunidad.');
  }

  const personal = input.resident?.datosPersonales || {};
  const displayName = [personal.nombre || input.resident?.nombre || user.displayName?.split(/\s+/)[0], personal.apellidos || input.resident?.apellidos || user.displayName?.split(/\s+/).slice(1).join(' ')].filter(Boolean).join(' ').trim() || user.email;
  const requestData = {
    uid: user.uid,
    email: user.email.trim().toLowerCase(),
    nombre: displayName,
    idComunidad: communityId,
    nombreComunidad: communityName,
    rolSolicitado: input.role,
    viviendaSolicitada: {
      portal: input.home.portal.trim(),
      piso: input.home.piso.trim(),
      letra: input.home.letra.trim().toUpperCase(),
    },
    datosPersonales: {
      nombre: personal.nombre || input.resident?.nombre || user.displayName?.split(/\s+/)[0] || '',
      apellidos: personal.apellidos || input.resident?.apellidos || user.displayName?.split(/\s+/).slice(1).join(' ') || '',
      dni: personal.dni || '',
      telefono: personal.telefono || personal.movil || '',
    },
    estado: 'pendiente',
    codigoAcceso: code,
    tieneAccesoPrevio: (await getDoc(doc(db, 'usuariosAcceso', user.uid))).exists(),
    fechaSolicitud: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(requestRef, requestData);
  if (input.resident?.idComunidad && input.resident.id && input.resident.uid === user.uid) {
    const currentMembershipRef = doc(db, 'membresiasComunidad', membershipDocId(user.uid, input.resident.idComunidad));
    if (!(await getDoc(currentMembershipRef)).exists()) {
      const currentCommunity = await getDoc(doc(db, 'comunidades', input.resident.idComunidad));
      batch.set(currentMembershipRef, {
        uid: user.uid,
        idComunidad: input.resident.idComunidad,
        idFicha: input.resident.id,
        nombreComunidad: String(currentCommunity.get('nombre') || input.resident.nombreComunidad || input.resident.idComunidad),
        rol: String(input.resident.rol || 'propietario'),
        estado: 'aprobada',
        aprobadaPorUid: user.uid,
        aprobadaEn: serverTimestamp(),
      });
    }
  }
  const membershipAlertRef = doc(db, 'notificacionesInscripcion', communityId, 'solicitudes', requestId);
  batch.set(membershipAlertRef, {
    solicitudId: requestId,
    uid: user.uid,
    idComunidad: communityId,
    nombreComunidad: communityName,
    nombreSolicitante: displayName,
    estado: 'pendiente',
    creadaEn: serverTimestamp(),
  });
  const accessNotificationRef = doc(db, 'usuariosAcceso', user.uid, 'inscripciones', requestId);
  batch.set(accessNotificationRef, {
    uid: user.uid,
    idComunidad: communityId,
    solicitudId: requestId,
    estado: 'pendiente',
    nombreComunidad: communityName,
    creadaEn: serverTimestamp(),
  });
  await batch.commit();
  return { id: requestId, communityId, communityName };
}

export function subscribeMembershipRequests(communityId: string, onChange: (requests: MembershipRequest[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(query(collection(db, 'solicitudesInscripcion'), where('idComunidad', '==', communityId)),
    (snapshot) => onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as MembershipRequest)),
    (error) => onError?.(error));
}

export function subscribeOwnMembershipNotices(uid: string, onChange: (notices: MembershipNotice[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(db, 'usuariosAcceso', uid, 'inscripciones'),
    (snapshot) => onChange(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MembershipNotice)),
    (error) => onError?.(error));
}

export function membershipDocId(uid: string, communityId: string) {
  return `${uid}_${communityId}`;
}

export function profileForMembership(uid: string, communityId: string) {
  return `${uid}__${communityId}`;
}

export async function deferMembershipRequest(request: MembershipRequest, note: string) {
  const user = auth.currentUser;
  if (!user || !request.idComunidad) throw new Error('No se pudo confirmar la comunidad de la solicitud.');
  const batch = writeBatch(db);
  batch.update(doc(db, 'solicitudesInscripcion', request.id), {
    estado: 'pendiente_acreditacion',
    acreditacionNota: note.trim().slice(0, 300),
    revisadaPorUid: user.uid,
    revisadaEn: serverTimestamp(),
  });
  batch.update(doc(db, 'notificacionesInscripcion', request.idComunidad, 'solicitudes', request.id), {
    estado: 'pendiente_acreditacion',
    revisadaPorUid: user.uid,
    revisadaEn: serverTimestamp(),
  });
  batch.update(doc(db, 'usuariosAcceso', request.uid, 'inscripciones', request.id), {
    estado: 'pendiente_acreditacion',
    revisadaEn: serverTimestamp(),
  });
  await batch.commit();
}

export async function approveMembershipRequest(request: MembershipRequest, administrator: VecinoData) {
  const user = auth.currentUser;
  if (!user || administrator.idComunidad !== request.idComunidad) throw new Error('La solicitud no pertenece a tu comunidad activa.');
  const requestRef = doc(db, 'solicitudesInscripcion', request.id);
  const freshRequest = await getDoc(requestRef);
  if (!freshRequest.exists() || freshRequest.get('uid') !== request.uid || !['pendiente', 'pendiente_acreditacion'].includes(String(freshRequest.get('estado')))) {
    throw new Error('La solicitud ya no está pendiente. Actualiza la página.');
  }

  const residentSnapshot = await getDocs(query(collection(db, 'vecinos'), where('idComunidad', '==', request.idComunidad)));
  const email = request.email.trim().toLowerCase();
  const existing = residentSnapshot.docs.find((entry) => {
    const data = entry.data();
    return [data.email, data.datosPersonales?.email].some((value) => String(value || '').trim().toLowerCase() === email);
  });
  const requestedData = freshRequest.data();
  const profileId = existing?.id || profileForMembership(request.uid, request.idComunidad);
  const hasExistingCommunityProfile = existing?.get('idComunidad') === request.idComunidad;
  const profileRef = doc(db, 'vecinos', profileId);
  const existingData = existing?.data() || {};
  const personal = {
    ...(existingData.datosPersonales || {}),
    ...(requestedData.datosPersonales || {}),
    email,
    portal: requestedData.viviendaSolicitada?.portal || '',
    piso: requestedData.viviendaSolicitada?.piso || '',
    letra: requestedData.viviendaSolicitada?.letra || '',
  };
  const profile: VecinoData = hasExistingCommunityProfile ? {
    ...existingData,
    id: profileId,
    uid: request.uid,
    email,
    rol: requestedData.rolSolicitado,
    estado: 'confirmado',
    datosPersonales: personal,
  } as VecinoData : {
    id: profileId,
    uid: request.uid,
    email,
    idComunidad: request.idComunidad,
    rol: requestedData.rolSolicitado,
    estado: 'confirmado',
    datosPersonales: personal,
  } as VecinoData;

  const batch = writeBatch(db);
  if (!hasExistingCommunityProfile) batch.set(profileRef, profile);
  else batch.update(profileRef, { uid: request.uid, estado: 'confirmado', rol: requestedData.rolSolicitado, datosPersonales: personal });
  const communityMembershipPath = doc(db, 'membresiasComunidad', membershipDocId(request.uid, request.idComunidad));
  const accessRef = doc(db, 'usuariosAcceso', request.uid);
  const hasExistingAccess = requestedData.tieneAccesoPrevio === true;
  const identityRef = doc(db, 'vecinoIdentidades', email);
  const identitySnapshot = await getDoc(identityRef);
  if (!identitySnapshot.exists()) {
    batch.set(identityRef, { correo: email, uid: request.uid, idFicha: profileId }, { merge: true });
  }
  const publicRef = doc(db, 'vecinosPublicos', profileId);
  batch.set(publicRef, {
    ...toPublicResident(profile),
    chatEnabled: true,
    actualizadoEn: serverTimestamp(),
  }, { merge: true });
  const membershipData = {
    uid: request.uid,
    idComunidad: request.idComunidad,
    idFicha: profileId,
    nombreComunidad: request.nombreComunidad,
    rol: requestedData.rolSolicitado,
    estado: 'aprobada',
    aprobadaPorUid: user.uid,
    aprobadaEn: serverTimestamp(),
  };
  batch.set(communityMembershipPath, membershipData);
  if (!hasExistingAccess) {
    const role = String(profile.rol || '').toLowerCase();
    const position = String(profile.cargo || '').toLowerCase();
    batch.set(accessRef, {
      uid: request.uid,
      idFicha: profileId,
      idComunidad: request.idComunidad,
      activo: true,
      administrador: role === 'administrador' && !position.includes('vocal'),
    });
  }
  batch.update(requestRef, {
    estado: 'aceptada',
    rol: requestedData.rolSolicitado,
    datosPersonales: personal,
    revisadaPorUid: user.uid,
    revisadaEn: serverTimestamp(),
    idFichaCreada: profileId,
  });
  batch.update(doc(db, 'notificacionesInscripcion', request.idComunidad, 'solicitudes', request.id), {
    estado: 'aceptada',
    revisadaPorUid: user.uid,
    revisadaEn: serverTimestamp(),
  });
  batch.update(doc(db, 'usuariosAcceso', request.uid, 'inscripciones', request.id), {
    estado: 'aceptada',
    revisadaEn: serverTimestamp(),
  });
  await batch.commit();
}
