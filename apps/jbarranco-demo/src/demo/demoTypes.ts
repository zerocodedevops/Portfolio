export type DemoDocumentData = Record<string, any>;
export type DemoUnsubscribe = () => void;
export type DemoRoleMode = "admin" | "cliente" | "empleado";

export class DemoTimestamp {
  readonly seconds: number;
  readonly nanoseconds: number;

  constructor(seconds: number, nanoseconds = 0) {
    this.seconds = Math.floor(seconds);
    this.nanoseconds = Math.floor(nanoseconds);
  }

  static now(): DemoTimestamp {
    return DemoTimestamp.fromMillis(Date.now());
  }

  static fromDate(date: Date): DemoTimestamp {
    return DemoTimestamp.fromMillis(date.getTime());
  }

  static fromMillis(milliseconds: number): DemoTimestamp {
    const seconds = Math.floor(milliseconds / 1000);
    const nanoseconds = Math.floor((milliseconds % 1000) * 1_000_000);
    return new DemoTimestamp(seconds, nanoseconds);
  }

  toDate(): Date {
    return new Date(this.toMillis());
  }

  toMillis(): number {
    return this.seconds * 1000 + Math.floor(this.nanoseconds / 1_000_000);
  }

  isEqual(other: DemoTimestamp): boolean {
    return this.seconds === other.seconds && this.nanoseconds === other.nanoseconds;
  }

  valueOf(): string {
    return `${this.seconds}.${String(this.nanoseconds).padStart(9, "0")}`;
  }
}

export { DemoTimestamp as Timestamp };

export interface DemoFirestore {
  readonly kind: "demo-firestore";
}

export interface DemoCollectionRef<T = DemoDocumentData> {
  readonly kind: "collection";
  readonly path: string;
  readonly id: string;
  readonly _type?: T;
}

export interface DemoDocRef<T = DemoDocumentData> {
  readonly kind: "doc";
  readonly path: string;
  readonly id: string;
  readonly _type?: T;
}

export type DemoWhereOp =
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "in"
  | "not-in"
  | "array-contains"
  | "array-contains-any";

export type DemoConstraint =
  | { readonly type: "where"; readonly field: string; readonly op: DemoWhereOp; readonly value: unknown }
  | { readonly type: "orderBy"; readonly field: string; readonly direction: "asc" | "desc" }
  | { readonly type: "limit"; readonly count: number };

export interface DemoQuery<T = DemoDocumentData> {
  readonly kind: "query";
  readonly collectionPath: string;
  readonly constraints: readonly DemoConstraint[];
  readonly _type?: T;
}

export interface DemoDocSnapshot<T = DemoDocumentData, _AppModel = T> {
  readonly id: string;
  readonly ref: DemoDocRef<T>;
  exists(): boolean;
  data(): T;
  get(fieldPath: string): any;
}

export interface DemoQueryDocSnapshot<T = DemoDocumentData, _AppModel = T> extends DemoDocSnapshot<T, _AppModel> {
  data(): T;
}

export interface DemoQuerySnapshot<T = DemoDocumentData, _AppModel = T> {
  readonly docs: DemoQueryDocSnapshot<T, _AppModel>[];
  readonly empty: boolean;
  readonly size: number;
  readonly metadata: { readonly hasPendingWrites: boolean; readonly fromCache: boolean };
  forEach(callback: (result: DemoQueryDocSnapshot<T, _AppModel>) => void): void;
}

export interface DemoTransaction {
  get<T = DemoDocumentData>(docRef: DemoDocRef<T>): Promise<DemoDocSnapshot<T>>;
  set<T = DemoDocumentData>(docRef: DemoDocRef<T>, data: T, options?: { merge?: boolean }): DemoTransaction;
  update(docRef: DemoDocRef<unknown>, data: DemoDocumentData): DemoTransaction;
  delete(docRef: DemoDocRef<unknown>): DemoTransaction;
}

export interface DemoUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  rol?: DemoRoleMode;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  firestoreId?: string;
  urlImagenPerfil?: string;
  terminosAceptados?: boolean;
  getIdTokenResult?: () => Promise<{ claims: Record<string, unknown> }>;
}
