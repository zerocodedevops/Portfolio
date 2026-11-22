// RUTA: ./src/components/layouts/VecinoLayout.jsx
import React from 'react';
import LayoutBase from './LayoutBase';
import VecinoSidebar from './sidebars/VecinoSidebar';
import type { VecinoData } from '../../types/domain';

function VecinoLayout({ datosVecino }: { datosVecino: VecinoData }) {
  return (
    <LayoutBase SidebarComponent={VecinoSidebar} datosVecino={datosVecino} />
  );
}

export default VecinoLayout;
