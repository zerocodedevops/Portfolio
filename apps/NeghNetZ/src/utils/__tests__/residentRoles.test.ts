import { describe, it, expect } from 'vitest';
import type { VecinoData } from '../../types/domain';
import {
  DEVELOPER_EMAIL,
  isPropertyAdministrator,
  isBoardExecutive,
  isBoardVocal,
  isDeveloperEmail,
  hasAdministratorAccess,
  canManageReservations,
  canConveneOrPublish,
  canModerateCommunity,
  canVoteOrSpeakInMeetings,
} from '../residentRoles';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal VecinoData with only the fields needed for role tests */
function makeResident(overrides: Partial<VecinoData> = {}): VecinoData {
  return { ...overrides };
}

// ---------------------------------------------------------------------------
// isPropertyAdministrator
// ---------------------------------------------------------------------------

describe('isPropertyAdministrator', () => {
  it('returns false for null', () => {
    expect(isPropertyAdministrator(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isPropertyAdministrator(undefined)).toBe(false);
  });

  it('returns false when rol is not "administrador"', () => {
    const resident = makeResident({ rol: 'propietario', cargo: 'administrador de fincas' });
    expect(isPropertyAdministrator(resident)).toBe(false);
  });

  it('returns false when cargo does not include "administrador de fincas"', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'presidente' });
    expect(isPropertyAdministrator(resident)).toBe(false);
  });

  it('returns true when rol is "administrador" and cargo includes "administrador de fincas"', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'Administrador de Fincas' });
    expect(isPropertyAdministrator(resident)).toBe(true);
  });

  it('returns true with accents/uppercase in cargo (normalisation)', () => {
    const resident = makeResident({ rol: 'Administrador', cargo: 'Administrádor de Fincas' });
    expect(isPropertyAdministrator(resident)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isBoardExecutive
// ---------------------------------------------------------------------------

describe('isBoardExecutive', () => {
  it('returns false for null', () => {
    expect(isBoardExecutive(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isBoardExecutive(undefined)).toBe(false);
  });

  it('returns false when rol is not "administrador" or "propietario" (e.g. inquilino)', () => {
    const resident = makeResident({ rol: 'inquilino', cargo: 'presidente' });
    expect(isBoardExecutive(resident)).toBe(false);
  });

  it('returns true when rol is "propietario" and cargo is "presidente"', () => {
    const resident = makeResident({ rol: 'propietario', cargo: 'presidente' });
    expect(isBoardExecutive(resident)).toBe(true);
  });

  it('returns true for cargo "presidente"', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'presidente' });
    expect(isBoardExecutive(resident)).toBe(true);
  });

  it('returns true for cargo "presidenta"', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'Presidenta' });
    expect(isBoardExecutive(resident)).toBe(true);
  });

  it('returns true for cargo "vicepresidente"', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'Vicepresidente' });
    expect(isBoardExecutive(resident)).toBe(true);
  });

  it('returns true for cargo "vicepresidenta"', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'vicepresidenta' });
    expect(isBoardExecutive(resident)).toBe(true);
  });

  it('returns false for cargo "vocal" (vocal is NOT an executive)', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'vocal' });
    expect(isBoardExecutive(resident)).toBe(false);
  });

  it('returns false when cargo is empty', () => {
    const resident = makeResident({ rol: 'administrador', cargo: '' });
    expect(isBoardExecutive(resident)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isBoardVocal
// ---------------------------------------------------------------------------

describe('isBoardVocal', () => {
  it('returns false for null', () => {
    expect(isBoardVocal(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isBoardVocal(undefined)).toBe(false);
  });

  it('returns true when cargo contains "vocal"', () => {
    const resident = makeResident({ cargo: 'vocal' });
    expect(isBoardVocal(resident)).toBe(true);
  });

  it('returns true when cargo contains "vocal" among other text', () => {
    const resident = makeResident({ cargo: 'Vocal de la junta' });
    expect(isBoardVocal(resident)).toBe(true);
  });

  it('returns false when cargo does not contain "vocal"', () => {
    const resident = makeResident({ cargo: 'presidente' });
    expect(isBoardVocal(resident)).toBe(false);
  });

  it('returns false when cargo is empty', () => {
    const resident = makeResident({ cargo: '' });
    expect(isBoardVocal(resident)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isDeveloperEmail
// ---------------------------------------------------------------------------

describe('isDeveloperEmail', () => {
  it('returns true for the exact developer email', () => {
    expect(isDeveloperEmail(DEVELOPER_EMAIL)).toBe(true);
  });

  it('returns true for the email in UPPERCASE (normalised)', () => {
    expect(isDeveloperEmail(DEVELOPER_EMAIL.toUpperCase())).toBe(true);
  });

  it('returns false for a different email', () => {
    expect(isDeveloperEmail('other@example.com')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isDeveloperEmail(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isDeveloperEmail(undefined)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isDeveloperEmail('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// hasAdministratorAccess
// ---------------------------------------------------------------------------

describe('hasAdministratorAccess', () => {
  it('returns false for null', () => {
    expect(hasAdministratorAccess(null)).toBe(false);
  });

  it('returns true when resident is a property administrator', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'administrador de fincas' });
    expect(hasAdministratorAccess(resident)).toBe(true);
  });

  it('returns true when board executive WITHOUT a property administrator (tieneAdministradorFincas=false)', () => {
    const resident = makeResident({
      rol: 'administrador',
      cargo: 'presidente',
      tieneAdministradorFincas: false,
    });
    expect(hasAdministratorAccess(resident)).toBe(true);
  });

  it('returns false when board executive WITH a property administrator (tieneAdministradorFincas=true)', () => {
    const resident = makeResident({
      rol: 'administrador',
      cargo: 'presidente',
      tieneAdministradorFincas: true,
    });
    expect(hasAdministratorAccess(resident)).toBe(false);
  });

  it('returns false for a regular propietario without any special role', () => {
    const resident = makeResident({ rol: 'propietario', cargo: '' });
    expect(hasAdministratorAccess(resident)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// canManageReservations
// ---------------------------------------------------------------------------

describe('canManageReservations', () => {
  it('returns true for developer email regardless of resident', () => {
    expect(canManageReservations(null, DEVELOPER_EMAIL)).toBe(true);
  });

  it('returns true for a property administrator', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'administrador de fincas' });
    expect(canManageReservations(resident)).toBe(true);
  });

  it('returns true for a board executive', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'presidente' });
    expect(canManageReservations(resident)).toBe(true);
  });

  it('returns false for a regular resident (vecino) with a random email', () => {
    const resident = makeResident({ rol: 'propietario' });
    expect(canManageReservations(resident, 'vecino@test.com')).toBe(false);
  });

  it('returns false for null resident and no special email', () => {
    expect(canManageReservations(null, 'random@test.com')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// canConveneOrPublish
// ---------------------------------------------------------------------------

describe('canConveneOrPublish', () => {
  it('returns true for developer email', () => {
    expect(canConveneOrPublish(null, DEVELOPER_EMAIL)).toBe(true);
  });

  it('returns true for a property administrator', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'administrador de fincas' });
    expect(canConveneOrPublish(resident)).toBe(true);
  });

  it('returns true for a board executive', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'presidenta' });
    expect(canConveneOrPublish(resident)).toBe(true);
  });

  it('returns false for a regular propietario', () => {
    const resident = makeResident({ rol: 'propietario' });
    expect(canConveneOrPublish(resident, 'vecino@example.com')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// canModerateCommunity
// ---------------------------------------------------------------------------

describe('canModerateCommunity', () => {
  it('returns true for developer email', () => {
    expect(canModerateCommunity(null, DEVELOPER_EMAIL)).toBe(true);
  });

  it('returns true for a property administrator', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'administrador de fincas' });
    expect(canModerateCommunity(resident)).toBe(true);
  });

  it('returns true for a board executive', () => {
    const resident = makeResident({ rol: 'administrador', cargo: 'vicepresidente' });
    expect(canModerateCommunity(resident)).toBe(true);
  });

  it('returns false for a regular propietario', () => {
    const resident = makeResident({ rol: 'propietario' });
    expect(canModerateCommunity(resident, 'vecino@example.com')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// canVoteOrSpeakInMeetings
// ---------------------------------------------------------------------------

describe('canVoteOrSpeakInMeetings', () => {
  it('returns true for a propietario', () => {
    const resident = makeResident({ rol: 'propietario' });
    expect(canVoteOrSpeakInMeetings(resident)).toBe(true);
  });

  it('returns true for an administrador', () => {
    const resident = makeResident({ rol: 'administrador' });
    expect(canVoteOrSpeakInMeetings(resident)).toBe(true);
  });

  it('returns false for an inquilino', () => {
    const resident = makeResident({ rol: 'inquilino' });
    expect(canVoteOrSpeakInMeetings(resident)).toBe(false);
  });

  it('returns false for "Inquilino" with capital letter (normalised)', () => {
    const resident = makeResident({ rol: 'Inquilino' });
    expect(canVoteOrSpeakInMeetings(resident)).toBe(false);
  });

  it('returns true for null resident (no rol → not inquilino)', () => {
    expect(canVoteOrSpeakInMeetings(null)).toBe(true);
  });

  it('returns true for resident without rol field', () => {
    const resident = makeResident({});
    expect(canVoteOrSpeakInMeetings(resident)).toBe(true);
  });
});
