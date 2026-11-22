import type { VecinoData } from '../types/domain';

const ACTIVE_RESIDENT_STATES = new Set(['activo', 'validado', 'confirmado', 'aprobado']);

export function isResidentActive(resident: VecinoData) {
  const state = String(resident.estado || '').trim().toLocaleLowerCase('es');
  return !state || ACTIVE_RESIDENT_STATES.has(state);
}

export function toPublicResident(resident: VecinoData) {
  const personal = resident.datosPersonales || {};
  const phoneAuthorized = personal.autorizaTelefonoDirectorio === true;
  return {
    idFicha: resident.id || '',
    uid: resident.uid || '',
    idComunidad: resident.idComunidad || '',
    activo: isResidentActive(resident),
    chatEnabled: false,
    nombre: personal.nombre || resident.nombre || '',
    apellidos: personal.apellidos || resident.apellidos || '',
    portal: personal.portal || resident.portal || '',
    piso: personal.piso || resident.piso || '',
    letra: personal.letra || resident.letra || '',
    telefono: phoneAuthorized ? personal.telefono || personal.movil || '' : '',
    autorizaTelefonoDirectorio: phoneAuthorized,
    fotoPerfil: personal.fotoPerfil || personal.photoURL || resident.fotoPerfil || '',
    datosPersonales: {
      nombre: personal.nombre || resident.nombre || '',
      apellidos: personal.apellidos || resident.apellidos || '',
      portal: personal.portal || resident.portal || '',
      piso: personal.piso || resident.piso || '',
      letra: personal.letra || resident.letra || '',
      telefono: phoneAuthorized ? personal.telefono || personal.movil || '' : '',
      autorizaTelefonoDirectorio: phoneAuthorized,
      fotoPerfil: personal.fotoPerfil || personal.photoURL || resident.fotoPerfil || '',
      coeficiente: personal.coeficiente ?? resident.coeficiente,
      coeficienteEstimado: personal.coeficienteEstimado ?? resident.coeficienteEstimado,
      plazaGaraje: personal.plazaGaraje || resident.plazaGaraje || '',
      trastero: personal.trastero || resident.trastero || '',
    },
    rol: resident.rol || 'Propietario',
    cargo: resident.cargo || '',
    coeficiente: resident.coeficiente ?? personal.coeficiente ?? null,
    coeficienteEstimado: resident.coeficienteEstimado ?? personal.coeficienteEstimado ?? null,
    plazaGaraje: resident.plazaGaraje || personal.plazaGaraje || '',
    trastero: resident.trastero || personal.trastero || '',
    estadoCuotas: resident.estadoCuotas || '',
  };
}
