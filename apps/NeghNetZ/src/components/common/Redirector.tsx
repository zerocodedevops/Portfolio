// RUTA: ./src/components/common/Redirector.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../demo/demoAuth';
import { onAuthStateChanged } from '../../demo/demoAuth';
import { findResidentProfile } from '../../firebase/residentProfile';
import logger from '../../utils/logger';
import { isDeveloperEmail } from '../../utils/residentRoles';

function Redirector() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) {
        logger.log("Redirector: No hay usuario autenticado");
        navigate('/login', { replace: true });
        setCargando(false);
        return;
      }

      try {
        if (isDeveloperEmail(userAuth.email)) {
          if (active) navigate('/developer', { replace: true });
          return;
        }
        const profile = await findResidentProfile(userAuth);
        if (!active) return;
        if (!profile) {
          logger.warn("Redirector: Usuario no encontrado en la colección 'vecinos'");
          navigate('/login', { replace: true });
        } else {
          const rol = profile.data()?.rol?.toLowerCase();
          logger.log("Redirector: Usuario logueado. Rol detectado:", rol);
          logger.log(`Redirector: Redirigiendo al Inicio (${rol || 'vecino'})`);
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        logger.error('Redirector: No se pudo resolver la ficha de vecino:', error);
        if (active) navigate('/login', { replace: true });
      } finally {
        if (active) setCargando(false);
      }
    });
    return () => {
      active = false;
      unsubscribeAuth();
    };
  }, [navigate]);

  if (cargando) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><div className="text-xl text-gray-600">Cargando...</div></div>;
  }

  return null;
}

export default Redirector;
