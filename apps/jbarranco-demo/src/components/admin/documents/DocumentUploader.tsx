import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteDocument,
  listDocumentsByCategory,
  StorageDocument,
} from "../../../services/storageService";
import { NoSymbolIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../../demo/demoConstants";
import { Cliente } from "../../../types";

interface DocumentUploaderProps {
  clients: Cliente[];
}

function DocumentUploader({ clients }: DocumentUploaderProps) {
  const [uploadCategory, setUploadCategory] = useState("facturas");
  const [uploadClientId, setUploadClientId] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState<StorageDocument[]>([]);

  const loadUploadedDocs = useCallback(async () => {
    if (uploadCategory) {
      const docs = await listDocumentsByCategory(
        uploadCategory,
        uploadClientId || null,
      );
      setUploadedDocs(docs);
    }
  }, [uploadCategory, uploadClientId]);

  useEffect(() => {
    loadUploadedDocs();
  }, [loadUploadedDocs]);

  const handleDeleteDoc = async (path: string) => {
    try {
      await deleteDocument(path);
      toast.success("Registro de documento eliminado en memoria");
      loadUploadedDocs();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error al eliminar el documento");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Repositorio de Documentos
      </h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoría *
            </label>
            <select
              id="category-select"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="facturas">Facturas</option>
              <option value="presupuestos">Presupuestos</option>
              <option value="nominas">Nóminas</option>
              <option value="albaranes">Albaranes</option>
              <option value="gastos-empresa">Gastos de empresa</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="client-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cliente (opcional)
            </label>
            <select
              id="client-select"
              value={uploadClientId}
              onChange={(e) => setUploadClientId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="">Sin cliente específico</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 flex items-center gap-3"
          data-testid="pdf-disabled-notice-uploader"
        >
          <NoSymbolIcon className="h-5 w-5 text-amber-700 shrink-0" />
          <span>
            Subida, previsualización y descarga de archivos PDF:{" "}
            <strong>{DEMO_PDF_DISABLED_MESSAGE}</strong>
          </span>
        </div>
      </div>

      {uploadedDocs.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Registros en {uploadCategory}
          </h3>
          <div className="space-y-2">
            {uploadedDocs.map((doc, index) => (
              <div
                key={doc.path || index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {doc.uploadDate &&
                      new Date(doc.uploadDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-300">
                    {DEMO_PDF_DISABLED_MESSAGE}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc.path)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Eliminar registro en memoria"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUploader;
