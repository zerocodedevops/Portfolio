import { resetDemoAuth } from "./demoAuth";
import { createInitialDemoState, type DemoSeedCollections } from "./demoSeed";
import { resetDemoStorage } from "./demoStorage";
import { clearAllDemoToasts } from "./shims/reactHotToast";
import {
  DemoTimestamp,
  Timestamp,
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
  type DemoWhereOp,
} from "./demoTypes";

export {
  DemoTimestamp,
  Timestamp,
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
  type DemoDocumentData as DocumentData,
  type DemoQueryDocSnapshot as QueryDocumentSnapshot,
  type DemoUnsubscribe as Unsubscribe,
  type DemoFirestore as Firestore,
};

class FieldSentinel {
  constructor(
    readonly kind: "serverTimestamp" | "deleteField" | "increment" | "arrayUnion" | "arrayRemove",
    readonly payload?: unknown,
  ) {}
}

let autoIdCounter = 1;
function nextDemoId(prefix = "demo"): string {
  autoIdCounter += 1;
  return `${prefix}_${Date.now()}_${autoIdCounter}`;
}

const collections = new Map<string, Map<string, Record<string, unknown>>>();
const emitter = new EventTarget();
let activeListenersCount = 0;

/**
 * Normaliza recursivamente cualquier instancia nativa de Date a DemoTimestamp
 * para reproducir el comportamiento oficial del SDK de Firestore.
 */
function normalizeAndClone<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof DemoTimestamp) {
    return DemoTimestamp.fromMillis(value.toMillis()) as unknown as T;
  }
  if (value instanceof Date) {
    return DemoTimestamp.fromDate(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeAndClone(item)) as unknown as T;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = normalizeAndClone(v);
  }
  return out as T;
}

function hydrateFromSeed(seed: DemoSeedCollections): void {
  collections.clear();
  for (const [collectionPath, docsMap] of Object.entries(seed)) {
    const map = new Map<string, Record<string, unknown>>();
    for (const [docId, docData] of Object.entries(docsMap)) {
      map.set(docId, normalizeAndClone(docData));
    }
    collections.set(collectionPath, map);
  }
}

hydrateFromSeed(createInitialDemoState());

function notifyCollectionChange(collectionPath: string): void {
  emitter.dispatchEvent(new CustomEvent("change", { detail: { collectionPath } }));
}

function getCollectionMap(collectionPath: string): Map<string, Record<string, unknown>> {
  let map = collections.get(collectionPath);
  if (!map) {
    map = new Map<string, Record<string, unknown>>();
    collections.set(collectionPath, map);
  }
  return map;
}

/**
 * Sincronización bidireccional aprobada (Opción 2.B):
 * - "reposicion" <-> "solicitudes_material"
 * - "usuarios" <-> "users"
 */
function syncMirroredCollections(
  sourceCollection: string,
  docId: string,
  docData: Record<string, unknown> | null,
): string | null {
  if (sourceCollection === "reposicion" || sourceCollection === "solicitudes_material") {
    const targetCollection =
      sourceCollection === "reposicion" ? "solicitudes_material" : "reposicion";
    const targetMap = getCollectionMap(targetCollection);

    if (docData === null) {
      targetMap.delete(docId);
      return targetCollection;
    }

    const existingTarget = targetMap.get(docId) || {};
    const ts =
      (docData.fechaSolicitud as DemoTimestamp | undefined) ||
      (docData.fecha as DemoTimestamp | undefined) ||
      (existingTarget.fechaSolicitud as DemoTimestamp | undefined) ||
      (existingTarget.fecha as DemoTimestamp | undefined) ||
      DemoTimestamp.now();

    const rawStatus = String(docData.estado || existingTarget.estado || "pendiente");
    const mappedStatus =
      rawStatus === "resuelto"
        ? "aprobada"
        : rawStatus === "cerrado"
          ? "rechazada"
          : rawStatus;

    const merged: Record<string, unknown> = normalizeAndClone({
      ...existingTarget,
      ...docData,
      id: docId,
      estado: mappedStatus,
      fecha: ts,
      fechaSolicitud: ts,
      observaciones:
        docData.observaciones ?? docData.comentarios ?? existingTarget.observaciones ?? "",
      comentarios:
        docData.comentarios ?? docData.observaciones ?? existingTarget.comentarios ?? "",
    });

    targetMap.set(docId, merged);
    return targetCollection;
  }

  if (sourceCollection === "usuarios" || sourceCollection === "users") {
    const targetCollection = sourceCollection === "usuarios" ? "users" : "usuarios";
    const targetMap = getCollectionMap(targetCollection);
    if (docData === null) {
      targetMap.delete(docId);
      return targetCollection;
    }
    const existingTarget = targetMap.get(docId) || {};
    targetMap.set(docId, normalizeAndClone({ ...existingTarget, ...docData, id: docId, uid: docId }));
    return targetCollection;
  }

  return null;
}

