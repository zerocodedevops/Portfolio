import { DEMO_ADMIN_UID, DEMO_OWNER_UID } from './demoConstants';
import type { DemoRoleMode, DemoUnsubscribe, DemoUser } from './demoTypes';

const OWNER_USER: DemoUser = {
  uid: DEMO_OWNER_UID,
  email: 'vecino.portal2.1a@neighnet.com',
  displayName: 'Vecino Portal 2 1A',
  photoURL: null,
  emailVerified: true,
  getIdTokenResult: async () => ({ claims: { role: 'authenticated', demoRole: 'propietario' } }),
};

const ADMIN_USER: DemoUser = {
  uid: DEMO_ADMIN_UID,
  email: 'vecino.portal1.1a@neighnet.com',
  displayName: 'Vecino Portal 1 1A',
  photoURL: null,
  emailVerified: true,
  getIdTokenResult: async () => ({ claims: { role: 'authenticated', demoRole: 'presidente', admin: true } }),
};

let activeUser: DemoUser | null = null;
let activeRoleMode: DemoRoleMode | null = null;
const authEmitter = new EventTarget();

function notifyAuthChange(): void {
  authEmitter.dispatchEvent(new CustomEvent('auth-changed'));
}

export function getDemoUser(): DemoUser | null {
  return activeUser;
}

export function getDemoRoleMode(): DemoRoleMode | null {
  return activeRoleMode;
}

export const auth = {
  get currentUser(): DemoUser | null {
    return activeUser;
  },
};

export function onAuthStateChanged(_auth: unknown, callback: (user: DemoUser | null) => void): DemoUnsubscribe {
  callback(activeUser);
  const handler = () => callback(activeUser);
  authEmitter.addEventListener('auth-changed', handler);
  return () => authEmitter.removeEventListener('auth-changed', handler);
}

export function loginAsOwner(): DemoUser {
  activeRoleMode = 'propietario';
  activeUser = { ...OWNER_USER };
  notifyAuthChange();
  return activeUser;
}

export function loginAsAdmin(): DemoUser {
  activeRoleMode = 'admin';
  activeUser = { ...ADMIN_USER };
  notifyAuthChange();
  return activeUser;
}

export function switchDemoRole(mode: DemoRoleMode): DemoUser {
  return mode === 'admin' ? loginAsAdmin() : loginAsOwner();
}

export async function signOut(_auth?: unknown): Promise<void> {
  activeUser = null;
  activeRoleMode = null;
  notifyAuthChange();
}
