import { useState } from "react";
import { Ticket, TicketStatus } from "../../../types";
import {
  addTicketResponse,
  updateTicketStatus,
} from "../../../services/ticketService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentCheckIcon,
  NoSymbolIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../../demo/demoConstants";

interface TicketPreviewProps {
  readonly ticket: Ticket;
  readonly onClose: () => void;
  readonly onUpdate: () => void;
}

export default function TicketPreview({
  ticket,
  onUpdate,
}: TicketPreviewProps) {
  const [updating, setUpdating] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setUpdating(true);
    try {
      if (responseText.trim()) {
        await addTicketResponse(
          ticket.id,
          {
            autorId: "admin",
            autorNombre: "Administrador",
            mensaje: responseText.trim(),
            esAdmin: true,
          },
          ticket.origen,
        );
      }

      await updateTicketStatus(ticket.id, newStatus, ticket.origen);
      toast.success(
        `Ticket actualizado a: ${newStatus.replaceAll("_", " ")}`,
      );
      setResponseText("");
      onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  const handleConvertToJob = async () => {
    setUpdating(true);
    try {
      await addDoc(collection(db, "trabajos"), {
        clienteId: ticket.clienteId,
        clienteNombre: ticket.clienteNombre,
        descripcion: `${ticket.asunto} (Origen: Solicitud Extra)`,
        observaciones: "",
        estado: "pendiente",
        empleadoId: "",
        empleadoNombre: "",
        fecha: Timestamp.now(),
        horaInicio: "09:00",
        tipo: "otro",
        origenExtraId: ticket.id,
        fechaCreacion: Timestamp.now(),
      });

      const extraRef = doc(db, "extras", ticket.id);
      await updateDoc(extraRef, { estado: "aprobado" });

      toast.success("Trabajo creado. Asígnalo en el Calendario/Rutas.");
      onUpdate();
    } catch (error) {
      console.error("Error converting to job:", error);
      toast.error("Error al convertir en trabajo");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "abierto":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_progreso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resuelto":
        return "bg-green-100 text-green-800 border-green-200";
      case "cerrado":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pendiente":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "solicitado":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "presupuestado":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "presupuesto_aceptado":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "aprobado":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "incidencia":
        return "bg-red-50 text-red-700 border-red-200";
      case "extra":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "observacion":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "material":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="pb-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{ticket.asunto}</h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium border ${getStatusColor(
                ticket.estado,
              )}`}
            >
              {ticket.estado.toUpperCase().replaceAll("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {ticket.tipo === "extra" && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
            Gestionar Trabajo Extra
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <NoSymbolIcon className="h-4 w-4 text-amber-700 shrink-0" />
              <span>
                Subida y visualización de presupuesto PDF:{" "}
                <strong>{DEMO_PDF_DISABLED_MESSAGE}</strong>
              </span>
            </div>

            {ticket.estado === "presupuestado" && (
              <span className="text-sm text-purple-700 flex items-center gap-2 border border-purple-200 bg-white px-3 py-1 rounded-md w-fit">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                Esperando respuesta del cliente...
              </span>
            )}

            {ticket.estado === "presupuesto_aceptado" && (
              <button
                type="button"
                onClick={handleConvertToJob}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 w-fit"
              >
                <DocumentCheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Convertir en Trabajo Pendiente
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Resolución / Respuesta
        </h4>

        <textarea
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm mb-3 p-2 border"
          placeholder="Escribe aquí una respuesta o nota para el cliente antes de cambiar el estado..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange("abierto")}
            disabled={updating || ticket.estado === "abierto"}
            className={`px-3 py-1 text-xs rounded border transition ${
              ticket.estado === "abierto"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Reabrir
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("en_progreso")}
            disabled={updating || ticket.estado === "en_progreso"}
            className={`px-3 py-1 text-xs rounded border transition ${
              ticket.estado === "en_progreso"
                ? "bg-yellow-500 text-white border-yellow-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            En Progreso
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("resuelto")}
            disabled={updating || ticket.estado === "resuelto"}
            className={`px-3 py-1 text-xs rounded border transition ${
              ticket.estado === "resuelto"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Resuelto / Enviar
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("cerrado")}
            disabled={updating || ticket.estado === "cerrado"}
            className={`px-3 py-1 text-xs rounded border transition ${
              ticket.estado === "cerrado"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Cerrar Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-200 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {ticket.clienteNombre}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span>
            {ticket.fechaCreacion?.toDate
              ? format(ticket.fechaCreacion.toDate(), "dd MMM yyyy, HH:mm", {
                  locale: es,
                })
              : "Fecha no disponible"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <TagIcon className="h-4 w-4 text-gray-400" />
          <span
            className={`capitalize px-2 py-0.5 rounded text-xs font-medium border ${getTypeBadgeClass(
              ticket.tipo,
            )}`}
          >
            {ticket.tipo}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-500" />
          Detalle y Conversación
        </h3>

        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
          {ticket.mensaje || "Sin descripción adicional."}
        </div>

        {ticket.mensajes && ticket.mensajes.length > 0 && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
            {ticket.mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm ${
                  msg.esAdmin
                    ? "bg-brand-blue/5 border border-brand-blue/10 ml-4"
                    : "bg-gray-50 border border-gray-100 mr-4"
                }`}
              >
                <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                  <span
                    className={`font-semibold ${
                      msg.esAdmin ? "text-brand-blue" : "text-gray-700"
                    }`}
                  >
                    {msg.autorNombre}
                  </span>
                  <span>
                    {msg.fecha?.toDate
                      ? format(msg.fecha.toDate(), "dd MMM HH:mm", {
                          locale: es,
                        })
                      : "Reciente"}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{msg.mensaje}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
