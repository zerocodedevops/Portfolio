import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { collection, onSnapshot, query, where } from '../../demo/demoStore';
import { db } from '../../demo/demoStore';
import type { VecinoOutletContext } from '../../types/domain';
import { normalizarEstadoIncidencia, normalizarPrioridadIncidencia } from '../../utils/incidencias';
import { hasAdministratorAccess } from '../../utils/residentRoles';

type AdminDashboardMetrics = {
  pendingResidents: number;
  activeIncidents: number;
  highPriorityIncidents: number;
  upcomingReservations: number;
  todayReservations: number;
  openVotes: number;
  recentDocuments: number;
  latestDocumentName: string;
};

const initialMetrics: AdminDashboardMetrics = {
  pendingResidents: 0,
  activeIncidents: 0,
  highPriorityIncidents: 0,
  upcomingReservations: 0,
  todayReservations: 0,
  openVotes: 0,
  recentDocuments: 0,
  latestDocumentName: '',
};

function asDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') return value.toDate();
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function SummaryCard({ label, count, detail, icon, to }: { label: string; count: number; detail: string; icon: string; to: string }) {
  return (
    <Link to={to} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-bold tabular-nums text-slate-950">{count}</p>
      <p className="mt-1 truncate text-sm text-slate-500 group-hover:text-slate-700">{detail}</p>
    </Link>
  );
}

function AdminAction({ to, icon, label, detail }: { to: string; icon: string; label: string; detail: string }) {
  return (
    <Link to={to} className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg">{icon}</span>
      <span className="min-w-0">
        <span className="block font-semibold text-slate-900">{label}</span>
        <span className="block truncate text-sm text-slate-500">{detail}</span>
      </span>
      <span aria-hidden="true" className="ml-auto text-slate-400">→</span>
    </Link>
  );
}

