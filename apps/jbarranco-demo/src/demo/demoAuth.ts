import {
  buildLocalAvatarSvg,
  DEMO_ADMIN_UID,
  DEMO_CLIENT_UID,
  DEMO_EMPLOYEE_UID,
} from "./demoConstants";
import type { DemoRoleMode, DemoUnsubscribe, DemoUser } from "./demoTypes";

export type { DemoUser as User };

export interface UserCredential {
  user: DemoUser;
}

export interface FirebaseApp {
  name: string;
  options: Record<string, unknown>;
}

export interface Auth {
  readonly currentUser: DemoUser | null;
  readonly app?: FirebaseApp;
}

export interface AuthCredential {
  readonly providerId: string;
  readonly email?: string;
  readonly password?: string;
}

interface StoredAccount {
  user: DemoUser;
  password: string;
  role: DemoRoleMode;
}

export const DEMO_PRIMARY_CREDENTIALS: Record<
  DemoRoleMode,
  { email: string; password: string; label: string; subtitle: string; uid: string }
> = {
  admin: {
    uid: DEMO_ADMIN_UID,
    email: "admin@jbarranco-demo.local",
    password: "DemoAdmin2026!",
    label: "Administrador Empresa",
    subtitle: "Dirección de Operaciones · Control total ERP (17 módulos)",
  },
  cliente: {
    uid: DEMO_CLIENT_UID,
    email: "presidente@monteclaro-demo.local",
    password: "DemoCliente2026!",
    label: "C.P. Residencial Monteclaro (Cliente)",
    subtitle: "Comunidad de Propietarios · Calendario, Tickets, Extras y Calidad",
  },
  empleado: {
    uid: DEMO_EMPLOYEE_UID,
    email: "laura.gomez@jbarranco-demo.local",
    password: "DemoEmpleada2026!",
    label: "Laura Gómez Martín (Empleada)",
    subtitle: "Operaria de Limpieza · Ruta Diaria, Tareas, Inventario y Valoraciones",
  },
};

function createInitialAccounts(): Map<string, StoredAccount> {
  const list: Array<{
    uid: string;
    email: string;
    password: string;
    displayName: string;
    nombre: string;
    apellidos?: string;
    role: DemoRoleMode;
    telefono: string;
    direccion?: string;
  }> = [
    {
      uid: DEMO_ADMIN_UID,
      email: "admin@jbarranco-demo.local",
      password: "DemoAdmin2026!",
      displayName: "Administrador Empresa",
      nombre: "Administrador Empresa",
      role: "admin",
      telefono: "600 100 100",
    },
    {
      uid: DEMO_CLIENT_UID,
      email: "presidente@monteclaro-demo.local",
      password: "DemoCliente2026!",
      displayName: "C.P. Residencial Monteclaro",
      nombre: "C.P. Residencial Monteclaro",
      role: "cliente",
      telefono: "600 200 101",
      direccion: "Av. de Europa 18, 28224 Pozuelo (Madrid)",
    },
    {
      uid: DEMO_EMPLOYEE_UID,
      email: "laura.gomez@jbarranco-demo.local",
      password: "DemoEmpleada2026!",
      displayName: "Laura Gómez Martín",
      nombre: "Laura Gómez",
      apellidos: "Martín",
      role: "empleado",
      telefono: "600 300 201",
    },
    // Cuentas secundarias de clientes
    {
      uid: "demo-client-2",
      email: "gerencia@castellana200-demo.local",
      password: "DemoCliente2026!",
      displayName: "Edificio Corporativo Castellana 200",
      nombre: "Edificio Corporativo Castellana 200",
      role: "cliente",
      telefono: "600 200 102",
      direccion: "Paseo de la Castellana 200, 28046 Madrid",
    },
    {
      uid: "demo-client-3",
      email: "admin@jardinesretiro-demo.local",
      password: "DemoCliente2026!",
      displayName: "Residencial Jardines del Retiro",
      nombre: "Residencial Jardines del Retiro",
      role: "cliente",
      telefono: "600 200 103",
      direccion: "Calle de Ibiza 44, 28009 Madrid",
    },
    {
      uid: "demo-client-4",
      email: "presidente@parquenorte-demo.local",
      password: "DemoCliente2026!",
      displayName: "Urbanización Parque Norte",
      nombre: "Urbanización Parque Norte",
      role: "cliente",
      telefono: "600 200 104",
      direccion: "Av. de Monforte de Lemos 112, 28029 Madrid",
    },
    {
      uid: "demo-client-5",
      email: "facilities@kronos-demo.local",
      password: "DemoCliente2026!",
      displayName: "Centro Empresarial Kronos",
      nombre: "Centro Empresarial Kronos",
      role: "cliente",
      telefono: "600 200 105",
      direccion: "Calle de Méndez Álvaro 56, 28045 Madrid",
    },
    {
      uid: "demo-client-6",
      email: "junta@miradordeleste-demo.local",
      password: "DemoCliente2026!",
      displayName: "Comunidad Mirador del Este",
      nombre: "Comunidad Mirador del Este",
      role: "cliente",
      telefono: "600 200 106",
      direccion: "Av. de la Gran Vía del Este 28, 28032 Madrid",
    },
    // Cuentas secundarias de empleados
    {
      uid: "demo-employee-2",
      email: "miguel.ruiz@jbarranco-demo.local",
      password: "DemoEmpleado2026!",
      displayName: "Miguel Ángel Ruiz",
      nombre: "Miguel Ángel",
      apellidos: "Ruiz",
      role: "empleado",
      telefono: "600 300 202",
    },
    {
      uid: "demo-employee-3",
      email: "elena.navarro@jbarranco-demo.local",
      password: "DemoEmpleada2026!",
      displayName: "Elena Navarro",
      nombre: "Elena",
      apellidos: "Navarro",
      role: "empleado",
      telefono: "600 300 203",
    },
    {
      uid: "demo-employee-4",
      email: "david.soler@jbarranco-demo.local",
      password: "DemoEmpleado2026!",
      displayName: "David Soler",
      nombre: "David",
      apellidos: "Soler",
      role: "empleado",
      telefono: "600 300 204",
    },
  ];

  const map = new Map<string, StoredAccount>();
  for (const item of list) {
    const avatar = buildLocalAvatarSvg(item.displayName);
    const user: DemoUser = {
      uid: item.uid,
      email: item.email,
      displayName: item.displayName,
      photoURL: avatar,
      urlImagenPerfil: avatar,
      emailVerified: true,
      rol: item.role,
      nombre: item.nombre,
      apellidos: item.apellidos,
      telefono: item.telefono,
      direccion: item.direccion,
      firestoreId: item.uid,
      terminosAceptados: true,
      getIdTokenResult: async () => ({
        claims: { role: "authenticated", demoRole: item.role, admin: item.role === "admin" },
      }),
    };
    map.set(item.email.toLowerCase(), {
      user,
      password: item.password,
      role: item.role,
    });
  }
  return map;
}

