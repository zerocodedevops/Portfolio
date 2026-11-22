import { createInitialDemoState, type DemoSeedCollections } from './demoSeed';
import {
  DemoTimestamp,
  type DemoCollectionRef,
  type DemoConstraint,
  type DemoDocRef,
  type DemoDocSnapshot,
  type DemoDocumentData,
  type DemoFirestore,
  type DemoQuery,
  type DemoQueryDocSnapshot,
  type DemoQuerySnapshot,
  type DemoTransaction,
  type DemoUnsubscribe,
} from './demoTypes';

export {
  DemoTimestamp,
  type DemoCollectionRef,
  type DemoConstraint,
  type DemoDocRef,
  type DemoDocSnapshot,
  type DemoDocumentData,
  type DemoFirestore,
  type DemoQuery,
  type DemoQueryDocSnapshot,
  type DemoQuerySnapshot,
  type DemoTransaction,
  type DemoUnsubscribe,
};

class FieldSentinel {
  constructor(
    readonly kind: 'serverTimestamp' | 'deleteField' | 'increment' | 'arrayUnion' | 'arrayRemove',
    readonly payload?: unknown
  ) {}
}

let autoIdCounter = 1;
function nextDemoId(prefix = 'demo'): string {
  autoIdCounter += 1;
  return `${prefix}_${Date.now()}_${autoIdCounter}`;
}

const collections = new Map<string, Map<string, Record<string, unknown>>>();
const emitter = new EventTarget();

function hydrateFromSeed(seed: DemoSeedCollections): void {
  collections.clear();
  for (const [collectionPath, docsMap] of Object.entries(seed)) {
    const map = new Map<string, Record<string, unknown>>();
    for (const [docId, docData] of Object.entries(docsMap)) {
      map.set(docId, structuredCloneSafe(docData));
    }
    collections.set(collectionPath, map);
  }
}

function structuredCloneSafe<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof DemoTimestamp) return DemoTimestamp.fromDate(value.toDate()) as unknown as T;
  if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
  if (Array.isArray(value)) return value.map((item) => structuredCloneSafe(item)) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = structuredCloneSafe(v);
  }
  return out as T;
}

hydrateFromSeed(createInitialDemoState());

export function resetDemoStore(): void {
  hydrateFromSeed(createInitialDemoState());
  emitter.dispatchEvent(new CustomEvent('change', { detail: { collectionPath: '*' } }));
}

function notifyCollectionChange(collectionPath: string): void {
  emitter.dispatchEvent(new CustomEvent('change', { detail: { collectionPath } }));
}

function getCollectionMap(collectionPath: string): Map<string, Record<string, unknown>> {
  let map = collections.get(collectionPath);
  if (!map) {
    map = new Map<string, Record<string, unknown>>();
    collections.set(collectionPath, map);
  }
  return map;
}

function getNestedValue(obj: Record<string, unknown> | undefined, fieldPath: string): unknown {
  if (!obj) return undefined;
  const parts = fieldPath.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function setNestedValue(target: Record<string, unknown>, fieldPath: string, value: unknown): void {
  const parts = fieldPath.split('.');
  let current: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    const next = current[key];
    if (!next || typeof next !== 'object' || Array.isArray(next) || next instanceof DemoTimestamp) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = parts[parts.length - 1];
  if (value instanceof FieldSentinel) {
    if (value.kind === 'deleteField') {
      delete current[lastKey];
    } else if (value.kind === 'serverTimestamp') {
      current[lastKey] = DemoTimestamp.now();
    } else if (value.kind === 'increment') {
      const prev = Number(current[lastKey] || 0);
      current[lastKey] = prev + Number(value.payload || 0);
    } else if (value.kind === 'arrayUnion') {
      const existing = Array.isArray(current[lastKey]) ? [...(current[lastKey] as unknown[])] : [];
      const additions = Array.isArray(value.payload) ? value.payload : [];
      for (const item of additions) {
        if (!existing.some((e) => JSON.stringify(e) === JSON.stringify(item))) {
          existing.push(item);
        }
      }
      current[lastKey] = existing;
    } else if (value.kind === 'arrayRemove') {
      const existing = Array.isArray(current[lastKey]) ? (current[lastKey] as unknown[]) : [];
      const removals = Array.isArray(value.payload) ? value.payload : [];
      current[lastKey] = existing.filter((e) => !removals.some((r) => JSON.stringify(e) === JSON.stringify(r)));
    }
    return;
  }
  if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof DemoTimestamp) && !(value instanceof Date)) {
    const resolved: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      setNestedValue(resolved, k, v);
    }
    current[lastKey] = resolved;
    return;
  }
  current[lastKey] = structuredCloneSafe(value);
}

