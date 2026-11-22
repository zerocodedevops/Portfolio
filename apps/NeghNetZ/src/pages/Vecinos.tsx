// RUTA: ./src/pages/Vecinos.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../demo/demoStore';
import type { VecinoData } from '../types/domain';
import { collection, onSnapshot, query, where } from '../demo/demoStore';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { hasAdministratorAccess } from '../utils/residentRoles';

function Vecinos({ datosVecino: currentUser }: { datosVecino?: VecinoData | null }) {
  const navigate = useNavigate();
  const [vecinos, setVecinos] = useState<VecinoData[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- Añadimos una constante para saber si el usuario es admin ---
  const isAdmin = hasAdministratorAccess(currentUser);

  useEffect(() => {
    if (!currentUser?.idComunidad) { setCargando(false); return; }
    const unsubscribe = onSnapshot(query(
      collection(db, 'vecinosPublicos'),
      where('idComunidad', '==', currentUser.idComunidad),
      where('activo', '==', true),
    ), (querySnapshot) => {
      const vecinosData: VecinoData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const rol = data.rol || data.datosPersonales?.rol || 'Sin rol';
        vecinosData.push({
          id: data.idFicha || doc.id,
          uid: data.uid,
          nombre: data.datosPersonales?.nombre || data.nombre || 'Sin nombre',
          portal: data.datosPersonales?.portal || data.portal || 'N/A',
          piso: data.datosPersonales?.piso || data.piso || 'N/A',
          letra: data.datosPersonales?.letra || data.letra || '',
          rol: rol,
          email: '',
          telefono: data.datosPersonales?.telefono || data.telefono || 'N/A',
          datosPersonales: {
            ...data.datosPersonales,
            autorizaTelefonoDirectorio: data.datosPersonales?.autorizaTelefonoDirectorio === true,
          },
        });
      });

      setVecinos(vecinosData);
      setCargando(false);
    }, (error) => {
      console.error("Error al obtener vecinos:", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [currentUser?.idComunidad]);

  const agruparYOrdenarVecinos = (listaVecinos: VecinoData[]) => {
    const sorted = [...listaVecinos].sort((a, b) => {
      const portalCompare = (a.portal ?? '').localeCompare(b.portal ?? '', undefined, { numeric: true, sensitivity: 'base' });
      if (portalCompare !== 0) return portalCompare;
      const pisoCompare = (a.piso ?? '').localeCompare(b.piso ?? '', undefined, { numeric: true, sensitivity: 'base' });
      if (pisoCompare !== 0) return pisoCompare;
      return (a.letra ?? '').localeCompare(b.letra ?? '');
    });
    return sorted.reduce<Record<string, VecinoData[]>>((acc, vecino) => {
      const portal = vecino.portal ?? 'Sin portal';
      if (!acc[portal]) {
        acc[portal] = [];
      }
      acc[portal].push(vecino);
      return acc;
    }, {});
  };

  const vecinosAgrupados = agruparYOrdenarVecinos(vecinos);

  // --- ¡CAMBIO CLAVE! Función de navegación unificada ---
  const handleVerFicha = (vecinoId: string) => {
    const destination = isAdmin ? `/admin/vecinos/${vecinoId}` : `/dashboard/vecinos/${vecinoId}`;
    navigate(destination);
  };

  if (cargando) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Vecinos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Vecinos</h1>

      {/* --- ¡NUEVO BOTÓN PARA EL ADMIN! --- */}
      {isAdmin && (
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/usuarios')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Validar Nuevos Usuarios
          </button>
        </div>
      )}

      {Object.keys(vecinosAgrupados).length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
          No hay miembros confirmados en la comunidad.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(vecinosAgrupados).map(([portal, listaVecinos]) => (
            <div key={portal} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-naranja-500 text-white p-4">
                <h2 className="text-lg font-semibold">Portal {portal}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4">
                {listaVecinos.map((vecino) => (
                  <div
                    key={vecino.id}
                    // --- ¡CAMBIO CLAVE! Ahora todos pueden hacer clic ---
                    onClick={() => vecino.id && handleVerFicha(vecino.id)}
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition flex items-center space-x-4 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                      {(vecino.nombre || 'V').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{vecino.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {(vecino.rol?.toLowerCase() === 'administrador' || vecino.rol?.toLowerCase() === 'conserje')
                          ? vecino.rol
                          : `Piso: ${vecino.piso} ${vecino.letra} | ${vecino.rol}`}
                      </p>
                      {/* El teléfono requiere consentimiento; el correo sigue siendo privado. */}
                      {(isAdmin || currentUser?.uid === vecino.uid || currentUser?.id === vecino.id || vecino.datosPersonales?.autorizaTelefonoDirectorio === true) && (
                        <div className="mt-2 text-xs text-gray-600 space-y-1">
                          {isAdmin && (
                            <p className="truncate"><strong>Email:</strong> {vecino.email}</p>
                          )}
                          {(isAdmin || currentUser?.uid === vecino.uid || currentUser?.id === vecino.id || vecino.datosPersonales?.autorizaTelefonoDirectorio === true) && (
                            <p><strong>Teléfono:</strong> {vecino.telefono}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vecinos;
