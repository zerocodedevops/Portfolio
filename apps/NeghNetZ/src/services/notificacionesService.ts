import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch, db } from '../demo/demoStore';
import type { DemoUnsubscribe as Unsubscribe } from '../demo/demoTypes';
import { auth } from '../demo/demoAuth';
import type { NotificacionData } from '../types/domain';
import { isMessageSoundEnabled, playMessageSound } from './notificationSound';

export interface NotificationPreferences {
  mensajes: boolean;
  incidencias: boolean;
  reservas: boolean;
  votaciones: boolean;
  documentos: boolean;
  reuniones: boolean;
  comunidad: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  mensajes: true, incidencias: true, reservas: true, votaciones: true,
  documentos: true, reuniones: true, comunidad: true,
};

export function isNotificationCategoryVisible(type: NotificacionData['tipo'], preferences: NotificationPreferences) {
  if (type === 'inscripcion') return true;
  const key: keyof NotificationPreferences = type === 'mensaje' ? 'mensajes'
    : type === 'votacion' ? 'votaciones'
      : type === 'documento' ? 'documentos'
        : type === 'incidencia' ? 'incidencias'
      : type === 'reserva' ? 'reservas'
            : type === 'reunion' ? 'reuniones' : 'comunidad';
  return preferences[key];
}

export function subscribeNotificationPreferences(uid: string, communityId: string, onChange: (preferences: NotificationPreferences) => void): Unsubscribe {
  return onSnapshot(doc(db, 'preferenciasNotificaciones', uid), (snapshot) => {
    const data = snapshot.data();
    onChange(snapshot.exists() && data?.idComunidad === communityId
      ? { ...DEFAULT_NOTIFICATION_PREFERENCES, ...data.preferencias }
      : DEFAULT_NOTIFICATION_PREFERENCES);
  });
}