function applyFieldUpdates(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const result = structuredCloneSafe(base);
  for (const [key, value] of Object.entries(patch)) {
    setNestedValue(result, key, value);
  }
  return result;
}

function comparableValue(val: unknown): number | string | boolean {
  if (val instanceof DemoTimestamp) return val.toMillis();
  if (val instanceof Date) return val.getTime();
  if (val && typeof val === 'object' && 'toMillis' in val && typeof (val as { toMillis: unknown }).toMillis === 'function') {
    return (val as { toMillis: () => number }).toMillis();
  }
  if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') return val;
  return String(val ?? '');
}

function matchesWhere(docId: string, data: Record<string, unknown>, constraint: Extract<DemoConstraint, { type: 'where' }>): boolean {
  const fieldVal = constraint.field === '__name__' ? docId : getNestedValue(data, constraint.field);
  const target = constraint.value;
  switch (constraint.op) {
    case '==':
      return comparableValue(fieldVal) === comparableValue(target);
    case '!=':
      return comparableValue(fieldVal) !== comparableValue(target);
    case '<':
      return comparableValue(fieldVal) < comparableValue(target);
    case '<=':
      return comparableValue(fieldVal) <= comparableValue(target);
    case '>':
      return comparableValue(fieldVal) > comparableValue(target);
    case '>=':
      return comparableValue(fieldVal) >= comparableValue(target);
    case 'in':
      return Array.isArray(target) && target.some((item) => comparableValue(item) === comparableValue(fieldVal));
    case 'not-in':
      return Array.isArray(target) && !target.some((item) => comparableValue(item) === comparableValue(fieldVal));
    case 'array-contains':
      return Array.isArray(fieldVal) && fieldVal.some((item) => comparableValue(item) === comparableValue(target));
    case 'array-contains-any':
      return (
        Array.isArray(fieldVal) &&
        Array.isArray(target) &&
        target.some((t) => fieldVal.some((item) => comparableValue(item) === comparableValue(t)))
      );
    default:
      return false;
  }
}

function splitDocPath(docPath: string): { collectionPath: string; id: string } {
  const segments = docPath.split('/').filter(Boolean);
  const id = segments.pop() || nextDemoId('doc');
  return { collectionPath: segments.join('/'), id };
}

function makeDocSnapshot<T = DemoDocumentData>(docPath: string, data: Record<string, unknown> | undefined): DemoDocSnapshot<T> {
  const { id } = splitDocPath(docPath);
  const cloned = data ? structuredCloneSafe(data) : undefined;
  return {
    id,
    exists: () => Boolean(cloned),
    data: () => cloned as T,
    get: (fieldPath: string) => getNestedValue(cloned, fieldPath),
    ref: { kind: 'doc', path: docPath, id },
  };
}

export const db = { kind: 'demo-firestore' } as const;

export function collection(_dbOrRef: unknown, ...pathSegments: string[]): DemoCollectionRef {
  return { kind: 'collection', path: pathSegments.join('/') };
}

export function doc(dbOrCollectionRef: unknown, ...pathSegments: string[]): DemoDocRef {
  if (
    dbOrCollectionRef &&
    typeof dbOrCollectionRef === 'object' &&
    'kind' in dbOrCollectionRef &&
    (dbOrCollectionRef as { kind: string }).kind === 'collection'
  ) {
    const colPath = (dbOrCollectionRef as DemoCollectionRef).path;
    const id = pathSegments[0] || nextDemoId('doc');
    return { kind: 'doc', path: `${colPath}/${id}`, id };
  }
  const fullPath = pathSegments.join('/');
  const { id } = splitDocPath(fullPath);
  return { kind: 'doc', path: fullPath, id };
}

