import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Role } from "../types";

export interface AuthUser extends FirebaseUser {
  rol?: Role;
  nombre?: string;
  urlImagenPerfil?: string;
  firestoreId?: string;
  direccion?: string;
  telefono?: string;
  terminosAceptados?: boolean;
  fechaAceptacionTerminos?: { toDate: () => Date } | Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  userRole: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isRole = (value: unknown): value is Role =>
  value === "admin" || value === "cliente" || value === "empleado";

const mergeAuthUser = (
  firebaseUser: FirebaseUser,
  profile: Record<string, unknown>,
  extras: Record<string, unknown> = {},
): AuthUser =>
  ({
    ...firebaseUser,
    ...profile,
    ...extras,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
  }) as AuthUser;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let foundUser = false;

        const findUserInCollections = async () => {
          // 1. Buscar en 'usuarios' por UID
          try {
            const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() || {};
              setUser(mergeAuthUser(firebaseUser, userData));
              setUserRole(isRole(userData.rol) ? userData.rol : null);
              foundUser = true;
              return;
            }
          } catch {
            // Ignorar
          }

          // 2. Buscar en 'empleados' por UID
          try {
            const employeesSnapshot = await getDoc(
              doc(db, "empleados", firebaseUser.uid),
            );
            if (employeesSnapshot.exists()) {
              setUser(
                mergeAuthUser(firebaseUser, employeesSnapshot.data() || {}),
              );
              setUserRole("empleado");
              foundUser = true;
              return;
            }
          } catch {
            // Ignorar
          }

          // 3. Fallback: Buscar en 'empleados' por EMAIL
          try {
            const qEmployee = query(
              collection(db, "empleados"),
              where("email", "==", firebaseUser.email),
            );
            const employeeQuerySnapshot = await getDocs(qEmployee);

            if (!employeeQuerySnapshot.empty) {
              const firstDoc = employeeQuerySnapshot.docs[0];
              if (firstDoc) {
                const employeeData = firstDoc.data();
                setUser(
                  mergeAuthUser(firebaseUser, employeeData, {
                    firestoreId: firstDoc.id,
                  }),
                );
                setUserRole("empleado");
                foundUser = true;
                return;
              }
            }
          } catch {
            // Ignorar
          }

          // 4. Buscar en 'clientes' por UID
          try {
            const clientsSnapshot = await getDoc(
              doc(db, "clientes", firebaseUser.uid),
            );
            if (clientsSnapshot.exists()) {
              const clientData = clientsSnapshot.data() || {};
              setUser(mergeAuthUser(firebaseUser, clientData));
              setUserRole("cliente");
              foundUser = true;
              return;
            }
          } catch {
            // Ignorar
          }

          // 5. Fallback: Buscar en 'clientes' por EMAIL
          try {
            const qClient = query(
              collection(db, "clientes"),
              where("email", "==", firebaseUser.email),
            );
            const clientQuerySnapshot = await getDocs(qClient);

            if (!clientQuerySnapshot.empty) {
              const firstDoc = clientQuerySnapshot.docs[0];
              if (firstDoc) {
                const clientData = firstDoc.data();
                setUser(
                  mergeAuthUser(firebaseUser, clientData, {
                    firestoreId: firstDoc.id,
                  }),
                );
                setUserRole("cliente");
                foundUser = true;
              }
            }
          } catch {
            // Ignorar
          }
        };

        await findUserInCollections();

        if (!foundUser) {
          await firebaseSignOut(auth);
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<UserCredential> => {
      return signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const signOut = useCallback(async (): Promise<void> => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserRole(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      userRole,
      loading,
      signIn,
      signOut,
    }),
    [user, userRole, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
