import React, { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import RegistroDatos, { type RegistroInicial } from '../pages/auth/RegistroDatos';
import { auth, loginAsAdmin, loginAsOwner, signOut } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import { DEMO_UNAVAILABLE_MESSAGE } from '../demo/demoConstants';
import { findResidentProfile } from '../firebase/residentProfile';
import { hasAdministratorAccess, isDeveloperEmail } from '../utils/residentRoles';
import { toPublicResident } from '../firebase/publicResident';
import type { DemoUser as User } from '../demo/demoTypes';

const demoUnavailableAuth = async (..._args: unknown[]): Promise<{ user: User }> => {
  throw new Error(DEMO_UNAVAILABLE_MESSAGE);
};
const createUserWithEmailAndPassword = demoUnavailableAuth;
const sendEmailVerification = demoUnavailableAuth;
const sendPasswordResetEmail = demoUnavailableAuth;
const signInWithEmailAndPassword = demoUnavailableAuth;
const signInWithPopup = demoUnavailableAuth;
const updatePassword = demoUnavailableAuth;
const reauthenticateWithCredential = demoUnavailableAuth;
const EmailAuthProvider = { credential: (_email: string, _password: string) => ({}) };
class GoogleAuthProvider {}
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch, type DemoQuerySnapshot as QuerySnapshot, type DemoDocumentData as DocumentData } from '../demo/demoStore';
import toast from 'react-hot-toast';
import type { IncidenciaData, VecinoData, VecinoOutletContext } from '../types/domain';
import { contarIncidencias, etiquetaEstadoIncidencia, normalizarEstadoIncidencia, normalizarPrioridadIncidencia } from '../utils/incidencias';
import { getIncidentImagesSignedUrls, removeIncidentImages, uploadIncidentImages } from '../services/incidenciasStorage';
import { isProfilePhotoReference, removeProfilePhoto, resolveProfilePhotoUrl, uploadProfilePhoto } from '../services/profilePhotoStorage';
import { useTheme } from '../context/ThemeContext';
import JoinCommunityForm from './features/JoinCommunityForm';

const ComunidadBoard = lazy(() => import('../pages/Comunidad'));

const referencePages = import.meta.glob<string>('../../NeighNetz-Stitch/stitch_neighnetz_community_manager/*/code.html', { eager: true, query: '?raw', import: 'default' });

const pageFolders: Record<string, string> = {
  gastos: 'neighnetz_contabilidad_y_gastos_dashboard_gastos',
  vecinos: 'neighnetz_directorio_de_vecinos_dashboard_vecinos',
  'admin-incidencias': 'neighnetz_gesti_n_de_incidencias_admin_incidencias',
  'admin-reservas': 'neighnetz_gesti_n_de_reservas_admin_reservas',
  'admin-documentos': 'neighnetz_gesti_n_documental_admin_documentos',
  incidencias: 'neighnetz_incidencias_dashboard_incidencias',
  login: 'neighnetz_inicio_de_sesi_n_y_registro_login',
  perfil: 'neighnetz_mi_perfil_dashboard_perfil',
  'admin-panel': 'neighnetz_panel_ejecutivo_de_administraci_n_admin',
  documentos: 'neighnetz_repositorio_documental_dashboard_documentos',
  reservas: 'neighnetz_reservas_de_zonas_comunes_dashboard_reservas',
  tablón: 'neighnetz_tabl_n_del_vecino_dashboard',
  'admin-usuarios': 'neighnetz_validar_vecinos_admin_usuarios',
  votaciones: 'neighnetz_votaciones_telem_ticas_dashboard_votaciones',
};

const pageRoutes: Record<string, string> = {
  dashboard: '/dashboard', 'dashboard-incidencias': '/dashboard/incidencias',
  'dashboard-reservas': '/dashboard/reservas', 'dashboard-votaciones': '/dashboard/votaciones',
  'dashboard-documentos': '/dashboard/documentos', 'dashboard-vecinos': '/dashboard/vecinos', 'dashboard-comunidad': '/dashboard/comunidad',
  'dashboard-gastos': '/dashboard/gastos', 'dashboard-perfil': '/dashboard/perfil',
  admin: '/dashboard', 'admin-usuarios': '/admin/usuarios',
  'admin-incidencias': '/admin/incidencias', 'admin-reservas': '/admin/reservas',
  'admin-documentos': '/admin/documentos',
};

const USER_MONTHLY_ORDINARY_QUOTA = 118.35;
const USER_PARTICIPATION_PERCENT = 1.23;

const STITCH_AMOLED_THEME = `
  html, body { background: #000 !important; color: #f4f4f5 !important; color-scheme: dark; }
  .bg-background, .bg-surface, .bg-surface-bg, .bg-surface-bright { background-color: #000 !important; }
  .bg-surface-container-lowest, .bg-surface-card, .bg-white { background-color: #09090b !important; }
  .bg-surface-container-low, .bg-slate-50 { background-color: #101012 !important; }
  .bg-surface-container { background-color: #18181b !important; }
  .bg-surface-container-high, .bg-surface-container-highest, .bg-surface-variant { background-color: #242427 !important; }
  .bg-primary-container, .bg-primary-fixed, .bg-primary-fixed-dim, .bg-tertiary-fixed, .bg-tertiary-fixed-dim { background-color: #18181b !important; }
  .bg-secondary-container, .bg-secondary-fixed, .bg-secondary-fixed-dim { background-color: #052e22 !important; }
  .bg-error-container, .bg-badge-coral-bg { background-color: #3f0d16 !important; }
  .from-surface-container { --tw-gradient-from: #18181b var(--tw-gradient-from-position) !important; --tw-gradient-to: rgb(24 24 27 / 0) var(--tw-gradient-to-position) !important; }
  .to-surface-container-high { --tw-gradient-to: #242427 var(--tw-gradient-to-position) !important; }
  .text-on-surface, .text-on-background, .text-slate-950, .text-slate-900 { color: #f4f4f5 !important; }
  .text-on-surface-variant, .text-slate-800, .text-slate-700, .text-slate-600 { color: #d4d4d8 !important; }
  .text-slate-500, .text-label-sm { color: #a1a1aa !important; }
  .text-primary, .text-on-primary-fixed { color: #f4f4f5 !important; }
  .bg-primary { background-color: #f4f4f5 !important; }
  .text-on-primary { color: #09090b !important; }
  .border-border-subtle, .border-outline-variant, .border-slate-100, .border-slate-200, .border-slate-300 { border-color: #27272a !important; }
  .bg-badge-navy-bg, .bg-badge-emerald-bg, .bg-badge-coral-bg, .bg-badge-amber-bg { background-color: #18181b !important; }
  input, textarea, select { color-scheme: dark; }
  input::placeholder, textarea::placeholder { color: #a1a1aa !important; }
`;

function participationPercent(resident: VecinoData | null | undefined) {
  const personal = resident?.datosPersonales;
  const raw = resident?.coeficiente ?? personal?.coeficiente ?? resident?.coeficienteEstimado ?? personal?.coeficienteEstimado;
  if (raw == null || !String(raw).trim()) return null;
  const parsed = Number(String(raw).replace('%', '').replace(',', '.').trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function estimatedMonthlyQuota(coefficient: number | null | undefined) {
  if (coefficient == null) return null;
  return Math.round((USER_MONTHLY_ORDINARY_QUOTA * coefficient / USER_PARTICIPATION_PERCENT) * 100) / 100;
}

function isQuotaAnchorHome(resident: VecinoData | null | undefined) {
  if (!resident || Math.abs((participationPercent(resident) || 0) - USER_PARTICIPATION_PERCENT) > 0.005) return false;
  const unit = residentUnit(resident);
  return unit.portal === '2' && unit.floor === '1' && unit.door.toUpperCase() === 'A';
}

function formatEuro(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
}

function applyQuarterlyFinancialReport(frameDocument: Document, resident: VecinoData | null) {
  const coefficient = participationPercent(resident);
  const quota = estimatedMonthlyQuota(coefficient);
  const propertyAddress = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => element.textContent?.trim() === 'Portal 2, Planta 3ª, Puerta B');
  if (propertyAddress && resident) propertyAddress.textContent = residentAddress(resident);
  const coefficientLabel = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => /^Coeficiente:/.test(element.textContent?.trim() || ''));
  if (coefficientLabel && coefficient != null) coefficientLabel.textContent = `Coeficiente estimado: ${coefficient.toFixed(2).replace('.', ',')}%`;
  const fee = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => element.textContent?.includes('85,40 € / mes'));
  if (fee) fee.textContent = quota == null ? 'Cuota pendiente de calcular' : `${formatEuro(quota)} / mes${isQuotaAnchorHome(resident) ? '' : ' (estimada)'}`;
  const holder = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => element.textContent?.trim() === 'Elena Morales Gómez');
  if (holder) holder.textContent = resident ? residentName(resident) : 'Titular de la vivienda';

  const yearSelector = frameDocument.getElementById('fiscal-selector');
  if (yearSelector) {
    yearSelector.replaceChildren();
    const option = frameDocument.createElement('option');
    option.value = '2026-Q2';
    option.textContent = '2T 2026 (Abril - Junio)';
    option.selected = true;
    yearSelector.append(option);
  }
  const auditStatus = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Auditoría Abierta');
  if (auditStatus) auditStatus.textContent = 'Informe contable';
  const exerciseStatus = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.includes('Ejercicio Activo'));
  if (exerciseStatus) exerciseStatus.textContent = '• 2T 2026';
  const reportIntro = [...frameDocument.querySelectorAll<HTMLElement>('p')].find((element) => element.textContent?.includes('Supervisión en tiempo real de ingresos'));
  if (reportIntro) reportIntro.textContent = 'Resumen de ingresos y gastos contabilizados en la comunidad durante abril, mayo y junio de 2026.';

  const summaryCards = [...frameDocument.querySelectorAll<HTMLElement>('.grid.grid-cols-1.md\\:grid-cols-3 > div')];
  const metricCard = (label: string) => summaryCards.find((card) => card.textContent?.includes(label));
  const updateCard = (oldLabel: string, newLabel: string, amount: number, detailA: string, detailB: string) => {
    const card = metricCard(oldLabel);
    if (!card) return;
    const label = [...card.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === oldLabel);
    if (label) label.textContent = newLabel;
    const mainValue = card.querySelector<HTMLElement>('.font-headline-xl');
    if (mainValue) mainValue.textContent = formatEuro(amount);
    const bodySpans = [...card.querySelectorAll<HTMLElement>('span')];
    const oldDetailTokens = ['Acta 14/01/2024', 'Aprobado por mayoría', 'Partidas ordinarias:', 'Extraordinarias:', 'Previsión a fin de año:', 'Dentro de límite', '10% Ley Propiedad Horizontal', 'Obligatorio superado', 'Banco Santander', 'Sin pignoraciones', '(74.6%)'];
    const oldDetails = bodySpans.filter((element) => oldDetailTokens.some((token) => element.textContent?.trim().includes(token)));
    oldDetails.forEach((element, index) => {
      if (oldLabel === 'Gasto Ejecutado Acumulado') {
        if (index === 0) element.remove();
        else if (index === 1) element.textContent = detailA;
        else if (index === 2) element.textContent = detailB;
        else element.remove();
        return;
      }
      if (index === 0) element.textContent = detailA;
      else if (index === 1) element.textContent = detailB;
      else if (oldLabel === 'Presupuesto Anual Aprobado' && index === 2) element.textContent = 'Otros ingresos: 1.722,90 €';
      else element.remove();
    });
    if (oldLabel === 'Gasto Ejecutado Acumulado') card.querySelector('.w-full.bg-surface-container-low.h-2')?.remove();
  };
  updateCard('Presupuesto Anual Aprobado', 'Ingresos del trimestre · abr.–jun. 2026', 26094.60, 'Relación contable 2T 2026', 'Provisiones ordinarias: 24.371,70 €');
  updateCard('Gasto Ejecutado Acumulado', 'Gastos del trimestre · abr.–jun. 2026', 28960.89, 'Déficit del trimestre: −2.866,29 €', 'Gasto promedio mensual: 9.653,63 €');
  updateCard('Fondo de Reserva Disponible', 'Saldo disponible a 30/06/2026', 8532.84, 'Saldo tras recibos pendientes', 'Según balance trimestral');

  const exactText = (text: string) => [...frameDocument.querySelectorAll<HTMLElement>('h2, p, span, div')]
    .find((element) => element.childElementCount === 0 && element.textContent?.trim() === text);
  exactText('Distribución por Categorías')?.replaceChildren(frameDocument.createTextNode('Distribución de gastos · 2T 2026'));
  exactText('Total 36.210 €')?.replaceChildren(frameDocument.createTextNode('Total 28.960,89 €'));
  const oldIntro = [...frameDocument.querySelectorAll<HTMLElement>('p')].find((element) => element.textContent?.includes('Desglose de facturas liquidadas'));
  if (oldIntro) oldIntro.textContent = 'Distribución real de las partidas recogidas en la relación contable del segundo trimestre de 2026.';
  exactText('Ejecutado')?.replaceChildren(frameDocument.createTextNode('Gasto Q2'));
  exactText('74.6%')?.replaceChildren(frameDocument.createTextNode('100%'));
  exactText('del presupuesto')?.replaceChildren(frameDocument.createTextNode('28.960,89 €'));

  const distribution = [
    { name: 'Conserjería y limpieza', value: 10453.05, color: '#131b2e' },
    { name: 'Seguro multirriesgo', value: 3991.98, color: '#b45309' },
    { name: 'Gastos generales', value: 3392.99, color: '#ba1a1a' },
    { name: 'Ascensores', value: 3153.26, color: '#565e74' },
    { name: 'Otras partidas', value: 7969.61, color: '#006c4a' },
  ];
  const donut = frameDocument.querySelector<SVGSVGElement>('svg.w-56.h-56');
  const circumference = 2 * Math.PI * 38;
  if (donut) {
    const circles = [...donut.querySelectorAll<SVGCircleElement>('circle')].slice(1);
    let offset = 0;
    distribution.forEach((item, index) => {
      const portion = item.value / 28960.89;
      const length = circumference * portion;
      const circle = circles[index];
      if (circle) {
        circle.setAttribute('stroke', item.color);
        circle.setAttribute('stroke-dasharray', `${length} ${circumference - length}`);
        circle.setAttribute('stroke-dashoffset', String(-offset));
      }
      offset += length;
    });
  }
  const legend = [...frameDocument.querySelectorAll<HTMLElement>('span')].filter((element) => /^(Limpieza \(30%\)|Suministros \(28%\)|Ascensores \(22%\)|Seguro \(12%\)|Imprevistos \/ Fontanería \(8%\))$/.test(element.textContent?.trim() || ''));
  legend.forEach((element, index) => {
    const item = distribution[index];
    if (item) element.textContent = `${item.name} (${(item.value / 28960.89 * 100).toFixed(1).replace('.', ',')}%)`;
  });

  const followTitle = exactText('Seguimiento por Partida Presupuestaria');
  if (followTitle) followTitle.textContent = 'Principales partidas · 2T 2026';
  const followStatus = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Sin desviaciones críticas');
  if (followStatus) followStatus.textContent = 'Importes del informe';
  const followIntro = [...frameDocument.querySelectorAll<HTMLElement>('p')].find((element) => element.textContent?.includes('Comparativa entre asignación votada'));
  if (followIntro) followIntro.textContent = 'Principales categorías por importe; los porcentajes representan su parte del gasto trimestral.';
  const labels = [
    'Conserjería y limpieza', 'Seguro multirriesgo', 'Gastos generales', 'Ascensores', 'Otras partidas',
  ];
  const values = [10453.05, 3991.98, 3392.99, 3153.26, 7969.61];
  const progressRows = [...frameDocument.querySelectorAll<HTMLElement>('.lg\\:col-span-7 .flex.flex-col.gap-space-md > div')];
  progressRows.forEach((row, index) => {
    const name = labels[index];
    const value = values[index];
    if (!name || value == null) { row.remove(); return; }
    const spans = row.querySelectorAll<HTMLElement>(':scope > div:first-child span');
    if (spans[0]) spans[0].textContent = name;
    if (spans[1]) spans[1].textContent = `${formatEuro(value)} (${(value / 28960.89 * 100).toFixed(1).replace('.', ',')}%)`;
    const bar = row.querySelector<HTMLElement>('.bg-primary-container, .bg-secondary, .bg-surface-tint, .bg-badge-amber-text, .bg-urgent-coral');
    if (bar) bar.style.width = `${value / 28960.89 * 100}%`;
  });
  const bankCheck = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.includes('Comprobación cruzada con extracto bancario'));
  if (bankCheck) bankCheck.textContent = 'Fuente: relación contable del segundo trimestre de 2026.';
  const closeMonth = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.includes('Cierre Mensual: Octubre OK'));
  if (closeMonth) closeMonth.textContent = 'Periodo: abril–junio de 2026';

  const table = frameDocument.querySelector<HTMLTableElement>('#invoices-table');
  const tbody = table?.tBodies[0];
  const transactions = [
    ['30/04/2026', 'Engrase y mantenimiento de ascensores', 'No indicado en el informe', 'Ascensores', 3153.26],
    ['19/06/2026', 'Seguro multirriesgo', 'No indicado en el informe', 'Seguro', 3991.98],
    ['01/04/2026', 'Conserjería y limpieza', 'No indicado en el informe', 'Servicios comunitarios', 3484.35],
    ['11/05/2026', 'Trabajos de electricidad para subsanar inspección', 'No indicado en el informe', 'Gastos generales', 1343.10],
    ['04/05/2026', 'Tasa de paso de carruajes', 'Administración pública', 'Tasas', 1309.00],
  ];
  if (tbody) {
    [...tbody.rows].forEach((row, index) => {
      const transaction = transactions[index];
      if (!transaction) { row.remove(); return; }
      [...row.cells].forEach((cell, cellIndex) => {
        if (cellIndex === 4) cell.textContent = formatEuro(transaction[4] as number);
        else if (cellIndex === 5) cell.textContent = 'Registrado en informe';
        else if (cellIndex === 6) cell.textContent = 'Relación 2T 2026';
        else cell.textContent = String(transaction[cellIndex]);
      });
    });
  }
  const tableHeading = exactText('Libro de Facturas y Proveedores');
  if (tableHeading) tableHeading.textContent = 'Movimientos incluidos en el informe';
  const tableDescription = [...frameDocument.querySelectorAll<HTMLElement>('p')].find((element) => element.textContent?.includes('Registro cronológico inmutable'));
  if (tableDescription) tableDescription.textContent = 'Selección de conceptos e importes que constan en la relación contable de abril a junio de 2026.';
  const pagination = [...frameDocument.querySelectorAll<HTMLElement>('button')].find((element) => element.textContent?.trim() === 'Siguiente')?.parentElement;
  pagination?.remove();
  const shownRows = [...frameDocument.querySelectorAll<HTMLElement>('p, span')].find((element) => element.textContent?.includes('Mostrando 5 de 64 movimientos'));
  if (shownRows) shownRows.textContent = '5 movimientos de ejemplo extraídos del informe trimestral; los importes totales corresponden al balance completo.';
  const legalDisclaimer = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.startsWith('Todas las facturas cuentan con firma del administrador'));
  if (legalDisclaimer) legalDisclaimer.textContent = 'El informe recoge gastos contabilizados entre el 1 de abril y el 30 de junio de 2026. El detalle de facturas puede consultarse con la Administración.';
}

function sanitizeReference(markup: string) {
  if (typeof window === 'undefined' || !window.DOMParser) return markup;
  const parsed = new DOMParser().parseFromString(markup, 'text/html');
  // Keep the supplied visual reference intact while stripping its demo-only
  // auth handlers. Tailwind is loaded by the reference's own stylesheet setup.
  parsed.querySelectorAll('script').forEach((script) => {
    const src = (script.getAttribute('src') || '').toLowerCase();
    const isTailwindRuntime = src.includes('cdn.tailwindcss.com');
    const isTailwindConfiguration = script.id === 'tailwind-config';
    if (isTailwindRuntime && script.parentNode) {
      const silenceWarning = parsed.createElement('script');
      silenceWarning.textContent = '(function(){var w=console.warn;console.warn=function(){if(arguments[0]&&typeof arguments[0]===\"string\"&&arguments[0].indexOf(\"cdn.tailwindcss.com\")!==-1)return;w.apply(console,arguments);};})();';
      script.parentNode.insertBefore(silenceWarning, script);
    }
    const isShader = script.parentElement?.querySelector('#shader-canvas-ANIMATION_31') !== null
      && Boolean(script.parentElement?.querySelector('#shader-canvas-ANIMATION_31'));
    if (!isTailwindRuntime && !isTailwindConfiguration && !isShader) script.remove();
  });
  const authForm = parsed.getElementById('auth-form');
  authForm?.removeAttribute('onsubmit');
  if (authForm && !parsed.getElementById('demo-role-entry-box')) {
    const demoBox = parsed.createElement('div');
    demoBox.id = 'demo-role-entry-box';
    demoBox.className = 'mb-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5';
    demoBox.innerHTML = `
      <p class="mb-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-900">Acceso rápido Demo (sin credenciales)</p>
      <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button type="button" data-demo-entry="owner" class="w-full rounded-lg bg-emerald-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">Entrar como Propietario</button>
        <button type="button" data-demo-entry="admin" class="w-full rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">Entrar como Administrador</button>
      </div>
    `;
    authForm.parentElement?.insertBefore(demoBox, authForm);
  }
  parsed.querySelectorAll('[onclick]').forEach((element) => element.removeAttribute('onclick'));
  parsed.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
    });
  });
  return `<!DOCTYPE html>${parsed.documentElement.outerHTML}`;
}

function labelText(element: Element) {
  const htmlElement = element as HTMLElement;
  return `${htmlElement.innerText || ''} ${element.getAttribute('aria-label') || ''} ${htmlElement.title || ''}`.replace(/\s+/g, ' ').trim();
}

function referenceFor(pageId: string) {
  const folder = pageFolders[pageId];
  const entry = Object.entries(referencePages).find(([path]) => path.includes(`/${folder}/code.html`));
  if (!entry) return '';
  const markup = sanitizeReference(entry[1]);
  if (pageId !== 'login' || typeof window === 'undefined' || !window.DOMParser) return markup;
  const parsed = new DOMParser().parseFromString(markup, 'text/html');
  const apartmentMark = [...parsed.querySelectorAll<HTMLElement>('.material-symbols-outlined')]
    .find((element) => element.textContent?.trim() === 'apartment');
  const logoFrame = apartmentMark?.parentElement;
  if (logoFrame) {
    logoFrame.className = 'h-11 w-11 shrink-0 overflow-hidden rounded-full';
    logoFrame.replaceChildren(Object.assign(parsed.createElement('img'), {
      src: '/neighnetz-app-icon.png',
      alt: '',
      className: 'h-11 w-11 object-contain',
    }));
  }
  return `<!DOCTYPE html>${parsed.documentElement.outerHTML}`;
}

