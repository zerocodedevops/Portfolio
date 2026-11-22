import { useState } from "react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../../demo/demoConstants";
import { Cliente, Empleado } from "../../../types";

function DocumentGenerator({
  clients,
  employees = [],
  loading,
}: {
  readonly clients: Cliente[];
  readonly employees?: Empleado[];
  readonly loading: boolean;
}) {
  const [selectedClient, setSelectedClient] = useState("");
  const [documentType, setDocumentType] = useState("budget");
  const [formData, setFormData] = useState({
    descripcion: "",
    precio: "",
    tipo: "Limpieza general",
    estado: "completado",
    empleado: "",
    observaciones: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Generador de Documentos PDF
      </h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div
          className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 flex items-center gap-3"
          data-testid="pdf-disabled-notice-generator"
        >
          <NoSymbolIcon className="h-5 w-5 text-amber-700 shrink-0" />
          <div>
            <p className="font-semibold">{DEMO_PDF_DISABLED_MESSAGE}</p>
            <p className="text-xs text-amber-800 mt-0.5">
              La estructura del formulario de emisión de presupuestos, facturas e informes se muestra para consulta funcional, pero la generación y descarga de archivos PDF está deshabilitada en la versión demo.
            </p>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Documento
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setDocumentType("budget")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                documentType === "budget"
                  ? "bg-brand-blue text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Presupuesto
            </button>
            <button
              type="button"
              onClick={() => setDocumentType("invoice")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                documentType === "invoice"
                  ? "bg-brand-green text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Factura
            </button>
            <button
              type="button"
              onClick={() => setDocumentType("report")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                documentType === "report"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Informe de Trabajo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="doc-client-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cliente *
            </label>
            <select
              id="doc-client-select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="">Selecciona un cliente...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tipo-servicio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Servicio
            </label>
            <select
              id="tipo-servicio"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="Limpieza general">Limpieza general</option>
              <option value="Limpieza profunda">Limpieza profunda</option>
              <option value="Abrillantado">Abrillantado</option>
              <option value="Cristales">Cristales</option>
              <option value="Desinfección">Desinfección</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="precio-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Importe Base (€) *
            </label>
            <input
              id="precio-input"
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="Ej. 320.00"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {documentType === "report" && (
            <div>
              <label
                htmlFor="empleado-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Empleado Asignado
              </label>
              <select
                id="empleado-select"
                name="empleado"
                value={formData.empleado}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={`${emp.nombre} ${emp.apellidos || ""}`}>
                    {emp.nombre} {emp.apellidos}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="descripcion-textarea"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Descripción del Servicio *
          </label>
          <textarea
            id="descripcion-textarea"
            name="descripcion"
            rows={3}
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Detalle de los trabajos incluidos..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="rounded-md bg-gray-100 border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-600">
          Generación y descarga de PDF: {DEMO_PDF_DISABLED_MESSAGE}
        </div>
      </div>
    </div>
  );
}

export default DocumentGenerator;