function getNestedValue(obj: Record<string, unknown> | undefined, fieldPath: string): unknown {
  if (!obj) return undefined;
  const parts = fieldPath.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function setNestedValue(target: Record<string, unknown>, fieldPath: string, value: unknown): void {
  const parts = fieldPath.split(".");
  let current: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (!key) continue;
    const next = current[key];
    if (
      !next ||
      typeof next !== "object" ||
      Array.isArray(next) ||
      next instanceof DemoTimestamp ||
      next instanceof Date
    ) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = parts[parts.length - 1];
  if (!lastKey) return;

  if (value instanceof FieldSentinel) {
    if (value.kind === "deleteField") {
      delete current[lastKey];
    } else if (value.kind === "serverTimestamp") {
      current[lastKey] = DemoTimestamp.now();
    } else if (value.kind === "increment") {
      const prev = Number(current[lastKey] || 0);
      current[lastKey] = prev + Number(value.payload || 0);
    } else if (value.kind === "arrayUnion") {
      const existing = Array.isArray(current[lastKey])
        ? [...(current[lastKey] as unknown[])]
        : [];
      const additions = Array.isArray(value.payload) ? value.payload : [];
      for (const item of additions) {
        const normalizedItem = normalizeAndClone(item);
        if (!existing.some((e) => JSON.stringify(e) === JSON.stringify(normalizedItem))) {
          existing.push(normalizedItem);
        }
      }
      current[lastKey] = existing;
    } else if (value.kind === "arrayRemove") {
      const existing = Array.isArray(current[lastKey])
        ? (current[lastKey] as unknown[])
        : [];
      const removals = Array.isArray(value.payload) ? value.payload : [];
      current[lastKey] = existing.filter(
        (e) => !removals.some((r) => JSON.stringify(e) === JSON.stringify(normalizeAndClone(r))),
      );
    }
    return;
  }

  if (value instanceof Date) {
    current[lastKey] = DemoTimestamp.fromDate(value);
    return;
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof DemoTimestamp)
  ) {
    const resolved: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      setNestedValue(resolved, k, v);
    }
    current[lastKey] = resolved;
    return;
  }

  current[lastKey] = normalizeAndClone(value);
}

function applyFieldUpdates(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const result = normalizeAndClone(base);
  for (const [key, value] of Object.entries(patch)) {
    setNestedValue(result, key, value);
  }
  return result;
}

function comparableValue(val: unknown): number | string | boolean {
  if (val instanceof DemoTimestamp) return val.toMillis();
  if (val instanceof Date) return val.getTime();
  if (
    val &&
    typeof val === "object" &&
    "toMillis" in val &&
    typeof (val as { toMillis: unknown }).toMillis === "function"
  ) {
    return (val as { toMillis: () => number }).toMillis();
  }
  if (typeof val === "number" || typeof val === "string" || typeof val === "boolean") {
    return val;
  }
  return String(val ?? "");
}

