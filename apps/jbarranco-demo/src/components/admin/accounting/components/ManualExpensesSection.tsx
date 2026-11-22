import { DEMO_PDF_DISABLED_MESSAGE } from "../../../../demo/demoConstants";
import type { TransactionItem } from "../../../../hooks/useAccountingData";

interface ManualExpensesSectionProps {
  readonly manualExpenses: TransactionItem[];
  readonly onViewDocument?: (path: string) => void;
}

export default function ManualExpensesSection({
  manualExpenses,
}: ManualExpensesSectionProps) {
  const totalManualExpenses = manualExpenses.reduce(
    (sum, item) => sum + item.importe,
    0,
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Gastos Varios y Suministros
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Varios</p>
          <p className="text-xl font-bold text-red-600">
            {totalManualExpenses.toLocaleString("es-ES")}€
          </p>
        </div>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Importe
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Justificante PDF
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {manualExpenses.length > 0 ? (
              manualExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.fecha.toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.concepto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                    {expense.importe.toLocaleString("es-ES")}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-center text-gray-500">
                    {expense.archivo ? (
                      <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 border border-gray-300">
                        {DEMO_PDF_DISABLED_MESSAGE}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No hay gastos varios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