function ensureIncidentModal(frameDocument: Document) {
  if (frameDocument.getElementById('new-incident-modal')) return;
  const incidentMarkup = referenceFor('incidencias');
  if (!incidentMarkup) return;
  const incidentDocument = new DOMParser().parseFromString(incidentMarkup, 'text/html');
  const modal = incidentDocument.getElementById('new-incident-modal');
  if (modal && frameDocument.body) frameDocument.body.append(frameDocument.importNode(modal, true));
}

function canModerateIncidentHistory(resident: VecinoData | null | undefined, isAdminRoute = false) {
  return isAdminRoute || hasAdministratorAccess(resident);
}


/**
 * Collects all image paths/urls from an incident (imagenes + fotos fields).
 * Returns raw Supabase storage paths or https:// URLs indistinctly;
 * resolution to signed URLs is done asynchronously via getIncidentImagesSignedUrls.
 */
function collectIncidentImageRefs(incident: IncidenciaData): string[] {
  return [
    ...(incident.imagenes || []),
    ...(Array.isArray(incident.fotos)
      ? incident.fotos.filter((item): item is string => typeof item === 'string')
      : []),
  ].filter(Boolean);
}

/**
 * Creates a skeleton placeholder grid while signed URLs are loading.
 */
function createImageSkeleton(frameDocument: Document, count: number, heightClass: string): HTMLElement {
  const grid = frameDocument.createElement('div');
  grid.className = 'grid grid-cols-2 gap-space-sm';
  for (let i = 0; i < Math.min(count, 4); i++) {
    const placeholder = frameDocument.createElement('div');
    placeholder.className = heightClass + ' w-full rounded-lg bg-surface-container-low animate-pulse';
    grid.append(placeholder);
  }
  return grid;
}

/**
 * Asynchronously resolves Supabase paths/https URLs to signed URLs and renders
 * an image grid into container, showing a skeleton placeholder while loading.
 */
function renderIncidentImages(
  frameDocument: Document,
  container: HTMLElement,
  imageRefs: string[],
  insertBefore: ChildNode | null,
  heightClass: string,
  altPrefix: string,
): void {
  if (!imageRefs.length) return;
  const skeleton = createImageSkeleton(frameDocument, imageRefs.length, heightClass);
  if (insertBefore) container.insertBefore(skeleton, insertBefore);
  else container.append(skeleton);
  void getIncidentImagesSignedUrls(imageRefs.slice(0, 4)).then((signedUrls) => {
    if (!signedUrls.length) { skeleton.remove(); return; }
    const imageGrid = frameDocument.createElement('div');
    imageGrid.className = 'grid grid-cols-2 gap-space-sm';
    for (const url of signedUrls) {
      const image = frameDocument.createElement('img');
      image.className = heightClass + ' w-full rounded-lg object-cover cursor-pointer';
      image.src = url;
      image.alt = altPrefix;
      image.loading = 'lazy';
      image.addEventListener('click', () => { window.open(url, '_blank', 'noopener,noreferrer'); });
      imageGrid.append(image);
    }
    skeleton.replaceWith(imageGrid);
  }).catch(() => { skeleton.remove(); });
}

type IncidentHistoryEntry = NonNullable<IncidenciaData['historial']>[number] & { id: string };

function showIncidentTracking(frameDocument: Document, incident: IncidenciaData, currentUid?: string, currentName?: string, currentCargo?: string, canModerate = false, historyEntries?: IncidentHistoryEntry[]) {
  let modal = frameDocument.getElementById('incident-tracking-modal');
  if (!modal) {
    modal = frameDocument.createElement('div');
    modal.id = 'incident-tracking-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'incident-tracking-title');
    modal.innerHTML = '<section class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl"><header class="mb-space-md flex items-start justify-between gap-space-md"><div><p class="font-label-sm text-label-sm uppercase text-primary">Seguimiento de incidencia</p><h2 id="incident-tracking-title" class="mt-1 font-headline-md text-headline-md font-bold text-on-surface"></h2></div><button type="button" data-close-incident-tracking aria-label="Cerrar seguimiento" class="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low"><span class="material-symbols-outlined">close</span></button></header><div data-tracking-content class="space-y-space-md"></div></section>';
    frameDocument.body.append(modal);
  }
  const content = modal.querySelector<HTMLElement>('[data-tracking-content]');
  const title = modal.querySelector<HTMLElement>('#incident-tracking-title');
  if (!content || !title) return;
  title.textContent = incident.titulo || 'Incidencia sin título';
  content.replaceChildren();

  const metadata = frameDocument.createElement('div');
  metadata.className = 'flex flex-wrap gap-space-sm';
  const status = frameDocument.createElement('span');
  status.className = 'rounded-full bg-surface-container-low px-space-sm py-1 font-label-sm text-label-sm text-on-surface';
  status.textContent = etiquetaEstadoIncidencia(incident.estado);
  const priority = frameDocument.createElement('span');
  priority.className = 'rounded-full bg-surface-container-low px-space-sm py-1 font-label-sm text-label-sm text-on-surface';
  const normalizedPriority = normalizarPrioridadIncidencia(incident.prioridad);
  priority.textContent = `Prioridad ${normalizedPriority === 'alta' ? 'alta' : normalizedPriority === 'baja' ? 'baja' : 'media'}`;
  metadata.append(status, priority);

  const description = frameDocument.createElement('p');
  description.className = 'whitespace-pre-wrap font-body-md text-body-md text-on-surface-variant';
  description.textContent = incident.descripcion || 'Sin descripción registrada.';
  const location = frameDocument.createElement('p');
  location.className = 'font-body-sm text-body-sm text-on-surface';
  location.textContent = `Ubicación: ${incident.ubicacion || incident.zona || 'No especificada'}`;
  const createdAt = incidenceTimestamp(incident.fechaCreacion);
  const date = frameDocument.createElement('p');
  date.className = 'font-label-sm text-label-sm text-on-surface-variant';
  date.textContent = `Registrada: ${createdAt ? createdAt.toLocaleString('es-ES') : 'Fecha desconocida'}`;
  content.append(metadata, description, location, date);

  const imageRefsModal = collectIncidentImageRefs(incident);
  renderIncidentImages(frameDocument, content, imageRefsModal, null, 'h-36', `Imagen de ${incident.titulo || 'la incidencia'}`);

  const historyTitle = frameDocument.createElement('h3');
  historyTitle.className = 'border-t border-outline-variant pt-space-md font-label-lg text-label-lg font-bold text-on-surface';
  historyTitle.textContent = 'Historial de seguimiento';
  const history = frameDocument.createElement('ol');
  history.className = 'space-y-space-sm';
  const entries = [...(historyEntries || (incident.historial || []).map((entry, index) => ({ ...entry, id: entry.id || `legacy-${index}` })))].sort((left, right) =>
    (incidenceTimestamp(left.fecha)?.getTime() || 0) - (incidenceTimestamp(right.fecha)?.getTime() || 0));
  if (entries.length) {
    for (const entry of entries) {
      const item = frameDocument.createElement('li');
      item.className = 'rounded-lg bg-surface-container-low p-space-sm';
      item.dataset.historyEntryId = entry.id;
      const detail = frameDocument.createElement('p');
      detail.className = 'font-body-sm text-body-sm text-on-surface';
      if (entry.eliminado) {
        detail.className = 'font-body-sm text-body-sm italic text-on-surface-variant';
        const deletedBy = entry.eliminadoPorNombre || entry.eliminadoPorCargo || 'un usuario autorizado';
        detail.textContent = `Comentario eliminado por ${deletedBy}${entry.eliminadoPorCargo && entry.eliminadoPorCargo !== deletedBy ? ` (${entry.eliminadoPorCargo})` : ''}`;
      } else {
        detail.textContent = entry.detalle || 'Actualización de la incidencia';
      }
      const stamp = incidenceTimestamp(entry.fecha);
      const byline = frameDocument.createElement('p');
      byline.className = 'mt-1 font-label-sm text-label-sm text-on-surface-variant';
      const authorUid = entry.autorUid || entry.autor || '';
      byline.textContent = `${entry.autorNombre || (authorUid === currentUid ? currentName : '') || (authorUid ? `Usuario ${authorUid.slice(0, 6)}` : 'Administración')} · ${stamp ? stamp.toLocaleString('es-ES') : 'Fecha desconocida'}`;
      item.append(detail, byline);
      if (!entry.id.startsWith('legacy-') && !entry.eliminado && (authorUid === currentUid || canModerate)) {
        const actions = frameDocument.createElement('div');
        actions.className = 'mt-space-xs flex gap-space-md';
        if (authorUid === currentUid) {
          const edit = frameDocument.createElement('button');
          edit.type = 'button';
          edit.dataset.historyAction = 'edit';
          edit.className = 'font-label-sm text-label-sm font-bold text-primary hover:underline';
          edit.textContent = 'Editar';
          actions.append(edit);
        }
        const remove = frameDocument.createElement('button');
        remove.type = 'button';
        remove.dataset.historyAction = 'delete';
        remove.className = 'font-label-sm text-label-sm font-bold text-error hover:underline';
        remove.textContent = 'Eliminar';
        actions.append(remove);
        item.append(actions);
      }
      history.append(item);
    }
  } else {
    const item = frameDocument.createElement('li');
    item.className = 'rounded-lg bg-surface-container-low p-space-sm font-body-sm text-body-sm text-on-surface-variant';
    item.textContent = 'Aún no hay actualizaciones adicionales. Se muestra el estado actual registrado.';
    history.append(item);
  }
  content.append(historyTitle, history);
  const form = frameDocument.createElement('form');
  form.id = 'incident-history-form';
  form.className = 'border-t border-outline-variant pt-space-md';
  const label = frameDocument.createElement('label');
  label.htmlFor = 'incident-history-note';
  label.className = 'mb-space-xs block font-label-md text-label-md font-bold text-on-surface';
  label.textContent = 'Añadir al historial';
  const textarea = frameDocument.createElement('textarea');
  textarea.id = 'incident-history-note';
  textarea.name = 'detalle';
  textarea.required = true;
  textarea.maxLength = 2000;
  textarea.rows = 3;
  textarea.className = 'w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-space-sm text-on-surface focus:border-primary focus:outline-none';
  textarea.placeholder = 'Escribe una actualización…';
  const submit = frameDocument.createElement('button');
  submit.type = 'submit';
  submit.className = 'mt-space-sm rounded-lg bg-primary px-space-md py-space-sm font-label-md text-label-md font-bold text-on-primary hover:opacity-90 disabled:opacity-50';
  submit.textContent = 'Añadir registro';
  submit.disabled = !currentUid;
  form.append(label, textarea, submit);
  content.append(form);
  modal.dataset.incidentId = incident.id;
  modal.classList.remove('hidden');
  modal.querySelector<HTMLButtonElement>('[data-close-incident-tracking]')?.focus();
}

async function loadIncidentHistory(incident: IncidenciaData): Promise<IncidentHistoryEntry[]> {
  const snapshot = await getDocs(query(collection(db, 'incidencias', incident.id, 'historial'), orderBy('fecha', 'asc')));
  if (snapshot.size) return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as IncidentHistoryEntry));
  return (incident.historial || []).map((entry, index) => ({ ...entry, id: entry.id || `legacy-${index}` }));
}

