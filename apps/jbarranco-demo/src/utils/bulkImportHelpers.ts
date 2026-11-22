import { Timestamp } from "firebase/firestore";

export interface ClientRow {
  nombre: string;
  nif: string;
  direccion: string;
  iban: string;
  importe: string;
  fechaCargo: string;
  codigoPostal?: string;
  ciudad?: string;
  telefono?: string;
  empleadoAsignadoId?: string;
  cuotaMensual?: number;
}

export interface ImportResult {
  nombre: string;
  email: string;
  password: string;
  status: "success" | "error";
  error?: string;
}

/**
 * Parse TXT file content into structured client rows
 */
export function parseTxtFile(content: string): ClientRow[] {
  const lines = content.split("\n").filter((line) => line.trim());
  const rows: ClientRow[] = [];

  // Skip header line (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line?.trim()) continue;

    // Split by tab
    const columns = line.split("\t");
    if (columns.length < 6) continue;

    rows.push({
      nombre: columns[0]?.trim() || "",
      direccion: columns[1]?.trim() || "",
      nif: columns[2]?.trim() || "",
      iban: columns[3]?.trim() || "",
      importe: columns[4]?.trim() || "",
      fechaCargo: columns[5]?.trim() || "",
    });
  }

  return rows;
}

/**
 * Generate fictitious demo email from client name
 */
export function generateEmail(nombre: string): string {
  const cleanName = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(/\s+/g, "")
    .replaceAll(/[^a-z0-9]/g, "")
    .trim();

  return `${cleanName}@comunidad-demo.local`;
}

/**
 * Generate fictitious demo password from client name and NIF
 */
export function generatePassword(nombre: string, nif?: string): string {
  if (nif?.trim()) {
    return nif.replaceAll("-", "").trim();
  }

  const words = nombre.trim().split(/\s+/);
  if (words.length === 0) return "Cliente*1";

  const capitalized = words.map((word, index) =>
    index === 0
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word.toLowerCase(),
  );

  return capitalized.join("*");
}

/**
 * Parse amount string to number
 */
export function parseAmount(importe: string): number {
  if (!importe) return 0;
  const cleaned = importe.replaceAll("€", "").trim();
  const normalized = cleaned.replaceAll(",", ".");
  return Number.parseFloat(normalized) || 0;
}

/**
 * Parse billing day from date string
 */
export function parseBillingDay(fecha: string): number | undefined {
  if (!fecha || fecha.trim() === "") return undefined;
  const parts = fecha.split("/");
  if (parts.length < 1) return undefined;
  const day = Number.parseInt(parts[0] || "", 10);
  return Number.isNaN(day) ? undefined : day;
}

/**
 * Validate IBAN format (basic check)
 */
export function isValidIBAN(iban: string): boolean {
  if (!iban || iban.trim() === "") return true;
  const cleaned = iban.replaceAll(/\s+/g, "");
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;
  return ibanRegex.test(cleaned);
}

/**
 * Map ClientRow to Firestore Cliente document
 */
export function mapRowToClientData(row: ClientRow) {
  const billingDay = parseBillingDay(row.fechaCargo);

  const data: Record<string, unknown> = {
    nombre: row.nombre,
    cif: row.nif || "",
    direccion: row.direccion,
    codigoPostal: row.codigoPostal || "28000",
    ciudad: row.ciudad || "Madrid",
    nombreContacto: "Presidente Comunidad (Demo)",
    telefono: row.telefono || "600 000 000",
    email: "",
    cuotaMensual: row.cuotaMensual ?? parseAmount(row.importe),
    iban: row.iban || "",
    activo: true,
    fechaCreacion: Timestamp.now(),
    diasContrato: [],
    empleadoAsignadoId: row.empleadoAsignadoId || "",
    empleadoAsignadoNombre: "",
  };

  if (billingDay !== undefined) {
    data.fechaCargo = billingDay;
  }

  return data;
}
