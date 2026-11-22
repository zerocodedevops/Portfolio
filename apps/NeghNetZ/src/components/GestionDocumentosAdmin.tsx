// RUTA: ./src/components/GestionDocumentosAdmin.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../demo/demoStore';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from '../demo/demoStore';
import { uploadDemoFileResumable, getDemoDownloadURL, removeDemoFiles } from '../demo/demoStorage';
import type { ArchivoDocumento, CarpetaDocumento, VecinoData } from '../types/domain';

// Componente para subir archivos (reutilizable)
interface FileUploaderProps {
  carpetaSeleccionada: CarpetaDocumento;
  datosVecino: VecinoData | null;
  onUploadSuccess: () => void;
}

const FileUploader = ({ carpetaSeleccionada, datosVecino, onUploadSuccess }: FileUploaderProps) => {
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    subirArchivo(file);
  };

  const subirArchivo = async (file: File) => {
    if (!datosVecino?.uid) {
      setError('Inicia sesión para subir documentos.');
      return;
    }
    setSubiendo(true);
    setProgreso(0);
    const filePath = `documentos/${carpetaSeleccionada.nombre}/${file.name}`;

    uploadDemoFileResumable(
      filePath,
      file,
      (snapshot) => setProgreso((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => {
        console.error('Error al subir el archivo:', error);
        setError('Error al subir el archivo. Inténtalo de nuevo.');
        setSubiendo(false);
      },
      async () => {
        try {
          const downloadURL = await getDemoDownloadURL(filePath);
          const nuevoDocumento = {
            nombre: file.name,
            urlDescarga: downloadURL,
            tipo: 'archivo',
            idCarpeta: carpetaSeleccionada.id,
            subidoPor: datosVecino.uid,
            fechaSubida: serverTimestamp(),
            tamaño: file.size,
            tipoMime: file.type,
            idComunidad: datosVecino.idComunidad,
          };
          await addDoc(collection(db, 'documentos'), nuevoDocumento);
          console.log("Archivo subido y guardado en Firestore con éxito");
          onUploadSuccess();
        } catch (err) {
          console.error('Error al guardar el documento en Firestore:', err);
          setError('Error al guardar la información del archivo.');
        } finally {
          setSubiendo(false);
        }
      }
    );
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Subir Nuevo Documento</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M7 16a4 4 0 01-.88.88 3.12 3.12L7 20l-4-4M21 12a4 4 0 01-3.12-3.12L17 8l4 4m0 0-4-4-4 4" />
            </svg>
            <p className="text-sm text-gray-600">Haz clic o arrastra un archivo aquí</p>
          </div>
          <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-800">{error}</p></div>}
      {subiendo && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progreso}%` }}></div></div>
          <p className="text-center text-sm text-gray-600 mt-2">Subiendo... {progreso.toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
};

function GestionDocumentosAdmin({ datosVecino }: { datosVecino: VecinoData | null }) {
  const [carpetas, setCarpetas] = useState<CarpetaDocumento[]>([]);
  const [archivos, setArchivos] = useState<ArchivoDocumento[]>([]);
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState<CarpetaDocumento | null>(null);
  const [mostrarModalCarpeta, setMostrarModalCarpeta] = useState(false);
  const [editandoCarpeta, setEditandoCarpeta] = useState<CarpetaDocumento | null>(null);

  useEffect(() => {
    if (!datosVecino?.idComunidad) return;
    const q = query(collection(db, 'documentos'), where('idComunidad', '==', datosVecino.idComunidad), where('tipo', '==', 'carpeta'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const carpetasData = snapshot.docs.map((document) => ({ id: document.id, ...document.data() })) as CarpetaDocumento[];
      setCarpetas(carpetasData);
    }, (error) => console.error("Error al obtener las carpetas:", error));
    return () => unsubscribe();
  }, [datosVecino?.idComunidad]);

  useEffect(() => {
    if (!carpetaSeleccionada) return;
    if (!datosVecino?.idComunidad) return;
    const q = query(collection(db, 'documentos'), where('idComunidad', '==', datosVecino.idComunidad), where('idCarpeta', '==', carpetaSeleccionada.id));
    const unsubscribeArchivos = onSnapshot(q, (snapshot) => {
      const archivosData = snapshot.docs.map((document) => ({ id: document.id, ...document.data() })) as ArchivoDocumento[];
      setArchivos(archivosData);
    }, (error) => console.error("Error al obtener archivos:", error));
    return unsubscribeArchivos;
  }, [carpetaSeleccionada, datosVecino?.idComunidad]);

  const handleAbrirModalCarpeta = (carpeta: CarpetaDocumento | null = null) => {
    setEditandoCarpeta(carpeta);
    setMostrarModalCarpeta(true);
  };

  const handleCerrarModalCarpeta = () => {
    setMostrarModalCarpeta(false);
    setEditandoCarpeta(null);
  };

  const handleGuardarCarpeta = async (datosFormulario: Pick<CarpetaDocumento, 'nombre'>) => {
    try {
      if (editandoCarpeta) {
        const docRef = doc(db, 'documentos', editandoCarpeta.id);
        await updateDoc(docRef, { ...datosFormulario });
        console.log("Carpeta actualizada con éxito");
      } else {
        await addDoc(collection(db, 'documentos'), { ...datosFormulario, idComunidad: datosVecino?.idComunidad, tipo: 'carpeta' });
        console.log("Carpeta creada con éxito");
      }
      handleCerrarModalCarpeta();
    } catch (error) {
      console.error("Error al guardar la carpeta:", error);
    }
  };

  const handleEliminarArchivo = async (archivo: ArchivoDocumento) => {
    if (!carpetaSeleccionada) return;
    if (window.confirm(`¿Estás seguro de que quieres eliminar el archivo "${archivo.nombre}"?`)) {
      try {
        removeDemoFiles([`documentos/${carpetaSeleccionada.nombre}/${archivo.nombre}`]);
        await deleteDoc(doc(db, 'documentos', archivo.id));
        console.log("Archivo eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar el archivo:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Documentos</h2>
        <button onClick={() => handleAbrirModalCarpeta()} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Crear Nueva Carpeta</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Carpetas */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Carpetas</h3>
            <ul className="space-y-2">
              {carpetas.map((carpeta) => (
                <li key={carpeta.id} className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${carpetaSeleccionada?.id === carpeta.id ? 'bg-naranja-50 border-l-4 border-naranja-500' : 'bg-white'}`} onClick={() => setCarpetaSeleccionada(carpeta)}>
                  <h4 className="font-medium text-gray-900">📁 {carpeta.nombre}</h4>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contenido de la Carpeta Seleccionada */}
        <div className="lg:col-span-2">
          {carpetaSeleccionada ? (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">📁 {carpetaSeleccionada.nombre}</h3>
              </div>
              <FileUploader carpetaSeleccionada={carpetaSeleccionada} datosVecino={datosVecino} onUploadSuccess={() => console.log('Upload success')} />
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Archivos en esta carpeta</h4>
                {archivos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Esta carpeta está vacía.</p>
                ) : (
                  <ul className="space-y-3">
                    {archivos.map((archivo) => (
                      <li key={archivo.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="font-medium text-gray-900">{archivo.nombre}</p>
                          <p className="text-xs text-gray-500">Subido el {archivo.fechaSubida instanceof Date ? archivo.fechaSubida.toLocaleDateString() : typeof archivo.fechaSubida === 'string' ? archivo.fechaSubida : archivo.fechaSubida?.toDate().toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <a href={archivo.urlDescarga} target="_blank" rel="noopener noreferrer" download className="text-naranja-600 hover:text-naranja-800 font-medium text-sm">Descargar</a>
                          <button onClick={() => handleEliminarArchivo(archivo)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
              Selecciona una carpeta del menú de la izquierda para ver su contenido.
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear/Editar Carpeta */}
      {mostrarModalCarpeta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editandoCarpeta ? 'Editar Carpeta' : 'Crear Nueva Carpeta'}</h2>
              <button onClick={handleCerrarModalCarpeta} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleGuardarCarpeta({ nombre: String(new FormData(e.currentTarget).get('nombre') ?? '') }); }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la Carpeta</label>
                  <input type="text" id="nombre" name="nombre" required defaultValue={editandoCarpeta?.nombre || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCerrarModalCarpeta} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm">{editandoCarpeta ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDocumentosAdmin;
