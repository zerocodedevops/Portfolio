import { beforeEach, describe, expect, it } from "vitest";
import {
  auth,
  createUserWithEmailAndPassword,
  DEMO_PRIMARY_CREDENTIALS,
  getAuth,
  getDemoRoleMode,
  getDemoUser,
  getRegisteredAccountsCount,
  initializeApp,
  loginAsDemoRole,
  signInWithEmailAndPassword,
  signOut,
} from "../demoAuth";
import {
  DEMO_CLIENT_UID,
  DEMO_EMPLOYEE_UID,
  DEMO_PDF_DISABLED_MESSAGE,
} from "../demoConstants";
import {
  getActiveBlobUrlsCount,
  registerDemoBlobUrl,
  supabase,
} from "../demoStorage";
import {
  addDoc,
  collection,
  db,
  DemoTimestamp,
  doc,
  getActiveListenersCount,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  resetDemoEnvironment,
  updateDoc,
  where,
  writeBatch,
} from "../demoStore";
import {
  generateBudget,
  generateInvoice,
  generateJobReport,
} from "../../services/pdfService";
import {
  approveRequest,
  getPendingRequests,
  rejectRequest,
} from "../../services/requestsService";
import { uploadDocument } from "../../services/storageService";

describe("J.Barranco ERP Demo — Motor In-Memory, Seguridad, Sincronización y Reinicio", () => {
  beforeEach(() => {
    resetDemoEnvironment();
  });

  it("1. Pobla las 19 colecciones reales de Firestore con datos 100% ficticios", async () => {
    const requiredCollections = [
      "usuarios",
      "users",
      "clientes",
      "empleados",
      "trabajos",
      "tareasEspeciales",
      "rutas",
      "tickets",
      "comunicaciones",
      "extras",
      "inventario",
      "stock_clientes",
      "solicitudes_material",
      "reposicion",
      "transactions",
      "documentosSubidos",
      "ratings",
      "configuracion",
      "counters",
    ];

    for (const colName of requiredCollections) {
      const snap = await getDocs(collection(db, colName));
      expect(snap.empty, `La colección ${colName} no debe estar vacía`).toBe(false);
    }
  });

  it("2. Autenticación ficticia: acceso 1-clic, validación estricta de credenciales y rechazo de claves inválidas", async () => {
    expect(getDemoUser()).toBeNull();

    // Rechaza email inexistente
    await expect(
      signInWithEmailAndPassword(auth, "inexistente@correo.com", "123456"),
    ).rejects.toThrow();

    // Rechaza contraseña incorrecta para cuenta existente
    await expect(
      signInWithEmailAndPassword(
        auth,
        DEMO_PRIMARY_CREDENTIALS.admin.email,
        "ClaveIncorrecta!",
      ),
    ).rejects.toThrow();

    // Acepta credenciales explícitas de Administrador
    const cred = await signInWithEmailAndPassword(
      auth,
      DEMO_PRIMARY_CREDENTIALS.admin.email,
      DEMO_PRIMARY_CREDENTIALS.admin.password,
    );
    expect(cred.user.uid).toBe(DEMO_PRIMARY_CREDENTIALS.admin.uid);
    expect(getDemoRoleMode()).toBe("admin");

    // Cambio rápido de perfil a Cliente y Empleado
    const clientUser = loginAsDemoRole("cliente");
    expect(clientUser.uid).toBe(DEMO_CLIENT_UID);
    expect(getDemoRoleMode()).toBe("cliente");

    const empUser = loginAsDemoRole("empleado");
    expect(empUser.uid).toBe(DEMO_EMPLOYEE_UID);
    expect(getDemoRoleMode()).toBe("empleado");

    // Cierre de sesión
    await signOut();
    expect(getDemoUser()).toBeNull();
    expect(getDemoRoleMode()).toBeNull();
  });

  it("3. Normaliza objetos Date nativos a DemoTimestamp en escrituras y soporta doc(collectionRef) + getCountFromServer", async () => {
    const colRef = collection(db, "trabajos");
    const autoRef = doc(colRef);
    expect(autoRef.id).toBeTruthy();

    const batch = writeBatch(db);
    const nativeDate = new Date(2026, 10, 22, 10, 30, 0);
    batch.set(autoRef, {
      clienteId: DEMO_CLIENT_UID,
      clienteNombre: "C.P. Residencial Monteclaro",
      empleadoId: "",
      estado: "pendiente",
      observaciones: "Observación de prueba en batch",
      fecha: nativeDate,
      createdAt: new Date(),
    });
    await batch.commit();

    const saved = await getDoc(autoRef);
    expect(saved.exists()).toBe(true);
    const savedFecha = saved.data()?.fecha as DemoTimestamp;
    expect(typeof savedFecha.toDate).toBe("function");
    expect(savedFecha.toDate().getTime()).toBe(nativeDate.getTime());

    const qUnassigned = query(
      collection(db, "trabajos"),
      where("empleadoId", "==", ""),
      where("estado", "==", "pendiente"),
    );
    const countSnap = await getCountFromServer(qUnassigned);
    expect(countSnap.data().count).toBeGreaterThanOrEqual(4);
  });

  it("4. Opción 2.B: Sincroniza bidireccionalmente 'reposicion' y 'solicitudes_material' en el flujo Empleado <-> Admin", async () => {
    // 1. El empleado crea una solicitud en 'reposicion' (como hace EmployeeInventory.tsx)
    const repRef = await addDoc(collection(db, "reposicion"), {
      empleadoId: DEMO_EMPLOYEE_UID,
      empleadoNombre: "Laura Gómez Martín",
      clienteId: DEMO_CLIENT_UID,
      clienteNombre: "C.P. Residencial Monteclaro",
      producto: "Lejía Detergente Clorada Densa 5L",
      cantidad: 3,
      estado: "pendiente",
      fecha: DemoTimestamp.now(),
      fechaSolicitud: DemoTimestamp.now(),
      comentarios: "Urgente para cuarto de basuras",
      observaciones: "Urgente para cuarto de basuras",
    });

    // 2. El administrador la ve inmediatamente en 'solicitudes_material'
    const pendingInAdmin = await getPendingRequests();
    const mirroredReq = pendingInAdmin.find((r) => r.id === repRef.id);
    expect(mirroredReq).toBeDefined();
    expect(mirroredReq?.producto).toBe("Lejía Detergente Clorada Densa 5L");
    expect(mirroredReq?.cantidad).toBe(3);

    // 3. El administrador aprueba la solicitud mediante transacción (approveRequest)
    await approveRequest(repRef.id);

    // 4. Tanto 'solicitudes_material' como 'reposicion' reflejan el estado 'aprobada'
    const solSnap = await getDoc(doc(db, "solicitudes_material", repRef.id));
    const repSnap = await getDoc(doc(db, "reposicion", repRef.id));
    expect(solSnap.data()?.estado).toBe("aprobada");
    expect(repSnap.data()?.estado).toBe("aprobada");

    // 5. Prueba de rechazo sincronizado sobre otra solicitud
    const repRef2 = await addDoc(collection(db, "reposicion"), {
      empleadoId: DEMO_EMPLOYEE_UID,
      empleadoNombre: "Laura Gómez Martín",
      clienteId: DEMO_CLIENT_UID,
      clienteNombre: "C.P. Residencial Monteclaro",
      producto: "Fregasuelos Neutro Pino Concentrado 5L",
      cantidad: 1,
      estado: "pendiente",
      fecha: DemoTimestamp.now(),
      fechaSolicitud: DemoTimestamp.now(),
    });
    await rejectRequest(repRef2.id, "Ya se entregó lote esta semana");
    const rejectedRep = await getDoc(doc(db, "reposicion", repRef2.id));
    expect(rejectedRep.data()?.estado).toBe("rechazada");
    expect(rejectedRep.data()?.motivoRechazo).toBe("Ya se entregó lote esta semana");
  });

  it("5. Restricción 1.4: Impide generar, subir o obtener enlaces de PDFs", async () => {
    await expect(
      generateBudget({ nombre: "Test" }, { tipo: "General", descripcion: "Test", precio: 100 }),
    ).rejects.toThrow(DEMO_PDF_DISABLED_MESSAGE);
    await expect(
      generateInvoice({ nombre: "Test" }, { tipo: "General", descripcion: "Test", precio: 100 }),
    ).rejects.toThrow(DEMO_PDF_DISABLED_MESSAGE);
    await expect(
      generateJobReport({ tipo: "General", descripcion: "Test", precio: 100 }),
    ).rejects.toThrow(DEMO_PDF_DISABLED_MESSAGE);

    const dummyFile = new File(["dummy"], "test.pdf", { type: "application/pdf" });
    await expect(uploadDocument(dummyFile, "facturas")).rejects.toThrow(
      DEMO_PDF_DISABLED_MESSAGE,
    );

    const supUpload = await supabase.storage.from("budgets").upload("path/test.pdf", dummyFile);
    expect(supUpload.error?.message).toBe(DEMO_PDF_DISABLED_MESSAGE);

    const signed = await supabase.storage.from("budgets").createSignedUrl("path/test.pdf", 3600);
    expect(signed.data?.signedUrl).toBe("");
  });

  it("6. FASE 7: Reinicio completo restaura colecciones, cierra sesión, elimina cuentas secundarias y revoca Blob URLs", async () => {
    const initialAccounts = getRegisteredAccountsCount();
    expect(initialAccounts).toBe(11);

    // 1. Iniciar sesión como Admin
    loginAsDemoRole("admin");
    expect(getDemoUser()).not.toBeNull();

    // 2. Crear un registro y modificar otro
    const createdTicket = await addDoc(collection(db, "tickets"), {
      clienteId: DEMO_CLIENT_UID,
      clienteNombre: "C.P. Residencial Monteclaro",
      asunto: "Ticket temporal de sesión",
      mensaje: "Debe desaparecer tras el reinicio",
      estado: "abierto",
    });
    await updateDoc(doc(db, "clientes", DEMO_CLIENT_UID), {
      cuotaMensual: 9999,
    });

    // 3. Crear una cuenta secundaria desde la app secundaria
    const secApp = initializeApp({}, "SecondaryAppForUserCreation");
    const secAuth = getAuth(secApp);
    await createUserWithEmailAndPassword(
      secAuth,
      "nuevo.vecino@comunidad-demo.local",
      "ClaveTemporal123!",
    );
    expect(getRegisteredAccountsCount()).toBe(12);
    expect(getDemoRoleMode()).toBe("admin"); // No cerró la sesión del Admin

    // 4. Registrar un Blob URL y una suscripción
    registerDemoBlobUrl("blob:http://localhost:5173/temp-session-artifact");
    expect(getActiveBlobUrlsCount()).toBe(1);

    const unsub = onSnapshot(collection(db, "tickets"), () => undefined);
    expect(getActiveListenersCount()).toBe(1);
    unsub();
    expect(getActiveListenersCount()).toBe(0);

    // 5. Ejecutar reinicio completo
    resetDemoEnvironment();

    // 6. Verificar limpieza total
    expect(getDemoUser()).toBeNull();
    expect(getDemoRoleMode()).toBeNull();
    expect(getRegisteredAccountsCount()).toBe(11);
    expect(getActiveBlobUrlsCount()).toBe(0);

    const ticketAfterReset = await getDoc(createdTicket);
    expect(ticketAfterReset.exists()).toBe(false);

    const clientAfterReset = await getDoc(doc(db, "clientes", DEMO_CLIENT_UID));
    expect(clientAfterReset.data()?.cuotaMensual).toBe(980);
  });
});
