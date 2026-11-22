import { DocumentIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { DEMO_PDF_DISABLED_MESSAGE } from "../../demo/demoConstants";

interface EntityAttachmentsProps {
  entityId: string;
  folderPath: string;
  title?: string;
}

export default function EntityAttachments({
  title = "Documentación",
}: EntityAttachmentsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <DocumentIcon className="h-4 w-4 text-brand-blue" />
        {title}
      </h4>

      <div
        className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-center gap-2"
        data-testid="entity-attachments-demo-disabled"
      >
        <NoSymbolIcon className="h-4 w-4 text-amber-700 shrink-0" />
        <span>
          Gestión, visualización y descarga de documentos PDF:{" "}
          <strong>{DEMO_PDF_DISABLED_MESSAGE}</strong>
        </span>
      </div>
    </div>
  );
}