export function subscribeNotifications(
  uid: string,
  communityId: string,
  onChange: (items: NotificacionData[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let baselineReady = false;
  const seen = new Set<string>();
  const notificationsQuery = query(
    collection(db, 'notificaciones'),
    where('destinatarioUid', '==', uid),
    where('idComunidad', '==', communityId),
    orderBy('creadaEn', 'desc'),
    limit(50),
  );
  return onSnapshot(notificationsQuery, (snapshot) => {
    const items = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as NotificacionData);
    if (baselineReady && isMessageSoundEnabled()) {
      const incoming = items.some((item) => !seen.has(item.id) && item.creadaPorUid !== uid);
      if (incoming) playMessageSound();
    }
    items.forEach((item) => seen.add(item.id));
    if (!snapshot.metadata.fromCache) baselineReady = true;
    onChange(items);
  }, (error) => onError?.(error));
}

export async function markNotificationRead(notificationId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Inicia sesión para actualizar tus notificaciones.');
  await updateDoc(doc(db, 'notificaciones', notificationId), { leida: true, leidaEn: serverTimestamp() });
}

export async function markAllNotificationsRead(items: NotificacionData[]) {
  const unread = items.filter((item) => !item.leida);
  for (let offset = 0; offset < unread.length; offset += 450) {
    const batch = writeBatch(db);
    unread.slice(offset, offset + 450).forEach((item) => {
      batch.update(doc(db, 'notificaciones', item.id), { leida: true, leidaEn: serverTimestamp() });
    });
    await batch.commit();
  }
}

export function notificationRoute(item: NotificacionData) {
  if (item.enlace?.startsWith('/dashboard') || item.enlace?.startsWith('/admin')) return item.enlace;
  return '/dashboard';
}

export async function notifyCommunityMembers(input: {
  communityId: string;
  actorUid: string;
  actorName: string;
  type: NotificacionData['tipo'];
  title: string;
  description: string;
  route: string;
  sourceId: string;
  excludeActor?: boolean;
}) {
  const residents = await getDocs(query(
    collection(db, 'vecinosPublicos'),
    where('idComunidad', '==', input.communityId),
    where('activo', '==', true),
  ));
  const recipients = residents.docs
    .map((entry) => ({ uid: String(entry.get('uid') || '') }))
    .filter((entry) => entry.uid && (!input.excludeActor || entry.uid !== input.actorUid));
  for (let offset = 0; offset < recipients.length; offset += 450) {
    const batch = writeBatch(db);
    recipients.slice(offset, offset + 450).forEach(({ uid }) => {
      const notificationId = `${input.type}_${input.sourceId}_${uid}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      batch.set(doc(db, 'notificaciones', notificationId), {
        destinatarioUid: uid,
        idComunidad: input.communityId,
        tipo: input.type,
        titulo: input.title,
        descripcion: input.description,
        creadaPorUid: input.actorUid,
        creadaPorNombre: input.actorName,
        creadaEn: serverTimestamp(),
        leida: false,
        enlace: input.route,
        sourceId: input.sourceId,
      });
    });
    await batch.commit();
  }
}

export async function notifyAdministrators(input: {
  communityId: string;
  actorUid: string;
  title: string;
  description: string;
  route: string;
  sourceId: string;
}) {
  const residents = await getDocs(query(
    collection(db, 'vecinosPublicos'),
    where('idComunidad', '==', input.communityId),
    where('activo', '==', true),
  ));
  const recipients = residents.docs
    .filter((entry) => String(entry.get('rol') || '').toLocaleLowerCase('es') === 'administrador')
    .map((entry) => String(entry.get('uid') || ''))
    .filter((uid) => uid && uid !== input.actorUid);
  if (!recipients.length) return;
  const batch = writeBatch(db);
  recipients.forEach((uid) => batch.set(doc(db, 'notificaciones', `reserva_${input.sourceId}_${uid}`), {
    destinatarioUid: uid,
    idComunidad: input.communityId,
    tipo: 'reserva',
    titulo: input.title,
    descripcion: input.description,
    creadaPorUid: input.actorUid,
    creadaEn: serverTimestamp(),
    leida: false,
    enlace: input.route,
    sourceId: input.sourceId,
  }));
  await batch.commit();
}

export async function notifyReservationOwner(input: {
  communityId: string;
  actorUid: string;
  recipientUid: string;
  reservationId: string;
  title: string;
  description: string;
}) {
  if (!input.recipientUid || input.recipientUid === input.actorUid) return;
  await setDoc(doc(db, 'notificaciones', `reserva_${input.reservationId}_${input.recipientUid}`), {
    destinatarioUid: input.recipientUid,
    idComunidad: input.communityId,
    tipo: 'reserva',
    titulo: input.title,
    descripcion: input.description,
    creadaPorUid: input.actorUid,
    creadaEn: serverTimestamp(),
    leida: false,
    enlace: '/dashboard/reservas',
    sourceId: input.reservationId,
  }, { merge: true });
}

export async function notifyPostAuthor(input: {
  communityId: string;
  actorUid: string;
  actorName: string;
  postId: string;
  postAuthorUid: string;
  activityId: string;
  activityType: 'comentario' | 'reaccion';
  description: string;
}) {
  if (!input.postAuthorUid || input.postAuthorUid === input.actorUid) return;
  const notificationId = `comunidad_${input.activityType}_${input.activityId}_${input.postAuthorUid}`;
  await setDoc(doc(db, 'notificaciones', notificationId), {
    destinatarioUid: input.postAuthorUid,
    idComunidad: input.communityId,
    tipo: 'comunidad',
    titulo: input.activityType === 'comentario' ? `${input.actorName} comentó tu publicación` : `${input.actorName} reaccionó a tu publicación`,
    descripcion: input.description,
    creadaPorUid: input.actorUid,
    creadaPorNombre: input.actorName,
    creadaEn: serverTimestamp(),
    leida: false,
    enlace: '/dashboard/comunidad',
    sourceId: input.postId,
    actividadId: input.activityId,
    actividadTipo: input.activityType,
  });
}

export async function notifyMentionedResidents(input: {
  communityId: string;
  actorUid: string;
  actorName: string;
  postId: string;
  mentionedUids: string[];
  postPreview: string;
}) {
  const recipients = input.mentionedUids.filter((targetUid) => targetUid && targetUid !== input.actorUid);
  if (!recipients.length) return;

  const batch = writeBatch(db);
  recipients.forEach((targetUid) => {
    const notificationId = 'comunidad_mencion_' + input.postId + '_' + targetUid;
    batch.set(doc(db, 'notificaciones', notificationId), {
      destinatarioUid: targetUid,
      idComunidad: input.communityId,
      tipo: 'comunidad',
      titulo: input.actorName + ' te mencionó en el Tablón',
      descripcion: input.postPreview.slice(0, 180),
      creadaPorUid: input.actorUid,
      creadaPorNombre: input.actorName,
      creadaEn: serverTimestamp(),
      leida: false,
      enlace: '/dashboard/comunidad',
      sourceId: input.postId,
      actividadTipo: 'mencion',
    }, { merge: true });
  });

  await batch.commit();
}
