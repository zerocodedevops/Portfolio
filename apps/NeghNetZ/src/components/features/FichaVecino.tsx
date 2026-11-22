// RUTA: ./src/components/features/FichaVecino.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { db } from '../../demo/demoStore';
import type { VecinoData, VecinoOutletContext } from '../../types/domain';
import { doc, getDoc } from '../../demo/demoStore';
import { hasAdministratorAccess } from '../../utils/residentRoles';

function FichaVecino() { // <-- 2. CAMBIADO: Ya no recibe props
  const [datosVecino] = useOutletContext<VecinoOutletContext>(); // <-- 3. AÑADIDO: Obtenemos los datos del contexto

  // --- 4. ¡CAMBIO CLAVE! Guarda de seguridad ---
  if (!datosVecino) {
    return <div className="p-6 text-center">Cargando usuario...</div>;
  }

  const { vecinoId } = useParams();
  const navigate = useNavigate();
  const [vecino, setVecino] = useState<VecinoData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = hasAdministratorAccess(datosVecino);
  const isOwnTarget = Boolean(vecinoId && (vecinoId === datosVecino.uid || vecinoId === datosVecino.id));

  useEffect(() => {
    const getVecinoData = async () => {
      if (!vecinoId) {
        setError('No se ha especificado un vecino.');
        setCargando(false);
        return;
      }
      try {
        const vecinoDocRef = doc(db, isAdmin || isOwnTarget ? 'vecinos' : 'vecinosPublicos', vecinoId);
        const vecinoDocSnap = await getDoc(vecinoDocRef);

        if (vecinoDocSnap.exists()) {
          const rawData = vecinoDocSnap.data();
          const data: VecinoData = { id: String(rawData.idFicha || vecinoDocSnap.id), ...rawData } as VecinoData;
          
          // --- ¡LÓGICA ROBUSTA Y CORRECTA (IGUAL QUE EN Vecinos.jsx)! ---
          // Leemos directamente los campos separados, con fallback a los datos antiguos si existen
          const portal = data.datosPersonales?.portal || data.portal || 'N/A';
          const piso = data.datosPersonales?.piso || data.piso || 'N/A';
          const letra = data.datosPersonales?.letra || data.letra || '';
          
          // Añadimos los datos procesados al objeto para usarlos en el renderizado
          data.portal = portal;
          data.piso = piso;
          data.letra = letra;

          setVecino(data);
        } else {
          setError('Vecino no encontrado.');
        }
      } catch (err) {
        console.error("Error al obtener el vecino:", err);
        setError('Error al cargar los datos del vecino.');
      } finally {
        setCargando(false);
      }
    };
    getVecinoData();
  }, [vecinoId, isAdmin, isOwnTarget]);

  // --- LÓGICA DE PRIVACIDAD ---
  const esMiPerfil = Boolean(isOwnTarget || (datosVecino?.id && datosVecino.id === vecino?.id));

  const puedeVerEmail = esMiPerfil || isAdmin;
  const puedeVerMovil = esMiPerfil || isAdmin || vecino?.datosPersonales?.autorizaTelefonoDirectorio === true;
  const puedeVerDni = isAdmin;
  const puedeEditar = esMiPerfil || isAdmin;

  if (cargando) return <div className="p-6 text-center">Cargando ficha...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!vecino) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-naranja-600 hover:text-naranja-800 font-medium">&larr; Volver</button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Cabecera con Foto y Nombre */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-2xl">
            {vecino.datosPersonales?.nombre?.charAt(0) || 'V'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{vecino.datosPersonales?.nombre || 'Sin nombre'} {vecino.datosPersonales?.apellidos || ''}</h1>
            <p className="text-gray-500">
              Portal: {vecino.portal}, Piso: {vecino.piso}
            </p>
          </div>
          {puedeEditar && (
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              Editar Perfil
            </button>
          )}
        </div>

        {/* Detalles de la Información */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p className="text-gray-600">
                {puedeVerEmail ? vecino.email : 'Oculto (solicitar contacto)'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Móvil</h3>
              <p className="text-gray-600">
                {puedeVerMovil ? vecino.datosPersonales?.telefono || vecino.datosPersonales?.movil || 'No especificado' : 'Oculto (solicitar contacto)'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">DNI</h3>
              <p className="text-gray-600">
                {puedeVerDni ? vecino.datosPersonales?.dni || 'No especificado' : 'Oculto'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Rol en la Comunidad</h3>
              <p className="text-gray-600">{vecino.rol || 'Sin rol definido'}</p>
            </div>
          </div>
        </div>

        {/* Sección de Acciones */}
        {!esMiPerfil && !isAdmin && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Acciones</h3>
            <button
              type="button"
              onClick={() => vecino?.uid && navigate(`/dashboard/mensajes?with=${encodeURIComponent(vecino.uid)}`)}
              disabled={!vecino?.uid || vecino.chatEnabled === false}
              className="rounded-lg bg-emerald-800 px-4 py-2 font-medium text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar mensaje privado
            </button>
            <p className="mt-2 text-xs text-gray-500">No se comparte el teléfono ni el correo del vecino.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FichaVecino;
