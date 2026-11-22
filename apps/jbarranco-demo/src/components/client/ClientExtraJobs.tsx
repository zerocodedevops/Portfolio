import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { COLLECTIONS } from "../../constants";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../demo/demoConstants";
import { useRatings } from "../../hooks/useRatings";
import { RequestExtraJobModal } from "./components/RequestExtraJobModal";
import { MapPinIcon, NoSymbolIcon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
import RateEmployeeModal from "./RateEmployeeModal";
import RatingStars from "../common/RatingStars";
import LoadingSpinner from "../common/LoadingSpinner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { Extra, Rating } from "../../types";

function ClientExtraJobs() {
  const { user } = useAuth();
  const [extraJobs, setExtraJobs] = useState<Extra[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Extra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getClientRatings } = useRatings();
  const [clientRatings, setClientRatings] = useState<Rating[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const loadRatings = async () => {
      const data = await getClientRatings(user.uid);
      setClientRatings(data);
    };
    loadRatings();

    const qHistory = query(
      collection(db, COLLECTIONS.EXTRAS),
      where("clienteId", "==", user.uid),
      where("estado", "==", "completado"),
      orderBy("fecha", "desc"),
    );

    const unsubscribeHistory = onSnapshot(qHistory, (snapshot) => {
      const jobsData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Extra[];
      setExtraJobs(jobsData);
      setLoading(false);
    });

    const qPending = query(
      collection(db, COLLECTIONS.EXTRAS),
      where("clienteId", "==", user.uid),
      where("estado", "in", [
        "pendiente",
        "solicitado",
        "presupuestado",
        "presupuesto_aceptado",
      ]),
    );

    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      const requests = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Extra[];
      setPendingRequests(requests);
    });

    return () => {
      unsubscribeHistory();
      unsubscribePending();
    };
  }, [user?.uid, getClientRatings]);

  const handleRate = (job: Extra) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const getJobRating = (jobId: string) => {
    return clientRatings.find((r) => r.jobId === jobId);
  };

  const handleRequestSubmit = async (
    description: string,
    preferredDate: string,
  ) => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, COLLECTIONS.EXTRAS), {
        clienteId: user.uid,
        clienteNombre: user.nombre || "Cliente Demo",
        empleadoId: "",
        empleadoNombre: "",
        tipo: "extra_request",
        descripcion: description,
        fechaSolicitud: Timestamp.now(),
        fechaPreferente: preferredDate
          ? Timestamp.fromDate(new Date(preferredDate))
          : null,
        estado: "pendiente",
        direccion: user.direccion || "Dirección Principal",
        comentariosCliente: "",
        createdAt: Timestamp.now(),
        fechaCreacion: Timestamp.now(),
        fecha: Timestamp.now(),
      });
      toast.success("Solicitud enviada correctamente");
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error al enviar la solicitud");
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await toast.promise(deleteDoc(doc(db, COLLECTIONS.EXTRAS, requestId)), {
        loading: "Cancelando solicitud...",
        success: "Solicitud cancelada",
        error: "Error al cancelar la solicitud",
      });
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Trabajos Extra</h2>
        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
        >
          Solicitar Nuevo Trabajo
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">
          Solicitudes Pendientes
        </h3>
        {pendingRequests.length === 0 ? (
          <div className="mt-4 bg-white shadow rounded-lg p-6 text-center text-gray-500">
            <p>No tienes solicitudes activas en este momento.</p>
          </div>
        ) : (
          <div className="mt-4 bg-white shadow rounded-lg">
            <ul className="divide-y divide-gray-200">
              {pendingRequests.map((req) => (
                <li key={req.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {req.descripcion}
                      </p>
                      <p className="text-sm text-gray-500">
                        Solicitado el{" "}
                        {req.createdAt
                          ? format(req.createdAt.toDate(), "dd 'de' MMMM", {
                              locale: es,
                            })
                          : "Fecha reciente"}
                        {req.presupuesto ? ` · Importe: ${req.presupuesto} €` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {req.estado === "presupuestado" && (
                        <>
                          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 border border-gray-300">
                            <NoSymbolIcon className="h-3.5 w-3.5 text-amber-700" />
                            PDF Presupuesto: {DEMO_PDF_DISABLED_MESSAGE}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await updateDoc(
                                  doc(db, COLLECTIONS.EXTRAS, req.id),
                                  { estado: "presupuesto_aceptado" },
                                );
                                toast.success("Presupuesto aceptado");
                              } catch (e) {
                                console.error(e);
                                toast.error("Error");
                              }
                            }}
                            className="bg-green-100 text-green-800 px-2.5 py-1 rounded text-xs font-semibold hover:bg-green-200"
                          >
                            Aceptar
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await updateDoc(
                                  doc(db, COLLECTIONS.EXTRAS, req.id),
                                  { estado: "rechazado" },
                                );
                                toast.success("Presupuesto rechazado");
                              } catch (e) {
                                console.error(e);
                                toast.error("Error");
                              }
                            }}
                            className="bg-red-100 text-red-800 px-2.5 py-1 rounded text-xs font-semibold hover:bg-red-200"
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.estado === "presupuestado"
                            ? "bg-indigo-100 text-indigo-800"
                            : req.estado === "presupuesto_aceptado"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.estado === "presupuestado"
                          ? "Presupuestado"
                          : req.estado === "presupuesto_aceptado"
                            ? "Aceptado (Esperando Fecha)"
                            : "Pendiente de Revisión"}
                      </span>

                      {(req.estado === "pendiente" ||
                        req.estado === "solicitado") && (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(req.id)}
                          className="text-red-500 hover:text-red-700 text-xs underline ml-2"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">
          Historial de Trabajos Extra Realizados
        </h3>
        {extraJobs.length === 0 ? (
          <div className="mt-4 bg-white shadow rounded-lg p-6 text-center text-gray-500">
            <p>No hay trabajos extra completados en tu historial.</p>
          </div>
        ) : (
          <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {extraJobs.map((job) => {
                const existingRating = getJobRating(job.id);
                return (
                  <li key={job.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {job.tipo || "Trabajo Extra"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {job.fecha?.toDate
                              ? format(
                                  job.fecha.toDate(),
                                  "d 'de' MMMM, yyyy",
                                  { locale: es },
                                )
                              : "Fecha desconocida"}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-gray-900">
                          {job.descripcion}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-1">
                          {job.empleadoNombre && (
                            <span className="flex items-center gap-1">
                              <UserIcon className="h-4 w-4" />
                              {job.empleadoNombre}
                            </span>
                          )}
                          {job.direccion && (
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              {job.direccion}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {existingRating ? (
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block mb-1">
                              Tu valoración:
                            </span>
                            <RatingStars
                              rating={existingRating.stars}
                              size="sm"
                            />
                          </div>
                        ) : (
                          job.empleadoId && (
                            <button
                              type="button"
                              onClick={() => handleRate(job)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-brand-orange border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100 transition"
                            >
                              <StarIcon className="h-4 w-4" />
                              Valorar Servicio
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {selectedJob && (
        <RateEmployeeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
            if (user?.uid) {
              getClientRatings(user.uid).then(setClientRatings);
            }
          }}
          employeeId={selectedJob.empleadoId || "unknown"}
          employeeName={selectedJob.empleadoNombre || "Empleado"}
          jobId={selectedJob.id}
        />
      )}

      <RequestExtraJobModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}

export default ClientExtraJobs;
