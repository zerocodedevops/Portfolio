/**
 * Adaptador de almacenamiento local en memoria para la DEMO de J.Barranco.
 * Cumple estrictamente la restricción 1.4:
 * - No conecta con Supabase Storage real ni Firebase Storage.
 * - No genera, visualiza ni descarga archivos PDF.
 * - Registra y revoca cualquier Blob URL no-PDF al ejecutar resetDemoStorage().
 */

import { DEMO_PDF_DISABLED_MESSAGE } from "./demoConstants";

export interface DemoStoredFile {
  name: string;
  path: string;
  size: number;
  mimetype: string;
  created_at: string;
  category: string;
  clientId?: string | null;
}

const activeBlobUrls = new Set<string>();

function createInitialFiles(): Map<string, DemoStoredFile> {
  const items: DemoStoredFile[] = [
    {
      name: "Factura_Mensual_Monteclaro_Nov2026.pdf",
      path: "facturas/demo-client-1/Factura_Mensual_Monteclaro_Nov2026.pdf",
      size: 148200,
      mimetype: "application/pdf",
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      category: "facturas",
      clientId: "demo-client-1",
    },
    {
      name: "Factura_Mensual_Castellana200_Nov2026.pdf",
      path: "facturas/demo-client-2/Factura_Mensual_Castellana200_Nov2026.pdf",
      size: 162400,
      mimetype: "application/pdf",
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      category: "facturas",
      clientId: "demo-client-2",
    },
    {
      name: "Presupuesto_Decapado_Garaje_Monteclaro.pdf",
      path: "presupuestos/demo-client-1/Presupuesto_Decapado_Garaje_Monteclaro.pdf",
      size: 112500,
      mimetype: "application/pdf",
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      category: "presupuestos",
      clientId: "demo-client-1",
    },
    {
      name: "Nomina_Laura_Gomez_Oct2026.pdf",
      path: "nominas/Nomina_Laura_Gomez_Oct2026.pdf",
      size: 98400,
      mimetype: "application/pdf",
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      category: "nominas",
      clientId: null,
    },
    {
      name: "Albaran_Suministros_Quimicos_Nov2026.pdf",
      path: "albaranes/Albaran_Suministros_Quimicos_Nov2026.pdf",
      size: 84100,
      mimetype: "application/pdf",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      category: "albaranes",
      clientId: null,
    },
    {
      name: "Factura_Proveedor_Quimicos_Madrid.pdf",
      path: "gastos-empresa/Factura_Proveedor_Quimicos_Madrid.pdf",
      size: 129300,
      mimetype: "application/pdf",
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      category: "gastos-empresa",
      clientId: null,
    },
  ];

  const map = new Map<string, DemoStoredFile>();
  for (const item of items) {
    map.set(item.path, { ...item });
  }
  return map;
}

let filesStore = createInitialFiles();

export function registerDemoBlobUrl(url: string): string {
  if (url.startsWith("blob:")) {
    activeBlobUrls.add(url);
  }
  return url;
}

export function getActiveBlobUrlsCount(): number {
  return activeBlobUrls.size;
}

export function resetDemoStorage(): void {
  for (const url of activeBlobUrls) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore revocation errors in test environments
    }
  }
  activeBlobUrls.clear();
  filesStore = createInitialFiles();
}

export function listDemoStoredFiles(prefix: string): DemoStoredFile[] {
  const cleanPrefix = prefix.replace(/\/$/, "");
  const results: DemoStoredFile[] = [];
  for (const file of filesStore.values()) {
    if (file.path.startsWith(cleanPrefix + "/") || file.category === cleanPrefix) {
      results.push({ ...file });
    }
  }
  return results;
}

export function removeDemoStoredFile(path: string): void {
  filesStore.delete(path);
}

// Emulador del cliente Supabase Storage sin red y sin generación/descarga de PDFs
export const supabase = {
  storage: {
    from(_bucket: string) {
      return {
        async upload(
          _path: string,
          _file: File,
          _options?: Record<string, unknown>,
        ): Promise<{ data: { path: string } | null; error: Error | null }> {
          return {
            data: null,
            error: new Error(DEMO_PDF_DISABLED_MESSAGE),
          };
        },
        async createSignedUrl(
          _path: string,
          _expiresIn: number,
        ): Promise<{ data: { signedUrl: string } | null; error: Error | null }> {
          return {
            data: { signedUrl: "" },
            error: null,
          };
        },
        async remove(
          paths: string[],
        ): Promise<{ data: string[]; error: Error | null }> {
          for (const p of paths) {
            removeDemoStoredFile(p);
          }
          return { data: paths, error: null };
        },
        async list(
          prefix = "",
        ): Promise<{
          data: Array<{
            name: string;
            created_at: string;
            metadata: { size: number; mimetype: string };
          }>;
          error: Error | null;
        }> {
          const matched = listDemoStoredFiles(prefix);
          return {
            data: matched.map((f) => ({
              name: f.name,
              created_at: f.created_at,
              metadata: { size: f.size, mimetype: f.mimetype },
            })),
            error: null,
          };
        },
      };
    },
  },
};

export function createClient(): typeof supabase {
  return supabase;
}

export default supabase;
