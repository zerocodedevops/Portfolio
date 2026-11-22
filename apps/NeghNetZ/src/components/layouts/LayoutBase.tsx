// RUTA: ./src/components/layouts/LayoutBase.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import logger from '../../utils/logger';
import PageTransition from '../common/PageTransition';
import type { ComponentType } from 'react';
import type { VecinoData } from '../../types/domain';

interface LayoutBaseProps {
  SidebarComponent: ComponentType<{ datosVecino: VecinoData }>;
  datosVecino: VecinoData;
}

function LayoutBase({ SidebarComponent, datosVecino }: LayoutBaseProps) {
  const { pathname } = useLocation();
  const isStitchPage = [
    '/admin', '/admin/vecinos', '/admin/usuarios', '/admin/incidencias',
    '/admin/documentos', '/admin/reservas', '/admin/gastos', '/admin/panel',
    '/dashboard', '/dashboard/perfil', '/dashboard/mensajes', '/dashboard/incidencias',
    '/dashboard/vecinos', '/dashboard/reservas', '/dashboard/documentos',
    '/dashboard/votaciones', '/dashboard/gastos', '/dashboard/resumen',
  ].includes(pathname);
  logger.debug("LayoutBase - datosVecino recibido:", datosVecino);

  return (
    <div className={`fixed inset-0 flex h-screen h-[100dvh] flex-col overflow-hidden bg-gray-100 dark:bg-black${isStitchPage ? ' stitch-layout' : ''}`}>
      <Header datosVecino={datosVecino} />

      <div className="flex min-h-0 flex-1">
        <SidebarComponent datosVecino={datosVecino} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gray-100 p-6 dark:bg-black">
            <PageTransition>
              <Outlet context={[datosVecino]} />
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LayoutBase;
