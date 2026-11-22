/**
 * Servicio PDF deshabilitado en el entorno de demostración (Decisión 1.4).
 * No genera, visualiza ni descarga archivos PDF.
 */

import { DEMO_PDF_DISABLED_MESSAGE } from "../demo/demoConstants";

export interface ClientData {
  nombre: string;
  direccion?: string;
  cif?: string;
  nombreContacto?: string;
  telefono?: string;
}

export interface JobData {
  tipo: string;
  descripcion: string;
  precio: number;
  estado?: string;
  empleado?: string;
  observaciones?: string;
  comunidad?: string;
}

export const generateBudget = async (
  _client: ClientData,
  _job: JobData,
  _docNumber?: string,
): Promise<void> => {
  throw new Error(DEMO_PDF_DISABLED_MESSAGE);
};

export const generateInvoice = async (
  _client: ClientData,
  _job: JobData,
  _docNumber?: string,
): Promise<void> => {
  throw new Error(DEMO_PDF_DISABLED_MESSAGE);
};

export const generateJobReport = async (
  _job: JobData,
  _docNumber?: string,
): Promise<void> => {
  throw new Error(DEMO_PDF_DISABLED_MESSAGE);
};
