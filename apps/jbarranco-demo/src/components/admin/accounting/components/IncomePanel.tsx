import { useState, useMemo } from "react";
import type { IncomeItem } from "../../../../hooks/useAccountingData";

interface IncomePanelProps {
    readonly incomes: IncomeItem[];
}

type SortKey = "fecha" | "cliente" | "descripcion" | "importe";
type SortDirection = "asc" | "desc";

export default function IncomePanel({ incomes }: IncomePanelProps) {
    const [sortKey, setSortKey] = useState<SortKey>("cliente");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const totalIncome = incomes.reduce((sum, item) => sum + item.importe, 0);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const sortedIncomes = useMemo(() => {
        return [...incomes].sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (sortKey === "fecha") {
                valA = a.fecha.getTime();
                valB = b.fecha.getTime();
            } else if (typeof valA === "string" && typeof valB === "string") {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [incomes, sortKey, sortDirection]);

    const renderSortArrow = (key: SortKey) => {
        if (sortKey !== key) return <span className="text-gray-300 ml-1">↕</span>;
        return sortDirection === "asc" ? <span className="ml-1 text-brand-blue">↑</span> : <span className="ml-1 text-brand-blue">↓</span>;
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Ingresos Mensuales Realizados
                </h3>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Total Ingresos
                    </p>
                    <p className="text-xl font-bold text-green-600">
                        {totalIncome.toLocaleString("es-ES")}€
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("fecha")}
                            >
                                Fecha {renderSortArrow("fecha")}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("cliente")}
                            >
                                Cliente / Origen {renderSortArrow("cliente")}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("descripcion")}
                            >
                                Descripción {renderSortArrow("descripcion")}
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("importe")}
                            >
                                Importe {renderSortArrow("importe")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedIncomes.length > 0
                            ? (
                                sortedIncomes.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.fecha.toLocaleDateString(
                                                "es-ES",
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.cliente}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.descripcion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                                            {item.importe.toLocaleString(
                                                "es-ES",
                                            )}€
                                        </td>
                                    </tr>
                                ))
                            )
                            : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No hay ingresos registrados
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
