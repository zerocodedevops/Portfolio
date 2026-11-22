import type { VecinoData } from '../types/domain';

export const DEVELOPER_EMAIL = 'zerocode.devops@gmail.com';

function normalizeRoleText(value: unknown) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
}

export function isBoardExecutive(resident: VecinoData | null | undefined) {
  const role = normalizeRoleText(resident?.rol);
  if (!['administrador', 'propietario'].includes(role)) return false;
  return /\b(?:presidente|presidenta|vicepresidente|vicepresidenta)\b/.test(normalizeRoleText(resident?.cargo));
}

export function isBoardVocal(resident: VecinoData | null | undefined) {
  return /\bvocal\b/.test(normalizeRoleText(resident?.cargo));
}

export function isPropertyAdministrator(resident: VecinoData | null | undefined) {
  return normalizeRoleText(resident?.rol) === 'administrador'
    && normalizeRoleText(resident?.cargo).includes('administrador de fincas');
}

export function isDeveloperEmail(email: string | null | undefined) {
  return normalizeRoleText(email) === DEVELOPER_EMAIL;
}

export function hasAdministratorAccess(resident: VecinoData | null | undefined) {
  if (isPropertyAdministrator(resident)) return true;
  return isBoardExecutive(resident) && resident?.tieneAdministradorFincas === false;
}

export function canManageReservations(resident: VecinoData | null | undefined, email?: string | null) {
  return isDeveloperEmail(email) || isPropertyAdministrator(resident) || isBoardExecutive(resident);
}

export function hasAdministrationNavigation(resident: VecinoData | null | undefined) {
  return hasAdministratorAccess(resident) || isBoardExecutive(resident);
}

export function canConveneOrPublish(resident: VecinoData | null | undefined, email?: string | null) {
  return isDeveloperEmail(email) || isPropertyAdministrator(resident) || isBoardExecutive(resident);
}

export function canModerateCommunity(resident: VecinoData | null | undefined, email?: string | null) {
  return canConveneOrPublish(resident, email);
}

export function canVoteOrSpeakInMeetings(resident: VecinoData | null | undefined) {
  return normalizeRoleText(resident?.rol) !== 'inquilino';
}
