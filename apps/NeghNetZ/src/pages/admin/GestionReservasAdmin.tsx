// RUTA: ./src/components/GestionReservasAdmin.jsx

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from '../../demo/demoStore';
import type { ReservaData, VecinoOutletContext, FirestoreDate } from '../../types/domain';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  getDocs,
  documentId
} from '../../demo/demoStore';

interface UserMapEntry { idVivienda?: string; vivienda?: string; datosPersonales?: { nombre?: string; portal?: string; piso?: string; letra?: string } }
interface ZoneMapEntry { nombre?: string }
const formatDate = (value?: FirestoreDate) => {
  if (!value) return 'Fecha no disponible';
  return (typeof value === 'object' && 'toDate' in value ? value.toDate() : new Date(value)).toLocaleString();
};

function GestionReservasAdmin() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();

  if (!datosVecino) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  const [reservas, setReservas] = useState<ReservaData[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<string, UserMapEntry>>({});
  const [zonasMap, setZonasMap] = useState<Record<string, ZoneMapEntry>>({});
  const [cargando, setCargando] = useState(true);

  // Effect para cargar las reservas
  useEffect(() => {
    if (!datosVecino || !datosVecino.idComunidad) {
      return;
    }
    
    const q = query(
      collection(db, 'reservas'),
      where('idComunidad', '==', datosVecino.idComunidad),
      orderBy('fechaInicio', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reservasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReservaData));
      setReservas(reservasData);
      setCargando(false);
    }, (error) => {
      console.error("GestionReservasAdmin: Error al obtener reservas:", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [datosVecino.idComunidad]);

  // Effect para cargar los datos de los usuarios de las reservas
  useEffect(() => {
    if (reservas.length === 0) {
      setUsuariosMap({});
      return;
    }
    const idsUsuarios = [...new Set(reservas.map(r => r.idVecino).filter((id): id is string => Boolean(id)))];
    if (!idsUsuarios.length) return;
    const q = query(collection(db, 'vecinos'), where(documentId(), 'in', idsUsuarios));
    const cargarUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const mapa: Record<string, UserMapEntry> = {};
        querySnapshot.forEach((doc) => {
          mapa[doc.id] = doc.data();
        });
        setUsuariosMap(mapa);
      } catch (error) {
        console.error("GestionReservasAdmin: Error al cargar datos de usuarios:", error);
      }
    };
    cargarUsuarios();
  }, [reservas]);

  // --- Effect para cargar los datos de las zonas de las reservas ---
  useEffect(() => {
    if (reservas.length === 0) {
      setZonasMap({});
      return;
    }

    // 1. Extraer todos los IDs de zona únicos de las reservas
    const idsZonas = [...new Set(reservas.map(r => r.idZonaComun).filter((id): id is string => Boolean(id)))];
    if (!idsZonas.length) return;
    
    // 2. Crear una consulta para obtener todos los documentos de esas zonas en una sola llamada
    const q = query(collection(db, 'zonasComunes'), where(documentId(), 'in', idsZonas));

    const cargarZonas = async () => {
      try {
        const querySnapshot = await getDocs(q);
        // 3. Crear un mapa para fácil acceso: { idZona: { datosDeLaZona } }
        const mapa: Record<string, ZoneMapEntry> = {};
        querySnapshot.forEach((doc) => {
          mapa[doc.id] = doc.data();
        });
        setZonasMap(mapa);
      } catch (error) {
        console.error("GestionReservasAdmin: Error al cargar datos de zonas:", error);
      }
    };

    cargarZonas();

  }, [reservas]); // Este efecto se ejecuta cada vez que la lista de reservas cambia

  const handleCambiarEstado = async (reservaId: string, nuevoEstado: string) => {
    try {
      const reservaRef = doc(db, 'reservas', reservaId);
      await updateDoc(reservaRef, {
        estado: nuevoEstado,
        fechaActualizacion: serverTimestamp(),
        actualizadoPor: datosVecino.uid,
      });
      console.log(`Reserva ${reservaId} actualizada a ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar el estado de la reserva:", error);
    }
  };

  const getEstadoBadge = (estado?: string) => {
    switch (estado) {
      case 'pre-reservada': return 'bg-yellow-100 text-yellow-800';
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (cargando) {
    return <div className="p-6 text-center">Cargando reservas...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Reservas</h1>

      {reservas.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
          No hay reservas registradas en la comunidad.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario (Vivienda)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona Común</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Inicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coste</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuariosMap[reserva.idVecino ?? '']?.idVivienda || reserva.idVecino}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* --- ¡CAMBIO CLAVE! Mostramos el nombre de la zona --- */}
                    {zonasMap[reserva.idZonaComun ?? '']?.nombre || reserva.idZonaComun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(reserva.fechaInicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(reserva.fechaFin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserva.costeTotal}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(reserva.estado)}`}>
                      {reserva.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {reserva.estado === 'pre-reservada' && (
                      <>
                        <button
                          onClick={() => handleCambiarEstado(reserva.id, 'confirmada')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(reserva.id, 'cancelada')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionReservasAdmin;