function residentAvatar(name: string, photo?: string | null, darkMode = false) {
  if (photo) return photo;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="${darkMode ? '#18181b' : '#dce9ff'}"/><text x="48" y="57" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="${darkMode ? '#f4f4f5' : '#0b1c30'}">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(avatar)}`;
}

function setResidentAvatar(avatar: HTMLImageElement, name: string, photo?: string | null) {
  const darkMode = avatar.ownerDocument.documentElement.dataset.theme === 'amoled';
  avatar.src = residentAvatar(name, photo && !isProfilePhotoReference(photo) ? photo : undefined, darkMode);
  if (photo && isProfilePhotoReference(photo)) {
    void resolveProfilePhotoUrl(photo).then((url) => {
      if (url && avatar.isConnected) avatar.src = url;
    }).catch((error) => console.warn('No se pudo cargar una foto de perfil desde Supabase:', error));
  }
}

function residentPhotoReference(resident: VecinoData | null | undefined, user?: User | null) {
  return resident?.datosPersonales?.fotoPerfil
    || resident?.fotoPerfil
    || resident?.datosPersonales?.photoURL
    || user?.photoURL
    || '';
}

function applyCommunityIdentity(frameDocument: Document) {
  const replacements = [
    ['Residencial Los Sauces 14', 'Jardín del Poeta'],
    ['Residencial Los Sauces', 'Jardín del Poeta'],
    ['Los Sauces 14', 'Jardín del Poeta'],
    ['Los Sauces', 'Jardín del Poeta'],
  ];
  const replace = (value: string) => replacements.reduce((result, [source, target]) => result.replaceAll(source, target), value);
  const textRoot = frameDocument.body || frameDocument.documentElement;
  if (!textRoot) return;
  const showText = frameDocument.defaultView?.NodeFilter.SHOW_TEXT ?? 4;
  const walker = frameDocument.createTreeWalker(textRoot, showText);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue ?? '';
    if (replacements.some(([source]) => text.includes(source))) node.nodeValue = replace(text);
  }
  frameDocument.querySelectorAll<HTMLElement>('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      if (replacements.some(([source]) => attribute.value.includes(source))) element.setAttribute(attribute.name, replace(attribute.value));
    });
  });
}

function applyResidentIdentity(frameDocument: Document, pageId: string, resident: VecinoData | null, user: User | null) {
  if (!frameDocument) return;
  const personal = resident?.datosPersonales || {};
  const firstName = personal.nombre || resident?.nombre || user?.displayName?.trim().split(/\s+/)[0] || '';
  const storedLastName = personal.apellidos || resident?.apellidos || user?.displayName?.trim().split(/\s+/).slice(1).join(' ') || '';
  const lastName = displayResidentSurname(firstName, storedLastName, resident);
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || user?.email || '';
  if (!fullName) return;

  const role = resident?.rol?.toLowerCase();
  const adminAccess = hasAdministratorAccess(resident);
  const roleLabel = adminAccess ? 'Administración' : role === 'administrador' ? 'Vocal' : role === 'propietario' ? 'Propietario' : role === 'inquilino' ? 'Inquilino' : '';
  if (!adminAccess) {
    frameDocument.querySelectorAll<HTMLElement>('a[data-path^="admin"]').forEach((link) => { link.hidden = true; link.classList.add('hidden'); });
    [...frameDocument.querySelectorAll<HTMLElement>('span')]
      .find((element) => element.textContent?.trim().toLocaleLowerCase('es') === 'panel de administración')
      ?.parentElement?.classList.add('hidden');
  }
  frameDocument.querySelectorAll<HTMLImageElement>('img[alt="Profile"]').forEach((avatar) => {
    const identity = avatar.parentElement;
    const name = identity?.querySelector('div.flex.flex-col.text-left > span:first-child');
    const subtitle = identity?.querySelector('div.flex.flex-col.text-left > span:nth-child(2)');
    if (name) name.textContent = fullName;
    if (subtitle && roleLabel) subtitle.textContent = roleLabel;
    setResidentAvatar(avatar, fullName, residentPhotoReference(resident, user));
  });

  if (pageId === 'tablón') {
    // The dashboard's greeting portrait is a separate mock image from the
    // header avatar (it has no alt="Profile" marker), so bind it explicitly.
    const greetingAvatar = frameDocument.querySelector<HTMLImageElement>('img[data-alt^="Warm natural portrait of Elena Morales"]');
    if (greetingAvatar) {
      setResidentAvatar(greetingAvatar, fullName, residentPhotoReference(resident, user));
      greetingAvatar.alt = `Foto de perfil de ${fullName}`;
    }
    const greeting = [...frameDocument.querySelectorAll('span')].find((element) => element.textContent.trim() === '¡Hola, Elena Morales!');
    if (greeting) greeting.textContent = `¡Hola, ${fullName}!`;
    const dashboardQuota = estimatedMonthlyQuota(participationPercent(resident));
    const dashboardQuotaLabel = [...frameDocument.querySelectorAll<HTMLElement>('span')]
      .find((element) => element.textContent?.includes('Cuota ord.:'));
    if (dashboardQuotaLabel && dashboardQuota != null) {
      dashboardQuotaLabel.textContent = `Cuota ord.: ${formatEuro(dashboardQuota).replace(/\s/g, '')}/mes`;
    }
    if (resident) {
      const address = residentAddress(resident);
      const unitSummary = [...frameDocument.querySelectorAll<HTMLElement>('span.truncate')]
        .find((element) => /^Portal\s.+?\s•/.test(element.textContent?.trim() || ''));
      const leadingText = unitSummary?.firstChild;
      if (address && leadingText && leadingText.nodeType === frameDocument.defaultView?.Node.TEXT_NODE) {
        leadingText.textContent = `${address} • `;
      }
    }
  }

  if (pageId === 'perfil') {
    const heading = [...frameDocument.querySelectorAll('h1,h2,h3')].find((element) => element.textContent.trim() === 'Elena Morales Gómez');
    if (heading) heading.textContent = fullName;
    const roleSubtitle = [...frameDocument.querySelectorAll<HTMLElement>('p')]
      .find((element) => /^(?:Propietaria|Propietario|Inquilina|Inquilino|Administradora|Administrador)\s*(?:\/|de la Comunidad)/i.test(element.textContent?.trim() || ''));
    if (roleSubtitle) roleSubtitle.textContent = residentProfileRoleSubtitle(resident, user);
    const profileAvatar = frameDocument.getElementById('avatar-preview') as HTMLImageElement | null;
    const photo = residentPhotoReference(resident, user);
    if (profileAvatar) setResidentAvatar(profileAvatar, fullName, photo);
    const photoHint = [...frameDocument.querySelectorAll<HTMLElement>('span')]
      .find((element) => element.textContent?.includes('Recorte circular inteligente'));
    if (photoHint) photoHint.textContent = 'JPG, PNG o WebP de hasta 5 MB. La imagen se guarda en Supabase Storage.';
    applyProfileHousing(frameDocument, resident);
    const fields = {
      first_name: firstName,
      last_name: lastName,
      document_id: personal.dni || '',
      phone_number: personal.telefono || personal.movil || '',
      email_address: personal.email || resident?.email || user?.email || '',
    };
    Object.entries(fields).forEach(([id, value]) => {
      const input = frameDocument.getElementById(id) as HTMLInputElement | null;
      if (input && value) input.value = value;
    });
    const directoryPhoneConsent = frameDocument.getElementById('dir-consent') as HTMLInputElement | null;
    if (directoryPhoneConsent) directoryPhoneConsent.checked = personal.autorizaTelefonoDirectorio === true;
  }

  if (pageId === 'vecinos') {
    // The current user's directory card is rendered from Firestore below.
  }

  if (pageId === 'gastos') {
    applyQuarterlyFinancialReport(frameDocument, resident);
  }
}

function displayResidentSurname(firstName: string, surname: string, resident?: VecinoData | null) {
  if (surname.trim().toLocaleLowerCase('es') !== 'vecino') return surname;
  const residentData = resident as (VecinoData & { genero?: string; sexo?: string; gender?: string }) | null | undefined;
  const personalData = resident?.datosPersonales as (VecinoData['datosPersonales'] & { genero?: string; sexo?: string }) | undefined;
  const gender = [residentData?.genero, residentData?.sexo, residentData?.gender, personalData?.genero, personalData?.sexo]
    .find((value) => typeof value === 'string')?.trim().toLocaleLowerCase('es');
  if (gender && /^(mujer|femenino|femenina|female|f)$/i.test(gender)) return 'Vecina';
  if (gender && /^(hombre|masculino|male|m)$/i.test(gender)) return 'Vecino';

  const first = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().split(/\s+/)[0]?.toLocaleLowerCase('es') || '';
  const feminineNames = new Set(['alba', 'anna', 'angeles', 'armina', 'bea', 'beatriz', 'carmen', 'cristina', 'elena', 'estefania', 'fabiola', 'iris', 'ksenia', 'laura', 'lucia', 'lidia', 'maria', 'marisa', 'marta', 'maya', 'melisa', 'micaela', 'noelia', 'patricia', 'rebecca', 'rebeca', 'sandra', 'vanesa', 'vanessa', 'veronica', 'yvone']);
  const masculineNames = new Set(['alberto', 'alfredo', 'antonio', 'asier', 'carlos', 'daniel', 'david', 'felix', 'ivan', 'javier', 'jorge', 'juan', 'luis', 'marco', 'mario', 'miguel', 'nacho', 'pablo', 'pedro', 'raul', 'sergio', 'zhivko']);
  if (feminineNames.has(first) || first.endsWith('a')) return 'Vecina';
  if (masculineNames.has(first) || first.endsWith('o')) return 'Vecino';
  return surname;
}

function residentProfileRoleSubtitle(resident: VecinoData | null, user: User | null) {
  if (!resident) return '';
  const personal = resident.datosPersonales || {};
  const firstName = personal.nombre || resident.nombre || user?.displayName?.split(/\s+/)[0] || '';
  const surname = displayResidentSurname(firstName, personal.apellidos || resident.apellidos || '', resident);
  const genderData = personal as typeof personal & { genero?: string; sexo?: string };
  const gender = [genderData.genero, genderData.sexo, resident.genero, resident.sexo]
    .find((value) => typeof value === 'string')?.toLocaleLowerCase('es') || '';
  const feminine = surname.toLocaleLowerCase('es') === 'vecina' || /^(mujer|femenino|femenina|female|f)$/.test(gender);
  const role = String(resident.rol || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const cargo = String(resident.cargo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const base = role === 'inquilino' ? (feminine ? 'Inquilina' : 'Inquilino') : (feminine ? 'Propietaria' : 'Propietario');

  if (cargo.includes('administrador de fincas')) return feminine ? 'Administradora de Fincas' : 'Administrador de Fincas';
  if (/vicepresident/.test(cargo)) return `${base} / ${feminine ? 'Vicepresidenta' : 'Vicepresidente'} de la Comunidad`;
  if (/president/.test(cargo)) return `${base} / ${feminine ? 'Presidenta' : 'Presidente'} de la Comunidad`;
  if (/\bvocal\b/.test(cargo)) return `${base} / Vocal de la Comunidad`;
  if (role === 'administrador') return feminine ? 'Administradora' : 'Administrador';
  return base;
}

function residentName(resident: VecinoData) {
  const personal = resident.datosPersonales || {};
  const firstName = personal.nombre || resident.nombre || '';
  const surname = displayResidentSurname(firstName, personal.apellidos || resident.apellidos || '', resident);
  return [firstName, surname].filter(Boolean).join(' ').trim() || 'Vecino sin nombre';
}

function residentUnit(resident: VecinoData): { portal: string; floor: string; door: string; unit: string } {
  const personal = resident.datosPersonales || {};
  const isPropertyAdministrator = resident.rol?.toLocaleLowerCase('es') === 'administrador'
    && /administrador\s+de\s+fincas/i.test(resident.cargo || '');
  const canonicalHome = String(resident.idVivienda || resident.vivienda || '').trim();
  const canonicalMatch = canonicalHome.match(/portal\s*(\d+)[\s,·-]+(.+?)\s*([A-Z])\s*$/i);
  const rawPortal = String(canonicalMatch?.[1] || personal.portal || resident.portal || '').trim().replace(/^portal\s+/i, '');
  if (isPropertyAdministrator && /oficina/i.test(rawPortal)) {
    return { portal: 'Administración', floor: '', door: 'Despacho', unit: 'Despacho' };
  }
  if (resident.rol?.toLocaleLowerCase('es') === 'conserje' && /oficina/i.test(rawPortal)) {
    return { portal: 'Administración', floor: '', door: 'Conserjería', unit: 'Conserjería' };
  }
  const portal = rawPortal;
  const rawFloor = (canonicalMatch?.[2] || personal.piso || resident.piso || '').replace(/[º°]\s*$/, '').trim();
  const floor = /^(?:7|at(?:ico)?)$/i.test(rawFloor) ? 'Ático' : rawFloor;
  const door = canonicalMatch?.[3] || personal.letra || resident.letra || '';
  const floorLabel = /^\d+$/.test(floor) ? `${floor}º` : floor;
  return { portal, floor, door, unit: [floorLabel, door].filter(Boolean).join(' ') || 'Vivienda sin especificar' };
}

function residentPortalLabel(portal: string) {
  const normalized = portal.trim().replace(/^portal\s+/i, '');
  if (/^administraci[oó]n(?:\s*[-–—].*)?$/i.test(normalized)) return 'Administración';
  return /^\d+$/.test(normalized) ? `Portal ${normalized}` : normalized;
}

function isAdministrativePortal(portal: string) {
  return /^administraci[oó]n(?:\s*[-–—].*)?$/i.test(portal.trim().replace(/^portal\s+/i, ''));
}

function isBoardMember(cargo: string | undefined) {
  const normalized = String(cargo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  return /\b(?:presidente|presidenta|vicepresidente|vicepresidenta|vocal)\b/.test(normalized);
}

function isPropertyAdministrator(resident: VecinoData) {
  return resident.rol?.toLocaleLowerCase('es') === 'administrador'
    && /administrador\s+de\s+fincas/i.test(resident.cargo || '');
}

function residentAddress(resident: VecinoData): string {
  const { portal, floor, door } = residentUnit(resident);
  const floorLabel = /^\d+$/.test(floor) ? `${floor}º` : floor;
  return [residentPortalLabel(portal), [floorLabel, door].filter(Boolean).join(' ')].filter(Boolean).join(', ');
}

function formatParticipationCoefficient(value: number | string | undefined, estimated: boolean): string {
  if (value == null || !String(value).trim()) return 'No registrado';
  const raw = String(value).trim();
  if (!estimated) {
    const numeric = Number(raw.replace('%', '').replace(',', '.'));
    return Number.isFinite(numeric) ? `${numeric.toFixed(2).replace('.', ',')} %` : (raw.includes('%') ? raw : `${raw} %`);
  }
  const numeric = Number(raw.replace('%', '').replace(',', '.'));
  return Number.isFinite(numeric) ? `${numeric.toFixed(2).replace('.', ',')} %` : raw;
}

function displayPropertyNumbers(value: string | undefined, label: 'garaje' | 'trastero') {
  const raw = String(value || '').trim();
  if (!raw) return label === 'garaje' ? 'Sin plaza asignada' : 'Sin trastero asignado';
  const numbers = raw.match(/^\d+(?:\s*[,;y]\s*\d+)*$/i);
  if (!numbers) return raw;
  const ids = raw.split(/\s*[,;y]\s*/i).filter(Boolean);
  const numbered = ids.length > 1 ? `${ids.slice(0, -1).join(', ')} y ${ids.at(-1)}` : ids[0];
  return label === 'garaje' ? `Plaza${ids.length > 1 ? 's' : ''} nº ${numbered}` : `Nº ${numbered}`;
}

function residentAssetsSummary(resident: VecinoData) {
  const personal = resident.datosPersonales || {};
  return `${displayPropertyNumbers(resident.plazaGaraje ?? personal.plazaGaraje, 'garaje')} · Trastero ${displayPropertyNumbers(resident.trastero ?? personal.trastero, 'trastero')}`;
}

function setupResidentAdminEditor(
  frameDocument: Document,
  resident: VecinoData,
  onSaved: (resident: VecinoData) => void,
) {
  const container = frameDocument.getElementById('ficha-vecino-container');
  if (!container) return;
  frameDocument.getElementById('admin-resident-editor')?.remove();

  const personal = resident.datosPersonales || {};
  const form = frameDocument.createElement('form');
  form.id = 'admin-resident-editor';
  form.className = 'flex flex-col gap-space-sm rounded-xl border border-outline-variant bg-surface-container-low p-space-md';
  const heading = frameDocument.createElement('h3');
  heading.className = 'font-headline-sm text-headline-sm text-on-surface font-bold';
  heading.textContent = 'Editar ficha del vecino';
  const hint = frameDocument.createElement('p');
  hint.className = 'font-body-sm text-body-sm text-on-surface-variant';
  hint.textContent = 'Actualiza los datos personales, comunitarios y de la vivienda.';
  const grid = frameDocument.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-space-sm';

  const fields = [
    { name: 'nombre', label: 'Nombre', value: personal.nombre || resident.nombre || '', autocomplete: 'given-name' },
    { name: 'apellidos', label: 'Apellidos', value: personal.apellidos || resident.apellidos || '', autocomplete: 'family-name' },
    { name: 'dni', label: 'DNI / NIE', value: personal.dni || resident.dni || '' },
    { name: 'telefono', label: 'Teléfono', value: personal.telefono || personal.movil || resident.telefono || '', type: 'tel' },
    { name: 'emailContacto', label: 'Correo de contacto', value: personal.email || '', type: 'email' },
    { name: 'portal', label: 'Portal', value: personal.portal || resident.portal || '' },
    { name: 'piso', label: 'Planta', value: personal.piso || resident.piso || '' },
    { name: 'letra', label: 'Puerta', value: personal.letra || resident.letra || '' },
    { name: 'plazaGaraje', label: 'Nº de plaza(s) de garaje', value: resident.plazaGaraje ?? personal.plazaGaraje ?? '' },
    { name: 'trastero', label: 'Nº de trastero', value: resident.trastero ?? personal.trastero ?? '' },
    { name: 'coeficiente', label: 'Cuota de participación (%)', value: String(resident.coeficiente ?? personal.coeficiente ?? resident.coeficienteEstimado ?? personal.coeficienteEstimado ?? ''), type: 'text' },
    { name: 'tipo', label: 'Tipo de vecino', value: resident.tipo || '' },
    { name: 'cargo', label: 'Cargo comunitario', value: resident.cargo || '' },
    { name: 'rol', label: 'Rol de acceso', value: resident.rol || '' },
    { name: 'estado', label: 'Estado', value: resident.estado || '' },
    { name: 'matricula', label: 'Matrícula', value: resident.matricula || '' },
    { name: 'estadoCuotas', label: 'Estado de cuotas', value: resident.estadoCuotas || '' },
  ];

  for (const field of fields) {
    const label = frameDocument.createElement('label');
    label.className = 'flex min-w-0 flex-col gap-1 font-label-sm text-label-sm text-on-surface-variant';
    const labelText = frameDocument.createElement('span');
    labelText.textContent = field.label;
    const input = frameDocument.createElement('input');
    input.name = field.name;
    input.type = field.type || 'text';
    input.value = field.value;
    input.setAttribute('autocomplete', field.autocomplete || 'off');
    input.className = 'min-h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm py-space-xs font-body-sm text-body-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-secondary';
    label.append(labelText, input);
    grid.append(label);
  }

  if (resident.email || personal.email) {
    const emailNote = frameDocument.createElement('p');
    emailNote.className = 'font-body-sm text-body-sm text-on-surface-variant';
    emailNote.textContent = `Correo de acceso: ${personal.email || resident.email} (se administra desde la cuenta de Firebase).`;
    form.append(heading, hint, grid, emailNote);
  } else {
    form.append(heading, hint, grid);
  }

  const feedback = frameDocument.createElement('p');
  feedback.className = 'font-body-sm text-body-sm text-error';
  feedback.setAttribute('role', 'alert');
  feedback.hidden = true;
  const actions = frameDocument.createElement('div');
  actions.className = 'flex justify-end';
  const save = frameDocument.createElement('button');
  save.type = 'submit';
  save.className = 'rounded-lg bg-primary px-space-md py-space-sm font-label-md text-label-md font-bold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-60';
  save.textContent = 'Guardar datos del vecino';
  actions.append(save);
  form.append(feedback, actions);
  container.append(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!resident.id) {
      feedback.textContent = 'No se ha encontrado el identificador de esta ficha.';
      feedback.hidden = false;
      return;
    }
    const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() || '';
    const nombre = value('nombre');
    const apellidos = value('apellidos');
    if (!nombre || !apellidos) {
      feedback.textContent = 'El nombre y los apellidos son obligatorios.';
      feedback.hidden = false;
      return;
    }
    save.disabled = true;
    feedback.hidden = true;
    try {
      const portal = value('portal');
      const piso = value('piso');
      const letra = value('letra').toUpperCase();
      const idVivienda = /^\d+$/.test(portal) && piso && letra
        ? `Portal ${portal} ${/^at/i.test(piso) ? 'At' : piso}${letra}`
        : [portal, piso, letra].filter(Boolean).join(' ');
      const patch = {
        nombre, apellidos,
        dni: value('dni'), telefono: value('telefono'), matricula: value('matricula'), estadoCuotas: value('estadoCuotas'),
        portal, piso, letra, idVivienda, vivienda: idVivienda,
        plazaGaraje: value('plazaGaraje'), trastero: value('trastero'),
        coeficiente: value('coeficiente'), tipo: value('tipo'), cargo: value('cargo'), rol: value('rol'), estado: value('estado'),
        'datosPersonales.nombre': nombre,
        'datosPersonales.apellidos': apellidos,
        'datosPersonales.dni': value('dni'),
        'datosPersonales.telefono': value('telefono'),
        'datosPersonales.email': value('emailContacto'),
        'datosPersonales.portal': portal,
        'datosPersonales.piso': piso,
        'datosPersonales.letra': letra,
        'datosPersonales.plazaGaraje': value('plazaGaraje'),
        'datosPersonales.trastero': value('trastero'),
        'datosPersonales.coeficiente': value('coeficiente'),
      };
      const profileRef = doc(db, 'vecinos', resident.id);
      const profileSnapshot = await getDoc(profileRef);
      if (!profileSnapshot.exists()) throw new Error('La ficha ya no está disponible.');
      const original = { id: resident.id, ...profileSnapshot.data() } as VecinoData;
      const saved = { ...resident, ...patch, datosPersonales: { ...personal, nombre, apellidos, dni: value('dni'), telefono: value('telefono'), email: value('emailContacto'), portal, piso, letra, plazaGaraje: value('plazaGaraje'), trastero: value('trastero'), coeficiente: value('coeficiente') } } as VecinoData;
      const batch = writeBatch(db);
      batch.update(profileRef, patch);
      const accessRef = original.uid ? doc(db, 'usuariosAcceso', original.uid) : null;
      const accessSnapshot = accessRef ? await getDoc(accessRef) : null;
      if (accessRef && accessSnapshot?.exists()) batch.set(accessRef, {
        uid: original.uid,
        idFicha: resident.id,
        idComunidad: original.idComunidad || null,
        activo: ['activo', 'validado', 'confirmado', 'aprobado'].includes(String(patch.estado || '').toLowerCase()),
        administrador: String(patch.rol || '').toLowerCase() === 'administrador' && !/vocal/i.test(String(patch.cargo || '')),
      }, { merge: true });
      const publicRef = doc(db, 'vecinosPublicos', resident.id);
      const publicSnapshot = await getDoc(publicRef);
      if (publicSnapshot.exists()) {
        const nextPublic = toPublicResident(saved);
        nextPublic.chatEnabled = Boolean(publicSnapshot.get('chatEnabled') && nextPublic.activo);
        batch.set(publicRef, { ...nextPublic, actualizadoEn: serverTimestamp() }, { merge: true });
      }
      await batch.commit();
      toast.success('Datos del vecino actualizados.');
      onSaved(saved);
    } catch (error) {
      console.error('No se pudo actualizar la ficha del vecino', error);
      feedback.textContent = 'No se pudieron guardar los cambios. Comprueba los permisos de Firebase e inténtalo de nuevo.';
      feedback.hidden = false;
    } finally {
      save.disabled = false;
    }
  });
}

function applyProfileHousing(frameDocument: Document, resident: VecinoData | null) {
  const heading = [...frameDocument.querySelectorAll<HTMLElement>('h3')]
    .find((element) => element.textContent?.trim() === 'Inmueble Asignado');
  const card = heading?.closest<HTMLElement>('.bg-surface-container-lowest');
  if (!card) return;

  const personal = resident?.datosPersonales || {};
  const { portal, floor, door } = resident ? residentUnit(resident) : { portal: '', floor: '', door: '' };
  const floorLabel = /^\d+$/.test(floor) ? `${floor}ª` : floor;
  const mainUnit = card.querySelector<HTMLElement>('[data-profile-main-unit]')
    || [...card.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Portal 2 · 3º B');
  if (mainUnit) {
    mainUnit.dataset.profileMainUnit = 'true';
    mainUnit.textContent = (resident ? residentAddress(resident) : '') || 'Vivienda no registrada';
  }

  const unitValues = {
    portal: portal || 'No registrado',
    floor: floorLabel || 'No registrada',
    door: door || 'No registrada',
  };
  const unitGrid = card.querySelector<HTMLElement>('.grid.grid-cols-3');
  const valueSelectors: Array<[keyof typeof unitValues, string, string]> = [
    ['portal', 'Portal', '2'],
    ['floor', 'Planta', '3ª'],
    ['door', 'Puerta', 'B'],
  ];
  for (const [key, , initialValue] of valueSelectors) {
    const value = unitGrid?.querySelector<HTMLElement>(`[data-profile-unit-${key}]`)
      || [...(unitGrid?.querySelectorAll<HTMLElement>('span') || [])]
        .find((element) => element.textContent?.trim() === initialValue);
    if (value) {
      value.dataset[`profileUnit${key[0].toUpperCase()}${key.slice(1)}`] = 'true';
      value.textContent = unitValues[key];
    }
  }

  const garageLabel = [...card.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Plaza de Garaje');
  const garageValue = garageLabel?.parentElement?.querySelector<HTMLElement>('span:nth-of-type(2)');
  if (garageValue) {
    garageValue.dataset.profileGarage = 'true';
    garageValue.textContent = displayPropertyNumbers(resident?.plazaGaraje ?? personal.plazaGaraje, 'garaje');
  }
  const storageLabel = [...card.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Trastero');
  const storageValue = storageLabel?.parentElement?.querySelector<HTMLElement>('span:nth-of-type(2)');
  if (storageValue) {
    storageValue.dataset.profileStorage = 'true';
    storageValue.textContent = displayPropertyNumbers(resident?.trastero ?? personal.trastero, 'trastero');
  }

  const coefficientLabel = [...card.querySelectorAll<HTMLElement>('span')]
    .find((element) => element.textContent?.trim() === 'Coeficiente de participación:');
  const coefficientSection = coefficientLabel?.parentElement?.parentElement;
  const coefficientValue = coefficientSection?.querySelector<HTMLElement>('[data-profile-coefficient]')
    || [...(coefficientSection?.querySelectorAll<HTMLElement>('span') || [])]
      .find((element) => element !== coefficientLabel && element.textContent?.trim() === '2.850%');
  const coefficient = resident?.coeficiente ?? personal.coeficiente ?? resident?.coeficienteEstimado ?? personal.coeficienteEstimado;
  const estimatedCoefficient = resident?.coeficiente == null && personal.coeficiente == null
    && (resident?.coeficienteEstimado != null || personal.coeficienteEstimado != null);
  if (coefficientLabel && estimatedCoefficient) coefficientLabel.textContent = 'Cuota estimada de participación:';
  if (coefficientValue) {
    coefficientValue.dataset.profileCoefficient = 'true';
    coefficientValue.textContent = formatParticipationCoefficient(coefficient, estimatedCoefficient);
  }
  if (coefficientSection) coefficientSection.classList.remove('hidden');
  const coefficientNote = coefficientSection?.querySelector<HTMLElement>('span.font-body-sm');
  if (coefficientNote && estimatedCoefficient) coefficientNote.textContent = 'Cálculo proporcional aproximado por superficies útiles.';
  const progress = coefficientSection?.querySelector<HTMLElement>('.bg-secondary.h-2');
  if (progress) {
    const numeric = Number(String(coefficient ?? '').replace('%', '').replace(',', '.'));
    progress.style.width = Number.isFinite(numeric) ? `${Math.max(0, Math.min(numeric, 100))}%` : '0%';
  }

  const ancillary = [
    { label: 'Plaza de Garaje', value: resident?.plazaGaraje ?? personal.plazaGaraje, initial: 'Plaza nº 14 (Sótano -1)' },
    { label: 'Trastero', value: resident?.trastero ?? personal.trastero, initial: 'Espacio T-08 (Planta Cubierta)' },
  ];
  for (const item of ancillary) {
    const label = [...card.querySelectorAll<HTMLElement>('span')]
      .find((element) => element.textContent?.trim() === item.label);
    const row = label?.closest<HTMLElement>('.flex.items-center.justify-between.p-space-sm');
    const value = row?.querySelector<HTMLElement>('[data-profile-ancillary-value]')
      || [...(row?.querySelectorAll<HTMLElement>('span') || [])]
        .find((element) => element.textContent?.trim() === item.initial);
    if (value) {
      value.dataset.profileAncillaryValue = 'true';
      value.textContent = typeof item.value === 'string' && item.value.trim() ? item.value.trim() : 'No registrado';
    }
    if (row) row.classList.remove('hidden');
  }
}

type IncidenceLoadState = 'loading' | 'ready' | 'error';

function applyDashboardIncidencePresentation(
  frameDocument: Document,
  incidents: IncidenciaData[],
  currentUid?: string,
  loadState: IncidenceLoadState = 'ready',
) {
  const metrics = contarIncidencias(incidents, currentUid);
  const destinations: Array<[string, string]> = [
    ['Próximas reservas', 'dashboard-reservas'],
    ['Votaciones abiertas', 'dashboard-votaciones'],
    ['Documentos recientes', 'dashboard-documentos'],
  ];
  for (const [labelText, destination] of destinations) {
    const label = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === labelText);
    const card = label?.closest<HTMLElement>('.bg-surface-container-lowest');
    if (!card) continue;
    card.dataset.dashboardDestination = destination;
    card.setAttribute('role', 'link');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Abrir sección ${labelText.toLocaleLowerCase('es')}`);
    card.classList.add('cursor-pointer');
  }

  const label = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Incidencias activas');
  const card = label?.closest<HTMLElement>('.bg-surface-container-lowest');
  if (card) {
    card.dataset.incidenceSummaryCard = 'true';
    card.setAttribute('role', 'link');
    card.tabIndex = 0;
    card.setAttribute('aria-label', 'Abrir incidencias de la comunidad');
    card.classList.add('cursor-pointer');
    const count = card.querySelector<HTMLElement>('.font-headline-xl');
    if (count) count.textContent = loadState === 'ready' ? String(metrics.activas) : '—';
    const status = [...card.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'en curso');
    if (status) status.textContent = 'activas';
    const detail = card.querySelector('p');
    if (detail) detail.textContent = loadState === 'ready'
      ? `${metrics.activasPropias} reportadas por ti • ${Math.max(metrics.activas - metrics.activasPropias, 0)} por otros vecinos`
      : loadState === 'loading' ? 'Cargando registros de Firebase…' : 'No se pudieron cargar las incidencias';
  }

  const chartTitle = frameDocument.querySelector<HTMLElement>('[data-dashboard-incidences-heading]')
    || [...frameDocument.querySelectorAll<HTMLElement>('h2')].find((element) => /^(Estado Mensual|Estado actual) de Incidencias$/.test(element.textContent?.trim() || ''));
  if (chartTitle) {
    chartTitle.dataset.dashboardIncidencesHeading = 'true';
    chartTitle.textContent = 'Estado actual de Incidencias';
  }
  chartTitle?.parentElement?.nextElementSibling?.classList.add('hidden');
  const chart = frameDocument.querySelector<HTMLElement>('[data-dashboard-incidences-chart]')
    || [...frameDocument.querySelectorAll<HTMLElement>('div')].find((element) => element.classList.contains('h-48') && element.classList.contains('items-end'));
  if (chart) chart.dataset.dashboardIncidencesChart = 'true';
  const rate = frameDocument.querySelector<HTMLElement>('[data-dashboard-incidences-rate]')
    || [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => /^\d+%$/.test(element.textContent?.trim() || ''));
  if (rate) rate.dataset.dashboardIncidencesRate = 'true';
  const resolutionTitle = frameDocument.querySelector<HTMLElement>('[data-dashboard-incidences-title]')
    || [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => ['Resolución media', 'Resueltas'].includes(element.textContent?.trim() || ''));
  if (resolutionTitle) {
    resolutionTitle.dataset.dashboardIncidencesTitle = 'true';
    resolutionTitle.textContent = 'Resueltas';
  }
  const resolutionCopy = resolutionTitle?.parentElement?.querySelector('p');
  if (loadState !== 'ready') {
    if (chart) {
      chart.className = 'w-full flex items-center justify-center py-space-md';
      chart.textContent = loadState === 'loading' ? 'Cargando incidencias de la comunidad…' : 'No se pudieron cargar las incidencias';
    }
    if (rate) rate.textContent = '—';
    const ring = rate?.closest('.relative')?.querySelector<SVGPathElement>('path.text-secondary');
    if (ring) ring.setAttribute('stroke-dasharray', '0, 100');
    if (resolutionCopy) resolutionCopy.textContent = loadState === 'loading' ? 'Cargando registros…' : 'Datos no disponibles';
    return;
  }
  if (chart) {
    const rows: Array<[string, number, string]> = [
      ['Pendientes', metrics.pendientes, 'bg-urgent-coral'],
      ['En reparación', metrics.enProgreso, 'bg-badge-amber-text'],
      ['Resueltas', metrics.resueltas, 'bg-secondary'],
      ['Descartadas', metrics.descartadas, 'bg-outline'],
    ];
    const max = Math.max(...rows.map(([, value]) => value), 1);
    chart.className = 'w-full flex flex-col justify-center gap-space-sm py-space-md';
    chart.replaceChildren(...rows.map(([captionText, value, color]) => {
      const row = frameDocument.createElement('div'); row.className = 'grid grid-cols-[112px_1fr_32px] items-center gap-space-sm';
      const caption = frameDocument.createElement('span'); caption.className = 'font-label-sm text-label-sm text-on-surface-variant'; caption.textContent = captionText;
      const track = frameDocument.createElement('div'); track.className = 'h-3 rounded-full bg-surface-container overflow-hidden';
      const fill = frameDocument.createElement('div'); fill.className = `h-full rounded-full ${color}`; fill.style.width = `${Math.round(value / max * 100)}%`; track.append(fill);
      const number = frameDocument.createElement('span'); number.className = 'font-label-md text-label-md text-on-surface font-bold text-right'; number.textContent = String(value);
      row.append(caption, track, number); return row;
    }));
  }
  const legend = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => element.textContent?.trim() === 'Recibidas (2)')?.parentElement?.parentElement;
  legend?.classList.add('hidden');
  const resolutionRate = incidents.length ? Math.round(metrics.resueltas / incidents.length * 100) : 0;
  if (rate) rate.textContent = `${resolutionRate}%`;
  const ring = rate?.closest('.relative')?.querySelector<SVGPathElement>('path.text-secondary');
  if (ring) ring.setAttribute('stroke-dasharray', `${resolutionRate}, 100`);
  if (resolutionCopy) resolutionCopy.textContent = `${metrics.resueltas} resueltas de ${metrics.total} registradas`;
}