const SESSION_STORAGE_KEY = "jbarranco_erp_demo_active_role";

let accountsRegistry = createInitialAccounts();
let activeUser: DemoUser | null = null;
let activeRoleMode: DemoRoleMode | null = null;
let createdUserCounter = 100;
const authEmitter = new EventTarget();
const registeredApps = new Map<string, FirebaseApp>();

function persistSessionRole(role: DemoRoleMode | null): void {
  try {
    if (typeof globalThis.sessionStorage === "undefined") return;
    if (role) {
      globalThis.sessionStorage.setItem(SESSION_STORAGE_KEY, role);
    } else {
      globalThis.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignorar en entornos sin sessionStorage
  }
}

function restoreInitialSession(): void {
  try {
    if (typeof globalThis.sessionStorage === "undefined") return;
    const savedRole = globalThis.sessionStorage.getItem(SESSION_STORAGE_KEY) as DemoRoleMode | null;
    if (savedRole && DEMO_PRIMARY_CREDENTIALS[savedRole]) {
      const primary = DEMO_PRIMARY_CREDENTIALS[savedRole];
      const account = accountsRegistry.get(primary.email.toLowerCase());
      if (account) {
        activeRoleMode = savedRole;
        activeUser = { ...account.user };
      }
    }
  } catch {
    // Ignorar en entornos sin sessionStorage
  }
}

restoreInitialSession();

function notifyAuthChange(): void {
  authEmitter.dispatchEvent(new CustomEvent("auth-changed"));
}

function createAuthError(code: string, message: string): Error & { code: string } {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

export function initializeApp(
  options: Record<string, unknown> = {},
  name = "[DEFAULT]",
): FirebaseApp {
  const app: FirebaseApp = { name, options };
  registeredApps.set(name, app);
  return app;
}

export function getApps(): FirebaseApp[] {
  return Array.from(registeredApps.values());
}

export function getApp(name = "[DEFAULT]"): FirebaseApp {
  return registeredApps.get(name) || initializeApp({}, name);
}

export const auth: Auth = {
  get currentUser(): DemoUser | null {
    return activeUser;
  },
};

export function getAuth(app?: FirebaseApp): Auth {
  if (app && app.name === "SecondaryAppForUserCreation") {
    return {
      get currentUser() {
        return null;
      },
      app,
    };
  }
  return auth;
}

export function getDemoUser(): DemoUser | null {
  return activeUser;
}

export function getDemoRoleMode(): DemoRoleMode | null {
  return activeRoleMode;
}

export function getRegisteredAccountsCount(): number {
  return accountsRegistry.size;
}

export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: DemoUser | null) => void,
): DemoUnsubscribe {
  callback(activeUser);
  const handler = () => callback(activeUser);
  authEmitter.addEventListener("auth-changed", handler);
  return () => authEmitter.removeEventListener("auth-changed", handler);
}

export function loginAsDemoRole(role: DemoRoleMode): DemoUser {
  const primary = DEMO_PRIMARY_CREDENTIALS[role];
  const account = accountsRegistry.get(primary.email.toLowerCase());
  if (!account) {
    throw createAuthError("auth/user-not-found", "Cuenta demo principal no encontrada.");
  }
  activeRoleMode = role;
  activeUser = { ...account.user };
  persistSessionRole(role);
  notifyAuthChange();
  return activeUser;
}

