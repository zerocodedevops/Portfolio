import { auth, initializeApp, type Auth, type FirebaseApp } from "../demo/demoAuth";
import { db, type DemoFirestore as Firestore } from "../demo/demoStore";

export const app: FirebaseApp = initializeApp({}, "[DEFAULT]");
export { auth, db, type Auth, type FirebaseApp, type Firestore };