export function documentId(): '__name__' {
  return '__name__';
}

export function where(field: string | '__name__', op: DemoConstraint['type'] extends never ? never : Extract<DemoConstraint, { type: 'where' }>['op'], value: unknown): DemoConstraint {
  return { type: 'where', field, op, value };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): DemoConstraint {
  return { type: 'orderBy', field, direction };
}

export function limit(count: number): DemoConstraint {
  return { type: 'limit', count };
}

export function query(target: DemoCollectionRef | DemoQuery, ...constraints: DemoConstraint[]): DemoQuery {
  if (target.kind === 'query') {
    return { kind: 'query', collectionPath: target.collectionPath, constraints: [...target.constraints, ...constraints] };
  }
  return { kind: 'query', collectionPath: target.path, constraints };
}

export function serverTimestamp(): FieldSentinel {
  return new FieldSentinel('serverTimestamp');
}

export function deleteField(): FieldSentinel {
  return new FieldSentinel('deleteField');
}

export function increment(n: number): FieldSentinel {
  return new FieldSentinel('increment', n);
}

export function arrayUnion(...elements: unknown[]): FieldSentinel {
  return new FieldSentinel('arrayUnion', elements);
}

export function arrayRemove(...elements: unknown[]): FieldSentinel {
  return new FieldSentinel('arrayRemove', elements);
}

function executeQuery<T = DemoDocumentData>(target: DemoCollectionRef | DemoQuery): DemoQuerySnapshot<T> {
  const collectionPath = target.kind === 'collection' ? target.path : target.collectionPath;
  const constraints = target.kind === 'query' ? target.constraints : [];
  const map = getCollectionMap(collectionPath);

  let entries = Array.from(map.entries());
  for (const c of constraints) {
    if (c.type === 'where') {
      entries = entries.filter(([id, data]) => matchesWhere(id, data, c));
    }
  }

  const orderConstraints = constraints.filter((c): c is Extract<DemoConstraint, { type: 'orderBy' }> => c.type === 'orderBy');
  if (orderConstraints.length > 0) {
    entries.sort(([, a], [, b]) => {
      for (const oc of orderConstraints) {
        const va = comparableValue(getNestedValue(a, oc.field));
        const vb = comparableValue(getNestedValue(b, oc.field));
        if (va < vb) return oc.direction === 'asc' ? -1 : 1;
        if (va > vb) return oc.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const limitConstraint = constraints.find((c): c is Extract<DemoConstraint, { type: 'limit' }> => c.type === 'limit');
  if (limitConstraint) {
    entries = entries.slice(0, limitConstraint.count);
  }

  const docs = entries.map(([id, data]) => makeDocSnapshot<T>(`${collectionPath}/${id}`, data) as unknown as DemoQueryDocSnapshot<T>);
  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    metadata: { hasPendingWrites: false, fromCache: false },
    forEach: (cb) => docs.forEach(cb),
  };
}

export async function getDoc<T = DemoDocumentData>(docRef: DemoDocRef): Promise<DemoDocSnapshot<T>> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const data = getCollectionMap(collectionPath).get(id);
  return makeDocSnapshot<T>(docRef.path, data);
}

export async function getDocs<T = DemoDocumentData>(target: DemoCollectionRef | DemoQuery): Promise<DemoQuerySnapshot<T>> {
  return executeQuery<T>(target);
}

export async function addDoc(colRef: DemoCollectionRef, data: Record<string, unknown>): Promise<DemoDocRef> {
  const id = nextDemoId('demo');
  const resolved = applyFieldUpdates({}, data);
  getCollectionMap(colRef.path).set(id, resolved);
  notifyCollectionChange(colRef.path);
  return { kind: 'doc', path: `${colRef.path}/${id}`, id };
}

export async function setDoc(docRef: DemoDocRef, data: Record<string, unknown>, options?: { merge?: boolean }): Promise<void> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const map = getCollectionMap(collectionPath);
  const base = options?.merge ? map.get(id) || {} : {};
  map.set(id, applyFieldUpdates(base, data));
  notifyCollectionChange(collectionPath);
}

export async function updateDoc(docRef: DemoDocRef, data: Record<string, unknown>): Promise<void> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const map = getCollectionMap(collectionPath);
  const existing = map.get(id) || {};
  map.set(id, applyFieldUpdates(existing, data));
  notifyCollectionChange(collectionPath);
}