export async function signInWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string,
): Promise<UserCredential> {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const account = accountsRegistry.get(normalizedEmail);
  if (!account) {
    throw createAuthError("auth/user-not-found", "Usuario o contraseña incorrectos.");
  }
  if (account.password !== password) {
    throw createAuthError("auth/wrong-password", "Usuario o contraseña incorrectos.");
  }
  activeRoleMode = account.role;
  activeUser = { ...account.user };
  persistSessionRole(account.role);
  notifyAuthChange();
  return { user: activeUser };
}

export async function createUserWithEmailAndPassword(
  targetAuth: Auth,
  email: string,
  password: string,
): Promise<UserCredential> {
  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw createAuthError("auth/invalid-email", "El formato del correo electrónico no es válido.");
  }
  if (!password || password.length < 6) {
    throw createAuthError("auth/weak-password", "La contraseña es muy débil (mínimo 6 caracteres).");
  }
  if (accountsRegistry.has(normalizedEmail)) {
    throw createAuthError("auth/email-already-in-use", "El correo electrónico ya está en uso por otra cuenta.");
  }

  createdUserCounter += 1;
  const uid = `demo-user-${createdUserCounter}`;
  const displayName = normalizedEmail.split("@")[0] || "Usuario Demo";
  const avatar = buildLocalAvatarSvg(displayName);
  const role: DemoRoleMode = normalizedEmail.includes("emplead") ? "empleado" : "cliente";

  const newUser: DemoUser = {
    uid,
    email: normalizedEmail,
    displayName,
    nombre: displayName,
    photoURL: avatar,
    urlImagenPerfil: avatar,
    emailVerified: true,
    rol: role,
    firestoreId: uid,
    terminosAceptados: true,
  };

  accountsRegistry.set(normalizedEmail, {
    user: newUser,
    password,
    role,
  });

  // Si se crea desde la app secundaria de authAdmin, NO alteramos la sesión activa del Administrador
  if (!targetAuth?.app || targetAuth.app.name !== "SecondaryAppForUserCreation") {
    activeUser = { ...newUser };
    activeRoleMode = role;
    notifyAuthChange();
  }

  return { user: newUser };
}

export async function signOut(targetAuth?: Auth): Promise<void> {
  if (targetAuth?.app && targetAuth.app.name === "SecondaryAppForUserCreation") {
    return;
  }
  activeUser = null;
  activeRoleMode = null;
  persistSessionRole(null);
  notifyAuthChange();
}

export async function sendPasswordResetEmail(_auth: unknown, email: string): Promise<void> {
  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!accountsRegistry.has(normalizedEmail)) {
    throw createAuthError("auth/user-not-found", "Email no registrado.");
  }
}

export class GoogleAuthProvider {
  readonly providerId = "google.com";
}

export async function signInWithPopup(_auth: unknown, _provider: unknown): Promise<UserCredential> {
  const user = loginAsDemoRole(activeRoleMode || "cliente");
  return { user };
}

export const EmailAuthProvider = {
  credential(email: string, password: string): AuthCredential {
    return { providerId: "password", email, password };
  },
};

export async function reauthenticateWithCredential(
  user: DemoUser,
  credential: AuthCredential,
): Promise<UserCredential> {
  const email = (credential.email || user.email || "").trim().toLowerCase();
  const account = accountsRegistry.get(email);
  if (!account || account.password !== credential.password) {
    throw createAuthError("auth/wrong-password", "La contraseña actual es incorrecta");
  }
  return { user };
}

export async function updatePassword(user: DemoUser, newPassword: string): Promise<void> {
  if (!newPassword || newPassword.length < 6) {
    throw createAuthError("auth/weak-password", "La contraseña debe tener al menos 6 caracteres");
  }
  const email = (user.email || "").trim().toLowerCase();
  const account = accountsRegistry.get(email);
  if (account) {
    account.password = newPassword;
  }
}

export async function updateEmail(user: DemoUser, newEmail: string): Promise<void> {
  const oldEmail = (user.email || "").trim().toLowerCase();
  const normalizedNew = (newEmail || "").trim().toLowerCase();
  if (!normalizedNew || !normalizedNew.includes("@")) {
    throw createAuthError("auth/invalid-email", "Email no válido");
  }
  const account = accountsRegistry.get(oldEmail);
  if (account) {
    accountsRegistry.delete(oldEmail);
    account.user.email = normalizedNew;
    accountsRegistry.set(normalizedNew, account);
  }
  if (activeUser && activeUser.uid === user.uid) {
    activeUser = { ...activeUser, email: normalizedNew };
    notifyAuthChange();
  }
}

export function resetDemoAuth(): void {
  accountsRegistry = createInitialAccounts();
  activeUser = null;
  activeRoleMode = null;
  createdUserCounter = 100;
  persistSessionRole(null);
  notifyAuthChange();
}
