import { useEffect, useState } from "react";
import { Trabajo } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { notifyNewTicket } from "../../utils/notifications";

function EmployeeTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  type ExtendedTrabajo = Trabajo & {
    comunidad?: string;
    esExtra?: boolean;
    tipoServicio?: string;
    incidencia?: string;
  };

  const [task, setTask] = useState<ExtendedTrabajo | null>(null);
  const [loading, setLoading] = useState(true);
  const [observation, setObservation] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "trabajos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as unknown as ExtendedTrabajo;
          setTask({
            ...data,
            id: docSnap.id,
          });
          if (data.observaciones) {
            setObservation(data.observaciones);
          }
        } else {
          setTask(null);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Error al cargar la tarea");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Coordenadas simuladas en memoria para evitar petición de permisos GPS en la demo
  const getSimulatedLocation = async (): Promise<{ lat: number; lng: number }> => {
    return { lat: 40.4168, lng: -3.7038 };
  };

  const handleStart = async () => {
    if (!task || !id) return;

    setLoading(true);
    try {
      const location = await getSimulatedLocation();
      const taskRef = doc(db, "trabajos", id);
      const updateData: Record<string, unknown> = {
        estado: "en_progreso",
        startedAt: new Date(),
        startLocation: location,
      };

      await updateDoc(taskRef, updateData as Partial<ExtendedTrabajo>);

      toast.success("Trabajo iniciado ⏳");
      setTask({ ...task, estado: "en_progreso" });
    } catch (error) {
      console.error("Error starting task:", error);
      toast.error("Error al iniciar");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!task || !id) return;

    setLoading(true);
    try {
      const location = await getSimulatedLocation();
      const taskRef = doc(db, "trabajos", id);

      const updateData: Record<string, unknown> = {
        estado: "completado",
        completedAt: new Date(),
        fechaFin: new Date(),
        observaciones: observation,
        endLocation: location,
      };

      await updateDoc(taskRef, updateData);

      if (observation.trim()) {
        notifyNewTicket({
          type: "observacion",
          clientName: task.clienteNombre || task.comunidad || "Cliente",
          description: observation,
          authorName: user?.nombre || "Empleado",
        });
      }

      toast.success("¡Tarea completada excelente!");
      setTask({ ...task, estado: "completado", observaciones: observation });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Hubo un error al completar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleIncomplete = async () => {
    if (!task || !id) return;

    const reason = observation.trim() || "Incidencia reportada por el operario en ruta";

    setLoading(true);
    try {
      const taskRef = doc(db, "trabajos", id);
      await updateDoc(taskRef, {
        estado: "no_completada",
        incidencia: reason,
        observaciones: reason,
        completionDate: new Date(),
      });

      notifyNewTicket({
        type: "incidencia",
        clientName: task.clienteNombre || task.comunidad || "Cliente",
        description: `TAREA NO REALIZADA: ${reason}`,
        authorName: user?.nombre || "Empleado",
      });

      toast.error("Tarea marcada como NO realizada");
      setTask({ ...task, estado: "no_completada", observaciones: reason });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error al actualizar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    if (status === "completado") {
      return { style: "bg-green-100 text-green-800", text: "Completada ✅" };
    }
    if (status === "en_progreso") {
      return { style: "bg-blue-100 text-blue-800", text: "En Curso ⏳" };
    }
    if (status === "no_completada") {
      return { style: "bg-red-100 text-red-800", text: "No Realizada ❌" };
    }
    return { style: "bg-yellow-100 text-yellow-800", text: "Pendiente" };
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando detalles...</div>;
  }

  if (!task) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 font-bold">Tarea no encontrada</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-200 px-4 py-2 rounded text-gray-800"
        >
          Volver
        </button>
      </div>
    );
  }

  const isCompleted = task.estado === "completado";
  const isInProgress = task.estado === "en_progreso";
  const isIncomplete = task.estado === "no_completada";
  const statusInfo = getStatusInfo(task.estado);

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 truncate flex-1">
          Detalle de Tarea
        </h2>
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusInfo.style}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-brand-blue">
            {task.clienteNombre || task.comunidad || "Cliente"}
          </h1>
          <div className="flex items-start gap-2 mt-2 text-gray-600">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {task.direccion || "Dirección asignada en ficha"}
              </p>
            </div>
          </div>
          {task.esExtra && (
            <span className="mt-3 inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-semibold">
              ✨ Trabajo Extra
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            Instrucciones / Descripción
          </h3>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-gray-700 leading-relaxed shadow-sm">
            {task.descripcion || task.tipoServicio || "Limpieza general según contrato."}
          </div>
        </div>

        <div>
          <label
            htmlFor="observations"
            className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2"
          >
            Observaciones / Incidencias
          </label>
          <textarea
            id="observations"
            rows={3}
            data-testid="employee-task-observation"
            disabled={isCompleted || isIncomplete}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-3 border"
            placeholder="Escribe aquí si falta material, hay alguna avería o motivo de no realización..."
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </div>

        <div className="pt-4 space-y-3">
          {!isInProgress && !isCompleted && !isIncomplete && (
            <button
              type="button"
              data-testid="employee-task-start-btn"
              onClick={handleStart}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold text-white shadow-lg bg-brand-blue hover:bg-blue-800 transition-all"
            >
              <span>▶</span> Iniciar Trabajo
            </button>
          )}

          {!isCompleted && !isIncomplete && (
            <>
              <button
                type="button"
                data-testid="employee-task-complete-btn"
                onClick={handleComplete}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold text-white shadow-lg bg-brand-green hover:bg-green-700 transition-all"
              >
                <CheckCircleIcon className="h-6 w-6" />
                Completar Tarea
              </button>

              <button
                type="button"
                data-testid="employee-task-incomplete-btn"
                onClick={handleIncomplete}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-base font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
              >
                ❌ Marcar como NO realizada
              </button>
            </>
          )}

          {(isCompleted || isIncomplete) && (
            <div
              className={`p-4 rounded-xl text-center font-medium ${
                isCompleted
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {isCompleted
                ? "Esta tarea ya ha sido completada."
                : `Tarea cerrada como NO realizada. Motivo: ${task.incidencia || task.observaciones || "N/A"}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeTaskDetail;