function applyIncidenceSummary(frameDocument: Document, incidents: IncidenciaData[], loadState: IncidenceLoadState = 'ready', currentUid?: string) {
  const metrics = contarIncidencias(incidents, currentUid);
  const cards: Array<[string, number, string?]> = [
    ['Total Registradas', metrics.total, 'Desde el inicio'],
    ['En Reparación', metrics.activas, 'Pendientes y en reparación'],
    ['Alta Prioridad', metrics.prioridadAlta, 'Importantes o urgentes'],
  ];

  for (const [title, count, helper] of cards) {
    const label = [...frameDocument.querySelectorAll<HTMLElement>('span')]
      .find((element) => element.textContent?.trim() === title);
    const card = label?.closest<HTMLElement>('.bg-surface-container-lowest');
    const value = card?.querySelector<HTMLElement>('.font-headline-lg');
    if (value) value.textContent = loadState === 'ready' ? String(count) : '—';
    if (helper && card && loadState === 'ready') {
      const helperLabel = [...card.querySelectorAll<HTMLElement>('span')]
        .find((element) => element !== label && element.classList.contains('font-label-sm'));
      if (helperLabel) helperLabel.textContent = helper;
    }
  }

  const closedLabel = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => element.textContent?.trim() === 'Cerradas con Éxito');
  const closedCard = closedLabel?.closest<HTMLElement>('.bg-surface-container-lowest');
  if (closedCard) {
    const cardGrid = closedCard.parentElement;
    if (cardGrid) cardGrid.className = cardGrid.className.replace('lg:grid-cols-4', 'lg:grid-cols-3');
    closedCard.remove();
  }

  const activeSummary = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => element.textContent?.includes('incidencias activas'));
  const totalActive = activeSummary?.querySelectorAll<HTMLElement>('span')[1];
  if (totalActive) totalActive.textContent = loadState === 'ready' ? String(metrics.activas) : '—';

  const filterCounts: Array<[string, number]> = [
    ['Todas', metrics.total],
    ['Pendientes / Recibidas', metrics.pendientes],
    ['En Proceso', metrics.enProgreso],
    ['Resueltas', metrics.resueltas],
  ];
  for (const [labelText, count] of filterCounts) {
    const button = [...frameDocument.querySelectorAll<HTMLButtonElement>('button')]
      .find((element) => [...element.querySelectorAll<HTMLElement>('span')]
        .some((span) => span.textContent?.trim() === labelText));
    const countLabel = [...(button?.querySelectorAll<HTMLElement>('span') || [])]
      .find((span) => /^(\d+|—)$/.test(span.textContent?.trim() || ''));
    if (countLabel) countLabel.textContent = loadState === 'ready' ? String(count) : '—';
  }
  const ownIncidentsButton = [...frameDocument.querySelectorAll<HTMLButtonElement>('button')]
    .find((button) => [...button.querySelectorAll<HTMLElement>('span')]
      .some((span) => span.textContent?.trim().startsWith('Solo mis incidencias')));
  const ownIncidentsLabel = [...(ownIncidentsButton?.querySelectorAll<HTMLElement>('span') || [])]
    .find((span) => span.textContent?.trim().startsWith('Solo mis incidencias'));
  if (ownIncidentsLabel && loadState === 'ready') ownIncidentsLabel.textContent = `Solo mis incidencias (${metrics.propiasTotal})`;
}

function getIncidenceCardGrid(frameDocument: Document) {
  return [...frameDocument.querySelectorAll<HTMLElement>('div')]
    .find((element) => element.classList.contains('xl:grid-cols-2')
      && element.classList.contains('gap-space-lg'));
}

function incidenceTimestamp(value: IncidenciaData['fechaCreacion'] | unknown) {
  if (!value) return undefined;
  let date: Date;
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    date = value.toDate();
  } else {
    date = value instanceof Date ? value : new Date(String(value));
  }
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function renderIncidenceCards(
  frameDocument: Document,
  incidents: IncidenciaData[],
  currentUid?: string,
  loadState: IncidenceLoadState = 'ready',
) {
  const grid = getIncidenceCardGrid(frameDocument);
  if (!grid) return;
  grid.replaceChildren();

  if (loadState !== 'ready' || incidents.length === 0) {
    const message = frameDocument.createElement('div');
    message.className = 'md:col-span-2 rounded-xl bg-surface-container-low p-space-lg text-center text-on-surface-variant';
    message.setAttribute('role', 'status');
    message.textContent = loadState === 'loading'
      ? 'Cargando incidencias de Firebase…'
      : loadState === 'error'
        ? 'No se pudieron cargar las incidencias de Firebase. Comprueba la conexión y vuelve a intentarlo.'
        : 'No hay incidencias registradas en esta comunidad.';
    grid.append(message);
    return;
  }

  const orderedIncidents = [...incidents].sort((left, right) =>
    (incidenceTimestamp(right.fechaCreacion)?.getTime() || 0) - (incidenceTimestamp(left.fechaCreacion)?.getTime() || 0));

  for (const incident of orderedIncidents) {
    const state = normalizarEstadoIncidencia(incident.estado);
    const priority = normalizarPrioridadIncidencia(incident.prioridad);
    const ownerUid = incident.idVecino || incident.creador || '';
    const createdAt = incidenceTimestamp(incident.fechaCreacion);
    const card = frameDocument.createElement('article');
    card.className = 'bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between hover:shadow-md transition-all group';
    card.dataset.incidentStatus = state;
    card.dataset.incidentPriority = priority;
    card.dataset.incidentOwner = ownerUid;
    card.dataset.incidentCreated = String(createdAt?.getTime() || 0);
    card.dataset.incidentUpdated = String(incidenceTimestamp(incident.fechaActualizacion || incident.updatedAt)?.getTime() || createdAt?.getTime() || 0);

    const content = frameDocument.createElement('div');
    content.className = 'flex flex-col gap-space-md';
    const badges = frameDocument.createElement('div');
    badges.className = 'flex flex-wrap items-center gap-space-xs';
    const priorityBadge = frameDocument.createElement('span');
    priorityBadge.className = `px-space-sm py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold ${priority === 'alta' ? 'bg-badge-coral-bg text-badge-coral-text' : priority === 'baja' ? 'bg-badge-navy-bg text-badge-navy-text' : 'bg-badge-amber-bg text-badge-amber-text'}`;
    priorityBadge.textContent = `Prioridad ${priority === 'alta' ? 'Alta' : priority === 'baja' ? 'Baja' : 'Media'}`;
    const stateBadge = frameDocument.createElement('span');
    stateBadge.className = `px-space-sm py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold ${state === 'resuelta' ? 'bg-badge-emerald-bg text-badge-emerald-text' : state === 'descartada' ? 'bg-surface-container-low text-on-surface-variant' : state === 'en_progreso' ? 'bg-badge-amber-bg text-badge-amber-text' : 'bg-surface-container-low text-on-surface-variant'}`;
    stateBadge.textContent = etiquetaEstadoIncidencia(incident.estado);
    const ticket = frameDocument.createElement('span');
    ticket.className = 'px-space-sm py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm';
    ticket.textContent = `#${incident.id}`;
    badges.append(priorityBadge, stateBadge, ticket);

    const dateLabel = frameDocument.createElement('span');
    dateLabel.className = 'font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap';
    dateLabel.textContent = createdAt ? createdAt.toLocaleDateString('es-ES') : 'Fecha desconocida';
    const top = frameDocument.createElement('div');
    top.className = 'flex items-start justify-between gap-space-sm';
    top.append(badges, dateLabel);

    const details = frameDocument.createElement('div');
    details.className = 'flex flex-col gap-space-xs';
    const title = frameDocument.createElement('h2');
    title.className = 'font-headline-md text-headline-md text-on-surface font-bold group-hover:text-primary transition-colors';
    title.textContent = incident.titulo || 'Incidencia sin título';
    const location = frameDocument.createElement('p');
    location.className = 'font-body-sm text-body-sm font-bold text-on-surface';
    location.textContent = `Ubicación: ${incident.ubicacion || 'No especificada'}`;
    const description = frameDocument.createElement('p');
    description.className = 'font-body-md text-body-md text-on-surface-variant pt-space-xs';
    description.textContent = incident.descripcion || 'Sin descripción';
    details.append(title, location, description);
    content.append(top, details);

    const cardImageRefs = collectIncidentImageRefs(incident);
    if (cardImageRefs.length) {
      renderIncidentImages(frameDocument, content, cardImageRefs, null, 'h-28 pt-space-xs', `Imagen de la incidencia ${incident.titulo || ''}`);
    }

    const footer = frameDocument.createElement('div');
    footer.className = 'flex items-center justify-between pt-space-md mt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg py-space-sm rounded-b-xl';
    const reporter = frameDocument.createElement('span');
    reporter.className = 'font-label-sm text-label-sm text-on-surface';
    reporter.textContent = ownerUid && ownerUid === currentUid ? 'Tu reporte' : incident.nombreCreador || 'Vecino de la comunidad';
    const viewButton = frameDocument.createElement('button');
    viewButton.className = 'inline-flex items-center gap-space-xs text-primary font-label-md text-label-md font-bold hover:underline';
    viewButton.type = 'button';
    viewButton.dataset.incidentId = incident.id;
    viewButton.innerHTML = '<span>Ver seguimiento</span><span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
    footer.append(reporter, viewButton);
    card.append(content, footer);
    grid.append(card);
  }
}

