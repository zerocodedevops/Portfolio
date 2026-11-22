import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { VecinoData } from '../../../types/domain';
import { useUnreadConversationCount } from '../../../hooks/useUnreadConversationCount';

const menuItems = [
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
];

function VecinoSidebar({ datosVecino }: { datosVecino: VecinoData }) {
  const location = useLocation();
  const unreadMessages = useUnreadConversationCount(datosVecino);

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:w-56 lg:w-64" aria-label="Navegación de la comunidad">
      <nav className="flex-1 space-y-3 overflow-y-auto px-1 py-2 sm:px-2 lg:px-3" aria-label="Secciones de propietarios">
        <div>
          <h3 className="hidden px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400 sm:block">Propietarios</h3>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-label={item.path === '/dashboard/mensajes' && unreadMessages > 0 ? `${item.label}, ${unreadMessages} conversaciones sin leer` : item.label}
                    aria-current={active ? 'page' : undefined}
                    title={item.label}
                    className={`relative flex min-h-9 items-center justify-center gap-3 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:justify-start sm:px-3 ${active ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'}`}
                  >
                    <span aria-hidden="true" className={['/dashboard/comunidad', '/dashboard/profesionales'].includes(item.path) ? 'material-symbols-outlined text-xl' : 'text-base'}>{item.icon}</span>
                    <span className="hidden min-w-0 flex-1 sm:inline">{item.label}</span>
                    {item.path === '/dashboard/mensajes' && unreadMessages > 0 && <>
                      <span aria-hidden="true" className="hidden min-w-5 rounded-full bg-emerald-700 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white sm:inline">{unreadMessages > 99 ? '99+' : unreadMessages}</span>
                      <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 sm:hidden" />
                    </>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default VecinoSidebar;
