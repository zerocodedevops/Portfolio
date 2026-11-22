export type DemoRoleMode = 'propietario' | 'admin';

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  getIdTokenResult: (forceRefresh?: boolean) => Promise<{ claims: Record<string, unknown> }>;
}

export class DemoTimestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  private readonly dateValue: Date;

  constructor(date: Date = new Date()) {
    this.dateValue = new Date(date.getTime());
    this.seconds = Math.floor(this.dateValue.getTime() / 1000);
    this.nanoseconds = (this.dateValue.getTime() % 1000) * 1_000_000;
  }

  static now(): DemoTimestamp {
    return new DemoTimestamp(new Date());
  }

  static fromDate(date: Date): DemoTimestamp {
    return new DemoTimestamp(date);
  }

  static fromMillis(millis: number): DemoTimestamp {
    return new DemoTimestamp(new Date(millis));
  }

  toDate(): Date {
    return new Date(this.dateValue.getTime());
  }

  toMillis(): number {
    return this.dateValue.getTime();
  }

  valueOf(): number {
    return this.dateValue.getTime();
  }
}

export type DemoUnsubscribe = () => void;

export interface DemoDocSnapshot<T = Record<string, any>> {
  id: string;
  exists: () => boolean;
  data: (options?: { serverTimestamps?: string }) => T;
  get: (fieldPath: string) => any;
  ref: DemoDocRef;
}

export interface DemoQueryDocSnapshot<T = Record<string, any>> {
  id: string;
  exists: () => true;
  data: (options?: { serverTimestamps?: string }) => T;
  get: (fieldPath: string) => any;
  ref: DemoDocRef;
}

export interface DemoQuerySnapshot<T = Record<string, any>> {
  docs: Array<DemoQueryDocSnapshot<T>>;
  empty: boolean;
  size: number;
  metadata: { hasPendingWrites: boolean; fromCache: boolean };
  forEach: (cb: (doc: DemoQueryDocSnapshot<T>) => void) => void;
}

export interface DemoDocRef {
  kind: 'doc';
  path: string;
  id: string;
}

export interface DemoCollectionRef {
  kind: 'collection';
  path: string;
}

export type DemoWhereOp =
  | '=='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'in'
  | 'not-in'
  | 'array-contains'
  | 'array-contains-any';

export type DemoConstraint =
  | { type: 'where'; field: string | '__name__'; op: DemoWhereOp; value: unknown }
  | { type: 'orderBy'; field: string; direction: 'asc' | 'desc' }
  | { type: 'limit'; count: number };

export type DemoDocumentData = Record<string, any>;
export type DemoFirestore = { kind: 'demo-firestore' };
export interface DemoTransaction {
  get: <T = Record<string, unknown>>(docRef: DemoDocRef) => Promise<DemoDocSnapshot<T>>;
  set: (docRef: DemoDocRef, data: Record<string, unknown>, options?: { merge?: boolean }) => void;
  update: (docRef: DemoDocRef, data: Record<string, unknown>) => void;
  delete: (docRef: DemoDocRef) => void;
}

export interface DemoQuery {
  kind: 'query';
  collectionPath: string;
  constraints: DemoConstraint[];
}