function matchesWhere(
  docId: string,
  data: Record<string, unknown>,
  constraint: Extract<DemoConstraint, { type: "where" }>,
): boolean {
  const fieldVal =
    constraint.field === "__name__" ? docId : getNestedValue(data, constraint.field);
  const target = constraint.value;

  switch (constraint.op) {
    case "==":
      if (fieldVal === undefined) return target === undefined;
      if (fieldVal === null) return target === null;
      return comparableValue(fieldVal) === comparableValue(target);
    case "!=":
      if (fieldVal === undefined || fieldVal === null) return false;
      return comparableValue(fieldVal) !== comparableValue(target);
    case "<":
      if (fieldVal === undefined || fieldVal === null) return false;
      return comparableValue(fieldVal) < comparableValue(target);
    case "<=":
      if (fieldVal === undefined || fieldVal === null) return false;
      return comparableValue(fieldVal) <= comparableValue(target);
    case ">":
      if (fieldVal === undefined || fieldVal === null) return false;
      return comparableValue(fieldVal) > comparableValue(target);
    case ">=":
      if (fieldVal === undefined || fieldVal === null) return false;
      return comparableValue(fieldVal) >= comparableValue(target);
    case "in":
      return (
        fieldVal !== undefined &&
        Array.isArray(target) &&
        target.some((item) => comparableValue(item) === comparableValue(fieldVal))
      );
    case "not-in":
      return (
        fieldVal !== undefined &&
        Array.isArray(target) &&
        !target.some((item) => comparableValue(item) === comparableValue(fieldVal))
      );
    case "array-contains":
      return (
        Array.isArray(fieldVal) &&
        fieldVal.some((item) => comparableValue(item) === comparableValue(target))
      );
    case "array-contains-any":
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
  const segments = docPath.split("/").filter(Boolean);
  const id = segments.pop() || nextDemoId("doc");
  return { collectionPath: segments.join("/"), id };
}

function makeDocSnapshot<T = DemoDocumentData>(
  docPath: string,
  data: Record<string, unknown> | undefined,
): DemoDocSnapshot<T> {
  const { id } = splitDocPath(docPath);
  const cloned = data ? normalizeAndClone(data) : undefined;
  return {
    id,
    exists: () => Boolean(cloned),
    data: () => cloned as T,
    get: (fieldPath: string) => getNestedValue(cloned, fieldPath),
    ref: { kind: "doc", path: docPath, id },
  };
}

export const db: DemoFirestore = { kind: "demo-firestore" };

export function initializeFirestore(
  _app?: unknown,
  _settings?: Record<string, unknown>,
): DemoFirestore {
  return db;
}

export function persistentLocalCache(_settings?: Record<string, unknown>): Record<string, unknown> {
  return { kind: "in-memory-only" };
}

export function collection(_dbOrRef: unknown, ...pathSegments: string[]): DemoCollectionRef {
  const fullPath = pathSegments.join("/");
  const id = pathSegments[pathSegments.length - 1] || fullPath;
  return { kind: "collection", path: fullPath, id };
}

export function doc(dbOrCollectionRef: unknown, ...pathSegments: string[]): DemoDocRef {
  if (
    dbOrCollectionRef &&
    typeof dbOrCollectionRef === "object" &&
    "kind" in dbOrCollectionRef &&
    (dbOrCollectionRef as { kind: string }).kind === "collection"
  ) {
    const colPath = (dbOrCollectionRef as DemoCollectionRef).path;
    const id = pathSegments[0] || nextDemoId("doc");
    return { kind: "doc", path: `${colPath}/${id}`, id };
  }
  const fullPath = pathSegments.join("/");
  const { id } = splitDocPath(fullPath);
  return { kind: "doc", path: fullPath, id };
}

export function documentId(): "__name__" {
  return "__name__";
}

export function where(field: string | "__name__", op: DemoWhereOp, value: unknown): DemoConstraint {
  return { type: "where", field, op, value };
}

export function orderBy(field: string, direction: "asc" | "desc" = "asc"): DemoConstraint {
  return { type: "orderBy", field, direction };
}

export function limit(count: number): DemoConstraint {
  return { type: "limit", count };
}

export function query(
  target: DemoCollectionRef | DemoQuery,
  ...constraints: DemoConstraint[]
): DemoQuery {
  if (target.kind === "query") {
    return {
      kind: "query",
      collectionPath: target.collectionPath,
      constraints: [...target.constraints, ...constraints],
    };
  }
  return { kind: "query", collectionPath: target.path, constraints };
}

export function serverTimestamp(): FieldSentinel {
  return new FieldSentinel("serverTimestamp");
}

export function deleteField(): FieldSentinel {
  return new FieldSentinel("deleteField");
}

export function increment(n: number): FieldSentinel {
  return new FieldSentinel("increment", n);
}

export function arrayUnion(...elements: unknown[]): FieldSentinel {
  return new FieldSentinel("arrayUnion", elements);
}

export function arrayRemove(...elements: unknown[]): FieldSentinel {
  return new FieldSentinel("arrayRemove", elements);
}

function executeQuery<T = DemoDocumentData>(
  target: DemoCollectionRef | DemoQuery,
): DemoQuerySnapshot<T> {
  const collectionPath = target.kind === "collection" ? target.path : target.collectionPath;
  const constraints = target.kind === "query" ? target.constraints : [];
  const map = getCollectionMap(collectionPath);

  let entries = Array.from(map.entries());
  for (const c of constraints) {
    if (c.type === "where") {
      entries = entries.filter(([id, data]) => matchesWhere(id, data, c));
    }
  }

  const orderConstraints = constraints.filter(
    (c): c is Extract<DemoConstraint, { type: "orderBy" }> => c.type === "orderBy",
  );
  if (orderConstraints.length > 0) {
    entries.sort(([, a], [, b]) => {
      for (const oc of orderConstraints) {
        const va = comparableValue(getNestedValue(a, oc.field));
        const vb = comparableValue(getNestedValue(b, oc.field));
        if (va < vb) return oc.direction === "asc" ? -1 : 1;
        if (va > vb) return oc.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const limitConstraint = constraints.find(
    (c): c is Extract<DemoConstraint, { type: "limit" }> => c.type === "limit",
  );
  if (limitConstraint) {
    entries = entries.slice(0, limitConstraint.count);
  }

  const docs = entries.map(
    ([id, data]) =>
      makeDocSnapshot<T>(`${collectionPath}/${id}`, data) as unknown as DemoQueryDocSnapshot<T>,
  );
  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    metadata: { hasPendingWrites: false, fromCache: false },
    forEach: (cb) => docs.forEach(cb),
  };
}

export async function getDoc<T = DemoDocumentData>(
  docRef: DemoDocRef<T>,
): Promise<DemoDocSnapshot<T>> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const data = getCollectionMap(collectionPath).get(id);
  return makeDocSnapshot<T>(docRef.path, data);
}

export async function getDocs<T = DemoDocumentData>(
  target: DemoCollectionRef<T> | DemoQuery<T>,
): Promise<DemoQuerySnapshot<T>> {
  return executeQuery<T>(target as unknown as DemoCollectionRef | DemoQuery);
}

export async function getCountFromServer(
  target: DemoCollectionRef | DemoQuery,
): Promise<{ data: () => { count: number } }> {
  const snap = executeQuery(target);
  return {
    data: () => ({ count: snap.size }),
  };
}

function writeAndMirror(
  collectionPath: string,
  id: string,
  resolvedData: Record<string, unknown> | null,
): string[] {
  const map = getCollectionMap(collectionPath);
  if (resolvedData === null) {
    map.delete(id);
  } else {
    map.set(id, resolvedData);
  }
  const mirrored = syncMirroredCollections(collectionPath, id, resolvedData);
  return mirrored ? [collectionPath, mirrored] : [collectionPath];
}

export async function addDoc(
  colRef: DemoCollectionRef,
  data: DemoDocumentData,
): Promise<DemoDocRef> {
  const id = nextDemoId("demo");
  const resolved = applyFieldUpdates({}, data);
  const touched = writeAndMirror(colRef.path, id, resolved);
  for (const col of touched) notifyCollectionChange(col);
  return { kind: "doc", path: `${colRef.path}/${id}`, id };
}

export async function setDoc(
  docRef: DemoDocRef,
  data: DemoDocumentData,
  options?: { merge?: boolean },
): Promise<void> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const map = getCollectionMap(collectionPath);
  const base = options?.merge ? map.get(id) || {} : {};
  const resolved = applyFieldUpdates(base, data);
  const touched = writeAndMirror(collectionPath, id, resolved);
  for (const col of touched) notifyCollectionChange(col);
}

export async function updateDoc(
  docRef: DemoDocRef,
  data: DemoDocumentData,
): Promise<void> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const map = getCollectionMap(collectionPath);
  const existing = map.get(id) || {};
  const resolved = applyFieldUpdates(existing, data);
  const touched = writeAndMirror(collectionPath, id, resolved);
  for (const col of touched) notifyCollectionChange(col);
}

export async function deleteDoc(docRef: DemoDocRef): Promise<void> {
  const { collectionPath, id } = splitDocPath(docRef.path);
  const touched = writeAndMirror(collectionPath, id, null);
  for (const col of touched) notifyCollectionChange(col);
}

export type DemoSnapshotCallback<T = DemoDocumentData> = {
  bivarianceHack(snapshot: DemoDocSnapshot<T> & DemoQuerySnapshot<T>): void;
}["bivarianceHack"];

export function onSnapshot<T = DemoDocumentData>(
  target: DemoDocRef<T> | DemoCollectionRef<T> | DemoQuery<T>,
  onNext: DemoSnapshotCallback<T>,
  _onError?: (error: Error & { code?: string }) => void,
): DemoUnsubscribe {
  const watchedCollection =
    target.kind === "doc"
      ? splitDocPath(target.path).collectionPath
      : target.kind === "collection"
        ? target.path
        : target.collectionPath;

  const emit = () => {
    if (target.kind === "doc") {
      const { collectionPath, id } = splitDocPath(target.path);
      const data = getCollectionMap(collectionPath).get(id);
      onNext(
        makeDocSnapshot<T>(target.path, data) as unknown as DemoDocSnapshot<T> &
          DemoQuerySnapshot<T>,
      );
    } else {
      onNext(
        executeQuery<T>(target as unknown as DemoCollectionRef | DemoQuery) as unknown as DemoDocSnapshot<T> &
          DemoQuerySnapshot<T>,
      );
    }
  };

  emit();

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ collectionPath: string }>).detail;
    if (detail?.collectionPath === "*" || detail?.collectionPath === watchedCollection) {
      emit();
    }
  };

  activeListenersCount += 1;
  emitter.addEventListener("change", handler);
  let unsubscribed = false;

  return () => {
    if (!unsubscribed) {
      unsubscribed = true;
      activeListenersCount = Math.max(0, activeListenersCount - 1);
      emitter.removeEventListener("change", handler);
    }
  };
}

