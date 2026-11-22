import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { onDemoEnvironmentReset } from "../demo/demoStore";
import { ItemInventario } from "../types";

export interface Notification {
  id: string;
  message: string;
  timestamp: Timestamp;
  link: string;
  type:
    | "comunicacion"
    | "extra"
    | "observacion"
    | "reposicion"
    | "stock_bajo"
    | "tarea_pendiente"
    | "ticket";
}

// Estado en memoria de sesión (sin persistencia en localStorage para cumplir FASE 7)
let memoryDismissedIds = new Set<string>();

export function useNotifications() {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    () => new Set(memoryDismissedIds),
  );

  const [sources, setSources] = useState({
    comunicaciones: [] as Notification[],
    extras: [] as Notification[],
    observaciones: [] as Notification[],
    reposiciones: [] as Notification[],
    stockBajo: [] as Notification[],
    tareasPendientes: [] as Notification[],
    tickets: [] as Notification[],
  });

  useEffect(() => {
    return onDemoEnvironmentReset(() => {
      memoryDismissedIds = new Set<string>();
      setDismissedIds(new Set<string>());
    });
  }, []);

  const dismissNotification = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev).add(id);
      memoryDismissedIds = new Set(next);
      return next;
    });
  };

  const clearAll = () => {
    const allIds = notifications.map((n) => n.id);
    setDismissedIds((prev) => {
      const next = new Set([...prev, ...allIds]);
      memoryDismissedIds = new Set(next);
      return next;
    });
  };

  useEffect(() => {
    const qComunicaciones = query(
      collection(db, "comunicaciones"),
      where("estado", "in", ["recibido", "en_progreso"]),
      orderBy("fechaCreacion", "desc"),
      limit(10),
    );

    const qExtras = query(
      collection(db, "extras"),
      where("estado", "in", ["pendiente", "solicitado", "presupuesto_aceptado"]),
      limit(10),
    );

    const qObservaciones = query(
      collection(db, "trabajos"),
      where("observaciones", "!=", ""),
      orderBy("fecha", "desc"),
      limit(10),
    );

    const qReposiciones = query(
      collection(db, "reposicion"),
      where("estado", "==", "pendiente"),
      orderBy("fecha", "desc"),
      limit(10),
    );

    const qInventario = query(collection(db, "inventario"));

    const qTareas = query(
      collection(db, "trabajos"),
      where("empleadoId", "==", ""),
      where("estado", "==", "pendiente"),
      limit(10),
    );

    const qTickets = query(
      collection(db, "tickets"),
      where("estado", "in", ["abierto", "en_progreso", "pendiente"]),
      orderBy("fechaCreacion", "desc"),
      limit(10),
    );

    const handleSnapshotError = (source: string, error: Error) => {
      console.error(`Error in ${source} listener:`, error);
      if (error?.message?.includes("index")) {
        toast.error(`Falta un índice en la base de datos para ${source}.`);
      }
    };

    const unsubComs = onSnapshot(
      qComunicaciones,
      (snap) => {
        const items = snap.docs.map(
          (d) =>
            ({
              id: `com_${d.id}`,
              message: `Nueva ${d.data().tipo}: ${d.data().asunto}`,
              timestamp: d.data().fechaCreacion,
              link: "/admin/complaints",
              type: "comunicacion",
            }) as Notification,
        );
        setSources((prev) => ({ ...prev, comunicaciones: items }));
      },
      (error) => handleSnapshotError("Comunicaciones", error),
    );

    const unsubExtras = onSnapshot(
      qExtras,
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          const isAccepted = data.estado === "presupuesto_aceptado";
          return {
            id: `ext_${d.id}`,
            message: isAccepted
              ? `¡Presupuesto Aceptado! ${data.clienteNombre || "Cliente"}`
              : `Solicitud Extra: ${data.descripcion?.substring(0, 24)}...`,
            timestamp: data.createdAt || data.fechaCreacion || Timestamp.now(),
            link: "/admin/extra-jobs",
            type: "extra",
          } as Notification;
        });
        setSources((prev) => ({ ...prev, extras: items }));
      },
      (error) => handleSnapshotError("Extras", error),
    );

    const unsubObs = onSnapshot(
      qObservaciones,
      (snap) => {
        const items = snap.docs.map(
          (d) =>
            ({
              id: `obs_${d.id}`,
              message: `Observación en ${d.data().clienteNombre || "Tarea"}`,
              timestamp: d.data().updatedAt || d.data().fecha || Timestamp.now(),
              link: "/admin/observations",
              type: "observacion",
            }) as Notification,
        );
        setSources((prev) => ({ ...prev, observaciones: items }));
      },
      (error) => handleSnapshotError("Observaciones", error),
    );

    const unsubRepos = onSnapshot(
      qReposiciones,
      (snap) => {
        const items = snap.docs.map(
          (d) =>
            ({
              id: `rep_${d.id}`,
              message: `Solicitud Material: ${d.data().producto}`,
              timestamp: d.data().fecha || d.data().fechaSolicitud || Timestamp.now(),
              link: "/admin/inventory",
              type: "reposicion",
            }) as Notification,
        );
        setSources((prev) => ({ ...prev, reposiciones: items }));
      },
      (error) => handleSnapshotError("Reposiciones", error),
    );

    const unsubInv = onSnapshot(
      qInventario,
      (snap) => {
        const items: Notification[] = [];
        snap.docs.forEach((d) => {
          const data = d.data() as ItemInventario;
          const min = data.stockMinimo ?? 5;
          if (data.cantidad <= min) {
            items.push({
              id: `stock_${d.id}_${data.cantidad}`,
              message: `Stock Bajo: ${data.producto} (${data.cantidad} uds)`,
              timestamp: Timestamp.now(),
              link: "/admin/inventory",
              type: "stock_bajo",
            });
          }
        });
        setSources((prev) => ({ ...prev, stockBajo: items }));
      },
      (error) => handleSnapshotError("Inventario", error),
    );

    const unsubTareas = onSnapshot(
      qTareas,
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          const dateStr = data.fecha?.toDate
            ? data.fecha.toDate().toLocaleDateString()
            : "Sin fecha";
          return {
            id: `task_${d.id}`,
            message: `Tarea sin asignar: ${data.clienteNombre || "Cliente"} (${dateStr})`,
            timestamp: data.createdAt || Timestamp.now(),
            link: "/admin/routes",
            type: "tarea_pendiente",
          } as Notification;
        });
        setSources((prev) => ({ ...prev, tareasPendientes: items }));
      },
      (error) => handleSnapshotError("Tareas", error),
    );

    const unsubTickets = onSnapshot(
      qTickets,
      (snap) => {
        const items = snap.docs.map(
          (d) =>
            ({
              id: `tick_${d.id}`,
              message: `Ticket [${d.data().prioridad?.toUpperCase() || "MEDIA"}]: ${d.data().asunto}`,
              timestamp: d.data().fechaCreacion || Timestamp.now(),
              link: "/admin/complaints",
              type: "ticket",
            }) as Notification,
        );
        setSources((prev) => ({ ...prev, tickets: items }));
      },
      (error) => handleSnapshotError("Tickets", error),
    );

    return () => {
      unsubComs();
      unsubExtras();
      unsubObs();
      unsubRepos();
      unsubInv();
      unsubTareas();
      unsubTickets();
    };
  }, []);

  const allNotifications = [
    ...sources.comunicaciones,
    ...sources.extras,
    ...sources.observaciones,
    ...sources.reposiciones,
    ...sources.stockBajo,
    ...sources.tareasPendientes,
    ...sources.tickets,
  ];

  const notifications = allNotifications
    .filter((n) => !dismissedIds.has(n.id))
    .sort((a, b) => {
      const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
      const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
      return timeB - timeA;
    });

  return {
    notifications,
    unreadCount: notifications.length,
    dismissNotification,
    clearAll,
  };
}
