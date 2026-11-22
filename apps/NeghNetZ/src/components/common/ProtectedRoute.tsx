// RUTA: ./src/components/common/ProtectedRoute.jsx

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../demo/demoAuth';
import { db } from '../../demo/demoStore';
import { onAuthStateChanged } from '../../demo/demoAuth';
import { doc, onSnapshot } from '../../demo/demoStore';
import { findResidentProfile } from '../../firebase/residentProfile';
import VecinoLayout from '../layouts/VecinoLayout';
import AdminLayout from '../layouts/AdminLayout';
import { hasAdministrationNavigation, hasAdministratorAccess } from '../../utils/residentRoles';
import type { DemoUser as User } from '../../demo/demoTypes';
import type { VecinoData } from '../../types/domain';

// Componente de Cargando
function Cargando() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-xl text-gray-600">Cargando...</div>
    </div>
  );
}

/**
 * Componente de ruta protegida unificado
 * @param {string} requiredRole - Rol requerido: 'administrador' o null para cualquier vecino validado
 */
function ProtectedRoute({ requiredRole = null }: { requiredRole?: string | null }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [datosVecino, setDatosVecino] = useState<VecinoData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribeCommunity: (() => void) | undefined;
    let generation = 0;
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
      const currentGeneration = ++generation;
      unsubscribeProfile?.();
      unsubscribeCommunity?.();
      unsubscribeProfile = undefined;
      unsubscribeCommunity = undefined;
      setUsuario(userAuth);
      if (userAuth) {
        setCargando(true);
        try {
          const profile = await findResidentProfile(userAuth);
          if (generation !== currentGeneration) return;
          if (!profile) {
            setDatosVecino(null);
            setCargando(false);
            return;
          }
          let currentResident: VecinoData | null = null;
          let currentCommunityId = '';
          let communityHasPropertyAdmin = true;
          const applyResident = () => {
            if (generation !== currentGeneration) return;
            setDatosVecino(currentResident ? { ...currentResident, tieneAdministradorFincas: communityHasPropertyAdmin } : null);
          };
          unsubscribeProfile = onSnapshot(profile.ref, (docSnapshot) => {
            if (docSnapshot.exists()) {
              currentResident = { uid: userAuth.uid, id: docSnapshot.id, ...docSnapshot.data() } as VecinoData;
              const communityId = String(currentResident.idComunidad || '');
              if (communityId !== currentCommunityId) {
                currentCommunityId = communityId;
                unsubscribeCommunity?.();
                unsubscribeCommunity = undefined;
                communityHasPropertyAdmin = true;
                if (communityId) {
                  unsubscribeCommunity = onSnapshot(doc(db, 'comunidades', communityId), (communitySnapshot) => {
                    const setting = communitySnapshot.get('tieneAdministradorFincas');
                    communityHasPropertyAdmin = typeof setting === 'boolean' ? setting : true;
                    applyResident();
                  }, (communityError) => {
                    console.error('No se pudo leer la configuración de administración de la comunidad:', communityError);
                    communityHasPropertyAdmin = true;
                    applyResident();
                  });
                }
              }
              applyResident();
            } else {
              currentResident = null;
              applyResident();
            }
            setCargando(false);
          }, (error) => {
            console.error('No se pudo cargar la ficha del vecino:', error);
            setDatosVecino(null);
            setCargando(false);
          });
        } catch (error) {
          console.error('No se pudo resolver la ficha del vecino:', error);
          setDatosVecino(null);
          setCargando(false);
        }
      } else {
        setDatosVecino(null);
        setCargando(false);
      }
    });
    return () => {
      generation++;
      unsubscribeProfile?.();
      unsubscribeCommunity?.();
      unsubscribeAuth();
    };
  }, []);

  if (cargando) return <Cargando />;
  
  // Usuario no autenticado
  if (!usuario || !datosVecino) {
    return <Navigate to="/login" replace />;
  }
  
  const isAdmin = hasAdministratorAccess(datosVecino);

  // Los administradores se validan por rol; el estado de alta de vecinos no debe bloquear su acceso.
  if (!isAdmin && ['pendiente_de_confirmacion', 'pendienteValidacion', 'pendiente', 'en_revision'].includes(datosVecino.estado ?? '')) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar rol específico si es requerido
  const hasRequiredAccess = requiredRole && requiredRole.toLowerCase() === 'administrador'
    ? hasAdministrationNavigation(datosVecino)
    : (!requiredRole || datosVecino.rol?.toLowerCase() === requiredRole.toLowerCase());

  if (requiredRole && !hasRequiredAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Renderizar layout apropiado
  return hasAdministrationNavigation(datosVecino) ? <AdminLayout datosVecino={datosVecino} /> : <VecinoLayout datosVecino={datosVecino} />;
}

export default ProtectedRoute;
