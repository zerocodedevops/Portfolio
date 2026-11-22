import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../demo/demoConstants";

function ClientDocuments() {
  const invoices = [
    {
      id: "FAC-2026-00042",
      description: "Cuota Mensual Mantenimiento Integral — C.P. Residencial Monteclaro",
      date: "02/11/2026",
    },
    {
      id: "FAC-2026-00038",
      description: "Cuota Mensual Mantenimiento Integral — Octubre",
      date: "02/10/2026",
    },
  ];

  const budgets = [
    {
      id: "PRE-2026-00014",
      description: "Presupuesto Fregado Mecánico e Hidrofugado de Garaje",
      date: "18/11/2026",
    },
    {
      id: "PRE-2026-00011",
      description: "Presupuesto Puesta a Punto Vestuarios y Solárium Piscina",
      date: "04/10/2026",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Mis Documentos</h2>

      <div
        className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded flex items-center gap-3"
        data-testid="client-documents-demo-disabled"
      >
        <NoSymbolIcon className="h-5 w-5 text-amber-700 shrink-0" />
        <p className="text-sm text-amber-900">
          <strong>{DEMO_PDF_DISABLED_MESSAGE}:</strong> La generación, visualización y descarga de archivos PDF está deshabilitada en este entorno de demostración.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Facturas</h3>
        <div className="mt-4 bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Nº: {invoice.id} - Fecha: {invoice.date}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full text-gray-600 bg-gray-100">
                    {DEMO_PDF_DISABLED_MESSAGE}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Presupuestos</h3>
        <div className="mt-4 bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {budgets.map((budget) => (
              <li key={budget.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {budget.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Nº: {budget.id} - Fecha: {budget.date}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full text-gray-600 bg-gray-100">
                    {DEMO_PDF_DISABLED_MESSAGE}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClientDocuments;
