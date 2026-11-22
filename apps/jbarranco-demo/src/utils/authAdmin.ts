import {
  createUserWithEmailAndPassword,
  getApp,
  getApps,
  getAuth,
  initializeApp,
  signOut,
} from "../demo/demoAuth";

const SECONDARY_APP_NAME = "SecondaryAppForUserCreation";

export const createAuthUser = async (
  email: string,
  password: string,
): Promise<string> => {
  const secondaryApp = getApps().some((app) => app.name === SECONDARY_APP_NAME)
    ? getApp(SECONDARY_APP_NAME)
    : initializeApp({}, SECONDARY_APP_NAME);

  const secondaryAuth = getAuth(secondaryApp);
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth,
    email,
    password,
  );
  const uid = userCredential.user.uid;
  await signOut(secondaryAuth);
  return uid;
};
