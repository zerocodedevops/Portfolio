import { useEffect, useState } from "react";
import {
    BuildingOfficeIcon,
    CalculatorIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import toast from "react-hot-toast";

interface TaxConfig {
    cuotaAutonomos: number;
    seguridadSocialPorcentaje: number;
    seguroResponsabilidad: number;
    gestoria: number;
    otrosGastosFijos: number;
}

interface TaxesSectionProps {
    readonly totalNominas: number;
}

const DEFAULT_CONFIG: TaxConfig = {
    cuotaAutonomos: 300,
    seguridadSocialPorcentaje: 30,
    seguroResponsabilidad: 50,
    gestoria: 100,
    otrosGastosFijos: 0,
};

export default function TaxesSection({ totalNominas }: TaxesSectionProps) {
    const [config, setConfig] = useState<TaxConfig>(DEFAULT_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Cargar configuración de Firestore
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const docRef = doc(db, "configuracion", "gastos_fijos");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setConfig(
                        { ...DEFAULT_CONFIG, ...docSnap.data() } as TaxConfig,
                    );
                }
            } catch (error) {
                console.error("Error loading tax config:", error);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, []);

    // Guardar configuración
    const handleSave = async () => {
        try {
            await setDoc(doc(db, "configuracion", "gastos_fijos"), config);
            toast.success("Configuración guardada");
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving config:", error);
            toast.error("Error al guardar");
        }
    };

    // Cálculos
    const seguridadSocialEmpresa =
        (totalNominas * config.seguridadSocialPorcentaje) / 100;
    const totalMensual = config.cuotaAutonomos +
        seguridadSocialEmpresa +
        config.seguroResponsabilidad +
        config.gestoria +
        config.otrosGastosFijos;

    const gastosFijos = [
        {
            concepto: "Cuota Autónomos",
            icon: BuildingOfficeIcon,
            importe: config.cuotaAutonomos,
            editable: true,
            field: "cuotaAutonomos" as keyof TaxConfig,
            descripcion: "Cuota mensual régimen autónomos",
        },
        {
            concepto: "Seguridad Social Empresa",
            icon: ShieldCheckIcon,
            importe: seguridadSocialEmpresa,
            editable: false,
            descripcion: `${config.seguridadSocialPorcentaje}% sobre nóminas`,
        },
        {
            concepto: "Seguro Responsabilidad Civil",
            icon: DocumentTextIcon,
            importe: config.seguroResponsabilidad,
            editable: true,
            field: "seguroResponsabilidad" as keyof TaxConfig,
            descripcion: "Seguro RC profesional",
        },
        {
            concepto: "Gestoría",
            icon: CalculatorIcon,
            importe: config.gestoria,
            editable: true,
            field: "gestoria" as keyof TaxConfig,
            descripcion: "Asesoría fiscal y contable",
        },
        {
            concepto: "Otros Gastos Fijos",
            icon: DocumentTextIcon,
            importe: config.otrosGastosFijos,
            editable: true,
            field: "otrosGastosFijos" as keyof TaxConfig,
            descripcion: "Otros gastos mensuales fijos",
        },
    ];

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-32 bg-gray-200 rounded" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Gastos Fijos Mensuales
                </h3>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">
                            Total Gastos Fijos
                        </p>
                        <p className="text-xl font-bold text-red-600">
                            {totalMensual.toLocaleString("es-ES")}€
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            isEditing ? handleSave() : setIsEditing(true)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                            isEditing
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {isEditing ? "Guardar" : "Editar"}
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <label
                        htmlFor="ss-porcentaje"
                        className="block text-sm font-medium text-yellow-800 mb-1"
                    >
                        % Seguridad Social sobre nóminas
                    </label>
                    <input
                        id="ss-porcentaje"
                        type="number"
                        value={config.seguridadSocialPorcentaje}
                        onChange={(e) =>
                            setConfig((prev) => ({
                                ...prev,
                                seguridadSocialPorcentaje: Number(
                                    e.target.value,
                                ),
                            }))}
                        className="w-24 px-2 py-1 border rounded text-sm"
                        min="0"
                        max="100"
                    />
                    <span className="ml-2 text-sm text-yellow-700">%</span>
                </div>
            )}

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-orange-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Concepto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Importe Mensual
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {gastosFijos.map((gasto) => (
                            <tr key={gasto.concepto}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <gasto.icon className="h-5 w-5 text-orange-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {gasto.concepto}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {gasto.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    {isEditing && gasto.editable && gasto.field
                                        ? (
                                            <input
                                                type="number"
                                                value={config[gasto.field]}
                                                onChange={(e) =>
                                                    setConfig((prev) => ({
                                                        ...prev,
                                                        [gasto.field as string]:
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                    }))}
                                                className="w-24 px-2 py-1 border rounded text-right text-sm"
                                                min="0"
                                            />
                                        )
                                        : (
                                            <span className="text-red-600 font-medium">
                                                {gasto.importe.toLocaleString(
                                                    "es-ES",
                                                )}€
                                            </span>
                                        )}
                                </td>
                            </tr>
                        ))}
                        {/* Fila de total */}
                        <tr className="bg-orange-50">
                            <td
                                colSpan={2}
                                className="px-6 py-3 text-right text-sm font-bold text-gray-900"
                            >
                                Total Mensual
                            </td>
                            <td className="px-6 py-3 text-right text-lg font-bold text-red-600">
                                {totalMensual.toLocaleString("es-ES")}€
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className="mt-2 text-xs text-gray-500">
                * Los impuestos trimestrales (IVA, IRPF, IS) se calculan en la
                pestaña de Rentabilidad
            </p>
        </div>
    );
}
