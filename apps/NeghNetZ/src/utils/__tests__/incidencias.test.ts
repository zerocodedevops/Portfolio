import { describe, it, expect } from 'vitest';
import type { IncidenciaData } from '../../types/domain';
import {
  normalizarEstadoIncidencia,
  normalizarPrioridadIncidencia,
  contarIncidencias,
  etiquetaEstadoIncidencia,
  type EstadoIncidencia,
} from '../incidencias';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function makeIncidencia(overrides: Partial<IncidenciaData> = {}): IncidenciaData {
  return { id: 'test-id', ...overrides };
}

// ---------------------------------------------------------------------------
// normalizarEstadoIncidencia
// ---------------------------------------------------------------------------

describe('normalizarEstadoIncidencia', () => {
  it('returns "pendiente" for undefined', () => {
    expect(normalizarEstadoIncidencia(undefined)).toBe<EstadoIncidencia>('pendiente');
  });

  it('returns "pendiente" for empty string', () => {
    expect(normalizarEstadoIncidencia('')).toBe<EstadoIncidencia>('pendiente');
  });

  it('returns "pendiente" for unknown value', () => {
    expect(normalizarEstadoIncidencia('abierta')).toBe<EstadoIncidencia>('pendiente');
  });

  // en_progreso aliases
  it.each([
    'en_progreso',
    'enproceso',
    'en_proceso',
    'en_reparacion',
    'en_reparación',
    'en_tramite',
    'en_trámite',
  ])('returns "en_progreso" for alias "%s"', (alias) => {
    expect(normalizarEstadoIncidencia(alias)).toBe<EstadoIncidencia>('en_progreso');
  });

  it('returns "en_progreso" for uppercase alias "EN_REPARACION"', () => {
    expect(normalizarEstadoIncidencia('EN_REPARACION')).toBe<EstadoIncidencia>('en_progreso');
  });

  // resuelta aliases
  it.each(['resuelta', 'resuelto', 'cerrada', 'cerrado', 'finalizada', 'finalizado'])(
    'returns "resuelta" for alias "%s"',
    (alias) => {
      expect(normalizarEstadoIncidencia(alias)).toBe<EstadoIncidencia>('resuelta');
    }
  );

  // descartada aliases
  it.each(['descartada', 'descartado', 'cancelada', 'cancelado', 'rechazada', 'rechazado'])(
    'returns "descartada" for alias "%s"',
    (alias) => {
      expect(normalizarEstadoIncidencia(alias)).toBe<EstadoIncidencia>('descartada');
    }
  );
});

// ---------------------------------------------------------------------------
// normalizarPrioridadIncidencia
// ---------------------------------------------------------------------------

describe('normalizarPrioridadIncidencia', () => {
  it('returns "media" for undefined', () => {
    expect(normalizarPrioridadIncidencia(undefined)).toBe('media');
  });

  it('returns "media" for empty string', () => {
    expect(normalizarPrioridadIncidencia('')).toBe('media');
  });

  it('returns "media" for unknown value', () => {
    expect(normalizarPrioridadIncidencia('desconocida')).toBe('media');
  });

  it.each(['alta', 'high', 'urgente', 'urgent'])(
    'returns "alta" for alias "%s"',
    (alias) => {
      expect(normalizarPrioridadIncidencia(alias)).toBe('alta');
    }
  );

  it('returns "alta" for "ALTA" (uppercase)', () => {
    expect(normalizarPrioridadIncidencia('ALTA')).toBe('alta');
  });

  it.each(['baja', 'low'])('returns "baja" for alias "%s"', (alias) => {
    expect(normalizarPrioridadIncidencia(alias)).toBe('baja');
  });

  it('returns "media" explicitly when value is "media"', () => {
    expect(normalizarPrioridadIncidencia('media')).toBe('media');
  });
});

// ---------------------------------------------------------------------------
// etiquetaEstadoIncidencia
// ---------------------------------------------------------------------------

describe('etiquetaEstadoIncidencia', () => {
  it('returns "Pendiente" for undefined', () => {
    expect(etiquetaEstadoIncidencia(undefined)).toBe('Pendiente');
  });

  it('returns "Pendiente" for unknown estado', () => {
    expect(etiquetaEstadoIncidencia('abierta')).toBe('Pendiente');
  });

  it('returns "En reparación" for "en_reparacion"', () => {
    expect(etiquetaEstadoIncidencia('en_reparacion')).toBe('En reparación');
  });

  it('returns "En reparación" for "en_progreso"', () => {
    expect(etiquetaEstadoIncidencia('en_progreso')).toBe('En reparación');
  });

  it('returns "Resuelta" for "cerrada"', () => {
    expect(etiquetaEstadoIncidencia('cerrada')).toBe('Resuelta');
  });

  it('returns "Resuelta" for "resuelta"', () => {
    expect(etiquetaEstadoIncidencia('resuelta')).toBe('Resuelta');
  });

  it('returns "Descartada" for "cancelada"', () => {
    expect(etiquetaEstadoIncidencia('cancelada')).toBe('Descartada');
  });

  it('returns "Descartada" for "descartada"', () => {
    expect(etiquetaEstadoIncidencia('descartada')).toBe('Descartada');
  });
});

