import React from 'react';
import GestionDocumentos from '../components/GestionDocumentos';
import type { VecinoData } from '../types/domain';

export default function Documentos({ datosVecino }: { datosVecino: VecinoData | null }) {
  return <GestionDocumentos datosVecino={datosVecino} />;
}