export async function deleteDoc(docRef: DemoDocRef): Promise<void> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  getCollectionMap(collectionPath).delete(id);
  notifyCollectionChange(collectionPath);
}

export function onSnapshot<T = DemoDocumentData>(
  target: DemoDocRef,
  onNext: (snapshot: DemoDocSnapshot<T>) => void,
  onError?: (error: Error & { code?: string }) => void
): DemoUnsubscribe;
export function onSnapshot<T = DemoDocumentData>(
  target: DemoCollectionRef | DemoQuery,
  onNext: (snapshot: DemoQuerySnapshot<T>) => void,
  onError?: (error: Error & { code?: string }) => void
): DemoUnsubscribe;
export function onSnapshot<T = DemoDocumentData>(
  target: DemoDocRef | DemoCollectionRef | DemoQuery,
  onNext: (snapshot: any) => void,
  _onError?: (error: Error & { code?: string }) => void
): DemoUnsubscribe {
  const watchedCollection =
    target.kind === 'doc'
      ? splitDocPath(target.path).collectionPath
      : target.kind === 'collection'
        ? target.path
        : target.collectionPath;

  const emit = () => {
    if (target.kind === 'doc') {
      const { collectionPath, id } = splitDocPath(target.path);
      const data = getCollectionMap(collectionPath).get(id);
      onNext(makeDocSnapshot<T>(target.path, data));
    } else {
      onNext(executeQuery<T>(target));
    }
  };

  emit();

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ collectionPath: string }>).detail;
    if (detail?.collectionPath === '*' || detail?.collectionPath === watchedCollection) {
      emit();
    }
  };

  emitter.addEventListener('change', handler);
  return () => emitter.removeEventListener('change', handler);
}

export function writeBatch(_db?: unknown) {
  const ops: Array<() => string> = [];
  return {
    set(docRef: DemoDocRef, data: Record<string, unknown>, options?: { merge?: boolean }) {
      ops.push(() => {
        const { collectionPath, id } = splitDocPath(docRef.path);
        const map = getCollectionMap(collectionPath);
        const base = options?.merge ? map.get(id) || {} : {};
        map.set(id, applyFieldUpdates(base, data));
        return collectionPath;
      });
    },
    update(docRef: DemoDocRef, data: Record<string, unknown>) {
      ops.push(() => {
        const { collectionPath, id } = splitDocPath(docRef.path);
        const map = getCollectionMap(collectionPath);
        const existing = map.get(id) || {};
        map.set(id, applyFieldUpdates(existing, data));
        return collectionPath;
      });
    },
    delete(docRef: DemoDocRef) {
      ops.push(() => {
        const { collectionPath, id } = splitDocPath(docRef.path);
        getCollectionMap(collectionPath).delete(id);
        return collectionPath;
      });
    },
    async commit() {
      const touched = new Set<string>();
      for (const op of ops) {
        touched.add(op());
      }
      for (const colPath of touched) {
        notifyCollectionChange(colPath);
      }
    },
  };
}

export async function runTransaction<R>(_db: unknown, updateFn: (transaction: {
  get: <T = Record<string, unknown>>(docRef: DemoDocRef) => Promise<DemoDocSnapshot<T>>;
  set: (docRef: DemoDocRef, data: Record<string, unknown>, options?: { merge?: boolean }) => void;
  update: (docRef: DemoDocRef, data: Record<string, unknown>) => void;
  delete: (docRef: DemoDocRef) => void;
}) => Promise<R>): Promise<R> {
  const batch = writeBatch();
  const tx = {
    get: <T = Record<string, unknown>>(docRef: DemoDocRef) => getDoc<T>(docRef),
    set: (docRef: DemoDocRef, data: Record<string, unknown>, options?: { merge?: boolean }) => batch.set(docRef, data, options),
    update: (docRef: DemoDocRef, data: Record<string, unknown>) => batch.update(docRef, data),
    delete: (docRef: DemoDocRef) => batch.delete(docRef),
  };
  const result = await updateFn(tx);
  await batch.commit();
  return result;
}