function setupIncidenceFilters(frameDocument: Document, currentUid?: string) {
  const pendingButton = [...frameDocument.querySelectorAll<HTMLButtonElement>('button')]
    .find((button) => [...button.querySelectorAll('span')]
      .some((span) => span.textContent?.trim() === 'Pendientes / Recibidas'));
  const filterPanel = pendingButton?.closest<HTMLElement>('div.bg-surface-container-lowest.rounded-xl.shadow-sm');
  const cardGrid = getIncidenceCardGrid(frameDocument);
  if (!filterPanel || !cardGrid) return () => undefined;

  // The maqueta lives in an iframe, so its elements belong to another window
  // and fail `instanceof HTMLElement` checks against the parent window.
  const cards = [...cardGrid.children].filter((element): element is HTMLElement => element.nodeType === 1) as HTMLElement[];
  const statusButtons = [...filterPanel.querySelectorAll<HTMLButtonElement>('button')]
    .filter((button) => [...button.querySelectorAll('span')]
      .some((span) => ['Todas', 'Pendientes / Recibidas', 'En Proceso', 'Resueltas'].includes(span.textContent?.trim() || '')));
  const scopeButtons = [...filterPanel.querySelectorAll<HTMLButtonElement>('button')]
    .filter((button) => [...button.querySelectorAll('span')]
      .some((span) => /^(Toda la comunidad|Solo mis incidencias)/.test(span.textContent?.trim() || '')));
  const searchInput = filterPanel.querySelector<HTMLInputElement>('input[placeholder*="Buscar"]');
  const selects = [...filterPanel.querySelectorAll<HTMLSelectElement>('select')];
  const prioritySelect = selects[0];
  const sortSelect = selects[1];
  const activeStatuses = new Set<string>();
  let scopeFilter: 'community' | 'mine' = 'community';

  const cardStatus = (card: HTMLElement) => {
    if (card.dataset.incidentStatus) {
      return ({ pendiente: 'Pendientes / Recibidas', en_progreso: 'En Proceso', resuelta: 'Resueltas', descartada: 'Descartadas' } as Record<string, string>)[card.dataset.incidentStatus] || 'Pendientes / Recibidas';
    }
    const text = (card.innerText || '').toLocaleLowerCase('es');
    if (/\bresuelt[ao]s?\b/.test(text)) return 'Resueltas';
    if (/\ben proceso\b|\ben reparaci[oó]n\b/.test(text)) return 'En Proceso';
    if (/\bpendiente\b|\brecibida\b|\bevaluaci[oó]n\b/.test(text)) return 'Pendientes / Recibidas';
    return 'Pendientes / Recibidas';
  };
  const cardPriority = (card: HTMLElement) => {
    if (card.dataset.incidentPriority) return ({ alta: 'high', media: 'medium', baja: 'low' } as Record<string, string>)[card.dataset.incidentPriority] || '';
    const text = (card.innerText || '').toLocaleLowerCase('es');
    if (text.includes('prioridad alta')) return 'high';
    if (text.includes('prioridad media')) return 'medium';
    if (text.includes('prioridad baja')) return 'low';
    return '';
  };
  const render = () => {
    const search = searchInput?.value.trim().toLocaleLowerCase('es') || '';
    const priority = prioritySelect?.value || '';
    const visibleCards = cards.filter((card) => {
      const text = (card.innerText || '').toLocaleLowerCase('es');
      const isMine = currentUid ? card.dataset.incidentOwner === currentUid : /\btu reporte\b/.test(text);
      const matchesStatus = activeStatuses.size === 0 || activeStatuses.has(cardStatus(card));
      return matchesStatus
        && (scopeFilter === 'community' || isMine)
        && (!priority || cardPriority(card) === priority)
        && (!search || text.includes(search));
    });

    if (sortSelect?.value === 'urgency') {
      const rank = (card: HTMLElement) => ({ high: 0, medium: 1, low: 2 }[cardPriority(card) as 'high' | 'medium' | 'low'] ?? 3);
      visibleCards.sort((left, right) => rank(left) - rank(right));
    } else if (sortSelect?.value === 'updated') {
      visibleCards.sort((left, right) => Number(right.dataset.incidentUpdated || 0) - Number(left.dataset.incidentUpdated || 0));
    } else {
      visibleCards.sort((left, right) => Number(right.dataset.incidentCreated || 0) - Number(left.dataset.incidentCreated || 0));
    }
    visibleCards.forEach((card) => cardGrid.append(card));
    cards.forEach((card) => card.classList.toggle('hidden', !visibleCards.includes(card)));

    for (const button of statusButtons) {
      const label = [...button.querySelectorAll('span')].find((span) => ['Todas', 'Pendientes / Recibidas', 'En Proceso', 'Resueltas'].includes(span.textContent?.trim() || ''))?.textContent?.trim();
      const selected = label === 'Todas' ? activeStatuses.size === 0 : activeStatuses.has(label || '');
      button.classList.toggle('bg-primary', selected);
      button.classList.toggle('text-on-primary', selected);
      button.classList.toggle('shadow-sm', selected);
      button.classList.toggle('bg-surface-container-low', !selected);
      button.classList.toggle('text-on-surface-variant', !selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    for (const button of scopeButtons) {
      const isMine = [...button.querySelectorAll('span')].some((span) => span.textContent?.trim().startsWith('Solo mis incidencias'));
      const selected = (scopeFilter === 'mine') === isMine;
      button.classList.toggle('bg-surface-container-lowest', selected);
      button.classList.toggle('shadow-sm', selected);
      button.classList.toggle('font-bold', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    const summary = [...frameDocument.querySelectorAll<HTMLElement>('span')]
      .find((element) => element.textContent?.trim().startsWith('Mostrando'));
    const summaryCounts = summary?.querySelectorAll<HTMLElement>('span');
    if (summaryCounts?.length === 2) {
      summaryCounts[0].textContent = String(visibleCards.length);
      summaryCounts[1].textContent = String(cards.length);
      if (summary?.lastChild) summary.lastChild.textContent = ' incidencias';
    }
    summary?.parentElement?.querySelector<HTMLElement>('div.flex.items-center.gap-space-xs')?.classList.add('hidden');
  };

  const onClick = (event: MouseEvent) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('button');
    if (!button || !filterPanel.contains(button)) return;
    const status = [...button.querySelectorAll('span')].map((span) => span.textContent?.trim() || '')
      .find((label) => ['Todas', 'Pendientes / Recibidas', 'En Proceso', 'Resueltas'].includes(label));
    if (status) {
      event.preventDefault();
      if (status === 'Todas') {
        activeStatuses.clear();
      } else {
        if (activeStatuses.has(status)) activeStatuses.delete(status);
        else activeStatuses.add(status);
      }
      render();
      return;
    }
    const scope = [...button.querySelectorAll('span')].map((span) => span.textContent?.trim() || '')
      .find((label) => /^(Toda la comunidad|Solo mis incidencias)/.test(label));
    if (scope) {
      event.preventDefault();
      scopeFilter = scope.startsWith('Solo mis incidencias') ? 'mine' : 'community';
      render();
    }
  };
  const onInput = () => render();
  const onChange = () => render();
  frameDocument.addEventListener('click', onClick, true);
  searchInput?.addEventListener('input', onInput);
  prioritySelect?.addEventListener('change', onChange);
  sortSelect?.addEventListener('change', onChange);
  render();
  return () => {
    frameDocument.removeEventListener('click', onClick, true);
    searchInput?.removeEventListener('input', onInput);
    prioritySelect?.removeEventListener('change', onChange);
    sortSelect?.removeEventListener('change', onChange);
  };
}

function setupIncidentImagePicker(frameDocument: Document, onFilesSelected: (files: File[]) => void) {
  const dropZone = frameDocument.getElementById('drop-zone');
  if (!dropZone) return () => undefined;

  let input = frameDocument.getElementById('incident-image-input') as HTMLInputElement | null;
  if (!input) {
    input = frameDocument.createElement('input');
    input.id = 'incident-image-input';
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg,.heic,image/png,image/jpeg,image/heic';
    input.multiple = true;
    input.hidden = true;
    dropZone.parentElement?.append(input);
  }

  let feedback = frameDocument.getElementById('incident-image-feedback');
  if (!feedback) {
    feedback = frameDocument.createElement('p');
    feedback.id = 'incident-image-feedback';
    feedback.className = 'mt-2 text-sm text-on-surface-variant';
    feedback.setAttribute('aria-live', 'polite');
    dropZone.insertAdjacentElement('afterend', feedback);
  }

  dropZone.setAttribute('role', 'button');
  dropZone.setAttribute('tabindex', '0');
  dropZone.setAttribute('aria-label', 'Añadir hasta 3 imágenes PNG, JPG o HEIC de máximo 10 MB cada una');

  const showFiles = (files: File[]) => {
    const unsupported = files.find((file) => !/\.(png|jpe?g|heic)$/i.test(file.name));
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (files.length > 3) feedback!.textContent = 'Puedes seleccionar un máximo de 3 imágenes.';
    else if (unsupported) feedback!.textContent = `${unsupported.name} no es PNG, JPG o HEIC.`;
    else if (oversized) feedback!.textContent = `${oversized.name} supera el límite de 10 MB.`;
    else {
      onFilesSelected(files);
      feedback!.textContent = files.length ? `Seleccionadas: ${files.map((file) => file.name).join(', ')}` : '';
      return;
    }
    onFilesSelected([]);
    input!.value = '';
  };

  const openPicker = (event: Event) => {
    event.preventDefault();
    input!.click();
  };
  const onKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') openPicker(event);
  };
  const onChange = () => showFiles(Array.from(input!.files || []));
  const onDragOver = (event: Event) => {
    event.preventDefault();
    dropZone.classList.add('ring-2', 'ring-primary');
  };
  const onDragLeave = () => dropZone.classList.remove('ring-2', 'ring-primary');
  const onDrop = (event: Event) => {
    event.preventDefault();
    onDragLeave();
    showFiles(Array.from((event as DragEvent).dataTransfer?.files || []));
  };

  dropZone.addEventListener('click', openPicker);
  dropZone.addEventListener('keydown', onKeyDown);
  dropZone.addEventListener('dragover', onDragOver);
  dropZone.addEventListener('dragleave', onDragLeave);
  dropZone.addEventListener('drop', onDrop);
  input.addEventListener('change', onChange);

  return () => {
    dropZone.removeEventListener('click', openPicker);
    dropZone.removeEventListener('keydown', onKeyDown);
    dropZone.removeEventListener('dragover', onDragOver);
    dropZone.removeEventListener('dragleave', onDragLeave);
    dropZone.removeEventListener('drop', onDrop);
    input?.removeEventListener('change', onChange);
  };
}

function setupProfilePhotoPicker(frameDocument: Document, resident: VecinoData | null, user: User | null) {
  const input = frameDocument.getElementById('avatar-input') as HTMLInputElement | null;
  const avatar = frameDocument.getElementById('avatar-preview') as HTMLImageElement | null;
  if (!input || !avatar) return () => undefined;

  input.accept = 'image/jpeg,image/png,image/webp';
  let feedback = frameDocument.getElementById('profile-photo-feedback') as HTMLElement | null;
  if (!feedback) {
    feedback = frameDocument.createElement('p');
    feedback.id = 'profile-photo-feedback';
    feedback.className = 'mt-2 text-sm text-on-surface-variant';
    feedback.setAttribute('aria-live', 'polite');
    avatar.closest('.relative')?.insertAdjacentElement('afterend', feedback);
  }
  let objectUrl: string | null = null;
  let saving = false;

  const onChange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!user?.uid || resident?.uid !== user.uid) {
      toast.error('No se pudo identificar tu perfil. Vuelve a iniciar sesión.');
      input.value = '';
      return;
    }
    if (saving) return;

    const previousPhoto = resident.datosPersonales?.fotoPerfil || resident.datosPersonales?.photoURL || user.photoURL || '';
    const previousAvatar = avatar.src;
    const priorObjectUrl = objectUrl;
    saving = true;
    input.disabled = true;
    feedback!.textContent = 'Guardando foto en memoria…';
    objectUrl = URL.createObjectURL(file);
    avatar.src = objectUrl;

    let uploadedReference = '';
    try {
      const token = await user.getIdTokenResult(true);
      if (token.claims.role !== 'authenticated') {
        throw new Error('La sesión necesita actualizar permisos. Cierra sesión y vuelve a entrar.');
      }
      uploadedReference = await uploadProfilePhoto(file, user.uid);
      const batch = writeBatch(db);
      const profileDocId = resident.id || user.uid;
      batch.update(doc(db, 'vecinos', profileDocId), { 'datosPersonales.fotoPerfil': uploadedReference });
      batch.update(doc(db, 'vecinosPublicos', profileDocId), {
        fotoPerfil: uploadedReference,
        'datosPersonales.fotoPerfil': uploadedReference,
      });
      await batch.commit();
      const signedUrl = await resolveProfilePhotoUrl(uploadedReference).catch((error) => {
        console.warn('La foto se guardó, pero no se pudo generar su vista previa desde Supabase:', error);
        return null;
      });
      if (signedUrl) {
        avatar.src = signedUrl;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
      if (priorObjectUrl) URL.revokeObjectURL(priorObjectUrl);
      feedback!.textContent = signedUrl
        ? 'Foto de perfil guardada en Supabase.'
        : 'Foto guardada. Revisa los permisos de lectura de las fotos de perfil en Supabase.';
      toast.success('Foto de perfil actualizada.');
      if (isProfilePhotoReference(previousPhoto)) {
        void removeProfilePhoto(previousPhoto).catch((error) => console.warn('No se pudo retirar la foto anterior del almacenamiento:', error));
      }
    } catch (error) {
      if (uploadedReference) {
        void removeProfilePhoto(uploadedReference).catch((cleanupError) => console.warn('No se pudo retirar la nueva foto del almacenamiento:', cleanupError));
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = null;
      avatar.src = previousAvatar;
      feedback!.textContent = error instanceof Error ? error.message : 'No se pudo guardar la foto.';
      toast.error(feedback!.textContent);
    } finally {
      saving = false;
      input.disabled = false;
      input.value = '';
    }
  };

  input.addEventListener('change', onChange);
  return () => {
    input.removeEventListener('change', onChange);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };
}

interface SampleResident {
  name: string;
  portal?: string;
  floor?: string;
  door?: string;
  aliasOf?: string;
}

interface HousingAssetData {
  id: string;
  portal: string;
  piso: string;
  letra: string;
  plazaGaraje?: string;
  trastero?: string;
}

interface AssignedResident extends SampleResident {
  sampleName: string;
  resident: VecinoData;
  name: string;
}

function assignMockResidents(frameDocument: Document, residents: VecinoData[], currentResident: VecinoData | null) {
  if (!frameDocument || residents.length === 0) return;
  const samples: SampleResident[] = [
    { name: 'Elena Morales', portal: '2', floor: '3', door: 'B' },
    { name: 'Carmen Ortiz', portal: '2', floor: '2', door: 'A' },
    { name: 'Marta y Javier Gómez', portal: '2', floor: '1', door: 'A' },
    { name: 'David Quintana', portal: '2', floor: '1', door: 'B' },
    { name: 'Ignacio Serrat', portal: '2', floor: 'Bajo', door: 'A' },
    { name: 'Javier Sanz' },
    { name: 'Marta Vidal' },
    { name: 'Raúl Méndez' },
    { name: 'David Menéndez' },
    { name: 'Carlos Alarcón' },
    { name: 'Marcos Varela' },
    { name: 'Javier Ramos' },
    { name: 'Sara Lozano' },
    { name: 'Carlos Vega' },
    { name: 'Lucía Gómez' },
    { name: 'Marcos Ríos' },
    { name: 'Laura Valdés' },
    { name: 'Laura Valdés Méndez', aliasOf: 'Laura Valdés' },
    { name: 'Beatriz Ramos Soria' },
    { name: 'Carlos Méndez' },
    { name: 'Sergio Montes Delgado' },
  ];
  const orderedResidents = [...residents].sort((a, b) => {
    const left = residentUnit(a);
    const right = residentUnit(b);
    return left.portal.localeCompare(right.portal, undefined, { numeric: true, sensitivity: 'base' })
      || left.floor.localeCompare(right.floor, undefined, { numeric: true, sensitivity: 'base' })
      || left.door.localeCompare(right.door, undefined, { numeric: true, sensitivity: 'base' })
      || residentName(a).localeCompare(residentName(b), 'es');
  });
  const currentName = currentResident ? residents.find((resident) => resident.id === currentResident.uid) : undefined;
  const assignments = samples.reduce<AssignedResident[]>((assigned, sample, index) => {
    const aliasAssignment = sample.aliasOf ? assigned.find(({ sampleName }) => sampleName === sample.aliasOf) : undefined;
    const resident = aliasAssignment?.resident || (sample.name === 'Elena Morales' && currentName
      ? currentName
      : orderedResidents.find((candidate) => {
        const unit = residentUnit(candidate);
        return sample.portal && sample.floor && sample.door
          && unit.portal === sample.portal
          && unit.floor.toLocaleLowerCase('es') === sample.floor.toLocaleLowerCase('es')
          && unit.door.toLocaleLowerCase('es') === sample.door.toLocaleLowerCase('es');
      }) || orderedResidents[index % orderedResidents.length]);
    assigned.push({ ...sample, sampleName: sample.name, resident, name: residentName(resident) });
    return assigned;
  }, []);
  const sampleNames = [...samples.map(({ name }) => name), 'Elena Morales Gómez'];
  const replacementPattern = new RegExp(sampleNames.sort((a, b) => b.length - a.length).map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  const replaceSamples = (value: string) => {
    return value.replace(replacementPattern, (matched: string) => {
      if (matched === 'Elena Morales Gómez' && currentName) return residentName(currentName);
      return assignments.find(({ sampleName }) => sampleName === matched)?.name || matched;
    });
  };

  const walker = frameDocument.createTreeWalker(frameDocument.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const text = node.nodeValue ?? '';
    if (sampleNames.some((sampleName) => text.includes(sampleName))) node.nodeValue = replaceSamples(text);
  });

  frameDocument.querySelectorAll<HTMLElement>('*').forEach((element) => {
    const alt = element.getAttribute('alt') || element.getAttribute('data-alt') || '';
    const assignedSample = samples.find(({ name }) => alt.includes(name));
    [...element.attributes].forEach((attribute) => {
      if (sampleNames.some((sampleName) => attribute.value.includes(sampleName))) element.setAttribute(attribute.name, replaceSamples(attribute.value));
    });
    if (element instanceof HTMLImageElement && assignedSample) {
      const assignedResident = assignments.find(({ sampleName }) => sampleName === assignedSample.name);
      const photo = assignedResident?.resident?.fotoPerfil || assignedResident?.resident?.datosPersonales?.fotoPerfil || assignedResident?.resident?.datosPersonales?.photoURL;
      setResidentAvatar(element, residentName(assignedResident?.resident || {}), photo);
    }
  });
  frameDocument.querySelectorAll('span').forEach((element) => {
    if (element.textContent.trim() === 'TÚ') element.classList.add('hidden');
  });
  // Keep role labels truthful when a sample administrator maps to a non-admin resident.
  frameDocument.querySelectorAll('body *').forEach((element) => {
    if (element.childElementCount === 0 && element.textContent.includes('(Admin)')) {
      const mapped = assignments.find(({ name }) => element.textContent.includes(name));
      if (mapped?.resident.rol?.toLowerCase() !== 'administrador') element.textContent = element.textContent.replace(/\s*\(Admin\)/g, '');
    }
  });
}

function populateResidentDirectory(
  frameDocument: Document | null,
  residents: VecinoData[],
  housingAssets: HousingAssetData[],
  currentResident: VecinoData | null,
  onSelect: (resident: VecinoData) => void,
) {
  if (!frameDocument) return;
  const list = frameDocument.getElementById('residents-list');
  if (!list) return;
  list.classList.remove('flex', 'flex-col');
  list.classList.remove('grid-cols-1', 'sm:grid-cols-2', 'xl:grid-cols-3', 'sm:grid-cols-3');
  list.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'xl:grid-cols-3', 'items-start');
  list.dataset.viewMode = 'grid';

  const directoryList = list as HTMLElement & { __residentCardTemplate?: HTMLElement };
  const exampleCard = directoryList.__residentCardTemplate || list.querySelector<HTMLElement>('.resident-card');
  if (!exampleCard) return;
  directoryList.__residentCardTemplate ||= exampleCard.cloneNode(true) as HTMLElement;
  const cardTemplate = directoryList.__residentCardTemplate;
  const propertyAdministrators = residents.filter(isPropertyAdministrator);
  const duplicatePropertyAdminIds = new Set(propertyAdministrators.flatMap((administrator) => {
    const email = String(administrator.email || administrator.datosPersonales?.email || '').trim().toLocaleLowerCase('es');
    if (!email) return [];
    return residents
      .filter((resident) => resident.id !== administrator.id
        && String(resident.email || resident.datosPersonales?.email || '').trim().toLocaleLowerCase('es') === email)
      .map((resident) => resident.id);
  }));
  const directoryResidents = residents.filter((resident) => !duplicatePropertyAdminIds.has(resident.id));
  const assetsByUnit = new Map(housingAssets.map((home) => {
    const floor = /^(?:7|at(?:ico)?)$/i.test(home.piso) ? 'Ático' : home.piso;
    return [`${home.portal}|${floor}|${home.letra.toUpperCase()}`, home];
  }));
  const registeredCount = [...frameDocument.querySelectorAll<HTMLElement>('span')]
    .find((element) => /(?:Fincas|Viviendas) Registradas/.test(element.textContent || ''));
  if (registeredCount) {
    registeredCount.textContent = `${housingAssets.length} Viviendas Registradas`;
  }
  const housingCount = frameDocument.getElementById('directory-housing-count');
  if (housingCount) housingCount.textContent = String(housingAssets.length);
  const boardCount = directoryResidents.filter((resident) => isBoardMember(resident.cargo) || isPropertyAdministrator(resident)).length;
  const boardCountLabel = frameDocument.getElementById('board-member-count');
  if (boardCountLabel) boardCountLabel.textContent = `${boardCount} Miembros`;
  const garageLabel = [...frameDocument.querySelectorAll<HTMLElement>('span')].find((element) => /^(?:Plazas Garaje|Garajes vinculados)$/.test(element.textContent?.trim() || ''));
  const garageValue = frameDocument.getElementById('directory-garage-count') || garageLabel?.parentElement?.querySelector<HTMLElement>('span:last-child');
  if (garageValue) {
    const linkedGarages = housingAssets.reduce((total, home) => total + String(home.plazaGaraje || '').split(/\s*[,;y]\s*/i).filter(Boolean).length, 0);
    if (garageLabel) garageLabel.textContent = 'Garajes vinculados';
    garageValue.textContent = String(linkedGarages);
  }
  const portalTabs = frameDocument.querySelector<HTMLElement>('.portal-tab')?.parentElement;
  let selectedPortal = '';
  let boardFilterActive = false;
  if (portalTabs) {
    const portals = [...new Set(['1', '2', '3', '4', ...directoryResidents.map((resident) => residentUnit(resident).portal).filter((portal) => portal && !/^(?:oficina|portal\s+oficina)$/i.test(portal))])]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    portalTabs.replaceChildren();
    portals.forEach((portal) => {
      const tab = frameDocument.createElement('button');
      tab.type = 'button';
      tab.className = 'portal-tab px-space-md py-space-xs rounded-md font-label-md text-label-md text-on-surface-variant transition-all hover:text-on-surface';
      tab.textContent = residentPortalLabel(portal);
      tab.addEventListener('click', () => {
        selectedPortal = portal;
        list.dataset.selectedPortal = portal;
        portalTabs.querySelectorAll('.portal-tab').forEach((button) => button.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold'));
        tab.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold');
        updateGroupVisibility();
      });
      portalTabs.append(tab);
    });
    const allTab = frameDocument.createElement('button');
    allTab.type = 'button';
    allTab.className = 'portal-tab px-space-md py-space-xs rounded-md font-label-md text-label-md text-on-surface-variant transition-all hover:text-on-surface';
    allTab.textContent = 'Todos';
    allTab.addEventListener('click', () => {
      selectedPortal = '';
      delete list.dataset.selectedPortal;
      portalTabs.querySelectorAll('.portal-tab').forEach((button) => button.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold'));
      allTab.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold');
      updateGroupVisibility();
    });
    portalTabs.append(allTab);
  }
  const homes = new Map<string, { portal: string; floor: string; door: string; residents: HTMLElement[]; garage?: string; storage?: string; coefficient?: number; coefficientEstimated?: boolean }>();
  const coefficientsByClass = new Map<string, Map<string, number>>();
  const coefficientsByDoor = new Map<string, Map<string, number>>();
  residents.forEach((resident) => {
    const coefficient = participationPercent(resident);
    if (coefficient == null) return;
    const unit = residentUnit(resident);
    const letter = unit.door.slice(-1).toUpperCase();
    const unitKey = `${unit.portal}|${unit.floor}|${letter}`;
    const classKey = `${unit.floor}|${letter}`;
    const sameClass = coefficientsByClass.get(classKey) || new Map<string, number>();
    sameClass.set(unitKey, coefficient);
    coefficientsByClass.set(classKey, sameClass);
    const sameDoor = coefficientsByDoor.get(letter) || new Map<string, number>();
    sameDoor.set(unitKey, coefficient);
    coefficientsByDoor.set(letter, sameDoor);
  });
  const average = (values: Map<string, number> | undefined) => {
    if (!values?.size) return null;
    const coefficients = [...values.values()];
    return coefficients.reduce((total, value) => total + value, 0) / coefficients.length;
  };
  const estimateHomeParticipation = (floor: string, door: string) => {
    const letter = door.slice(-1).toUpperCase();
    return average(coefficientsByClass.get(`${floor}|${letter}`))
      ?? average(coefficientsByDoor.get(letter))
      ?? USER_PARTICIPATION_PERCENT;
  };
  const standardFloors = [
    { floor: '1', doors: ['A', 'B'] },
    { floor: '2', doors: ['A', 'B', 'C'] },
    { floor: '3', doors: ['A', 'B', 'C'] },
    { floor: '4', doors: ['A', 'B', 'C'] },
    { floor: '5', doors: ['A', 'B', 'C'] },
    { floor: '6', doors: ['A', 'B', 'C'] },
    { floor: 'Ático', doors: ['A', 'B'] },
  ];
  for (let portalNumber = 1; portalNumber <= 4; portalNumber += 1) {
    standardFloors.forEach(({ floor, doors }) => {
      const portalDoors = portalNumber === 1 && floor === '1' ? ['A'] : doors;
      portalDoors.forEach((door) => {
        const portal = String(portalNumber);
        const unit = floor === 'Ático' ? `Ático ${door}` : `${floor}º ${door}`;
        const assignedAssets = assetsByUnit.get(`${portal}|${floor}|${door}`);
        homes.set(`${portal}|${floor}|${unit}`, { portal, floor, door: unit, residents: [], garage: assignedAssets?.plazaGaraje, storage: assignedAssets?.trastero });
      });
    });
  }
  const sorted = [...directoryResidents].sort((left, right) => {
    const a = residentUnit(left);
    const b = residentUnit(right);
    return a.portal.localeCompare(b.portal, undefined, { numeric: true, sensitivity: 'base' })
      || a.floor.localeCompare(b.floor, undefined, { numeric: true, sensitivity: 'base' })
      || a.door.localeCompare(b.door, undefined, { numeric: true, sensitivity: 'base' })
      || residentName(left).localeCompare(residentName(right), 'es');
  });

  sorted.forEach((resident) => {
    const personal = resident.datosPersonales || {};
    const name = residentName(resident);
    const { portal, floor, unit } = residentUnit(resident);
    const portalLabel = portal || 'Sin portal';
    const isAdministrativeUnit = isAdministrativePortal(portal);
    const isCurrent = resident.id === currentResident?.uid;
    const card = cardTemplate.cloneNode(true) as HTMLElement;
    card.dataset.name = name;
    card.dataset.portal = portal;
    card.dataset.unit = unit;
    card.dataset.boardMember = String(isBoardMember(resident.cargo) || isPropertyAdministrator(resident));
    card.dataset.boardRole = isBoardMember(resident.cargo) ? resident.cargo?.trim() || '' : '';
    card.dataset.residentId = resident.id;
    card.removeAttribute('onclick');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Ver ficha de ${name}, ${unit}`);
    card.classList.toggle('ring-2', isCurrent);
    card.classList.toggle('ring-secondary', isCurrent);
    card.querySelector('.absolute.left-0')?.classList.toggle('hidden', !isCurrent);
    card.querySelectorAll<HTMLElement>('span').forEach((label) => {
      if (label.textContent.trim() === 'Elena Morales') label.dataset.residentName = 'true';
      if (label.textContent.trim() === 'Portal 2 · 3º B') label.dataset.residentUnit = 'true';
      if (label.textContent.trim() === 'Propietaria') label.dataset.residentRole = 'true';
      if (label.textContent.trim() === 'TÚ') label.dataset.currentUserBadge = 'true';
      if (label.textContent.trim() === 'Vicepresidenta') label.dataset.boardRole = 'true';
    });

    const nameLabel = card.querySelector<HTMLElement>('[data-resident-name]');
    if (nameLabel) {
      nameLabel.textContent = name;
      nameLabel.dataset.residentName = 'true';
    }
    const youBadge = card.querySelector('[data-current-user-badge]');
    if (youBadge) youBadge.classList.toggle('hidden', !isCurrent);
    const roleBadge = card.querySelector('[data-board-role]');
    if (roleBadge) {
      if (resident.cargo) roleBadge.textContent = resident.cargo;
      else roleBadge.remove();
    }
    const unitLabel = card.querySelector('[data-resident-unit]');
    if (unitLabel) unitLabel.textContent = `${residentPortalLabel(portalLabel)} · ${unit}`;
    if (!isAdministrativeUnit) {
      const assetLine = frameDocument.createElement('span');
      assetLine.className = 'mt-1 block font-body-sm text-body-sm text-on-surface-variant';
      assetLine.textContent = residentAssetsSummary(resident);
      assetLine.setAttribute('aria-label', `Asignaciones de la vivienda: ${assetLine.textContent}`);
      unitLabel?.parentElement?.after(assetLine);
    }
    const typeLabel = card.querySelector('[data-resident-role]');
    if (typeLabel) typeLabel.textContent = resident.tipo || resident.rol || 'Vecino';
    const quotaLabel = [...card.querySelectorAll<HTMLElement>('span')].find((label) => /^Cuota\s/.test(label.textContent.trim()));
    quotaLabel?.remove();
    const detailsRow = unitLabel?.parentElement;
    if (detailsRow) {
      detailsRow.className = 'mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-on-surface-variant font-body-sm text-body-sm';
      detailsRow.querySelectorAll<HTMLElement>('span').forEach((item) => { if (item.textContent.trim() === '•') item.remove(); });
    }
    if (typeLabel) typeLabel.className = 'inline-flex items-center rounded-full bg-surface-container-low px-2 py-0.5 text-xs font-medium text-on-surface-variant';
    card.querySelector('.flex.items-center.gap-1.text-on-surface-variant')?.remove();
    const avatar = card.querySelector<HTMLImageElement>('img');
    if (avatar) {
      setResidentAvatar(avatar, name, resident.fotoPerfil || personal.fotoPerfil || personal.photoURL);
      avatar.alt = name;
    }
    card.querySelectorAll('button').forEach((button) => {
      const isOwnContactButton = resident.uid === currentResident?.uid || resident.id === currentResident?.id;
      button.removeAttribute('onclick');
      button.type = 'button';
      button.dataset.messageResidentUid = resident.uid || '';
      button.dataset.messageResidentId = resident.id;
      button.disabled = isOwnContactButton;
      button.setAttribute('aria-label', isOwnContactButton ? 'No puedes enviarte un mensaje a ti mismo' : `Contactar con ${name}`);
      button.title = isOwnContactButton ? 'No puedes enviarte mensajes a ti mismo' : 'Mensaje interno';
      if (isOwnContactButton) button.classList.add('cursor-not-allowed', 'opacity-50');
    });
    card.addEventListener('click', () => onSelect(resident));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(resident); }
    });

    const homeKey = unit === 'Vivienda sin especificar'
      ? `sin-vivienda|${resident.id}`
      : `${portalLabel}|${floor || 'Sin planta'}|${unit}`;
    if (!homes.has(homeKey)) homes.set(homeKey, { portal: portalLabel, floor, door: unit, residents: [] });
    const residentHome = homes.get(homeKey);
    residentHome?.residents.push(card);
    if (residentHome) {
      residentHome.garage = resident.plazaGaraje ?? personal.plazaGaraje;
      residentHome.storage = resident.trastero ?? personal.trastero;
      const coefficient = participationPercent(resident);
      const coefficientEstimated = resident.coeficiente == null && personal.coeficiente == null;
      if (coefficient != null && (residentHome.coefficient == null || (residentHome.coefficientEstimated && !coefficientEstimated))) {
        residentHome.coefficient = coefficient;
        residentHome.coefficientEstimated = coefficientEstimated;
      }
    }
  });

  list.replaceChildren();
  const orderedHomes = [...homes.values()].sort((left, right) => {
    const portalOrder = left.portal.localeCompare(right.portal, undefined, { numeric: true, sensitivity: 'base' });
    if (portalOrder) return portalOrder;
    const floorRank = (floor: string) => /^\d+$/.test(floor) ? Number(floor) : /ático/i.test(floor) ? 7 : 8;
    const floorOrder = floorRank(left.floor) - floorRank(right.floor);
    if (floorOrder) return floorOrder;
    return left.door.slice(-1).localeCompare(right.door.slice(-1), 'es', { sensitivity: 'base' });
  });
  orderedHomes.forEach(({ portal, floor, door, residents: cards, garage, storage, coefficient, coefficientEstimated }) => {
    const isAdministrativeGroup = isAdministrativePortal(portal);
    const isResidentialHome = /^\d+$/.test(portal.trim().replace(/^portal\s+/i, ''));
    const group = frameDocument.createElement('section');
    group.className = 'resident-unit-group overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest';
    group.dataset.portal = portal;
    const toggle = frameDocument.createElement('button');
    toggle.type = 'button';
    toggle.className = 'flex w-full items-center justify-between gap-space-md p-space-md text-left transition-colors hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary';
    toggle.setAttribute('aria-expanded', 'false');
    const title = frameDocument.createElement('span');
    title.className = 'min-w-0 truncate whitespace-nowrap font-label-md text-label-md font-bold text-on-surface';
    title.textContent = `${residentPortalLabel(portal)} · ${door}`;
    const homeTitle = frameDocument.createElement('div');
    homeTitle.className = 'flex min-w-0 flex-col items-start gap-1';
    const boardRoles = [...new Set(cards.map((card) => card.dataset.boardRole).filter((role): role is string => Boolean(role)))];
    const titleRow = frameDocument.createElement('div');
    titleRow.className = 'flex w-full min-w-0 items-center justify-between gap-space-sm';
    titleRow.append(title);
    if (boardRoles.length) {
      const badge = frameDocument.createElement('span');
      badge.className = 'inline-flex shrink-0 items-center rounded-full bg-secondary-container px-space-sm py-0 font-label-sm text-label-sm font-semibold leading-4 text-on-secondary-container';
      badge.textContent = [...new Set(boardRoles.map((role) => {
        const normalized = role.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
        if (/^vicepresident/.test(normalized)) return 'Vicepresidente';
        if (/^president/.test(normalized)) return 'Presidente';
        return 'Vocal';
      }))].join(' · ');
      badge.setAttribute('aria-label', `Junta de Gobierno: ${boardRoles.join(', ')}`);
      titleRow.append(badge);
    }
    homeTitle.append(titleRow);
    if (!isAdministrativeGroup) {
      const assets = frameDocument.createElement('span');
      assets.className = 'font-body-sm text-body-sm text-on-surface-variant';
      assets.textContent = `${displayPropertyNumbers(garage, 'garaje')} · Trastero ${displayPropertyNumbers(storage, 'trastero')}`;
      homeTitle.append(assets);
    }
    if (isResidentialHome && !isAdministrativeGroup) {
      const quotaLine = frameDocument.createElement('span');
      quotaLine.className = 'font-label-sm text-label-sm text-secondary';
      const participation = coefficient ?? estimateHomeParticipation(floor, door);
      const isEstimated = coefficient == null || coefficientEstimated === true;
      quotaLine.textContent = `Cuota de participación${isEstimated ? ' estimada' : ''}: ${formatParticipationCoefficient(participation, true)}`;
      homeTitle.append(quotaLine);
    }
    const meta = frameDocument.createElement('span');
    meta.className = 'flex items-center gap-space-sm text-on-surface-variant';
    const count = frameDocument.createElement('span');
    count.className = 'rounded-full bg-surface-container-low px-space-sm py-1 text-label-sm';
    count.textContent = cards.length ? `${cards.length} ${cards.length === 1 ? 'vecino' : 'vecinos'}` : 'Sin vecino';
    const chevron = frameDocument.createElement('span');
    chevron.className = 'material-symbols-outlined transition-transform';
    chevron.textContent = 'expand_more';
    meta.append(count, chevron);
    toggle.append(homeTitle, meta);
    const members = frameDocument.createElement('div');
    members.className = 'hidden flex flex-col gap-space-sm border-t border-outline-variant p-space-sm';
    members.hidden = true;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      members.hidden = expanded;
      members.classList.toggle('hidden', expanded);
      chevron.classList.toggle('rotate-180', !expanded);
    });
    if (cards.length) members.append(...cards);
    else {
      const vacant = frameDocument.createElement('p');
      vacant.className = 'rounded-lg bg-surface-container-low p-space-sm text-body-sm text-on-surface-variant';
      vacant.textContent = 'Vivienda sin vecino asociado';
      members.append(vacant);
    }
    group.append(toggle, members);
    list.append(group);
  });

  const updateGroupVisibility = () => {
    const query = (frameDocument.getElementById('directory-search') as HTMLInputElement | null)?.value.trim().toLocaleLowerCase('es') || '';
    list.querySelectorAll<HTMLElement>('.resident-card').forEach((card) => {
      const text = `${card.dataset.name || ''} ${card.dataset.unit || ''} ${card.dataset.portal || ''}`.toLocaleLowerCase('es');
      const hidden = !text.includes(query) || (boardFilterActive && card.dataset.boardMember !== 'true');
      card.hidden = hidden;
      card.classList.toggle('hidden', hidden);
    });
    frameDocument.querySelectorAll<HTMLElement>('.resident-unit-group').forEach((group) => {
      const cards = [...group.querySelectorAll<HTMLElement>('.resident-card')];
      const matchesFilter = cards.some((card) => !card.hidden);
      const vacantVisible = cards.length === 0 && query === '' && !boardFilterActive;
      const hidden = (selectedPortal !== '' && group.dataset.portal !== selectedPortal) || !(matchesFilter || vacantVisible);
      group.hidden = hidden;
      group.classList.toggle('hidden', hidden);
    });
  };

  const boardFilter = frameDocument.getElementById('filter-board-members') as HTMLButtonElement | null;
  boardFilter?.addEventListener('click', () => {
    boardFilterActive = !boardFilterActive;
    boardFilter?.setAttribute('aria-pressed', String(boardFilterActive));
    boardFilter?.classList.toggle('bg-surface-container', boardFilterActive);
    updateGroupVisibility();
  });
  const directorySearch = frameDocument.getElementById('directory-search') as HTMLInputElement | null;
  directorySearch?.addEventListener('input', updateGroupVisibility);
  const viewButton = frameDocument.getElementById('toggle-resident-view') as HTMLButtonElement | null;
  const viewModes = [
    { id: 'grid', label: 'Cuadrícula', next: 'Lista', icon: 'grid_view', columns: 'repeat(auto-fit, minmax(320px, 1fr))' },
    { id: 'list', label: 'Lista', next: 'Cuadrícula compacta', icon: 'view_list', columns: 'minmax(0, 1fr)' },
    { id: 'compact', label: 'Cuadrícula compacta', next: 'Cuadrícula', icon: 'view_compact', columns: 'repeat(auto-fit, minmax(230px, 1fr))' },
  ];
  const applyViewMode = (modeId: string) => {
    const mode = viewModes.find((candidate) => candidate.id === modeId) || viewModes[0];
    list.style.gridTemplateColumns = mode.columns;
    list.style.gap = mode.id === 'compact' ? '0.625rem' : '';
    list.dataset.viewMode = mode.id;
    list.querySelectorAll<HTMLElement>('.resident-unit-group > button').forEach((toggle) => {
      toggle.style.padding = mode.id === 'compact' ? '0.625rem' : '';
    });
    if (viewButton) {
      viewButton.title = `Vista: ${mode.label} · Cambiar a ${mode.next}`;
      viewButton.setAttribute('aria-label', `Cambiar vista de viviendas (actual: ${mode.label}, siguiente: ${mode.next})`);
      const icon = viewButton.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = mode.icon;
    }
  };
  applyViewMode('grid');
  if (viewButton) {
    viewButton.onclick = () => {
      const currentIndex = viewModes.findIndex((mode) => mode.id === list.dataset.viewMode);
      applyViewMode(viewModes[(currentIndex + 1) % viewModes.length].id);
    };
  }

  const empty = frameDocument.createElement('p');
  empty.id = 'directory-empty-state';
  empty.className = 'rounded-xl bg-surface-container-lowest p-space-lg text-center text-on-surface-variant';
  empty.textContent = 'No hay vecinos confirmados para mostrar.';
  empty.hidden = sorted.length > 0;
  list.append(empty);
}

function populateResidentDetails(
  frameDocument: Document,
  resident: VecinoData,
  currentResident: VecinoData | null,
  isAdmin: boolean,
  onAdminSave?: (saved: VecinoData) => void,
) {
  if (!frameDocument || !resident) return;
  const personal = resident.datosPersonales || {};
  const name = residentName(resident);
  const { portal, unit } = residentUnit(resident);
  const isCurrent = resident.id === currentResident?.uid;
  const privateValue = (value: string | undefined, allowed: boolean) => (allowed && value ? value : 'Oculto por privacidad');
  const setText = (id: string, value: string) => {
    const element = frameDocument.getElementById(id);
    if (element) element.textContent = value;
  };

  setText('ficha-name', name);
  setText('ficha-unit', `${portal ? residentPortalLabel(portal) : 'Portal —'}, ${unit}`);
  setText('ficha-type', resident.tipo || resident.rol || 'Vecino');
  const coefficient = resident.coeficiente ?? personal.coeficiente ?? resident.coeficienteEstimado ?? personal.coeficienteEstimado;
  const estimatedCoefficient = resident.coeficiente == null && personal.coeficiente == null
    && (resident.coeficienteEstimado != null || personal.coeficienteEstimado != null);
  const parking = resident.plazaGaraje ?? personal.plazaGaraje;
  const storage = resident.trastero ?? personal.trastero;
  setText('ficha-coefficient', formatParticipationCoefficient(coefficient, estimatedCoefficient));
  const coefficientLabel = frameDocument.getElementById('ficha-coefficient')?.parentElement?.querySelector('span, p, dt');
  if (coefficientLabel && estimatedCoefficient) coefficientLabel.textContent = 'Cuota estimada';
  const coefficientNote = frameDocument.getElementById('ficha-coefficient')?.parentElement?.querySelector<HTMLElement>('[class*="text-[11px]"]');
  if (coefficientNote && estimatedCoefficient) coefficientNote.textContent = 'Cálculo proporcional aproximado por superficies útiles.';
  setText('ficha-parking', displayPropertyNumbers(parking, 'garaje'));
  setText('ficha-storage', displayPropertyNumbers(storage, 'trastero'));
  setText('ficha-plate', resident.matricula ? `Matrícula: ${resident.matricula}` : 'Vehículo no registrado');
  const phoneConsentGranted = personal.autorizaTelefonoDirectorio === true;
  const canViewPhone = isCurrent || isAdmin || phoneConsentGranted;
  setText('ficha-phone', privateValue(personal.telefono || personal.movil, canViewPhone));
  setText('ficha-email', privateValue(personal.email || resident.email, isCurrent || isAdmin));
  setText('modal-target-resident', `${name} (${unit})`);
  const avatar = frameDocument.getElementById('ficha-avatar') as HTMLImageElement | null;
  if (avatar) {
    setResidentAvatar(avatar, name, resident.fotoPerfil || personal.fotoPerfil || personal.photoURL);
    avatar.alt = name;
  }
  const boardRole = frameDocument.getElementById('ficha-board-role');
  if (boardRole) boardRole.textContent = resident.cargo || 'Sin cargo comunitario registrado';
  const emailRow = frameDocument.getElementById('ficha-email')?.parentElement?.parentElement as HTMLElement | null;
  const phoneRow = frameDocument.getElementById('ficha-phone')?.parentElement?.parentElement as HTMLElement | null;
  if (emailRow) emailRow.hidden = !isCurrent && !isAdmin;
  if (phoneRow) phoneRow.hidden = !canViewPhone;
  const contactSection = frameDocument.getElementById('ficha-email')?.closest<HTMLElement>('.flex.flex-col.gap-space-xs');
  if (contactSection) contactSection.hidden = !isCurrent && !isAdmin && !phoneConsentGranted;
  const assetsSection = frameDocument.getElementById('ficha-parking')?.closest<HTMLElement>('.bg-surface-container-low.p-space-md');
  if (assetsSection) assetsSection.hidden = false;
  const coefficientCard = frameDocument.getElementById('ficha-coefficient')?.parentElement as HTMLElement | null;
  if (coefficientCard) coefficientCard.hidden = false;
  const financialCard = frameDocument.getElementById('ficha-coefficient')?.parentElement?.parentElement?.querySelector<HTMLElement>('.bg-surface-container-low.p-space-sm.rounded-xl:last-child');
  if (financialCard) financialCard.hidden = !resident.estadoCuotas;
  if (financialCard && resident.estadoCuotas) financialCard.querySelectorAll('span')[1].textContent = resident.estadoCuotas;
  const statusBadge = frameDocument.querySelector<HTMLElement>('#ficha-vecino-container .bg-badge-emerald-bg');
  if (statusBadge) statusBadge.textContent = resident.estado || 'Activo';
  if (isAdmin && onAdminSave) setupResidentAdminEditor(frameDocument, resident, onAdminSave);
}

interface Workflow {
  key: string;
  data?: RegistroInicial & { email?: string; datosVecino?: VecinoData | null };
}

type WorkflowPageProps = { datosVecino: VecinoData | null };
type WorkflowPages = Record<string, React.ComponentType<WorkflowPageProps>>;

interface WorkflowContentProps {
  workflow: Workflow;
  workflowPages: WorkflowPages;
  initialEmail: string;
  close: () => void;
}

function WorkflowContent({ workflow, workflowPages, initialEmail, close }: WorkflowContentProps) {
  if (workflow.key === 'register') return <RegistroDatos initialData={workflow.data} onComplete={close} />;
  if (workflow.key === 'forgot') return <RecoveryWorkflow initialEmail={initialEmail} onCancel={close} />;
  if (workflow.key === 'join-community') return workflow.data?.datosVecino
    ? <JoinCommunityForm resident={workflow.data.datosVecino} />
    : <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">No se pudo cargar tu perfil para iniciar la inscripción.</p>;
  const Component = workflowPages[workflow.key];
  if (!Component) return null;
  return <Component datosVecino={workflow.data?.datosVecino ?? null} />;
}

function RecoveryWorkflow({ initialEmail, onCancel }: { initialEmail: string; onCancel: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSending(true); setErrorMessage('');
    try { await sendPasswordResetEmail(auth, email.trim()); toast.success('Enlace de recuperación enviado.'); onCancel(); }
    catch (error) { setErrorMessage(authError(error)); }
    finally { setSending(false); }
  };
  return <form onSubmit={submit} className="mx-auto w-full max-w-lg space-y-5 rounded-xl bg-white p-7"><h2 className="font-[Plus_Jakarta_Sans] text-2xl font-bold text-slate-900">Recuperar contraseña</h2><label htmlFor="recovery-email-live" className="block space-y-2 text-sm font-semibold text-slate-700">Correo electrónico<input autoFocus id="recovery-email-live" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></label>{errorMessage && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="btn-secondary">Volver</button><button disabled={sending} className="btn-primary disabled:opacity-60" type="submit">{sending ? 'Enviando…' : 'Enviar enlace'}</button></div></form>;
}

function StitchPage({ pageId, workflowPages = {}, title }: { pageId: string; workflowPages?: WorkflowPages; title?: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const outletContext = useOutletContext<VecinoOutletContext | null>();
  const datosVecino: VecinoData | null = outletContext?.[0] ?? null;
  const firebaseUser = auth.currentUser;
  const location = useLocation();
  const isAdmin = hasAdministratorAccess(datosVecino);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loginMode, setLoginMode] = useState('login');
  const [loginError, setLoginError] = useState('');
  
  const [busy, setBusy] = useState(false);
  const [frameVersion, setFrameVersion] = useState(0);
  const [dashboardNoticeTarget, setDashboardNoticeTarget] = useState<Element | null>(null);
  const [directorioVecinos, setDirectorioVecinos] = useState<VecinoData[]>([]);
  const [directorioViviendas, setDirectorioViviendas] = useState<HousingAssetData[]>([]);
  const [incidenciasComunidad, setIncidenciasComunidad] = useState<IncidenciaData[]>([]);
  const [incidenciasLoadState, setIncidenciasLoadState] = useState<IncidenceLoadState>('loading');
  const incidentImagesRef = useRef<File[]>([]);
  const incidentHistoryCacheRef = useRef(new Map<string, IncidentHistoryEntry[]>());
  const submittingIncidentRef = useRef(false);
  const [directorioCargando, setDirectorioCargando] = useState(pageId === 'vecinos');
  const pageMarkup = useMemo(() => referenceFor(pageId), [pageId]);
  const { darkMode } = useTheme();
  const pageTitle = title || pageId;
  const workflows = useMemo(() => workflowPages, [workflowPages]);

  useEffect(() => {
    const frameDocument = frameRef.current?.contentDocument;
    if (!frameDocument?.head) return;
    const existing = frameDocument.getElementById('neighnetz-amoled-theme');
    existing?.remove();
    if (!darkMode) {
      frameDocument.documentElement?.removeAttribute('data-theme');
      return;
    }
    if (frameDocument.documentElement) frameDocument.documentElement.dataset.theme = 'amoled';
    const style = frameDocument.createElement('style');
    style.id = 'neighnetz-amoled-theme';
    style.textContent = STITCH_AMOLED_THEME;
    frameDocument.head.append(style);
  }, [darkMode, frameVersion]);

  const createIncident = useCallback(async (frameDocument: Document) => {
    if (submittingIncidentRef.current) return;
    const modal = frameDocument.getElementById('new-incident-modal');
    const submitButton = frameDocument.getElementById('submit-incident-btn') as HTMLButtonElement | null;
    const textInputs = [...(modal?.querySelectorAll<HTMLInputElement>('input[type="text"]') || [])];
    const selects = [...(modal?.querySelectorAll<HTMLSelectElement>('select') || [])];
    const titleInput = textInputs[0];
    const locationInput = textInputs[1];
    const descriptionInput = modal?.querySelector<HTMLTextAreaElement>('textarea');
    const title = titleInput?.value.trim() || '';
    const category = selects[0]?.value || '';
    const priority = selects[1]?.value || 'media';
    const locationText = locationInput?.value.trim() || '';
    const description = descriptionInput?.value.trim() || '';

    if (!auth.currentUser || !datosVecino?.uid || !datosVecino.idComunidad) {
      toast.error('No se ha podido identificar tu cuenta o comunidad. Vuelve a iniciar sesión e inténtalo de nuevo.');
      return;
    }
    if (!title || !category || !locationText || !description) {
      toast.error('Completa el título, categoría, ubicación y descripción.');
      return;
    }

    submittingIncidentRef.current = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Registrando…';
    }

    let uploadedPaths: string[] = [];
    let incidentSaved = false;
    try {
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdTokenResult(true);
      if (token.claims.role !== 'authenticated') {
        throw new Error('La sesión aún no tiene el permiso de almacenamiento. Cierra sesión y vuelve a entrar.');
      }

      const incidentRef = doc(collection(db, 'incidencias'));
      uploadedPaths = await uploadIncidentImages(incidentImagesRef.current, currentUser.uid, incidentRef.id);
      await setDoc(incidentRef, {
        titulo: title,
        categoria: category,
        prioridad: priority,
        ubicacion: locationText,
        descripcion: description,
        estado: 'pendiente',
        idVecino: currentUser.uid,
        creador: currentUser.uid,
        nombreCreador: currentUser.displayName || currentUser.email || 'Vecino',
        idComunidad: datosVecino.idComunidad,
        imagenes: uploadedPaths,
        fechaCreacion: serverTimestamp(),
      });
      incidentSaved = true;
      incidentImagesRef.current = [];
      if (titleInput) titleInput.value = '';
      if (locationInput) locationInput.value = '';
      if (descriptionInput) descriptionInput.value = '';
      selects.forEach((select, index) => { select.selectedIndex = index === 0 ? 0 : 1; });
      const imageInput = frameDocument.getElementById('incident-image-input') as HTMLInputElement | null;
      if (imageInput) imageInput.value = '';
      const imageFeedback = frameDocument.getElementById('incident-image-feedback');
      if (imageFeedback) imageFeedback.textContent = '';
      modal?.classList.add('hidden');
      toast.success('Incidencia registrada correctamente.');
    } catch (error) {
      if (!incidentSaved && uploadedPaths.length) {
        try { await removeIncidentImages(uploadedPaths); } catch (cleanupError) {
          console.error('No se pudieron limpiar las imágenes de una incidencia fallida:', cleanupError);
        }
      }
      console.error('No se pudo registrar la incidencia:', error);
      toast.error(error instanceof Error ? error.message : 'No se pudo registrar la incidencia.');
    } finally {
      submittingIncidentRef.current = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Registrar Incidencia';
      }
    }
  }, [datosVecino]);

  useEffect(() => {
    if (pageId === 'login') return undefined;
    if (pageId === 'vecinos') setDirectorioCargando(true);
    const communityId = datosVecino?.idComunidad;
    if (!isAdmin && !communityId) { setDirectorioVecinos([]); setDirectorioCargando(false); return undefined; }
    const residentsQuery = isAdmin
      ? collection(db, 'vecinos')
      : query(collection(db, 'vecinosPublicos'), where('idComunidad', '==', communityId), where('activo', '==', true));
    const unsubscribe = onSnapshot(residentsQuery, (snapshot) => {
      const residents = snapshot.docs
        .map((residentDoc) => {
          const residentData = residentDoc.data();
          return { id: String(residentData.idFicha || residentDoc.id), ...residentData } as VecinoData;
        })
        .filter((resident) => !resident.estado || ['activo', 'validado', 'confirmado', 'aprobado'].includes(resident.estado.toLowerCase()));
      setDirectorioVecinos(residents);
      setDirectorioCargando(false);
    }, (error) => {
      console.error('Error al cargar el directorio de vecinos:', error);
      setDirectorioCargando(false);
      toast.error('No se pudo cargar el directorio de vecinos.');
    });
    return unsubscribe;
  }, [pageId, isAdmin, datosVecino?.idComunidad]);

  useEffect(() => {
    if (pageId !== 'vecinos') return undefined;
    const housingQuery = isAdmin ? collection(db, 'viviendas') : query(collection(db, 'viviendas'), where('idComunidad', '==', datosVecino?.idComunidad));
    return onSnapshot(housingQuery, (snapshot) => {
      setDirectorioViviendas(snapshot.docs.map((home) => ({ id: home.id, ...home.data() } as HousingAssetData)));
    }, (error) => {
      console.error('No se pudieron cargar las asignaciones de viviendas:', error);
      toast.error('No se pudieron cargar los números de garaje y trastero.');
    });
  }, [pageId, isAdmin, datosVecino?.idComunidad]);

  useEffect(() => {
    if (!['tablón', 'incidencias'].includes(pageId)) return undefined;
    setIncidenciasComunidad([]);
    const communityId = datosVecino?.idComunidad;
    if (!communityId) {
      setIncidenciasLoadState('error');
      return undefined;
    }
    setIncidenciasLoadState('loading');
    const incidentsQuery = query(collection(db, 'incidencias'), where('idComunidad', '==', communityId));
    let active = true;
    const applySnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      setIncidenciasComunidad(snapshot.docs.map((incident) => ({ id: incident.id, ...incident.data() } as IncidenciaData)));
      setIncidenciasLoadState('ready');
    };
    // getDocs provides a one-shot initial result even when the realtime listener
    // is delayed while Firestore reconnects; onSnapshot keeps it current after.
    void getDocs(incidentsQuery).then((snapshot) => {
      if (active) applySnapshot(snapshot);
    }).catch((error) => {
      console.error('No se pudieron obtener las incidencias iniciales:', error);
      if (active) toast.error(`No se pudieron cargar las incidencias (${error instanceof Error ? error.message : 'error de Firebase'}).`);
      if (active) setIncidenciasLoadState('error');
    });
    const unsubscribe = onSnapshot(incidentsQuery, (snapshot) => {
      if (active) applySnapshot(snapshot);
    }, (error) => {
      console.error('No se pudieron cargar las incidencias del tablón:', error);
      if (active) setIncidenciasLoadState((state) => state === 'ready' ? state : 'error');
      if (active) toast.error(`No se pudieron cargar las incidencias (${error.message || error.code}).`);
    });
    return () => { active = false; unsubscribe(); };
  }, [datosVecino?.idComunidad, pageId]);

  const openWorkflow = useCallback((key: string, data?: Workflow['data']) => setWorkflow({ key, data }), []);
  const routeFor = useCallback((key: string) => {
    if (isAdmin) return {
      dashboard: '/dashboard', 'dashboard-incidencias': '/dashboard/incidencias',
      'dashboard-reservas': '/dashboard/reservas', 'dashboard-documentos': '/dashboard/documentos',
      'dashboard-vecinos': '/admin/vecinos', 'dashboard-gastos': '/admin/gastos',
      'dashboard-perfil': '/dashboard/perfil', 'dashboard-votaciones': '/dashboard/votaciones',
      admin: '/dashboard', 'admin-usuarios': '/admin/usuarios',
      'admin-incidencias': '/admin/incidencias', 'admin-reservas': '/admin/reservas',
      'admin-documentos': '/admin/documentos',
    }[key as keyof typeof pageRoutes] || pageRoutes[key];
    return pageRoutes[key] || (key === 'admin' ? '/dashboard' : null);
  }, [datosVecino?.rol, isAdmin]);

  const handleLogin = useCallback(async (frameDocument: Document) => {
    const form = frameDocument.getElementById('auth-form') as HTMLFormElement | null;
    if (!form) return;
    const readFormValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '';
    if (!form.reportValidity()) return;
    if (loginMode === 'register') {
      const email = readFormValue('email').trim();
      const password = readFormValue('password');
      setBusy(true);
      setLoginError('');
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setLoginError(`Te enviamos un correo de verificación a ${email}. Cuando lo confirmes, inicia sesión: si el correo ya figura en el directorio, vincularemos tu ficha existente automáticamente.`);
      } catch (error) {
        setLoginError(authError(error));
      } finally { setBusy(false); }
      return;
    }
    setBusy(true);
    setLoginError('');
    try {
      const credential = await signInWithEmailAndPassword(auth, readFormValue('email').trim(), readFormValue('password'));
      if (isDeveloperEmail(credential.user.email)) { navigate('/developer', { replace: true }); return; }
      const snapshot = await findResidentProfile(credential.user);
      if (!snapshot?.exists()) { navigate('/registro-datos', { replace: true }); return; }
      const resident = snapshot.data();
      if (!hasAdministratorAccess(resident) && ['pendiente_de_confirmacion', 'pendienteValidacion', 'pendiente', 'en_revision'].includes(resident.estado)) {
        setLoginError('Tu solicitud está pendiente de validación por la administración.');
        return;
      }
      navigate('/dashboard', { replace: true });
    } catch (error) { setLoginError(authError(error)); }
    finally { setBusy(false); }
  }, [loginMode, navigate]);

  useEffect(() => {
    if (!frameVersion) return undefined;
    const frameDocument = frameRef.current?.contentDocument;
    if (!frameDocument?.head || !frameDocument?.body) return undefined;
    frameDocument.documentElement?.classList?.add('stitch-frame-header-hidden');
    let headerStyle = frameDocument.getElementById('neighnetz-single-header-style') as HTMLStyleElement | null;
    if (!headerStyle) {
      headerStyle = frameDocument.createElement('style');
      headerStyle.id = 'neighnetz-single-header-style';
      frameDocument.head.append(headerStyle);
    }
    headerStyle.textContent = 'body > aside { display: none !important; } body > div.pl-72 { padding-left: 0 !important; } body > div.pl-72 > header { display: none !important; } body > div.pl-72 > main { padding-top: 0 !important; }';
    applyResidentIdentity(frameDocument, pageId, datosVecino, firebaseUser);
    applyCommunityIdentity(frameDocument);
    if (pageId === 'perfil') {
      const profileMain = frameDocument.querySelector('main');
      if (profileMain && !frameDocument.getElementById('join-community-section')) {
        const section = frameDocument.createElement('section');
        section.id = 'join-community-section';
        section.className = 'mx-auto w-full max-w-5xl px-space-lg pb-space-xl';
        section.innerHTML = `<div class="rounded-xl border border-border-subtle bg-surface-container-lowest p-space-lg shadow-sm"><div class="flex flex-col gap-space-md sm:flex-row sm:items-center sm:justify-between"><div class="flex items-start gap-space-sm"><span class="material-symbols-outlined flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-secondary">apartment</span><div><h2 class="font-headline-sm text-headline-sm text-on-surface">Tus comunidades</h2><p class="mt-1 font-body-sm text-body-sm text-on-surface-variant">Inscríbete en otra comunidad con su código de acceso. La administración tendrá que aprobar la solicitud antes de darte acceso.</p></div></div><button id="join-community-button" type="button" class="inline-flex min-h-11 shrink-0 items-center justify-center gap-space-xs rounded-lg bg-primary px-space-lg py-space-sm font-label-md text-label-md text-on-primary shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary"><span class="material-symbols-outlined text-[18px]">add_home</span><span>Inscribirme en otra comunidad</span></button></div></div>`;
        (profileMain.firstElementChild || profileMain).append(section);
      }
      const profileForm = frameDocument.getElementById('profile-form') as HTMLFormElement | null;
      if (profileForm && !frameDocument.getElementById('save-profile-btn')) {
        const btnContainer = frameDocument.createElement('div');
        btnContainer.className = 'flex justify-end pt-space-xs';
        btnContainer.innerHTML = `<button id="save-profile-btn" type="submit" class="flex items-center justify-center gap-space-xs px-space-lg py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all shadow-sm cursor-pointer"><span class="material-symbols-outlined text-[18px]">save</span><span>Guardar Cambios</span></button>`;
        profileForm.append(btnContainer);
      }
    }
    if (pageId === 'tablón') {
      setDashboardNoticeTarget(null);
      ensureIncidentModal(frameDocument);
      const noticesHeading = [...frameDocument.querySelectorAll<HTMLElement>('h2')]
        .find((heading) => heading.textContent?.trim() === 'Tablón de Avisos de la Comunidad');
      const noticeSection = noticesHeading?.closest<HTMLElement>('div.bg-surface-container-lowest');
      const noticeList = noticeSection && [...noticeSection.children].find((child) => child.classList.contains('flex')
        && child.classList.contains('flex-col') && child.classList.contains('gap-space-sm'));
      if (noticeList) {
        const mount = frameDocument.createElement('div');
        mount.className = 'dashboard-community-feed';
        noticeList.append(mount);
        setDashboardNoticeTarget(mount);
      }
      const viewAll = [...(noticeSection?.querySelectorAll<HTMLAnchorElement>('a') || [])]
        .find((link) => /ver todos/i.test(link.textContent || ''));
      if (viewAll) {
        viewAll.dataset.path = 'dashboard-comunidad';
        viewAll.href = '/dashboard/comunidad';
        viewAll.textContent = 'Ver todos';
      }
      applyCommunityIdentity(frameDocument);
    } else {
      setDashboardNoticeTarget(null);
    }
    if (pageId === 'incidencias' && (location.state as { openNewIncident?: boolean } | null)?.openNewIncident) {
      frameDocument.getElementById('new-incident-modal')?.classList.remove('hidden');
      navigate(location.pathname, { replace: true, state: null });
    }
    if (pageId !== 'vecinos' && directorioVecinos.length > 0) assignMockResidents(frameDocument, directorioVecinos, datosVecino);
    if (pageId === 'tablón') applyDashboardIncidencePresentation(frameDocument, incidenciasComunidad, datosVecino?.uid, incidenciasLoadState);
    if (pageId === 'incidencias') {
      applyIncidenceSummary(frameDocument, incidenciasComunidad, incidenciasLoadState, datosVecino?.uid);
      renderIncidenceCards(frameDocument, incidenciasComunidad, datosVecino?.uid, incidenciasLoadState);
    }
    const cleanupIncidenceFilters = pageId === 'incidencias' && incidenciasLoadState === 'ready'
      ? setupIncidenceFilters(frameDocument, datosVecino?.uid)
      : () => undefined;
    const cleanupIncidentImagePicker = ['tablón', 'incidencias'].includes(pageId)
      ? setupIncidentImagePicker(frameDocument, (files) => { incidentImagesRef.current = files; })
      : () => undefined;
    const cleanupProfilePhotoPicker = pageId === 'perfil'
      ? setupProfilePhotoPicker(frameDocument, datosVecino, firebaseUser)
      : () => undefined;
    if (pageId === 'vecinos') {
      const selectResident = (resident: VecinoData) => {
        const canEditResident = isAdmin;
        populateResidentDetails(frameDocument, resident, datosVecino, canEditResident, (saved) => {
          setDirectorioVecinos((previous) => previous.map((entry) => entry.id === saved.id ? saved : entry));
          populateResidentDetails(frameDocument, saved, datosVecino, canEditResident, (updated) => {
            setDirectorioVecinos((previous) => previous.map((entry) => entry.id === updated.id ? updated : entry));
          });
        });
        const details = frameDocument.getElementById('ficha-vecino-container');
        if (details) {
          details.hidden = false;
          details.classList.remove('hidden');
        }
      };
      populateResidentDirectory(frameDocument, directorioVecinos, directorioViviendas, datosVecino, selectResident);
      if (directorioCargando) {
        const list = frameDocument.getElementById('residents-list');
        if (list) {
          const loading = frameDocument.createElement('p');
          loading.className = 'rounded-xl bg-surface-container-lowest p-space-lg text-center text-on-surface-variant';
          loading.textContent = 'Cargando vecinos de la comunidad…';
          list.replaceChildren(loading);
        }
      } else {
        const details = frameDocument.getElementById('ficha-vecino-container');
        if (details) {
          details.hidden = true;
          details.classList.add('hidden');
        }
      }
    }
    if (pageId === 'login') {
      frameDocument.querySelector<HTMLElement>('main > div')?.style.setProperty('margin-bottom', 'auto', 'important');
    }

    const showMessage = (message: string) => {
      const form = frameDocument.getElementById('auth-form') as HTMLFormElement | null;
      if (!form) return;
      let alert = form.querySelector<HTMLElement>('[data-auth-feedback]');
      if (!alert) {
        alert = frameDocument.createElement('p');
        alert.dataset.authFeedback = 'true';
        alert.setAttribute('role', 'alert');
        alert.className = 'text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2';
        form.prepend(alert);
      }
      alert.textContent = message;
      alert.hidden = !message;
    };
    const updateMode = (mode: 'login' | 'register') => {
      setLoginMode(mode);
      setLoginError('');
      const register = mode === 'register';
      frameDocument.getElementById('housing-data-section')?.classList.toggle('hidden', !register);
      frameDocument.getElementById('remember-session-wrapper')?.classList.toggle('hidden', register);
      const titleElement = frameDocument.getElementById('panel-title');
      if (titleElement) titleElement.textContent = register ? 'Registro de Nuevo Vecino' : 'Bienvenido de nuevo';
      const buttonLabel = frameDocument.querySelector('#submit-btn span:first-child');
      if (buttonLabel) buttonLabel.textContent = register ? 'Solicitar Alta en Comunidad' : 'Acceder a mi Comunidad';
      ['login', 'register'].forEach((name) => {
        const tab = frameDocument.getElementById(`tab-${name}`);
        if (!tab) return;
        const selected = name === mode;
        tab.setAttribute('aria-pressed', String(selected));
        tab.classList.toggle('bg-surface-card', selected);
        tab.classList.toggle('text-on-surface', selected);
        tab.classList.toggle('shadow-sm', selected);
        tab.classList.toggle('text-on-surface-variant', !selected);
        tab.classList.toggle('hover:text-on-surface', !selected);
        tab.classList.toggle('font-semibold', !selected);
        tab.classList.toggle('font-bold', selected);
      });
    };
    const click = async (event: MouseEvent) => {
      const rawTarget = event.target as HTMLElement | null;
      if (pageId === 'tablón' && /ver reglamento en pdf/i.test(rawTarget?.textContent || '')) {
        event.preventDefault();
        toast('Sin archivos adjuntos en versión Demo');
        return;
      }
      const element = rawTarget?.closest<HTMLElement>('a,button,[role="button"],[data-incidence-summary-card],[data-dashboard-destination]');
      if (!element) return;
      if (pageId === 'perfil' && element.closest('#join-community-button')) {
        event.preventDefault();
        openWorkflow('join-community', { datosVecino });
        return;
      }
      if (pageId === 'vecinos' && element.dataset.messageResidentUid !== undefined) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const resident = directorioVecinos.find((entry) => entry.uid === element.dataset.messageResidentUid
          || entry.id === element.dataset.messageResidentId);
        if (resident?.uid === datosVecino?.uid || resident?.id === datosVecino?.id) {
          toast('Esta es tu propia ficha de contacto.');
        } else {
          let messagingIsEnabled = resident?.chatEnabled === true;
          if (resident && !messagingIsEnabled && isAdmin && resident.uid && resident.id) {
            try {
              const access = await getDoc(doc(db, 'usuariosAcceso', resident.uid));
              const hasActiveAccount = access.exists()
                && access.get('activo') === true
                && access.get('idFicha') === resident.id
                && access.get('idComunidad') === resident.idComunidad;
              if (hasActiveAccount) {
                await updateDoc(doc(db, 'vecinosPublicos', resident.id), {
                  uid: resident.uid,
                  chatEnabled: true,
                });
                messagingIsEnabled = true;
              }
            } catch (error) {
              console.error('No se pudo comprobar la cuenta de mensajería del vecino:', error);
            }
          }

          if (!resident?.uid || !messagingIsEnabled) {
            toast('Este vecino todavía no tiene una cuenta activa para recibir mensajes.');
          } else {
            navigate(`/dashboard/mensajes?with=${encodeURIComponent(resident.uid)}`);
          }
        }
        return;
      }
      if (pageId === 'vecinos' && /aviso legal/i.test(labelText(element))) {
        event.preventDefault();
        event.stopPropagation();
        return;
        return;
      }
      if (pageId === 'login' && element.tagName.toLocaleLowerCase() === 'a' && element.dataset.legalPath) {
        event.preventDefault();
        event.stopPropagation();
        navigate(element.dataset.legalPath);
        return;
      }
      if (pageId === 'incidencias' && element.dataset.incidentId) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const incident = incidenciasComunidad.find((item) => item.id === element.dataset.incidentId);
        if (incident) {
          const currentName = [datosVecino?.datosPersonales?.nombre || datosVecino?.nombre || firebaseUser?.displayName, datosVecino?.datosPersonales?.apellidos || datosVecino?.apellidos].filter(Boolean).join(' ') || firebaseUser?.email || 'Vecino';
          const canModerate = canModerateIncidentHistory(datosVecino, isAdmin);
          void loadIncidentHistory(incident).then((entries) => {
            incidentHistoryCacheRef.current.set(incident.id, entries);
            showIncidentTracking(frameDocument, incident, datosVecino?.uid || firebaseUser?.uid, currentName, datosVecino?.cargo, canModerate, entries);
          }).catch((error) => {
            console.error('No se pudo cargar el historial de la incidencia:', error);
            toast.error('No se pudo cargar el historial de esta incidencia.');
          });
        }
        return;
      }
      if (element.closest('#incident-tracking-modal')) {
        if (element.hasAttribute('data-close-incident-tracking')) {
          frameDocument.getElementById('incident-tracking-modal')?.classList.add('hidden');
        } else if (element.hasAttribute('data-history-cancel')) {
          const modal = frameDocument.getElementById('incident-tracking-modal');
          const incidentId = modal?.dataset.incidentId;
          const incident = incidenciasComunidad.find((item) => item.id === incidentId);
          if (incident) {
            const currentName = [datosVecino?.datosPersonales?.nombre || datosVecino?.nombre || firebaseUser?.displayName, datosVecino?.datosPersonales?.apellidos || datosVecino?.apellidos].filter(Boolean).join(' ') || firebaseUser?.email || 'Vecino';
            void loadIncidentHistory(incident).then((entries) => {
              incidentHistoryCacheRef.current.set(incident.id, entries);
              showIncidentTracking(frameDocument, incident, datosVecino?.uid || firebaseUser?.uid, currentName, datosVecino?.cargo, canModerateIncidentHistory(datosVecino, isAdmin), entries);
            }).catch((error) => console.error('No se pudo volver a cargar el historial:', error));
          }
        } else if (element.dataset.historyAction) {
          event.preventDefault();
          const item = element.closest<HTMLElement>('[data-history-entry-id]');
          const entryId = item?.dataset.historyEntryId;
          const incidentId = frameDocument.getElementById('incident-tracking-modal')?.dataset.incidentId;
          if (!item || !entryId || !incidentId || !datosVecino?.uid) return;
          const selectedEntry = incidentHistoryCacheRef.current.get(incidentId)?.find((entry) => entry.id === entryId);
          if (!selectedEntry || selectedEntry.eliminado) return;
          const canModerate = canModerateIncidentHistory(datosVecino, isAdmin);
          if (element.dataset.historyAction === 'edit') {
            if ((selectedEntry.autorUid || selectedEntry.autor) !== datosVecino.uid) return;
            const text = item.querySelector('p')?.textContent || '';
            const form = frameDocument.createElement('form');
            form.id = 'incident-history-form';
            form.dataset.editEntryId = entryId;
            const textarea = frameDocument.createElement('textarea');
            textarea.name = 'detalle';
            textarea.required = true;
            textarea.maxLength = 2000;
            textarea.rows = 3;
            textarea.className = 'w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-space-sm text-on-surface focus:border-primary focus:outline-none';
            textarea.value = text;
            const save = frameDocument.createElement('button');
            save.type = 'submit';
            save.className = 'mt-space-xs rounded-lg bg-primary px-space-sm py-1 font-label-sm text-label-sm font-bold text-on-primary';
            save.textContent = 'Guardar';
            const cancel = frameDocument.createElement('button');
            cancel.type = 'button';
            cancel.dataset.historyCancel = 'true';
            cancel.className = 'ml-space-sm font-label-sm text-label-sm text-on-surface-variant';
            cancel.textContent = 'Cancelar';
            form.append(textarea, save, cancel);
            item.replaceChildren(form);
            textarea.focus();
          } else if (element.dataset.historyAction === 'delete') {
            if (!frameDocument.defaultView?.confirm('¿Eliminar este registro del historial?')) return;
            const isOwner = (selectedEntry.autorUid || selectedEntry.autor) === datosVecino.uid;
            if (!isOwner && !canModerate) {
              toast.error('No tienes permiso para eliminar este comentario.');
              return;
            }
            const currentName = [datosVecino.datosPersonales?.nombre || datosVecino.nombre || firebaseUser?.displayName, datosVecino.datosPersonales?.apellidos || datosVecino.apellidos].filter(Boolean).join(' ') || firebaseUser?.email || 'Vecino';
            const currentCargo = datosVecino.cargo || datosVecino.rol || 'Vecino';
            try {
              await updateDoc(doc(db, 'incidencias', incidentId, 'historial', entryId), {
                eliminado: true,
                eliminadoPorUid: datosVecino.uid,
                eliminadoPorNombre: currentName,
                eliminadoPorCargo: currentCargo,
                fechaEliminacion: serverTimestamp(),
              });
              const fresh = await getDoc(doc(db, 'incidencias', incidentId));
              if (fresh.exists()) {
                const updatedIncident = { id: fresh.id, ...fresh.data() } as IncidenciaData;
                const entries = await loadIncidentHistory(updatedIncident);
                incidentHistoryCacheRef.current.set(incidentId, entries);
                showIncidentTracking(frameDocument, updatedIncident, datosVecino.uid, currentName, currentCargo, canModerate, entries);
              }
              toast.success('Comentario eliminado.');
            } catch (error) {
              console.error('No se pudo eliminar el registro de seguimiento:', error);
              toast.error('No se pudo eliminar el registro. Comprueba tus permisos e inténtalo de nuevo.');
            }
          }
        }
        return;
      }
      if (element.dataset.dashboardDestination) {
        event.preventDefault();
        const next = routeFor(element.dataset.dashboardDestination);
        if (next) navigate(next);
        return;
      }
      if (element.closest('[data-incidence-summary-card]')) {
        event.preventDefault();
        navigate('/dashboard/incidencias');
        return;
      }
      if (pageId === 'perfil' && element.matches('[data-focus-password-form]')) {
        event.preventDefault();
        const passwordForm = frameDocument.getElementById('password-form');
        passwordForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (frameDocument.getElementById('current_password') as HTMLInputElement | null)?.focus({ preventScroll: true });
        return;
      }
      if (pageId === 'perfil' && element.matches('[data-forgot-password]')) {
        event.preventDefault();
        const email = firebaseUser?.email;
        if (!email) { toast.error('No encontramos el correo electrónico asociado a tu sesión.'); return; }
        try {
          await sendPasswordResetEmail(auth, email);
          toast.success(`Enlace de recuperación enviado a ${email}.`);
        } catch (error) {
          toast.error(authError(error));
        }
        return;
      }
      const link = element.closest<HTMLAnchorElement>('a[data-path]');
      if (link) {
        event.preventDefault();
        const next = routeFor(link.dataset.path ?? '');
        if (next) navigate(next);
        return;
      }
      if (pageId === 'login') {
        const demoEntryButton = element.closest<HTMLElement>('[data-demo-entry]');
        if (demoEntryButton) {
          event.preventDefault();
          if (demoEntryButton.dataset.demoEntry === 'admin') {
            loginAsAdmin();
            navigate('/admin', { replace: true });
          } else {
            loginAsOwner();
            navigate('/dashboard', { replace: true });
          }
          return;
        }
        if (element.id === 'tab-login') { event.preventDefault(); updateMode('login'); return; }
        if (element.id === 'tab-register') { event.preventDefault(); updateMode('register'); return; }
      if (element.closest('#recovery-modal')) {
          const label = (element.innerText || '').trim();
          if (/enviar enlace/i.test(label)) {
            event.preventDefault();
            const email = (frameDocument.getElementById('recovery-email') as HTMLInputElement | null)?.value.trim();
            if (!email) { frameDocument.getElementById('recovery-email')?.focus(); return; }
            try { await sendPasswordResetEmail(auth, email); toast.success('Enlace de recuperación enviado.'); frameDocument.getElementById('recovery-modal')?.classList.add('hidden'); }
            catch (error) { setLoginError(authError(error)); showMessage(authError(error)); }
          } else if (/cancelar|close|cerrar/i.test(`${label} ${element.getAttribute('aria-label') || ''}`)) frameDocument.getElementById('recovery-modal')?.classList.add('hidden');
          return;
        }
        if (element.matches('input[type="checkbox"]')) return;
        if (/forgot|recover|olvidado/i.test(element.getAttribute('onclick') || '') || element.closest('a')?.textContent.match(/olvidado/i)) {
          event.preventDefault();
          const recovery = frameDocument.getElementById('recovery-modal');
          const value = (frameDocument.getElementById('email') as HTMLInputElement | null)?.value || '';
          const input = frameDocument.getElementById('recovery-email') as HTMLInputElement | null;
          if (input) input.value = value;
          recovery?.classList.remove('hidden');
          input?.focus();
          return;
        }
        if (/continuar con google/i.test(element.textContent || '')) {
          event.preventDefault(); setBusy(true); setLoginError('');
          try {
            const credential = await signInWithPopup(auth, new GoogleAuthProvider());
            if (isDeveloperEmail(credential.user.email)) { navigate('/developer', { replace: true }); return; }
            const snapshot = await findResidentProfile(credential.user);
            navigate(snapshot?.exists() ? '/dashboard' : '/registro-datos', { replace: true });
          } catch (error) { setLoginError(authError(error)); showMessage(authError(error)); }
          finally { setBusy(false); }
          return;
        }
        if (element.closest('#auth-form') && (element.id === 'submit-btn' || (element as HTMLButtonElement).type === 'submit')) {
          event.preventDefault(); await handleLogin(frameDocument); return;
        }
        if (element.querySelector('#password-toggle-icon')) {
          const password = frameDocument.getElementById('password') as HTMLInputElement | null;
          if (password) password.type = password.type === 'password' ? 'text' : 'password';
        }
        return;
      }
      const actionRules: Record<string, Array<[RegExp, string]>> = {
        'tablón': [[/nueva reserva|reservas/i, 'reservas'], [/reportar incidencia/i, 'incidencias'], [/emitir mi voto|memoria pdf|votaciones/i, 'votaciones'], [/actas oficiales|documentos/i, 'documentos']],
        incidencias: [[/reportar nueva incidencia|nueva incidencia|registrar incidencia/i, 'incidencias']],
        reservas: [[/reservar|solicitar reserva|consultar disponibilidad|cancelar/i, 'reservas']],
        votaciones: [[/emitir mi voto|votar|crear votaci[oó]n/i, 'votaciones']],
        documentos: [[/subir documento|crear carpeta|descargar|configurar/i, 'documentos']],
        perfil: [[/guardar cambios|actualizar contraseña|cerrar sesi[oó]n/i, 'perfil']],
        vecinos: [[/contactar|mensaje comunitario|transmitir aviso|enviar aviso urgente/i, 'vecinos']],
        gastos: [[/exportar balance|reclamar/i, 'gastos']],
        'admin-panel': [[/revisar|detalles de incidencia/i, 'admin-incidencias'], [/aprobar|autorizar|validar/i, 'admin-usuarios'], [/bloquear|reserva|franja/i, 'admin-reservas'], [/nuevo comunicado|informe mensual/i, 'admin-panel']],
        'admin-usuarios': [[/aprobar|ratificar|subsanaci[oó]n|rechazar|visualizar/i, 'admin-usuarios']],
        'admin-incidencias': [[/alta aver[ií]a|guardar nota|subir parte|resolver|reasignar|ver ficha/i, 'admin-incidencias']],
        'admin-reservas': [[/bloquear|validar acceso|anular|liberar|reembolsar|reclamar/i, 'admin-reservas']],
        'admin-documentos': [[/nueva carpeta|subir documento|configurar|eliminar|borrar/i, 'admin-documentos']],
      };
      if (['tablón', 'incidencias'].includes(pageId) && ['close-modal-btn', 'cancel-modal-btn'].includes(element.id)) {
        frameDocument.getElementById('new-incident-modal')?.classList.add('hidden');
        return;
      }
      if (pageId === 'incidencias' && element.id === 'open-modal-btn') {
        event.preventDefault();
        frameDocument.getElementById('new-incident-modal')?.classList.remove('hidden');
        return;
      }
      if (['tablón', 'incidencias'].includes(pageId) && element.id === 'submit-incident-btn') {
        event.preventDefault(); event.stopPropagation();
        void createIncident(frameDocument);
        return;
      }
      if (pageId === 'reservas' && /cancelar reserva/i.test(labelText(element))) {
        event.preventDefault();
        event.stopPropagation();
        if (workflows.reservas) openWorkflow('reservas', { datosVecino });
        else toast('La cancelación se gestiona desde Mis Reservas.');
        return;
      }
      if (pageId === 'tablón' && /cancelar/i.test(labelText(element))) {
        event.preventDefault(); event.stopPropagation();
        if (workflows.reservas) openWorkflow('reservas', { datosVecino });
        return;
      }
      if (pageId === 'votaciones' && element.closest('#submit-vote-btn')) {
        event.preventDefault(); event.stopPropagation();
        if (workflows.votaciones) openWorkflow('votaciones', { datosVecino });
        else toast('Selecciona una opción para registrar tu voto.');
        return;
      }
      if (pageId === 'perfil' && element.matches('input[type="checkbox"]')) {
        const card = element.closest('[onclick*="toggleCheckbox"]');
        if (card && event.target !== element) (element as HTMLInputElement).checked = !(element as HTMLInputElement).checked;
      }
      if (pageId === 'perfil' && element.closest('#profile-form')) {
        if (!element.matches('button[type="submit"], button[type="submit"] *')) {
          // allow clicking inputs and labels
        }
        return;
      }
      if (pageId === 'perfil' && element.closest('#password-form')) {
        event.preventDefault(); event.stopPropagation();
        toast('Actualiza la contraseña desde el formulario de seguridad del perfil.');
        return;
      }
      if (pageId === 'admin-documentos' && element.closest('#upload-drawer')) {
        if (element.matches('button[type="submit"]')) {
          event.preventDefault(); event.stopPropagation();
          toast('Subida simulada disponible desde el gestor documental de la Demo.');
        } else if (/cancelar/i.test(labelText(element))) {
          frameDocument.getElementById('upload-drawer')?.classList.add('translate-x-full');
        }
        return;
      }
      if (pageId === 'admin-documentos' && element.closest('#modal-new-folder')) {
        if (/crear carpeta/i.test(labelText(element))) {
          event.preventDefault(); event.stopPropagation();
          frameDocument.getElementById('modal-new-folder')?.classList.add('hidden');
          if (workflows['admin-documentos']) openWorkflow('admin-documentos', { datosVecino });
        } else if (/cancelar|close|cerrar/i.test(labelText(element))) {
          frameDocument.getElementById('modal-new-folder')?.classList.add('hidden');
        }
        return;
      }
      if (pageId === 'admin-documentos' && /nueva carpeta|subir documento oficial/i.test(labelText(element))) {
        const folder = frameDocument.getElementById('modal-new-folder');
        if (/nueva carpeta/i.test(labelText(element))) folder?.classList.remove('hidden');
        else frameDocument.getElementById('upload-drawer')?.classList.remove('translate-x-full');
        return;
      }
      if (pageId === 'admin-documentos' && element.matches('input[type="file"]')) {
        const name = (element as HTMLInputElement).files?.[0]?.name;
        if (name) toast(`Archivo seleccionado: ${name}. Puedes probar la carga en memoria desde el repositorio.`);
        return;
      }
      if (pageId === 'gastos' && element.closest('#fiscal-selector')) {
        toast('El selector de ejercicio muestra los datos de referencia de la maqueta.');
        return;
      }
      if (pageId === 'gastos' && /exportar balance/i.test(labelText(element))) {
        event.preventDefault();
        toast('La exportación estará disponible cuando se conecte el informe a los gastos de la comunidad.');
        return;
      }
      const label = labelText(element);
      if (pageId === 'documentos' && /subir documento/i.test(label)) {
        event.preventDefault(); event.stopPropagation();
        openWorkflow('documentos', { datosVecino });
        return;
      }
      if (pageId === 'documentos' && /descargar copia certificada/i.test(label)) {
        event.preventDefault(); event.stopPropagation();
        frameDocument.getElementById('previewModal')?.classList.add('hidden');
        toast('Descarga de archivos no disponible en versión Demo');
        return;
      }
      if (pageId === 'documentos' && element.closest('#previewModal')) {
        if (/cerrar|close/i.test(label)) frameDocument.getElementById('previewModal')?.classList.add('hidden');
        if (/descargar copia certificada/i.test(label)) {
          event.preventDefault(); event.stopPropagation();
          frameDocument.getElementById('previewModal')?.classList.add('hidden');
          toast('Descarga de archivos no disponible en versión Demo');
        }
        return;
      }
      if (pageId === 'documentos' && element.title === 'Vista Previa Rápida') {
        event.preventDefault(); event.stopPropagation();
        frameDocument.getElementById('previewModal')?.classList.remove('hidden');
        toast('Vista de ejemplo: los archivos de esa vista son ilustrativos.');
        return;
      }
      if (pageId === 'admin-documentos' && label === 'Anterior' || pageId === 'admin-documentos' && label === 'Siguiente') {
        event.preventDefault();
        if (workflows['admin-documentos']) openWorkflow('admin-documentos', { datosVecino });
        return;
      }
      if (pageId === 'tablón' && /ver reglamento en pdf/i.test(label)) {
        event.preventDefault();
        toast('Sin archivos adjuntos en versión Demo');
        return;
      }
      if (pageId === 'tablón' && /reportar nueva incidencia|reportar incidencia/i.test(label)) {
        event.preventDefault();
        event.stopPropagation();
        const modal = frameDocument.getElementById('new-incident-modal');
        modal?.classList.remove('hidden');
        modal?.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
        return;
      }
      const match = (actionRules[pageId] || []).find(([pattern]) => pattern.test(label));
      if (match && workflows[match[1]]) {
        event.preventDefault();
        event.stopPropagation();
        openWorkflow(match[1], { datosVecino });
      }
    };
    const keydown = (event: KeyboardEvent) => {
      const dashboardCard = (event.target as Element | null)?.closest<HTMLElement>('[data-dashboard-destination]');
      if (dashboardCard && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const next = routeFor(dashboardCard.dataset.dashboardDestination ?? '');
        if (next) navigate(next);
        return;
      }
      const incidenceCard = (event.target as Element | null)?.closest<HTMLElement>('[data-incidence-summary-card]');
      if (incidenceCard && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        navigate('/dashboard/incidencias');
      }
    };
    const submit = async (event: Event) => {
      if (pageId === 'perfil' && (event.target as HTMLFormElement | null)?.id === 'profile-form') {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const profileDocId = datosVecino?.id || firebaseUser?.uid;
        if (!profileDocId) {
          toast.error('No se encontró tu ficha de perfil.');
          return;
        }
        const firstName = (form.elements.namedItem('first_name') as HTMLInputElement | null)?.value.trim() || '';
        const lastName = (form.elements.namedItem('last_name') as HTMLInputElement | null)?.value.trim() || '';
        const phoneNumber = (form.elements.namedItem('phone_number') as HTMLInputElement | null)?.value.trim() || '';
        const dirConsent = (form.elements.namedItem('dir-consent') as HTMLInputElement | null)?.checked === true;
        if (!firstName) {
          toast.error('El nombre es obligatorio.');
          return;
        }
        const submitBtn = frameDocument.getElementById('save-profile-btn') as HTMLButtonElement | null;
        if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.65'; }
        try {
          const batch = writeBatch(db);
          batch.update(doc(db, 'vecinos', profileDocId), {
            'datosPersonales.nombre': firstName,
            'datosPersonales.apellidos': lastName,
            'datosPersonales.telefono': phoneNumber,
            'datosPersonales.autorizaTelefonoDirectorio': dirConsent,
          });
          batch.update(doc(db, 'vecinosPublicos', profileDocId), {
            telefono: dirConsent ? phoneNumber : '',
            autorizaTelefonoDirectorio: dirConsent,
            'datosPersonales.telefono': dirConsent ? phoneNumber : '',
            'datosPersonales.autorizaTelefonoDirectorio': dirConsent,
          });
          await batch.commit();
          toast.success('Perfil guardado y sincronizado correctamente.');
        } catch (saveError) {
          console.error('Error al guardar el perfil:', saveError);
          toast.error('No se pudieron guardar los cambios del perfil.');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
        }
        return;
      }
      if (pageId === 'perfil' && (event.target as HTMLFormElement | null)?.id === 'password-form') {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const currentPassword = (form.elements.namedItem('current_password') as HTMLInputElement | null)?.value || '';
        const newPassword = (form.elements.namedItem('new_password') as HTMLInputElement | null)?.value || '';
        const confirmPassword = (form.elements.namedItem('confirm_password') as HTMLInputElement | null)?.value || '';
        if (!firebaseUser?.email) { toast.error('No encontramos el correo de tu cuenta.'); return; }
        if (newPassword.length < 8) { toast.error('La nueva contraseña debe tener al menos 8 caracteres.'); return; }
        if (newPassword !== confirmPassword) { toast.error('La confirmación no coincide con la nueva contraseña.'); return; }
        try {
          await reauthenticateWithCredential(firebaseUser, EmailAuthProvider.credential(firebaseUser.email, currentPassword));
          await updatePassword(firebaseUser, newPassword);
          form.reset();
          toast.success('Contraseña actualizada correctamente.');
        } catch (error) {
          toast.error(authError(error));
        }
        return;
      }
      if (pageId === 'login' && event.target instanceof Element && event.target.id === 'auth-form') {
        event.preventDefault(); handleLogin(frameDocument);
        return;
      }
      if (pageId === 'incidencias' && (event.target as HTMLFormElement | null)?.id === 'incident-history-form') {
        event.preventDefault();
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;
        const modal = frameDocument.getElementById('incident-tracking-modal');
        const incidentId = modal?.dataset.incidentId;
        const detail = form.querySelector<HTMLTextAreaElement>('textarea[name="detalle"]')?.value.trim();
        const currentUid = datosVecino?.uid || firebaseUser?.uid;
        if (!incidentId || !detail || !currentUid) return;
        const editEntryId = form.dataset.editEntryId;
        const currentName = [datosVecino?.datosPersonales?.nombre || datosVecino?.nombre || firebaseUser?.displayName, datosVecino?.datosPersonales?.apellidos || datosVecino?.apellidos].filter(Boolean).join(' ') || firebaseUser?.email || 'Vecino';
        try {
          if (editEntryId) {
            await updateDoc(doc(db, 'incidencias', incidentId, 'historial', editEntryId), {
              detalle: detail,
              editadoPorUid: currentUid,
              fechaEdicion: serverTimestamp(),
            });
            toast.success('Registro actualizado.');
          } else {
            await addDoc(collection(db, 'incidencias', incidentId, 'historial'), {
              autorUid: currentUid,
              autorNombre: currentName,
              detalle: detail,
              fecha: serverTimestamp(),
            });
            toast.success('Registro añadido al historial.');
          }
          const fresh = await getDoc(doc(db, 'incidencias', incidentId));
          if (fresh.exists()) {
            const updatedIncident = { id: fresh.id, ...fresh.data() } as IncidenciaData;
            const entries = await loadIncidentHistory(updatedIncident);
            incidentHistoryCacheRef.current.set(incidentId, entries);
            showIncidentTracking(frameDocument, updatedIncident, currentUid, currentName, datosVecino?.cargo, canModerateIncidentHistory(datosVecino, isAdmin), entries);
          }
        } catch (error) {
          console.error('No se pudo guardar el registro de seguimiento:', error);
          toast.error('No se pudo guardar el registro. Comprueba tus permisos e inténtalo de nuevo.');
        }
      }
    };
    const input = () => {
      const form = frameDocument.getElementById('auth-form');
      const feedback = form?.querySelector<HTMLElement>('[data-auth-feedback]');
      if (feedback) feedback.hidden = true;
    };
    const change = async (event: Event) => {
      if (pageId !== 'perfil' || !(event.target instanceof HTMLInputElement) || event.target.id !== 'dir-consent') return;
      const checkbox = event.target;
      const profileDocId = datosVecino?.id || firebaseUser?.uid;
      if (!profileDocId) {
        checkbox.checked = false;
        toast.error('No se encontró tu ficha para guardar esta preferencia.');
        return;
      }
      const previousValue = datosVecino?.datosPersonales?.autorizaTelefonoDirectorio === true;
      checkbox.disabled = true;
      try {
        const batch = writeBatch(db);
        const personal = datosVecino?.datosPersonales || {};
        const phone = personal.telefono || personal.movil || '';
        batch.update(doc(db, 'vecinos', profileDocId), {
          'datosPersonales.autorizaTelefonoDirectorio': checkbox.checked,
        });
        batch.update(doc(db, 'vecinosPublicos', profileDocId), {
          telefono: checkbox.checked ? phone : '',
          autorizaTelefonoDirectorio: checkbox.checked,
          'datosPersonales.telefono': checkbox.checked ? phone : '',
          'datosPersonales.autorizaTelefonoDirectorio': checkbox.checked,
        });
        await batch.commit();
        toast.success(checkbox.checked
          ? 'Tu teléfono ya es visible para los vecinos verificados.'
          : 'Tu teléfono permanecerá oculto en el directorio.');
      } catch (error) {
        console.error('No se pudo guardar la autorización de teléfono:', error);
        checkbox.checked = previousValue;
        toast.error('No se pudo guardar esta preferencia. Inténtalo de nuevo.');
      } finally {
        checkbox.disabled = false;
      }
    };
    frameDocument.addEventListener('click', click, true);
    frameDocument.addEventListener('change', change, true);
    frameDocument.addEventListener('submit', submit, true);
    frameDocument.addEventListener('keydown', keydown, true);
    if (pageId === 'login') {
      showMessage(loginError);
      if (busy) {
        const button = frameDocument.getElementById('submit-btn') as HTMLButtonElement | null;
        if (button) { button.disabled = true; button.style.opacity = '.65'; }
      }
      frameDocument.getElementById('auth-form')?.addEventListener('input', input);
    }
    return () => {
      frameDocument.removeEventListener('click', click, true);
      frameDocument.removeEventListener('change', change, true);
      frameDocument.removeEventListener('submit', submit, true);
      frameDocument.removeEventListener('keydown', keydown, true);
      frameDocument.getElementById('auth-form')?.removeEventListener('input', input);
      cleanupIncidenceFilters();
      cleanupIncidentImagePicker();
      cleanupProfilePhotoPicker();
    };
  }, [busy, createIncident, darkMode, datosVecino, directorioCargando, directorioVecinos, directorioViviendas, firebaseUser, frameVersion, handleLogin, incidenciasComunidad, incidenciasLoadState, isAdmin, loginError, navigate, openWorkflow, pageId, routeFor, workflows]);

  return (
    <div className={`stitch-page${pageId === 'login' ? ' stitch-page-login' : ''}`}>
      <iframe ref={frameRef} className="stitch-frame" title={`NeighNetZ · ${pageTitle}`} srcDoc={pageMarkup || '<!doctype html><html lang="es"><body>Pantalla Stitch no encontrada.</body></html>'} onLoad={() => setFrameVersion((version) => version + 1)} />
      {workflow && (
        <div className="stitch-workflow-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setWorkflow(null); }}>
          <section className="stitch-workflow-window" role="dialog" aria-modal="true" aria-label={`Acción: ${pageTitle}`}>
            <button className="stitch-workflow-close" type="button" onClick={() => setWorkflow(null)} aria-label="Cerrar ventana">×</button>
            <div className="stitch-workflow-content"><WorkflowContent workflow={workflow} workflowPages={workflows} initialEmail={workflow.data?.email || ''} close={() => {
              if (workflow.key === 'register') toast.success('Solicitud enviada. La administración debe validar tus datos antes de activar el acceso.');
              setWorkflow(null);
            }} /></div>
          </section>
        </div>
      )}
      
      {pageId === 'tablón' && dashboardNoticeTarget && createPortal(<ComunidadBoard embedded />, dashboardNoticeTarget)}
    </div>
  );
}

function authError(error: unknown) {
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'No encontramos una cuenta con ese correo.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ese correo ya tiene una cuenta.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'Introduce un correo electrónico válido.',
    'auth/popup-closed-by-user': 'Se cerró la ventana de acceso con Google.',
  };
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (messages[code]) return messages[code];
  if (error instanceof Error && !('code' in error) && error.message) return error.message;
  return 'No se pudo completar la solicitud. Inténtalo de nuevo.';
}

export default StitchPage;