// ---------------------------------------------------------------------------
// contarIncidencias
// ---------------------------------------------------------------------------

describe('contarIncidencias', () => {
  it('returns all zeros for an empty array', () => {
    const counts = contarIncidencias([]);
    expect(counts.total).toBe(0);
    expect(counts.pendientes).toBe(0);
    expect(counts.enProgreso).toBe(0);
    expect(counts.resueltas).toBe(0);
    expect(counts.descartadas).toBe(0);
    expect(counts.prioridadAlta).toBe(0);
    expect(counts.activas).toBe(0);
    expect(counts.activasPropias).toBe(0);
    expect(counts.propiasTotal).toBe(0);
    expect(counts.datosDemostracion).toBe(false);
  });

  it('counts total correctly', () => {
    const incidencias = [
      makeIncidencia({ estado: 'pendiente' }),
      makeIncidencia({ estado: 'resuelta' }),
    ];
    expect(contarIncidencias(incidencias).total).toBe(2);
  });

  it('counts pendientes correctly', () => {
    const incidencias = [
      makeIncidencia({ estado: 'pendiente' }),
      makeIncidencia({ estado: 'pendiente' }),
      makeIncidencia({ estado: 'resuelta' }),
    ];
    expect(contarIncidencias(incidencias).pendientes).toBe(2);
  });

  it('counts enProgreso correctly', () => {
    const incidencias = [
      makeIncidencia({ estado: 'en_progreso' }),
      makeIncidencia({ estado: 'en_reparacion' }),
    ];
    expect(contarIncidencias(incidencias).enProgreso).toBe(2);
  });

  it('counts resueltas correctly', () => {
    const incidencias = [
      makeIncidencia({ estado: 'resuelta' }),
      makeIncidencia({ estado: 'cerrada' }),
    ];
    expect(contarIncidencias(incidencias).resueltas).toBe(2);
  });

  it('counts descartadas correctly', () => {
    const incidencias = [
      makeIncidencia({ estado: 'descartada' }),
      makeIncidencia({ estado: 'cancelada' }),
    ];
    expect(contarIncidencias(incidencias).descartadas).toBe(2);
  });

  it('counts activas (pendientes + en_progreso)', () => {
    const incidencias = [
      makeIncidencia({ estado: 'pendiente' }),
      makeIncidencia({ estado: 'en_progreso' }),
      makeIncidencia({ estado: 'resuelta' }),
    ];
    expect(contarIncidencias(incidencias).activas).toBe(2);
  });

  it('counts prioridadAlta correctly', () => {
    const incidencias = [
      makeIncidencia({ prioridad: 'alta' }),
      makeIncidencia({ prioridad: 'urgente' }),
      makeIncidencia({ prioridad: 'baja' }),
    ];
    expect(contarIncidencias(incidencias).prioridadAlta).toBe(2);
  });

  it('detects datosDemostracion when at least one has esDatoDemo=true', () => {
    const incidencias = [
      makeIncidencia({ esDatoDemo: false }),
      makeIncidencia({ esDatoDemo: true }),
    ];
    expect(contarIncidencias(incidencias).datosDemostracion).toBe(true);
  });

  it('datosDemostracion is false when none has esDatoDemo=true', () => {
    const incidencias = [makeIncidencia({ esDatoDemo: false }), makeIncidencia({})];
    expect(contarIncidencias(incidencias).datosDemostracion).toBe(false);
  });

  describe('with uidActual', () => {
    const UID = 'vecino-uid-123';

    it('counts propiasTotal by idVecino', () => {
      const incidencias = [
        makeIncidencia({ idVecino: UID, estado: 'resuelta' }),
        makeIncidencia({ idVecino: 'otro-uid', estado: 'resuelta' }),
      ];
      expect(contarIncidencias(incidencias, UID).propiasTotal).toBe(1);
    });

    it('counts propiasTotal by creador when idVecino does not match', () => {
      const incidencias = [
        makeIncidencia({ creador: UID, estado: 'resuelta' }),
        makeIncidencia({ creador: 'otro-uid', estado: 'resuelta' }),
      ];
      expect(contarIncidencias(incidencias, UID).propiasTotal).toBe(1);
    });

    it('counts activasPropias only for active (pendiente/en_progreso) owned incidencias', () => {
      const incidencias = [
        makeIncidencia({ idVecino: UID, estado: 'pendiente' }),   // activa propia ✓
        makeIncidencia({ idVecino: UID, estado: 'resuelta' }),    // propia pero no activa
        makeIncidencia({ idVecino: 'otro', estado: 'pendiente' }), // activa pero no propia
      ];
      const counts = contarIncidencias(incidencias, UID);
      expect(counts.activasPropias).toBe(1);
      expect(counts.propiasTotal).toBe(2);
    });

    it('does not count propiasTotal when uidActual is not provided', () => {
      const incidencias = [makeIncidencia({ idVecino: UID, estado: 'pendiente' })];
      expect(contarIncidencias(incidencias).propiasTotal).toBe(0);
      expect(contarIncidencias(incidencias).activasPropias).toBe(0);
    });
  });
});
