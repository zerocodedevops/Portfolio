import { useEffect, useRef, useState } from "react";
import { useProfitability } from "../../../hooks/useProfitability";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import ClientProfitabilityReport from "./ClientProfitabilityReport";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

interface FixedExpensesConfig {
    cuotaAutonomos: number;
    seguridadSocialPorcentaje: number;
    seguroResponsabilidad: number;
    gestoria: number;
    otrosGastosFijos: number;
}

const DEFAULT_FIXED_EXPENSES: FixedExpensesConfig = {
    cuotaAutonomos: 300,
    seguridadSocialPorcentaje: 30,
    seguroResponsabilidad: 50,
    gestoria: 100,
    otrosGastosFijos: 0,
};

export default function ProfitabilityDashboard() {
    const {
        totalRevenue,
        totalLaborCost,
        totalMaterialCost,
        estimatedMonthlyRevenue,
        loading,
        error,
    } = useProfitability();

    const [fixedExpenses, setFixedExpenses] = useState<FixedExpensesConfig>(
        DEFAULT_FIXED_EXPENSES,
    );

    // Fix Recharts width(-1) error: Ensure container has dimensions before rendering
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartDimensions, setChartDimensions] = useState({
        width: 0,
        height: 0,
    });

    // Cargar configuración de gastos fijos
    useEffect(() => {
        const loadFixedExpenses = async () => {
            try {
                const docRef = doc(db, "configuracion", "gastos_fijos");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFixedExpenses(
                        {
                            ...DEFAULT_FIXED_EXPENSES,
                            ...docSnap.data(),
                        } as FixedExpensesConfig,
                    );
                }
            } catch (error) {
                console.error("Error loading fixed expenses:", error);
            }
        };
        loadFixedExpenses();
    }, []);

    useEffect(() => {
        // Delayed check or Observer to ensure DOM is ready
        if (!chartContainerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Only set dimensions if they are valid and > 0
                if (
                    entry.contentRect.width > 0 && entry.contentRect.height > 0
                ) {
                    setChartDimensions({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    });
                }
            }
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => resizeObserver.disconnect();
    }, [loading]); // Re-run if loading changes, though ref is stable

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4">
                </div>
                <p className="text-gray-500">
                    Calculando rentabilidad... (esto puede tardar unos segundos)
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    // Cálculos de gastos fijos
    const seguridadSocialEmpresa =
        (totalLaborCost * fixedExpenses.seguridadSocialPorcentaje) / 100;
    const totalGastosFijos = fixedExpenses.cuotaAutonomos +
        seguridadSocialEmpresa +
        fixedExpenses.seguroResponsabilidad +
        fixedExpenses.gestoria +
        fixedExpenses.otrosGastosFijos;

    const data = [
        { name: "Ingresos", amount: totalRevenue, color: "#10B981" },
        { name: "Mano de Obra", amount: totalLaborCost, color: "#F59E0B" },
        { name: "Materiales", amount: totalMaterialCost, color: "#3B82F6" },
        {
            name: "Autónomos",
            amount: fixedExpenses.cuotaAutonomos,
            color: "#8B5CF6",
        },
        {
            name: "SS Empresa",
            amount: seguridadSocialEmpresa,
            color: "#EC4899",
        },
        {
            name: "Seguro RC",
            amount: fixedExpenses.seguroResponsabilidad,
            color: "#14B8A6",
        },
        { name: "Gestoría", amount: fixedExpenses.gestoria, color: "#F97316" },
        ...(fixedExpenses.otrosGastosFijos > 0
            ? [{
                name: "Otros",
                amount: fixedExpenses.otrosGastosFijos,
                color: "#6B7280",
            }]
            : []),
    ];

    const totalCosts = totalLaborCost + totalMaterialCost + totalGastosFijos;
    const netProfitReal = totalRevenue - totalCosts;
    const profitMarginReal = totalRevenue > 0
        ? (netProfitReal / totalRevenue) * 100
        : 0;

    // Helper for margin color to avoid nested ternary lint error
    const getMarginColor = (margin: number) => {
        if (margin >= 20) return "border-green-600 text-green-600";
        if (margin > 0) return "border-yellow-500 text-yellow-600";
        return "border-red-600 text-red-600";
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
                Rentabilidad del Negocio
            </h2>

            {/* Alerta de Cuotas Mensuales */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                    <div className="shrink-0">
                        <svg
                            className="h-5 w-5 text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Ingresos Recurrentes Estimados (Cuotas Activas):
                            {" "}
                            <span className="font-bold">
                                {estimatedMonthlyRevenue.toLocaleString(
                                    "es-ES",
                                    {
                                        style: "currency",
                                        currency: "EUR",
                                    },
                                )} / mes
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Tarjetas Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-sm text-gray-500 font-medium">
                        Ingresos Totales
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {totalRevenue.toLocaleString("es-ES", {
                            style: "currency",
                            currency: "EUR",
                        })}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-amber-400">
                    <p className="text-sm text-gray-500 font-medium">
                        Costes Operativos
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {(totalLaborCost + totalMaterialCost).toLocaleString(
                            "es-ES",
                            {
                                style: "currency",
                                currency: "EUR",
                            },
                        )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        M. Obra: {totalLaborCost.toFixed(0)}€ | Material:{" "}
                        {totalMaterialCost.toFixed(0)}€
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-400">
                    <p className="text-sm text-gray-500 font-medium">
                        Gastos Fijos
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {totalGastosFijos.toLocaleString("es-ES", {
                            style: "currency",
                            currency: "EUR",
                        })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Autón: {fixedExpenses.cuotaAutonomos}€ | SS:{" "}
                        {seguridadSocialEmpresa.toFixed(0)}€ | Seguro:{" "}
                        {fixedExpenses.seguroResponsabilidad}€
                    </p>
                </div>

                <div
                    className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                        netProfitReal >= 0
                            ? "border-brand-blue"
                            : "border-red-600"
                    }`}
                >
                    <p className="text-sm text-gray-500 font-medium">
                        Beneficio Neto
                    </p>
                    <p
                        className={`text-2xl font-bold mt-1 ${
                            netProfitReal >= 0
                                ? "text-brand-blue"
                                : "text-red-600"
                        }`}
                    >
                        {netProfitReal.toLocaleString("es-ES", {
                            style: "currency",
                            currency: "EUR",
                        })}
                    </p>
                </div>

                <div
                    className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                        getMarginColor(profitMarginReal).split(" ")[0]
                    }`}
                >
                    <p className="text-sm text-gray-500 font-medium">
                        Margen de Beneficio
                    </p>
                    <p
                        className={`text-2xl font-bold mt-1 ${
                            getMarginColor(profitMarginReal).split(" ")[1]
                        }`}
                    >
                        {profitMarginReal.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Desglose de Gastos Fijos */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Desglose de Gastos Fijos Mensuales
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-violet-50 rounded-lg">
                        <p className="text-xs text-gray-500">Autónomos</p>
                        <p className="text-lg font-bold text-violet-600">
                            {fixedExpenses.cuotaAutonomos}€
                        </p>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <p className="text-xs text-gray-500">
                            SS Empresa ({fixedExpenses
                                .seguridadSocialPorcentaje}%)
                        </p>
                        <p className="text-lg font-bold text-pink-600">
                            {seguridadSocialEmpresa.toFixed(0)}€
                        </p>
                    </div>
                    <div className="text-center p-3 bg-teal-50 rounded-lg">
                        <p className="text-xs text-gray-500">Seguro RC</p>
                        <p className="text-lg font-bold text-teal-600">
                            {fixedExpenses.seguroResponsabilidad}€
                        </p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-gray-500">Gestoría</p>
                        <p className="text-lg font-bold text-orange-600">
                            {fixedExpenses.gestoria}€
                        </p>
                    </div>
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-500">Otros</p>
                        <p className="text-lg font-bold text-gray-600">
                            {fixedExpenses.otrosGastosFijos}€
                        </p>
                    </div>
                </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Desglose Financiero
                </h3>
                <div
                    ref={chartContainerRef}
                    className="h-80 w-full relative"
                    style={{
                        minHeight: "320px",
                        width: "100%",
                        minWidth: "0px",
                    }}
                >
                    {/* Render ONLY if the container has reported valid dimensions via ResizeObserver */}
                    {chartDimensions.width > 0 && (
                        <BarChart
                            width={chartDimensions.width}
                            height={chartDimensions.height}
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis
                                tickFormatter={(val) => `${val}€`}
                            />
                            <Tooltip
                                formatter={(val) =>
                                    Number(val ?? 0).toLocaleString("es-ES", {
                                        style: "currency",
                                        currency: "EUR",
                                    })}
                            />
                            <Bar
                                dataKey="amount"
                                name="Importe"
                                radius={[4, 4, 0, 0]}
                            >
                                {data.map((entry) => (
                                    <Cell
                                        key={`cell-${entry.name}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </div>
            </div>

            {/* Reporte Detallado por Cliente */}
            <ClientProfitabilityReport />
        </div>
    );
}
