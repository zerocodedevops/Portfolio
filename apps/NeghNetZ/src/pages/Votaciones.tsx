// RUTA: ./src/pages/Votaciones.jsx

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from '../demo/demoStore';
import type { VotacionData, VecinoOutletContext } from '../types/domain';

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
  increment,
  writeBatch
} from '../demo/demoStore';
import { notifyCommunityMembers } from '../services/notificacionesService';

function Votaciones() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();
  const isAdmin = hasAdministratorAccess(datosVecino);
  const [votacionesActivas, setVotaciones] = useState<VotacionData[]>([]);
  const [historico, setHistorico] = useState<VotacionData[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [votacionEditando, setVotacionEditando] = useState<VotacionData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!datosVecino?.idComunidad) return;
    const qActivas = query(collection(db, 'votaciones'), where('idComunidad', '==', datosVecino.idComunidad), where('estado', '==', 'activa'));
    const qHistorico = query(collection(db, 'votaciones'), where('idComunidad', '==', datosVecino.idComunidad), where('estado', 'in', ['finalizada', 'cancelada']));

    const unsubscribeActivas = onSnapshot(qActivas, (snapshot) => {
      const activasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VotacionData));
      setVotaciones(activasData);
    });

    const unsubscribeHistorico = onSnapshot(qHistorico, (snapshot) => {
      const historicoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VotacionData));
      setHistorico(historicoData);
    });

    setCargando(false);
    return () => {
      unsubscribeActivas();
      unsubscribeHistorico();
    };
  }, [datosVecino?.idComunidad]);

  const handleVotar = async (votacionId: string, opcion: string) => {
    const uid = datosVecino?.uid;
    if (!uid) return;
    const userVoteRef = doc(db, 'votaciones', votacionId);
    const votoRef = doc(userVoteRef, 'votos', uid);

    const batch = writeBatch(db);
    batch.set(votoRef, { uid, opcion, creadoEn: serverTimestamp() });
    batch.update(userVoteRef, { [`votos.${opcion}`]: increment(1) });
    await batch.commit();

    console.log(`Voto registrado para la opción ${opcion}`);
  };

  const handleAbrirFormulario = (votacion?: VotacionData) => {
    setVotacionEditando(votacion ?? null);
    setEditando(Boolean(votacion));
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(false);
    setVotacionEditando(null);
  };

  const handleGuardar = async (datosFormulario: FormData) => {
    try {
      const datosLimpios = {
        titulo: datosFormulario.get('titulo'),
        descripcion: datosFormulario.get('descripcion'),
        opciones: String(datosFormulario.get('opciones') ?? '').split('\n').map(op => op.trim()).filter(Boolean),
      };

      if (editando && votacionEditando) {
        const docRef = doc(db, 'votaciones', votacionEditando.id);
        await updateDoc(docRef, { ...datosLimpios });
        console.log("Votación actualizada con éxito");
      } else if (datosVecino?.idComunidad && datosVecino.uid) {
        const datosCompletos = {
          ...datosLimpios,
          estado: 'activa',
          idComunidad: datosVecino.idComunidad,
          creadaPor: datosVecino.uid,
          fechaCreacion: serverTimestamp(),
          votos: {}
        };
        const votacion = await addDoc(collection(db, 'votaciones'), datosCompletos);
        void notifyCommunityMembers({
          communityId: datosVecino.idComunidad,
          actorUid: datosVecino.uid,
          actorName: [datosVecino.datosPersonales?.nombre, datosVecino.datosPersonales?.apellidos].filter(Boolean).join(' ') || datosVecino.nombre || 'Administración',
          type: 'votacion',
          title: 'Nueva votación abierta',
          description: String(datosCompletos.titulo || 'Votación comunitaria'),
          route: '/dashboard/votaciones',
          sourceId: votacion.id,
          excludeActor: true,
        }).catch((notificationError) => console.error('No se pudo notificar la votación:', notificationError));
        console.log("Votación creada con éxito");
      }
      handleCerrarFormulario();
    } catch (error) {
      console.error("Error al guardar la votación:", error);
    }
  };

  if (cargando) {
    return <div className="p-6 text-center">Cargando votaciones...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Votaciones de la Comunidad</h1>
        {isAdmin && (
          <button onClick={() => handleAbrirFormulario()} className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded">
            Crear Nueva Votación
          </button>
        )}
      </div>

      {/* Modal para Crear/Editar Votación */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editando ? 'Editar Votación' : 'Crear Nueva Votación'}</h2>
              <button onClick={handleCerrarFormulario} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleGuardar(formData);
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título de la Votación</label>
                  <input type="text" id="titulo" name="titulo" required defaultValue={votacionEditando?.titulo || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea id="descripcion" name="descripcion" rows={3} required defaultValue={votacionEditando?.descripcion || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="opciones" className="block text-sm font-medium text-gray-700">Opciones (una por línea)</label>
                  <textarea id="opciones" name="opciones" rows={4} required defaultValue={votacionEditando?.opciones?.map(op => typeof op === 'string' ? op : op.texto ?? op.nombre ?? '').join('\n') || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-naranja-500 focus:border-naranja-500 sm:text-sm" placeholder="Opción A&#10;Opción B&#10;Opción C" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCerrarFormulario} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancelar</button>
                <button type="submit" className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naranja-500">{editando ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Votaciones Activas */}
      <div className="space-y-6">
        {votacionesActivas.length === 0 ? (
          <p className="text-gray-500 text-center bg-white p-4 rounded-lg shadow">No hay votaciones activas en este momento.</p>
        ) : (
          votacionesActivas.map((votacion) => (
            <div key={votacion.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">{votacion.titulo}</h3>
              <p className="text-gray-600 mb-4">{votacion.descripcion}</p>
              <div className="space-y-2">
                {votacion.opciones?.map((opcion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <span>{typeof opcion === 'string' ? opcion : opcion.texto ?? opcion.nombre}</span>
                    <button
                      onClick={() => handleVotar(votacion.id, typeof opcion === 'string' ? opcion : opcion.texto ?? opcion.nombre ?? '')}
                      className="bg-naranja-500 text-white px-3 py-1 rounded text-sm hover:bg-naranja-600"
                    >
                      Votar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Historial de Votaciones (solo para admin) */}
      {isAdmin && historico.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Votaciones</h2>
          <div className="space-y-4">
            {historico.map((votacion) => (
              <div key={votacion.id} className="bg-white p-4 rounded-lg shadow opacity-75">
                <h4 className="font-semibold text-gray-700">{votacion.titulo}</h4>
                <p className="text-sm text-gray-500">Estado: {votacion.estado}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Votaciones;
