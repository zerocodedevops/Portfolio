// RUTA: ./src/pages/Gastos.jsx

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from '../demo/demoStore';
import type { GastoData } from '../types/domain';
import type { VecinoOutletContext } from '../types/domain';
import { hasAdministratorAccess } from '../utils/residentRoles';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  where,
  orderBy
} from '../demo/demoStore';

function Gastos() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();
  const isAdmin = hasAdministratorAccess(datosVecino);
  const [gastos, setGastos] = useState<GastoData[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!datosVecino?.idComunidad) {
      setCargando(false);
      return;
    }

    const q = query(
      collection(db, 'gastos'), 
      where('idComunidad', '==', datosVecino.idComunidad), 
      orderBy('fecha', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gastosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GastoData));
      setGastos(gastosData);
      setCargando(false);
    }, (error) => {
      console.error("Error al obtener los gastos:", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [datosVecino]);

  const handleAbrirFormulario = (gasto?: GastoData) => {
    setGastoEditando(gasto ?? null);
    setEditando(Boolean(gasto));
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(false);
    setGastoEditando(null);
  };

  const handleGuardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const datosFormulario = {
      concepto: String(formData.get('concepto') ?? ''),
      importe: parseFloat(String(formData.get('importe') ?? '0')),
      tipo: String(formData.get('tipo') ?? ''),
      periodicidad: String(formData.get('periodicidad') ?? '')
    };

    try {
      if (editando && gastoEditando) {
        const docRef = doc(db, 'gastos', gastoEditando.id);
        await updateDoc(docRef, datosFormulario);
        console.log("Gasto actualizado con éxito");
      } else if (datosVecino?.idComunidad && datosVecino.uid) {
        await addDoc(collection(db, 'gastos'), {
          ...datosFormulario,
          idComunidad: datosVecino.idComunidad,
          creadoPor: datosVecino.uid,
          fecha: serverTimestamp(),
        });
        console.log("Gasto creado con éxito");
      }
      handleCerrarFormulario();
    } catch (error) {
      console.error("Error al guardar el gasto:", error);
    }
  };

  if (cargando) {
    return <div className="p-6 text-center">Cargando gastos...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gastos y Cuotas</h1>
        {isAdmin && (
          <button onClick={() => handleAbrirFormulario()} className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded">
            Añadir Nuevo Gasto
          </button>
        )}
      </div>

      {/* Modal para Crear/Editar Gasto */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editando ? 'Editar Gasto' : 'Añadir Nuevo Gasto'}</h2>
              <button onClick={handleCerrarFormulario} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleGuardar}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="concepto" className="block text-sm font-medium text-gray-700">Concepto</label>
                  <input type="text" id="concepto" name="concepto" required defaultValue={gastoEditando?.concepto || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="importe" className="block text-sm font-medium text-gray-700">Importe (€)</label>
                  <input type="number" id="importe" name="importe" step="0.01" required defaultValue={gastoEditando?.importe || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select id="tipo" name="tipo" required defaultValue={gastoEditando?.tipo || 'ordinario'} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm">
                    <option value="ordinario">Ordinario</option>
                    <option value="extraordinario">Extraordinario</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="periodicidad" className="block text-sm font-medium text-gray-700">Periodicidad</label>
                  <select id="periodicidad" name="periodicidad" required defaultValue={gastoEditando?.periodicidad || 'mensual'} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm">
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCerrarFormulario} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancelar</button>
                <button type="submit" className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naranja-500">{editando ? 'Actualizar' : 'Añadir'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Gastos */}
      <div className="space-y-4">
        {gastos.length === 0 ? (
          <p className="text-gray-500 text-center bg-white p-4 rounded-lg shadow">No hay gastos registrados en este momento.</p>
        ) : (
          gastos.map((gasto) => (
            <div key={gasto.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{gasto.concepto}</h4>
                <p className="text-sm text-gray-600">Importe: {gasto.importe}€ | Tipo: {gasto.tipo}</p>
                <p className="text-xs text-gray-500">Periodicidad: {gasto.periodicidad} | {gasto.fecha ? (typeof gasto.fecha === 'object' && 'toDate' in gasto.fecha ? gasto.fecha.toDate() : new Date(gasto.fecha)).toLocaleDateString() : 'Fecha no disponible'}</p>
              </div>
              <div className="flex space-x-2">
                {isAdmin && (
                  <button onClick={() => handleAbrirFormulario(gasto)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Gastos;
