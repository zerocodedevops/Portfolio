// RUTA: ./src/components/GestionZonas.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../demo/demoStore';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from '../demo/demoStore';
import type { ZonaComun } from '../types/domain';

function GestionZonas() {
  const [zonas, setZonas] = useState<ZonaComun[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [zonaEditando, setZonaEditando] = useState<ZonaComun | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'zonasComunes'), (snapshot) => {
      const zonasData = snapshot.docs.map(document => ({ id: document.id, ...document.data() })) as ZonaComun[];
      setZonas(zonasData);
    }, (error) => {
      console.error("Error al obtener las zonas comunes:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleAbrirFormulario = () => {
    setEditando(false);
    setZonaEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (zona: ZonaComun) => {
    setZonaEditando(zona);
    setMostrarFormulario(true);
    setEditando(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(false);
    setZonaEditando(null);
  };

  const handleGuardar = async (datosFormulario: Omit<ZonaComun, 'id'>) => {
    try {
      if (editando) {
        // Actualizar zona existente
        if (!zonaEditando) return;
        const docRef = doc(db, 'zonasComunes', zonaEditando.id);
        await updateDoc(docRef, {
          ...datosFormulario,
          fechaActualizacion: serverTimestamp(),
        });
        console.log("Zona actualizada con éxito");
      } else {
        // Crear nueva zona
        await addDoc(collection(db, 'zonasComunes'), {
          ...datosFormulario,
          fechaCreacion: serverTimestamp(),
        });
        console.log("Zona creada con éxito");
      }
      handleCerrarFormulario();
    } catch (error) {
      console.error("Error al guardar la zona:", error);
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta zona? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, 'zonasComunes', id));
        console.log("Zona eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la zona:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Zonas Comunes</h2>
        <button
          onClick={handleAbrirFormulario}
          className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded"
        >
          Crear Nueva Zona
        </button>
      </div>

      {/* Lista de Zonas */}
      <div className="space-y-4">
        {zonas.length === 0 ? (
          <p className="text-gray-500 text-center bg-white p-4 rounded-lg shadow">
            No hay zonas comunes registradas. ¡Crea la primera!
          </p>
        ) : (
          zonas.map((zona) => (
            <div key={zona.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{zona.nombre}</h3>
                <p className="text-sm text-gray-600">{zona.descripcion}</p>
                <p className="text-xs text-gray-500">Capacidad: {zona.capacidadMaxima} | Coste: {zona.costePorHora}€/h</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditar(zona)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(zona.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para Crear/Editar Zona */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editando ? 'Editar Zona' : 'Crear Nueva Zona'}
              </h2>
              <button onClick={handleCerrarFormulario} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const fieldValue = (key: string) => String(formData.get(key) ?? '');
              handleGuardar({
                nombre: fieldValue('nombre'),
                descripcion: fieldValue('descripcion'),
                capacidadMaxima: Number.parseInt(fieldValue('capacidadMaxima'), 10),
                costoPorHora: Number.parseFloat(fieldValue('costePorHora')),
                reglasUso: fieldValue('reglasUso'),
                fotoUrl: fieldValue('fotoUrl'),
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la Zona</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    defaultValue={zonaEditando?.nombre || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="descripcion" className="block text-formula text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={3}
                    required
                    defaultValue={zonaEditando?.descripcion || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="capacidadMaxima" className="block text-sm font-medium text-gray-700">Capacidad Máxima</label>
                    <input
                      type="number"
                      id="capacidadMaxima"
                      name="capacidadMaxima"
                      required
                      defaultValue={zonaEditando?.capacidadMaxima ?? ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="costePorHora" className="block text-sm font-medium text-gray-700">Coste por Hora (€)</label>
                    <input
                      type="number"
                      id="costePorHora"
                      name="costePorHora"
                      step="0.01"
                      required
                      defaultValue={zonaEditando?.costePorHora ?? ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="reglasUso" className="block text-sm font-medium text-gray-700">Reglas de Uso</label>
                  <textarea
                    id="reglasUso"
                    name="reglasUso"
                    rows={2}
                    required
                    defaultValue={zonaEditando?.reglasUso || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="fotoUrl" className="block text-sm font-medium text-gray-700">URL de la Foto (Opcional)</label>
                  <input
                    type="url"
                    id="fotoUrl"
                    name="fotoUrl"
                    placeholder="https://ejemplo.com/foto.jpg"
                    defaultValue={zonaEditando?.fotoUrl || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCerrarFormulario}
                  className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naranja-500"
                >
                  {editando ? 'Actualizar Zona' : 'Crear Zona'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionZonas;
