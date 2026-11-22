// RUTA: ./src/pages/Dashboard.jsx

import React from 'react';
import { useOutletContext } from 'react-router-dom'; // <-- 1. AÑADIDO
import type { VecinoOutletContext } from '../types/domain';

function Dashboard() { // <-- 2. CAMBIADO: Ya no recibe props
  const [datosVecino] = useOutletContext<VecinoOutletContext>(); // <-- 3. AÑADIDO: Obtenemos los datos del contexto

  // --- 4. ¡CAMBIO CLAVE! Guarda de seguridad ---
  if (!datosVecino) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  // --- 5. ¡CAMBIO CLAVE! Ya no renderizamos el Header aquí ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-center mb-4">¡Bienvenido a tu Portal!</h1>
        <p className="text-gray-600 mb-6">Has accedido correctamente como {datosVecino.rol}.</p>
        <p className="text-sm text-gray-500">Aquí construiremos el menú principal para los vecinos.</p>
      </div>
    </div>
  );
}

export default Dashboard;
