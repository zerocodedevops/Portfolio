import type {
    InventoryExpenseItem,
    PayrollExpenseItem,
    TransactionItem,
} from "../../../../hooks/useAccountingData";
import ManualExpensesSection from "./ManualExpensesSection";
import PayrollSection from "./PayrollSection";
import InventorySection from "./InventorySection";
import TaxesSection from "./TaxesSection";

interface ExpensesPanelProps {
    readonly manualExpenses: TransactionItem[];
    readonly payrollExpenses: PayrollExpenseItem[];
    readonly inventoryExpenses: InventoryExpenseItem[];
    readonly onViewDocument: (path: string) => void;
}

export default function ExpensesPanel({
    manualExpenses,
    payrollExpenses,
    inventoryExpenses,
    onViewDocument,
}: ExpensesPanelProps) {
    // Calcular total nóminas para pasar a TaxesSection
    const totalNominas = payrollExpenses.reduce(
        (sum, item) => sum + item.costeMensual,
        0,
    );

    return (
        <div className="p-4 space-y-8">
            <ManualExpensesSection
                manualExpenses={manualExpenses}
                onViewDocument={onViewDocument}
            />
            <PayrollSection payrollExpenses={payrollExpenses} />
            <TaxesSection totalNominas={totalNominas} />
            <InventorySection inventoryExpenses={inventoryExpenses} />
        </div>
    );
}