export function getActiveListenersCount(): number {
  return activeListenersCount;
}

export function writeBatch(_db?: unknown) {
  const ops: Array<() => string[]> = [];
  return {
    set(docRef: DemoDocRef, data: DemoDocumentData, options?: { merge?: boolean }) {
      ops.push(() => {
        const { collectionPath, id } = splitDocPath(docRef.path);
        const map = getCollectionMap(collectionPath);
        const base = options?.merge ? map.get(id) || {} : {};
        const resolved = applyFieldUpdates(base, data);
        return writeAndMirror(collectionPath, id, resolved);
      });
    },
    update(docRef: DemoDocRef, data: DemoDocumentData) {
      ops.push(() => {
        const { collectionPath, id } = splitDocPath(docRef.path);
        const map = getCollectionMap(collectionPath);
        const existing = map.get(id) || {};
        const resolved = applyFieldUpdates(existing, data);
        return writeAndMirror(collectionPath, id, resolved);
      });
    },
    delete(docRef: DemoDocRef) {
      ops.push(() => {
        const { collectionPath, id } = splitDocPath(docRef.path);
        return writeAndMirror(collectionPath, id, null);
      });
    },
    async commit() {
      const touched = new Set<string>();
      for (const op of ops) {
        for (const col of op()) {
          touched.add(col);
        }
      }
      for (const colPath of touched) {
        notifyCollectionChange(colPath);
      }
    },
  };
}

