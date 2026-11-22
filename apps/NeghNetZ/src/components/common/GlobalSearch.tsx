// RUTA: ./src/components/common/GlobalSearch.jsx

import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      {/* Trigger Button (Visible on Desktop) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center w-64 px-4 py-2 text-sm text-gray-500 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
      >
        <MagnifyingGlassIcon className="w-5 h-5 mr-3 text-white" />
        <span className="text-white/80">Buscar...</span>
      </button>

      {/* Command Palette Modal */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Search"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
      >
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-2" />
          <Command.Input 
            placeholder="¿Qué estás buscando?" 
            className="w-full p-4 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="p-4 text-center text-gray-500 text-sm">
            No se encontraron resultados.
          </Command.Empty>

          <Command.Group heading="Navegación Rápida" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
            <Command.Item
              onSelect={() => runCommand(() => navigate('/'))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-naranja-50 dark:aria-selected:bg-naranja-900/20"
            >
              <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />
              Inicio
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate('/incidencias'))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-naranja-50 dark:aria-selected:bg-naranja-900/20"
            >
              <ExclamationTriangleIcon className="w-5 h-5 mr-3 text-gray-400" />
              Incidencias
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate('/documentos'))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-naranja-50 dark:aria-selected:bg-naranja-900/20"
            >
              <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400" />
              Documentos
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate('/reservas'))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-naranja-50 dark:aria-selected:bg-naranja-900/20"
            >
              <CalendarIcon className="w-5 h-5 mr-3 text-gray-400" />
              Reservas
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate('/gastos'))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-naranja-50 dark:aria-selected:bg-naranja-900/20"
            >
              <CurrencyEuroIcon className="w-5 h-5 mr-3 text-gray-400" />
              Gastos
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Acciones" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 px-2">
             <Command.Item
              onSelect={() => runCommand(() => navigate('/perfil'))}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-naranja-50 dark:aria-selected:bg-naranja-900/20"
            >
              <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />
              Ver mi perfil
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>

      {/* Overlay backdrop */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setOpen(false)} />}
    </>
  );
}