function AdminPanel() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!datosVecino?.idComunidad) {
      setMetrics(initialMetrics);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribers: Array<() => void> = [];
    const communityId = datosVecino.idComunidad;
    const communityResidentsQuery = query(collection(db, 'vecinos'), where('idComunidad', '==', communityId));
    const communityIncidentsQuery = query(collection(db, 'incidencias'), where('idComunidad', '==', communityId));
    const communityReservationsQuery = query(collection(db, 'reservas'), where('idComunidad', '==', communityId));
    const communityVotesQuery = query(collection(db, 'votaciones'), where('idComunidad', '==', communityId));

    const update = (partial: Partial<AdminDashboardMetrics>) => {
      setMetrics((current) => ({ ...current, ...partial }));
      setLoading(false);
    };
    if (hasAdministratorAccess(datosVecino)) {
      unsubscribers.push(onSnapshot(communityResidentsQuery, (snapshot) => {
      const pendingResidents = snapshot.docs.filter((resident) => ['pendiente_de_confirmacion', 'pendientevalidacion', 'pendiente', 'en_revision'].includes(String(resident.data().estado || '').toLowerCase()) && String(resident.data().rol || '').toLowerCase() !== 'administrador').length;
      update({ pendingResidents });
    }, (error) => console.error('No se pudieron cargar los vecinos pendientes:', error)));
    }

    unsubscribers.push(onSnapshot(communityIncidentsQuery, (snapshot) => {
      const incidents = snapshot.docs.map((incident) => incident.data());
      const active = incidents.filter((incident) => ['pendiente', 'en_progreso'].includes(normalizarEstadoIncidencia(incident.estado)));
      update({
        activeIncidents: active.length,
        highPriorityIncidents: active.filter((incident) => normalizarPrioridadIncidencia(incident.prioridad) === 'alta').length,
      });
    }, (error) => console.error('No se pudieron cargar las incidencias del panel:', error)));

    unsubscribers.push(onSnapshot(communityReservationsQuery, (snapshot) => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
      const reservations = snapshot.docs.map((reservation) => reservation.data());
      const upcoming = reservations.filter((reservation) => {
        const start = asDate(reservation.fechaInicio || reservation.fecha)?.getTime();
        const status = String(reservation.estado || '').toLowerCase();
        return start != null && start >= now.getTime() && !['cancelada', 'cancelado', 'rechazada'].includes(status);
      });
      const today = reservations.filter((reservation) => {
        const start = asDate(reservation.fechaInicio || reservation.fecha)?.getTime();
        const status = String(reservation.estado || '').toLowerCase();
        return start != null && start >= todayStart && start < tomorrowStart && !['cancelada', 'cancelado', 'rechazada'].includes(status);
      });
      update({ upcomingReservations: upcoming.length, todayReservations: today.length });
    }, (error) => console.error('No se pudieron cargar las reservas del panel:', error)));

    unsubscribers.push(onSnapshot(communityVotesQuery, (snapshot) => {
      const now = Date.now();
      const openVotes = snapshot.docs.filter((vote) => {
        if (String(vote.data().estado || '').toLowerCase() !== 'activa') return false;
        const end = asDate(vote.data().fechaFin)?.getTime();
        return end == null || end >= now;
      }).length;
      update({ openVotes });
    }, (error) => console.error('No se pudieron cargar las votaciones abiertas:', error)));

    const communityDocumentsQuery = query(collection(db, 'documentos'), where('idComunidad', '==', communityId));
    unsubscribers.push(onSnapshot(communityDocumentsQuery, (snapshot) => {
      const recent = snapshot.docs
        .map((document) => ({ name: String(document.data().nombre || document.data().name || 'Documento'), date: asDate(document.data().fechaSubida || document.data().fechaCreacion) }))
        .sort((left, right) => (right.date?.getTime() || 0) - (left.date?.getTime() || 0))
        .slice(0, 5);
      update({ recentDocuments: recent.length, latestDocumentName: recent[0]?.name || '' });
    }, (error) => console.error('No se pudieron cargar los documentos recientes:', error)));

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [datosVecino?.idComunidad]);

  const residentName = [datosVecino?.datosPersonales?.nombre || datosVecino?.nombre, datosVecino?.datosPersonales?.apellidos || datosVecino?.apellidos].filter(Boolean).join(' ') || 'Administración';
  const summaryCards = [
    { label: 'Incidencias Activas', count: metrics.activeIncidents, detail: 'Pendientes y en reparación', icon: '🔧', to: '/admin/incidencias' },
    { label: 'Incidencias de Prioridad Alta', count: metrics.highPriorityIncidents, detail: 'Requieren atención prioritaria', icon: '⚠️', to: '/admin/incidencias' },
    { label: 'Próximas Reservas', count: metrics.upcomingReservations, detail: 'Reservas futuras de la comunidad', icon: '📅', to: '/admin/reservas' },
    { label: 'Votaciones Abiertas', count: metrics.openVotes, detail: 'Procesos de votación activos', icon: '🗳️', to: '/dashboard/votaciones' },
    { label: 'Documentos Recientes', count: metrics.recentDocuments, detail: metrics.latestDocumentName || 'Últimos documentos compartidos', icon: '📁', to: '/admin/documentos' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-2 sm:p-4">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Jardín del Poeta</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Panel de Control de Administrador</h1>
        <p className="mt-2 text-slate-600">Bienvenido, {residentName}. Aquí tienes el estado de la comunidad y tus herramientas de gestión.</p>
      </header>

      <section aria-labelledby="community-summary-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="community-summary-heading" className="text-xl font-bold text-slate-900">Resumen de la comunidad</h2>
            <p className="mt-1 text-sm text-slate-500">Indicadores actualizados desde Firebase.</p>
          </div>
          {loading && <span role="status" className="text-sm text-slate-500">Cargando datos…</span>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => <SummaryCard key={card.label} {...card} count={loading ? 0 : card.count} detail={loading ? 'Cargando…' : card.detail} />)}
        </div>
      </section>

      <section aria-labelledby="admin-panel-heading" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Herramientas de gestión</p>
          <h2 id="admin-panel-heading" className="mt-1 text-2xl font-bold text-slate-950">Panel Ejecutivo</h2>
          <p className="mt-1 text-slate-600">Acceso directo a las tareas propias de administración.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AdminAction to="/admin/usuarios" icon="✅" label="Validar Vecinos" detail={`${loading ? '…' : metrics.pendingResidents} solicitudes pendientes`} />
          <AdminAction to="/admin/incidencias" icon="🛠️" label="Gestión de Incidencias" detail={`${loading ? '…' : metrics.activeIncidents} incidencias activas`} />
          <AdminAction to="/admin/reservas" icon="🗓️" label="Gestión de Reservas" detail={`${loading ? '…' : metrics.todayReservations} reservas para hoy`} />
          <AdminAction to="/admin/documentos" icon="🗂️" label="Gestión Documental" detail="Carpetas y documentos de la comunidad" />
          <AdminAction to="/admin/estadisticas" icon="📊" label="Estadísticas" detail="Indicadores y actividad comunitaria" />
          <AdminAction to="/admin/configuracion" icon="⚙️" label="Configuración" detail="Herramientas administrativas" />
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
