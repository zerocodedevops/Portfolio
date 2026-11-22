import type { DemoUser as User, DemoDocSnapshot as DocumentSnapshot } from '../demo/demoTypes';
import { doc, getDoc, updateDoc, writeBatch, db } from '../demo/demoStore';
import type { VecinoData } from '../types/domain';

/** Finds an existing resident profile even when its document ID is not the Auth UID. */
export async function findResidentProfile(user: Pick<User, 'uid' | 'email'> & { emailVerified?: boolean }): Promise<DocumentSnapshot | null> {
  const syncMessagingAccess = async (profile: DocumentSnapshot) => {
    const resident = profile.data() as VecinoData;
    if (!resident.idComunidad || !user.emailVerified || !user.email) return;
    const email = user.email.trim().toLocaleLowerCase('es');
    if (!email || email.includes('/')) return;

    const identity = await getDoc(doc(db, 'vecinoIdentidades', email));
    if (!identity.exists() || identity.get('idFicha') !== profile.id) return;

    const publicRef = doc(db, 'vecinosPublicos', profile.id);
    const publicProfile = await getDoc(publicRef);
    if (!publicProfile.exists()) return;

    const status = String(resident.estado || '').trim().toLocaleLowerCase('es');
    const active = !status || ['activo', 'validado', 'confirmado', 'aprobado'].includes(status);
    if (publicProfile.get('uid') !== user.uid || publicProfile.get('chatEnabled') !== active) {
      try {
        await updateDoc(publicRef, { uid: user.uid, chatEnabled: active });
      } catch (error) {
        console.warn('No se pudo sincronizar la disponibilidad de mensajería del perfil público:', error);
      }
    }
  };

  const access = await getDoc(doc(db, 'usuariosAcceso', user.uid));
  if (access.exists()) {
    const profileId = access.get('idFicha');
    if (typeof profileId !== 'string' || !profileId) throw new Error('La vinculación de tu ficha no es válida. Contacta con la administración.');
    const profile = await getDoc(doc(db, 'vecinos', profileId));
    if (profile.exists() && profile.get('uid') === user.uid) {
      await syncMessagingAccess(profile);
      return profile;
    }
  }

  const email = user.email?.trim().toLocaleLowerCase('es');
  if (!email || email.includes('/')) return null;
  const identity = await getDoc(doc(db, 'vecinoIdentidades', email));
  if (!identity.exists() || String(identity.get('correo') || '').trim().toLocaleLowerCase('es') !== email) return null;
  if (identity.get('ambigua') === true) throw new Error('Ese correo está asociado a más de una ficha vecinal. Contacta con la administración antes de crear una cuenta.');
  const profileId = identity.get('idFicha');
  if (typeof profileId !== 'string' || !profileId) return null;
  if (!user.emailVerified) {
    throw new Error('Verifica tu correo electrónico y vuelve a iniciar sesión para vincularlo con tu ficha vecinal.');
  }
  const profile = await getDoc(doc(db, 'vecinos', profileId));
  if (!profile.exists()) return null;
  if (profile.get('uid') === user.uid) {
    await syncMessagingAccess(profile);
    return profile;
  }
  const currentData = profile.data() as VecinoData;
  const rootEmail = String(currentData.email || '').trim().toLocaleLowerCase('es');
  const personalEmail = String(currentData.datosPersonales?.email || '').trim().toLocaleLowerCase('es');
  if (rootEmail !== email && personalEmail !== email) throw new Error('El correo de tu cuenta no coincide con el correo guardado en la ficha. Contacta con la administración.');
  const resident = { ...currentData, id: profile.id, uid: user.uid } as VecinoData;
  const status = String(resident.estado || '').trim().toLocaleLowerCase('es');
  const active = !status || ['activo', 'validado', 'confirmado', 'aprobado'].includes(status);
  const role = String(resident.rol || '').toLocaleLowerCase('es');
  const cargo = String(resident.cargo || '').toLocaleLowerCase('es');
  const profileRef = doc(db, 'vecinos', profileId);
  const identityRef = doc(db, 'vecinoIdentidades', email);
  const accessRef = doc(db, 'usuariosAcceso', user.uid);
  const publicRef = doc(db, 'vecinosPublicos', profileId);
  const batch = writeBatch(db);

  // A verified email may claim only its own pre-existing resident profile.
  batch.update(profileRef, { uid: user.uid });
  batch.set(identityRef, { correo: email, uid: user.uid, idFicha: profileId }, { merge: true });
  batch.set(accessRef, {
    uid: user.uid,
    idFicha: profileId,
    idComunidad: resident.idComunidad || null,
    activo: active,
    administrador: role === 'administrador' && !cargo.includes('vocal'),
  });
  if (resident.idComunidad) batch.update(publicRef, { uid: user.uid, chatEnabled: active });
  await batch.commit();
  return getDoc(profileRef);
}
