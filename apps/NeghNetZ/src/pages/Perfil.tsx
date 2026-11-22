// RUTA: ./src/pages/Perfil.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { VecinoOutletContext } from '../types/domain';
import { doc, updateDoc, serverTimestamp, writeBatch } from '../demo/demoStore';
import { createDemoFileUrl } from '../demo/demoStorage';
import { DEMO_UNAVAILABLE_MESSAGE } from '../demo/demoConstants';
import JoinCommunityForm from '../components/features/JoinCommunityForm';
import { subscribeOwnMembershipNotices, type MembershipNotice } from '../services/membershipService';

function Perfil() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();

  if (!datosVecino) {
    return <div className="p-6 text-center">Cargando perfil...</div>;
  }

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    dni: '',
  });

  const [imagenPreviewURL, setImagenPreviewURL] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [membershipNotices, setMembershipNotices] = useState<MembershipNotice[]>([]);

  useEffect(() => {
    if (datosVecino) {
      setFormData({
        nombre: datosVecino.datosPersonales?.nombre || '',
        apellidos: datosVecino.datosPersonales?.apellidos || '',
        telefono: datosVecino.datosPersonales?.telefono || '',
        email: datosVecino.email || '',
        dni: datosVecino.datosPersonales?.dni || '',
      });
      setImagenPreviewURL(datosVecino.fotoPerfil || null);
    }
  }, [datosVecino]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setMembershipNotices([]); return undefined; }
    return subscribeOwnMembershipNotices(uid, (notices) => {
      setMembershipNotices(notices);
      const unread = notices.filter((notice) => !notice.leidaEn);
      if (!unread.length) return;
      const batch = writeBatch(db);
      unread.forEach((notice) => batch.update(doc(db, 'usuariosAcceso', uid, 'inscripciones', notice.id), { leidaEn: serverTimestamp() }));
      void batch.commit().catch((noticeError) => console.warn('No se pudo marcar el estado de inscripción como leído:', noticeError));
    }, (noticeError) => console.warn('No se pudieron cargar los estados de inscripción:', noticeError));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagenPreviewURL(preview);
    }
  };

  const redimensionarImagen = (file: File, maxWidth = 300, maxHeight = 300): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') img.src = reader.result;
      };

      img.onload = () => {
        let { width, height } = img;
        const canvas = document.createElement('canvas');

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo preparar la imagen.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('No se pudo redimensionar la imagen'));
          }
        }, 'image/jpeg', 0.8);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubirImagen = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setSubiendoImagen(true);
    const user = auth.currentUser;
    if (!user) {
      setSubiendoImagen(false);
      return;
    }

    try {
      const imagenReducida = await redimensionarImagen(file);
      const avatarFile = imagenReducida instanceof File ? imagenReducida : new File([imagenReducida], 'avatar.jpg', { type: 'image/jpeg' });
      const downloadURL = createDemoFileUrl(`perfiles/${user.uid}/${Date.now()}.jpg`, avatarFile);

      const userRef = doc(db, "vecinos", user.uid);
      await updateDoc(userRef, { fotoPerfil: downloadURL });

      setMensaje("¡Foto de perfil actualizada correctamente!");
    } catch (err) {
      setError("Error al subir la imagen: " + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    setCargando(true);

    const user = auth.currentUser;
    if (!user) {
      setError('Inicia sesión para actualizar tu perfil.');
      setCargando(false);
      return;
    }

    try {
      const userRef = doc(db, "vecinos", user.uid);
      await updateDoc(userRef, {
        "datosPersonales.nombre": formData.nombre,
        "datosPersonales.apellidos": formData.apellidos,
        "datosPersonales.telefono": formData.telefono,
      });
      setMensaje("¡Datos actualizados correctamente!");
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setError("Error al actualizar los datos: " + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setCargando(false);
    }
  };

  const handlePasswordChange = async () => {
    setError(DEMO_UNAVAILABLE_MESSAGE);
  };

 return (
  <>
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div
            className="w-64 h-64 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center overflow-hidden"
            style={{ backgroundImage: `url(${imagenPreviewURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {!imagenPreviewURL && (
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM3 10a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8zM8 12a1 1 0 100 2h1a1 1 0 100-2H8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <button
          onClick={handleSubirImagen}
          disabled={subiendoImagen}
          className="mt-4 bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {subiendoImagen ? 'Subiendo...' : 'Cambiar Foto'}
        </button>
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
        
        {/* Mensajes de éxito o error */}
        {mensaje && <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">{mensaje}</div>}
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        {/* --- FORMULARIO COMPLETO --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellidos">
                Apellidos
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apellidos"
                name="apellidos"
                type="text"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                Teléfono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                readOnly // El email no se puede editar aquí
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">
                DNI
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
                id="dni"
                name="dni"
                type="text"
                value={formData.dni}
                readOnly // El DNI no se puede editar aquí
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={cargando}
              className="bg-naranja-500 hover:bg-naranja-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
              {cargando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={handlePasswordChange}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>

    <section className="mx-auto mt-6 max-w-4xl space-y-4">
      {membershipNotices.map((notice) => <article key={notice.id} className={`rounded-xl border p-4 ${notice.estado === 'pendiente_acreditacion' ? 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100' : 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100'}`}><p className="font-semibold">Inscripción en {notice.nombreComunidad}: {notice.estado === 'pendiente_acreditacion' ? 'pendiente de acreditación' : notice.estado === 'aceptada' ? 'aprobada' : 'pendiente de revisión'}</p><p className="mt-1 text-sm">{notice.estado === 'aceptada' ? 'Ya puedes cambiar a esta comunidad desde el selector del encabezado.' : 'La administración todavía debe revisar tu solicitud. No tendrás acceso a esa comunidad hasta que la apruebe.'}</p></article>)}
    </section>

    <JoinCommunityForm resident={datosVecino} />

    <input
      type="file"
      ref={fileInputRef}
      onChange={handleImagenChange}
      accept="image/*"
      className="hidden"
    />
  </>
);
}

export default Perfil;