export async function runTransaction<R>(
  _db: unknown,
  updateFn: (transaction: DemoTransaction) => Promise<R>,
): Promise<R> {
  const batch = writeBatch();
  const tx: DemoTransaction = {
    get: <T = DemoDocumentData>(docRef: DemoDocRef<T>) => getDoc<T>(docRef),
    set: <T = DemoDocumentData>(docRef: DemoDocRef<T>, data: T, options?: { merge?: boolean }) => {
      batch.set(docRef as unknown as DemoDocRef, data as DemoDocumentData, options);
      return tx;
    },
    update: (docRef: DemoDocRef<unknown>, data: DemoDocumentData) => {
      batch.update(docRef as unknown as DemoDocRef, data);
      return tx;
    },
    delete: (docRef: DemoDocRef<unknown>) => {
      batch.delete(docRef as unknown as DemoDocRef);
      return tx;
    },
  };
  const result = await updateFn(tx);
  await batch.commit();
  return result;
}

const resetCallbacks = new Set<() => void>();

export function onDemoEnvironmentReset(cb: () => void): DemoUnsubscribe {
  resetCallbacks.add(cb);
  return () => resetCallbacks.delete(cb);
}

export function resetDemoStore(): void {
  autoIdCounter = 1;
  hydrateFromSeed(createInitialDemoState());
  emitter.dispatchEvent(new CustomEvent("change", { detail: { collectionPath: "*" } }));
}

/**
 * Reinicio integral del entorno Demo (FASE 7):
 * 1. Restaura las 19 colecciones de Firestore al estado semilla inicial.
 * 2. Revoca todos los Blob URLs y restaura el almacenamiento simulado.
 * 3. Cierra la sesión activa y restaura las 11 cuentas de usuario iniciales.
 * 4. Limpia los toasts activos y notifica a App.tsx para limpiar React Query y estados de vista.
 */
export function resetDemoEnvironment(): void {
  resetDemoStorage();
  resetDemoStore();
  resetDemoAuth();
  clearAllDemoToasts();
  for (const cb of resetCallbacks) {
    try {
      cb();
    } catch {
      // Ignore callback error
    }
  }
}
