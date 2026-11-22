// RUTA: ./src/components/layouts/AdminLayout.jsx
import React from 'react';
import LayoutBase from './LayoutBase';
import AdminSidebar from './sidebars/AdminSidebar';
import type { VecinoData } from '../../types/domain';

function AdminLayout({ datosVecino }: { datosVecino: VecinoData }) {
  return (
    <LayoutBase SidebarComponent={AdminSidebar} datosVecino={datosVecino} />
  );
}

export default AdminLayout;
