// RUTA: ./src/pages/Incidencias.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../demo/demoStore';
import type { IncidenciaData, VecinoData } from '../types/domain';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  where
} from '../demo/demoStore';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { notifyCommunityMembers } from '../services/notificacionesService';

function Incidencias({ datosVecino: currentUser }: { datosVecino?: VecinoData | null }) {
  const [incidencias, setIncidencias] = useState<IncidenciaData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todas');

  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    prioridad: 'media',
    estado: 'pendiente',
    creador: currentUser?.uid || null
  });

  useEffect(() => {
    if (!currentUser?.idComunidad) return;
    const q = query(collection(db, 'incidencias'), where('idComunidad', '==', currentUser.idComunidad), orderBy('fechaCreacion', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const incidenciasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as IncidenciaData));
        setIncidencias(incidenciasData);
        setCargando(false);
      },
      (error) => {
        console.error("Error al obtener incidencias:", error);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.idComunidad]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const incidenciaLimpia = {
        ...nuevaIncidencia,
        prioridad: nuevaIncidencia.prioridad ?? 'media',
        estado: nuevaIncidencia.estado ?? 'pendiente',
        creador: currentUser?.uid || null
      };

      if (editando) {
        const docRef = doc(db, 'incidencias', editando);
        const datosFiltrados = Object.fromEntries(
          Object.entries(incidenciaLimpia).filter(([, value]) => value !== undefined)
        );
        await updateDoc(docRef, datosFiltrados);
        setEditando(null);
      } else {
        const nueva = await addDoc(collection(db, 'incidencias'), {
          ...incidenciaLimpia,
          idVecino: currentUser?.uid || null,
          idComunidad: currentUser?.idComunidad || null,
          fechaCreacion: serverTimestamp()
        });
        if (currentUser?.uid && currentUser.idComunidad) {
          void notifyCommunityMembers({
            communityId: currentUser.idComunidad,
            actorUid: currentUser.uid,
            actorName: [currentUser.datosPersonales?.nombre, currentUser.datosPersonales?.apellidos].filter(Boolean).join(' ') || currentUser.nombre || 'Un vecino',
            type: 'incidencia',
            title: 'Nueva incidencia reportada',
            description: nuevaIncidencia.titulo.trim(),
            route: '/dashboard/incidencias',
            sourceId: nueva.id,
            excludeActor: true,
          }).catch((notificationError) => console.error('No se pudo notificar la incidencia:', notificationError));
        }
      }

      setNuevaIncidencia({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        prioridad: 'media',
        estado: 'pendiente',
        creador: currentUser?.uid || null
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al guardar incidencia:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta incidencia?')) {
      try {
        await deleteDoc(doc(db, 'incidencias', id));
      } catch (error) {
        console.error("Error al eliminar incidencia:", error);
      }
    }
  };

  const handleEdit = (incidencia: IncidenciaData) => {
    setNuevaIncidencia({
      titulo: incidencia.titulo ?? '',
      descripcion: incidencia.descripcion ?? '',
      ubicacion: incidencia.ubicacion ?? '',
      prioridad: incidencia.prioridad ?? 'media',
      estado: incidencia.estado ?? 'pendiente',
      creador: incidencia.creador ?? currentUser?.uid ?? null
    });
    setEditando(incidencia.id);
    setMostrarFormulario(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaIncidencia((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const filtrarIncidencias = () => {
    if (filtroEstado === 'todas') return incidencias;
    return incidencias.filter((i) => i.estado === filtroEstado);
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'resuelta': return 'bg-green-100 text-green-800';
      case 'descartada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (cargando) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Incidencias de la Comunidad</h1>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn-primary"
        >
          {mostrarFormulario ? 'Cancelar' : 'Nueva Incidencia'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {editando ? 'Editar Incidencia' : 'Nueva Incidencia'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={nuevaIncidencia.titulo ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={nuevaIncidencia.ubicacion ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={nuevaIncidencia.descripcion ?? ''}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                <select
                  name="prioridad"
                  value={nuevaIncidencia.prioridad ?? 'media'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                <select
                  name="estado"
                  value={nuevaIncidencia.estado ?? 'pendiente'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="resuelta">Resuelta</option>
                  <option value="descartada">Descartada</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
              >
                {editando ? 'Actualizar' : 'Crear'} Incidencia
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por estado:</span>
          {['todas', 'pendiente', 'en_progreso', 'resuelta', 'descartada'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                filtroEstado === estado 
                  ? 'bg-naranja-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {estado === 'todas'
                ? 'Todas'
                : estado === 'en_progreso'
                ? 'En Progreso'
                : estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtrarIncidencias().length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
          No hay incidencias registradas.
        </div>
      ) : (
        <div className="space-y-4">
          {filtrarIncidencias().map((incidencia) => (
            <div key={incidencia.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden card-hover">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {incidencia.titulo ?? 'Sin título'}
                  </h3>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getEstadoColor(incidencia.estado ?? 'pendiente')
                      }`}
                    >
                      {incidencia.estado === 'en_progreso'
                        ? 'En Progreso'
                        : typeof incidencia.estado === 'string'
                        ? incidencia.estado.charAt(0).toUpperCase() + incidencia.estado.slice(1)
                        : 'Sin estado'}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPrioridadColor(incidencia.prioridad ?? 'media')
                      }`}
                    >
                      {typeof incidencia.prioridad === 'string'
                        ? incidencia.prioridad.charAt(0).toUpperCase() + incidencia.prioridad.slice(1)
                        : 'Media'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Ubicación:</strong> {incidencia.ubicacion ?? 'No especificada'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {incidencia.descripcion ?? 'Sin descripción'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Creada el{' '}
                    {incidencia.fechaCreacion
                      ? (typeof incidencia.fechaCreacion === 'object' && 'toDate' in incidencia.fechaCreacion
                        ? incidencia.fechaCreacion.toDate()
                        : new Date(incidencia.fechaCreacion as string | Date)).toLocaleDateString()
                      : 'Fecha desconocida'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(incidencia)}
                      className="text-naranja-600 hover:text-naranja-800 dark:text-naranja-400 dark:hover:text-naranja-300 font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(incidencia.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Incidencias;
