export const DEMO_ADMIN_UID = "demo-admin-1";
export const DEMO_CLIENT_UID = "demo-client-1";
export const DEMO_EMPLOYEE_UID = "demo-employee-1";

export const DEMO_PDF_DISABLED_MESSAGE = "No disponible en versión demo";

const avatarCache = new Map<string, string>();

export function buildLocalAvatarSvg(name: string, bg = "#003366", fg = "#ffffff"): string {
  const clean = (name || "JB").trim();
  const key = `${clean}|${bg}|${fg}`;
  const cached = avatarCache.get(key);
  if (cached) return cached;

  const parts = clean.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase()
      : clean.slice(0, 2).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="48" fill="${bg}"/>
  <text x="48" y="54" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="34" font-weight="700" fill="${fg}">${initials}</text>
</svg>`;
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  avatarCache.set(key, uri);
  return uri;
}
