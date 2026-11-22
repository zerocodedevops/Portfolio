import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../demo/demoConstants";

function EmployeeDocuments() {
  const employeeDocs = [
    { id: "NOM-2026-10", title: "Nómina Octubre 2026 (Datos Ficticios)", category: "Nóminas" },
    { id: "CUA-2026-11", title: "Cuadrante Mensual de Rutas Asignadas", category: "Cuadrantes" },
    { id: "PRL-2026-01", title: "Protocolo de Prevención y Uso de Químicos", category: "Protocolos" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mis Documentos Laborales</h2>

      <div
        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded flex items-center gap-3"
        data-testid="employee-documents-demo-disabled"
      >
        <NoSymbolIcon className="h-5 w-5 text-amber-700 shrink-0" />
        <p className="text-sm text-amber-900">
          <strong>{DEMO_PDF_DISABLED_MESSAGE}:</strong> La visualización y descarga de documentos PDF no está disponible en la versión demo.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {employeeDocs.map((item) => (
            <li key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">
                  Ref: {item.id} · Categoría: {item.category}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full text-gray-600 bg-gray-100">
                {DEMO_PDF_DISABLED_MESSAGE}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmployeeDocuments;
