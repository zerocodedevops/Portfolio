import { describe, it, expect } from 'vitest';
import {
  parseMentions,
  splitMentions,
  resolveUidsFromNames,
  buildMentionFilter,
} from '../mentions';

// ---------------------------------------------------------------------------
// parseMentions
// ---------------------------------------------------------------------------

describe('parseMentions', () => {
  it('returns empty array when text has no mentions', () => {
    expect(parseMentions('Hola a todos')).toEqual([]);
  });

  it('extracts a single mention', () => {
    expect(parseMentions('Hola @Juan Pérez')).toEqual(['Juan Pérez']);
  });

  it('extracts multiple mentions', () => {
    expect(parseMentions('@Ana García y @Luis López, por favor revisen')).toEqual([
      'Ana García',
      'Luis López',
    ]);
  });

  it('handles @ followed by nothing (end of string)', () => {
    expect(parseMentions('escríbeme @')).toEqual([]);
  });

  it('handles @ in the middle of a URL-like string without capturing it', () => {
    // "@" not followed by a letter should not be captured
    expect(parseMentions('envía a user@example.com')).toEqual([]);
  });

  it('stops mention at punctuation', () => {
    // "@Ana," — comma stops the mention
    const result = parseMentions('@Ana, revisa esto');
    expect(result).toEqual(['Ana']);
  });

  it('captures names with accented characters', () => {
    expect(parseMentions('@María José y @Ángel Rodríguez')).toEqual([
      'María José',
      'Ángel Rodríguez',
    ]);
  });

  it('deduplicates repeated mentions', () => {
    expect(parseMentions('@Ana García y @Ana García de nuevo')).toEqual(['Ana García']);
  });
});

// ---------------------------------------------------------------------------
// splitMentions
// ---------------------------------------------------------------------------

describe('splitMentions', () => {
  it('returns single plain segment when no mentions', () => {
    expect(splitMentions('Hola mundo')).toEqual([{ text: 'Hola mundo', mention: false }]);
  });

  it('splits text with one mention', () => {
    expect(splitMentions('Hola @Juan Pérez cómo estás')).toEqual([
      { text: 'Hola ', mention: false },
      { text: '@Juan Pérez', mention: true },
      { text: ' cómo estás', mention: false },
    ]);
  });

  it('handles mention at start of text', () => {
    const result = splitMentions('@Ana García hola');
    expect(result[0]).toEqual({ text: '@Ana García', mention: true });
  });

  it('handles mention at end of text', () => {
    const result = splitMentions('Hola @Luis');
    expect(result[result.length - 1]).toEqual({ text: '@Luis', mention: true });
  });

  it('handles consecutive mentions', () => {
    const result = splitMentions('@Ana @Luis');
    expect(result.filter((s) => s.mention)).toHaveLength(2);
  });

  it('returns empty array for empty string', () => {
    expect(splitMentions('')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// resolveUidsFromNames
// ---------------------------------------------------------------------------

describe('resolveUidsFromNames', () => {
  const uidToName: Record<string, string> = {
    uid1: 'Ana García',
    uid2: 'Luis López',
    uid3: 'María José Ruiz',
  };

  it('resolves a known name to its UID', () => {
    expect(resolveUidsFromNames(['Ana García'], uidToName)).toEqual(['uid1']);
  });

  it('resolves multiple names', () => {
    expect(resolveUidsFromNames(['Ana García', 'Luis López'], uidToName)).toEqual([
      'uid1',
      'uid2',
    ]);
  });

  it('ignores unknown names silently', () => {
    expect(resolveUidsFromNames(['Desconocido'], uidToName)).toEqual([]);
  });

  it('is case-insensitive', () => {
    expect(resolveUidsFromNames(['ana garcía'], uidToName)).toEqual(['uid1']);
  });

  it('is accent-insensitive', () => {
    expect(resolveUidsFromNames(['Ana Garcia'], uidToName)).toEqual(['uid1']);
  });

  it('returns empty array for empty tokens', () => {
    expect(resolveUidsFromNames([], uidToName)).toEqual([]);
  });

  it('deduplicates UIDs when same name mentioned twice', () => {
    expect(resolveUidsFromNames(['Ana García', 'Ana García'], uidToName)).toEqual(['uid1']);
  });
});

// ---------------------------------------------------------------------------
// buildMentionFilter
// ---------------------------------------------------------------------------

describe('buildMentionFilter', () => {
  it('filters by prefix case-insensitively', () => {
    const names = ['Ana García', 'Luis López', 'Ángel Ruiz'];
    expect(buildMentionFilter('an', names)).toEqual(['Ana García']);
  });

  it('filters accent-insensitively', () => {
    const names = ['Ana García', 'Ángel Ruiz'];
    expect(buildMentionFilter('angel', names)).toEqual(['Ángel Ruiz']);
  });

  it('returns at most 5 results', () => {
    const names = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];
    expect(buildMentionFilter('a', names)).toHaveLength(5);
  });

  it('returns empty array when no match', () => {
    expect(buildMentionFilter('xyz', ['Ana', 'Luis'])).toEqual([]);
  });

  it('returns initial candidates for empty query (just @ typed)', () => {
    expect(buildMentionFilter('', ['Ana', 'Luis'])).toEqual(['Ana', 'Luis']);
  });
});

