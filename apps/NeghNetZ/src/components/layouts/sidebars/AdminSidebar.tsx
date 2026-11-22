import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { VecinoData } from '../../../types/domain';
import { hasAdministratorAccess, isBoardExecutive } from '../../../utils/residentRoles';
import { useUnreadConversationCount } from '../../../hooks/useUnreadConversationCount';
import { subscribeMembershipRequests } from '../../../services/membershipService';

const propertySection = {
  title: 'Propietarios',
  items: [
    { path: '/dashboard', label: 'Inicio', icon: '🏠' },
    { path: '/dashboard/perfil', label: 'Mi Perfil', icon: '👤' },
    { path: '/dashboard/vecinos', label: 'Directorio de Vecinos', icon: '👥' },
    { path: '/dashboard/profesionales', label: 'Directorio de Servicios', icon: 'handyman' },
    { path: '/dashboard/mensajes', label: 'Mensajes', icon: '✉️' },
    { path: '/dashboard/reuniones', label: 'Juntas y Reuniones', icon: '🗓️' },
    { path: '/dashboard/comunidad', label: 'Tablón de Avisos', icon: 'campaign' },
    { path: '/dashboard/incidencias', label: 'Incidencias', icon: '🔧' },
    { path: '/dashboard/reservas', label: 'Reservas', icon: '📅' },
    { path: '/dashboard/votaciones', label: 'Votaciones', icon: '🗳️' },
    { path: '/dashboard/documentos', label: 'Documentos', icon: '📁' },
    { path: '/dashboard/gastos', label: 'Cuentas y Gastos', icon: '💰' },
    { path: '/dashboard/notificaciones', label: 'Notificaciones', icon: '🔔' },
  ],
};

const administrationSection = {
  title: 'Administración',
  items: [
    { path: '/admin/panel', label: 'Panel de Control', icon: '📊' },
    { path: '/admin/usuarios', label: 'Validar Vecinos', icon: '✅' },
    { path: '/admin/vecinos', label: 'Gestión de Vecinos', icon: '👥' },
    { path: '/dashboard/mensajes', label: 'Mensajes', icon: '✉️' },
    { path: '/admin/incidencias', label: 'Gestión de Incidencias', icon: '🛠️' },
    { path: '/dashboard/reservas', label: 'Gestión de Reservas', icon: '🗓️' },
    { path: '/admin/documentos', label: 'Gestión Documental', icon: '🗂️' },
    { path: '/admin/gastos', label: 'Cuentas y Gastos', icon: '💰' },
    { path: '/admin/estadisticas', label: 'Estadísticas', icon: '📈' },
    { path: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
    { path: '/dashboard/reuniones', label: 'Juntas y Reuniones', icon: '🗓️' },
    { path: '/dashboard/profesionales', label: 'Directorio de Servicios', icon: 'handyman' },
    { path: '/dashboard/comunidad', label: 'Tablón de Avisos', icon: 'campaign' },
  ],
};

function AdminSidebar({ datosVecino }: { datosVecino: VecinoData }) {
  const location = useLocation();
  const unreadMessages = useUnreadConversationCount(datosVecino);
  const [membershipRequestCount, setMembershipRequestCount] = useState(0);
  useEffect(() => {
    if (!datosVecino.idComunidad) { setMembershipRequestCount(0); return undefined; }
    if (!hasAdministratorAccess(datosVecino)) return undefined;
    return subscribeMembershipRequests(datosVecino.idComunidad, (requests) => setMembershipRequestCount(requests.filter((request) => request.estado !== 'aceptada').length), (error) => console.warn('No se pudo cargar el contador de inscripciones:', error));
  }, [datosVecino.idComunidad]);
  const boardExecutive = isBoardExecutive(datosVecino);
  const adminItems = boardExecutive
    ? administrationSection.items.filter((item) => !['/dashboard/mensajes', '/dashboard/reuniones', '/dashboard/profesionales', '/dashboard/comunidad'].includes(item.path))
    : administrationSection.items;
  const sections = boardExecutive
    ? [propertySection, { ...administrationSection, items: adminItems }]
    : [administrationSection];

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:w-56 lg:w-64" aria-label="Navegación de administración">
      <nav className="flex-1 space-y-3 overflow-y-auto px-1 py-2 sm:px-2 lg:px-3" aria-label="Secciones administrativas y de propietario">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="hidden px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400 sm:block">{section.title}</h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.path === '/dashboard/mensajes' && unreadMessages > 0 ? `${item.label}, ${unreadMessages} conversaciones sin leer` : item.label}
                      title={item.label}
                      className={`relative flex min-h-9 items-center justify-center gap-3 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:justify-start sm:px-3 ${active ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'}`}
                    >
                      <span aria-hidden="true" className={['/dashboard/comunidad', '/dashboard/profesionales'].includes(item.path) ? 'material-symbols-outlined text-xl' : 'text-base'}>{item.icon}</span>
                      <span className="hidden min-w-0 flex-1 sm:inline">{item.label}</span>
                      {item.path === '/dashboard/mensajes' && unreadMessages > 0 && <>
                        <span aria-hidden="true" className="hidden min-w-5 rounded-full bg-emerald-700 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white sm:inline">{unreadMessages > 99 ? '99+' : unreadMessages}</span>
                        <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 sm:hidden" />
                      </>}
                      {item.path === '/admin/usuarios' && membershipRequestCount > 0 && <span aria-label={`${membershipRequestCount} solicitudes de inscripción pendientes`} className="min-w-5 rounded-full bg-rose-600 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">{membershipRequestCount > 99 ? '99+' : membershipRequestCount}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
