// RUTA: ./src/components/GestionDocumentos.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../demo/demoStore';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, where } from '../demo/demoStore';
import { uploadDemoFileResumable, getDemoDownloadURL } from '../demo/demoStorage';
import type { ArchivoDocumento, CarpetaDocumento, VecinoData, ZonaComun } from '../types/domain';
import { hasAdministratorAccess } from '../utils/residentRoles';
import { notifyCommunityMembers } from '../services/notificacionesService';

const COLECCION_ZONAS = 'zonasComunes';
const COLECCION_CARPETAS = 'carpetas';
const COLECCION_DOCUMENTOS = 'documentos';

function GestionDocumentos({ datosVecino }: { datosVecino: VecinoData | null }) {
  const esAdmin = hasAdministratorAccess(datosVecino);
  const communityId = datosVecino?.idComunidad;

  const [zonas, setZonas] = useState<ZonaComun[]>([]);
  const [carpetas, setCarpetas] = useState<CarpetaDocumento[]>([]);
  const [archivos, setArchivos] = useState<ArchivoDocumento[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoZona, setEditandoZona] = useState<ZonaComun | null>(null);
  const [editandoCarpeta, setEditandoCarpeta] = useState<CarpetaDocumento | null>(null);
  const [tabActiva, setTabActiva] = useState('zonas');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState<CarpetaDocumento | null>(null);

  useEffect(() => {
    if (!communityId) return;
    const unsubscribeZonas = onSnapshot(query(collection(db, COLECCION_ZONAS), where('idComunidad', '==', communityId)), (snapshot) => {
      setZonas(snapshot.docs.map(document => ({ id: document.id, ...document.data() })) as ZonaComun[]);
    });

    const unsubscribeCarpetas = onSnapshot(query(collection(db, COLECCION_CARPETAS), where('idComunidad', '==', communityId)), (snapshot) => {
      setCarpetas(snapshot.docs.map(document => ({ id: document.id, ...document.data() })) as CarpetaDocumento[]);
    });

    return () => {
      unsubscribeZonas();
      unsubscribeCarpetas();
    };
  }, [communityId]);

  useEffect(() => {
    if (!carpetaSeleccionada) return;
    if (!communityId) return;
    const q = query(collection(db, COLECCION_DOCUMENTOS), where('idComunidad', '==', communityId), where('idCarpeta', '==', carpetaSeleccionada.id));
    const unsubscribeArchivos = onSnapshot(q, (snapshot) => {
      setArchivos(snapshot.docs.map(document => ({ id: document.id, ...document.data() })) as ArchivoDocumento[]);
    });
    return () => unsubscribeArchivos();
  }, [carpetaSeleccionada, communityId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleAbrirFormulario = (tipo: 'zona' | 'carpeta', itemExistente: ZonaComun | CarpetaDocumento | null = null) => {
    if (!esAdmin) return;
    if (tipo === 'zona') setEditandoZona(itemExistente);
    else setEditandoCarpeta(itemExistente);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditandoZona(null);
    setEditandoCarpeta(null);
    setFile(null);
    setUploadProgress(0);
  };

  const handleGuardar = async (datosFormulario: Record<string, string | number | undefined>) => {
    if (!esAdmin) return;
    try {
      if (editandoZona) {
        await updateDoc(doc(db, COLECCION_ZONAS, editandoZona.id), {
          ...datosFormulario,
          fechaActualizacion: serverTimestamp()
        });
      } else if (editandoCarpeta) {
        await updateDoc(doc(db, COLECCION_CARPETAS, editandoCarpeta.id), datosFormulario);
      } else {
        if (tabActiva === 'zonas') {
          await addDoc(collection(db, COLECCION_ZONAS), {
            ...datosFormulario,
            idComunidad: communityId,
            fechaCreacion: serverTimestamp()
          });
        } else {
          const folderRef = await addDoc(collection(db, COLECCION_CARPETAS), { ...datosFormulario, idComunidad: communityId });
          if (file) await subirArchivo(file, folderRef.id, String(datosFormulario.nombre ?? ''));
        }
      }
      handleCerrarFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const subirArchivo = async (selectedFile: File, folderId: string, folderName: string) => {
    if (!datosVecino?.uid) return;
    setUploading(true);
    setUploadProgress(0);
    const filePath = `documentos/${folderName}/${selectedFile.name}`;
    await new Promise<void>((resolve, reject) => {
      uploadDemoFileResumable(
        filePath,
        selectedFile,
        (snapshot) => {
          setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        reject,
        async () => {
          try {
            const urlDescarga = await getDemoDownloadURL(filePath);
            const createdDocument = await addDoc(collection(db, COLECCION_DOCUMENTOS), {
            nombre: selectedFile.name,
            urlDescarga,
            tipo: 'archivo',
            idCarpeta: folderId,
            idComunidad: communityId,
            subidoPor: datosVecino.uid,
            fechaSubida: serverTimestamp(),
            tamaño: selectedFile.size,
            tipoMime: selectedFile.type,
          });
          if (datosVecino.idComunidad && datosVecino.uid) {
            void notifyCommunityMembers({
              communityId: datosVecino.idComunidad,
              actorUid: datosVecino.uid,
              actorName: [datosVecino.datosPersonales?.nombre, datosVecino.datosPersonales?.apellidos].filter(Boolean).join(' ') || datosVecino.nombre || 'Un vecino',
              type: 'documento',
              title: 'Nuevo documento comunitario',
              description: selectedFile.name,
              route: '/dashboard/documentos',
              sourceId: createdDocument.id,
              excludeActor: true,
            }).catch((notificationError) => console.error('No se pudo notificar el documento:', notificationError));
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }).finally(() => setUploading(false));
  };

  const handleEliminar = async (id: string, coleccion: string) => {
    if (!esAdmin) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      try {
        await deleteDoc(doc(db, coleccion, id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const renderZonas = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Zonas Comunes</h3>
        {esAdmin && (
          <button onClick={() => handleAbrirFormulario('zona')} className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded">
            Crear Nueva Zona
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zonas.map(zona => (
          <div key={zona.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{zona.nombre}</h4>
              <p className="text-sm text-gray-600">{zona.descripcion}</p>
              <p className="text-xs text-gray-500">Capacidad: {zona.capacidadMaxima} | Coste: {zona.costoPorHora}€/h</p>
            </div>
            {esAdmin && (
              <div className="flex space-x-2">
                <button onClick={() => handleAbrirFormulario('zona', zona)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => handleEliminar(zona.id, 'zonasComunes')} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const renderCarpetas = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Carpetas de Documentos</h3>
        {esAdmin && (
          <button onClick={() => handleAbrirFormulario('carpeta')} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
            Crear Nueva Carpeta
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carpetas.map(carpeta => (
          <div key={carpeta.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCarpetaSeleccionada(carpeta)}>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">📁 {carpeta.nombre}</h4>
            </div>
            {esAdmin && (
              <div className="flex space-x-2">
                                <button onClick={(e) => { e.stopPropagation(); handleEliminar(carpeta.id, 'carpetas'); }} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {carpetaSeleccionada && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">📁 {carpetaSeleccionada.nombre}</h3>
            {esAdmin && (
              <button onClick={() => handleAbrirFormulario('carpeta')} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
                Subir Archivo
              </button>
            )}
          </div>

          {uploading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Subiendo: {file?.name}</span>
                <span className="text-sm text-blue-700">{uploadProgress.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivos.map((archivo) => (
              <div key={archivo.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium text-gray-900">{archivo.nombre}</p>
                    <p className="text-xs text-gray-500">Subido por {archivo.subidoPor} el {archivo.fechaSubida instanceof Date ? archivo.fechaSubida.toLocaleDateString() : typeof archivo.fechaSubida === 'string' ? archivo.fechaSubida : archivo.fechaSubida?.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
                <a
                  href={archivo.urlDescarga}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-naranja-600 hover:text-naranja-800 font-medium text-sm"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de la Comunidad</h2>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setTabActiva('zonas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tabActiva === 'zonas'
                ? 'border-naranja-500 text-naranja-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Zonas Comunes
          </button>
          <button
            onClick={() => setTabActiva('carpetas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tabActiva === 'carpetas'
                ? 'border-naranja-500 text-naranja-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Carpetas
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {tabActiva === 'zonas' && renderZonas()}
        {tabActiva === 'carpetas' && renderCarpetas()}
      </div>

      {mostrarFormulario && esAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editandoZona ? 'Editar Zona' : editandoCarpeta ? 'Editar Carpeta' : (tabActiva === 'zonas' ? 'Crear Nueva Zona' : 'Crear Nueva Carpeta')}
              </h2>
              <button onClick={handleCerrarFormulario} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const fieldValue = (key: string) => String(formData.get(key) ?? '');
              if (!datosVecino?.idComunidad) return;
              const datosFormulario = {
                nombre: fieldValue('nombre'),
                descripcion: fieldValue('descripcion'),
                capacidadMaxima: Number.parseInt(fieldValue('capacidadMaxima'), 10) || 0,
                costoPorHora: Number.parseFloat(fieldValue('costePorHora')) || 0,
                reglasUso: fieldValue('reglasUso'),
                fotoUrl: fieldValue('fotoUrl'),
                idComunidad: datosVecino.idComunidad,
              };
              handleGuardar(datosFormulario);
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" id="nombre" name="nombre" required defaultValue={editandoZona?.nombre || editandoCarpeta?.nombre || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                {tabActiva === 'zonas' && (
                  <>
                    <div>
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                      <textarea id="descripcion" name="descripcion" defaultValue={editandoZona?.descripcion || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="capacidadMaxima" className="block text-sm font-medium text-gray-700">Capacidad Máxima</label>
                      <input type="number" id="capacidadMaxima" name="capacidadMaxima" defaultValue={editandoZona?.capacidadMaxima || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="costePorHora" className="block text-sm font-medium text-gray-700">Coste por Hora (€)</label>
                      <input type="number" step="0.01" id="costePorHora" name="costePorHora" defaultValue={editandoZona?.costoPorHora || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="reglasUso" className="block text-sm font-medium text-gray-700">Reglas de Uso</label>
                      <textarea id="reglasUso" name="reglasUso" defaultValue={editandoZona?.reglasUso || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="fotoUrl" className="block text-sm font-medium text-gray-700">URL de Foto</label>
                      <input type="text" id="fotoUrl" name="fotoUrl" defaultValue={editandoZona?.fotoUrl || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                  </>
                )}
                {tabActiva === 'carpetas' && (
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">Archivo (opcional)</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCerrarFormulario} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naranja-500">
                  {editandoZona || editandoCarpeta ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDocumentos;
