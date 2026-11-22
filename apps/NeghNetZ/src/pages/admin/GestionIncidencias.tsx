// RUTA: ./src/pages/admin/GestionIncidencias.jsx

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from '../../demo/demoStore';
import type { IncidenciaData, VecinoOutletContext } from '../../types/domain';
import { hasAdministratorAccess } from '../../utils/residentRoles';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, arrayUnion, serverTimestamp, addDoc, getDocs } from '../../demo/demoStore';
import FormularioIncidencia, { type FormularioIncidenciaData } from '../../components/FormularioIncidencia';

// --- FUNCIÓN PARA MAPEARAR ESTADOS A TEXTO LITERAL ---
const mapEstadoATexto = (estado: string = '') => {
  const estadoMap: Record<string, string> = {
    'recibida': 'Recibida',
    'enProceso': 'En Proceso',
    'resuelta': 'Resuelta',
    'cancelada': 'Cancelada',
  };
  return estadoMap[estado] || estado;
};

function GestionIncidencias() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();
  const isAdmin = hasAdministratorAccess(datosVecino);
  
  const [incidencias, setIncidencias] = useState<IncidenciaData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<IncidenciaData | null>(null);
  const [nuevaObservacion, setNuevaObservacion] = useState('');
  const [usuariosMap, setUsuariosMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!datosVecino?.idComunidad) return;

    const q = query(
      collection(db, "incidencias"),
      where("idComunidad", "==", datosVecino.idComunidad),
      orderBy("fechaCreacion", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const datosIncidencias: IncidenciaData[] = [];
      querySnapshot.forEach((doc) => {
        datosIncidencias.push({ ...doc.data(), id: doc.id } as IncidenciaData);
      });
      setIncidencias(datosIncidencias);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [datosVecino]);

  useEffect(() => {
    const getUsuarios = async () => {
      const usuariosSnapshot = await getDocs(collection(db, 'vecinos'));
      const map: Record<string, string> = {};
      usuariosSnapshot.forEach(doc => {
        const data = doc.data();
        const nombre = data.datosPersonales?.nombre || data.nombre || 'Usuario desconocido';
        map[doc.id] = nombre;
      });
      setUsuariosMap(map);
    };
    getUsuarios();
  }, []);

  const getNombreAutor = (autorId?: string) => {
    return (autorId ? usuariosMap[autorId] : undefined) || 'Autor desconocido';
  };

  const handleNuevaIncidencia = async (datosFormulario: FormularioIncidenciaData) => {
    if (!datosVecino?.idComunidad || !datosVecino.uid) return;
    try {
      await addDoc(collection(db, "incidencias"), {
        ...datosFormulario,
        idComunidad: datosVecino.idComunidad,
        idVecino: datosVecino.uid,
        estado: "recibida",
        fechaCreacion: serverTimestamp(),
      });
      console.log("Incidencia creada correctamente.");
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al crear la incidencia:", error);
    }
  };

  const handleVerDetalles = (incidencia: IncidenciaData) => {
    setIncidenciaSeleccionada(incidencia);
  };

  const handleCerrarModal = () => {
    setIncidenciaSeleccionada(null);
    setNuevaObservacion('');
  };

  const handleAgregarObservacion = async () => {
    if (!nuevaObservacion.trim() || !incidenciaSeleccionada || !datosVecino?.uid) return;

    const incidenciaRef = doc(db, "incidencias", incidenciaSeleccionada.id);
    try {
      await updateDoc(incidenciaRef, {
        historial: arrayUnion({
          autor: datosVecino.uid,
          detalle: nuevaObservacion,
          fecha: new Date()
        })
      });
      console.log("Observación añadida correctamente.");
      setNuevaObservacion('');
    } catch (error) {
      console.error("Error al añadir la observación:", error);
    }
  };

  const handleCambiarEstado = async (idIncidencia: string, nuevoEstado: string) => {
    if (!datosVecino?.uid) return;
    const incidenciaRef = doc(db, "incidencias", idIncidencia);
    try {
      await updateDoc(incidenciaRef, {
        estado: nuevoEstado,
        historial: arrayUnion({
          autor: datosVecino.uid,
          detalle: `Estado cambiado a: ${nuevoEstado}`,
          fecha: new Date()
        })
      });
      console.log(`Incidencia ${idIncidencia} actualizada a ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  if (cargando) {
    return <div className="text-center p-4">Cargando incidencias...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Incidencias</h2>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded"
        >
          Notificar Incidencia
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioIncidencia
          onSubmit={handleNuevaIncidencia}
          onCancel={() => setMostrarFormulario(false)}
        />
      )}

      {incidencias.length === 0 ? (
        <p className="text-gray-500">No hay incidencias registradas en tu comunidad.</p>
      ) : (
        <div className="space-y-4">
          {incidencias.map((incidencia) => (
            <div 
              key={incidencia.id} 
              onClick={() => handleVerDetalles(incidencia)}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-400 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{incidencia.titulo}</h3>
                  <p className="text-gray-600">{incidencia.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Categoría: {incidencia.categoria} | Zona: {incidencia.zona}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                    incidencia.estado === 'resuelta' ? 'bg-green-100 text-green-800' :
                    incidencia.estado === 'enProceso' ? 'bg-yellow-100 text-yellow-800' :
                    incidencia.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {mapEstadoATexto(incidencia.estado)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {incidenciaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Detalles de la Incidencia</h2>
              <button onClick={handleCerrarModal} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{incidenciaSeleccionada.titulo}</h3>
              <p className="text-gray-600 my-2">{incidenciaSeleccionada.descripcion}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Categoría:</strong> {incidenciaSeleccionada.categoria}</p>
                <p><strong>Zona:</strong> {incidenciaSeleccionada.zona}</p>
                <p><strong>Estado:</strong> <span className={`capitalize ${mapEstadoATexto(incidenciaSeleccionada.estado)}`}>{mapEstadoATexto(incidenciaSeleccionada.estado)}</span></p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Historial de Cambios</h4>
                {incidenciaSeleccionada.historial && incidenciaSeleccionada.historial.length > 0 ? (
                  <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {incidenciaSeleccionada.historial.map((entry, index) => (
                      <li key={index} className="text-sm bg-gray-100 p-2 rounded border-l-4 border-naranja-400">
                        <p><strong>{entry.detalle}</strong></p>
                        <p className="text-xs text-gray-500">
                          Por: {getNombreAutor(entry.autor)} | {entry.fecha ? (typeof entry.fecha === 'object' && 'toDate' in entry.fecha ? entry.fecha.toDate() : new Date(entry.fecha)).toLocaleString() : 'Fecha desconocida'}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No hay cambios en el historial.</p>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Acciones de Administrador</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleCambiarEstado(incidenciaSeleccionada.id, 'enProceso')} className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">En Proceso</button>
                    <button onClick={() => handleCambiarEstado(incidenciaSeleccionada.id, 'resuelta')} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Resolver</button>
                    <button onClick={() => handleCambiarEstado(incidenciaSeleccionada.id, 'descartada')} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Descartar</button>
                  </div>
                </div>

                {isAdmin && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Añadir Observación</h4>
                      <textarea
                      value={nuevaObservacion}
                      onChange={(e) => setNuevaObservacion(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Escribe aquí tu comentario o información adicional..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAgregarObservacion}
                        className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded"
                      >
                        Añadir Comentario
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionIncidencias;
