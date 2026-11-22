// RUTA: ./src/pages/auth/RegistroDatos.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../demo/demoAuth';
import { submitMembershipRequest, verifyCommunityAccessCode } from '../../services/membershipService';

export interface RegistroInicial {
  first_name?: string;
  last_name?: string;
  dni?: string;
  phone?: string;
  portal?: string;
  floor?: string;
  door?: string;
}

interface RegistroDatosProps {
  onComplete?: () => void;
  initialData?: RegistroInicial;
}

function RegistroDatos({ onComplete, initialData = {} }: RegistroDatosProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: initialData.first_name || '',
    apellidos: initialData.last_name || '',
    dni: initialData.dni || '',
    telefono: initialData.phone || '',
    portal: initialData.portal || '',
    piso: initialData.floor || '',
    letra: initialData.door || '',
    rol: 'propietario',
    codigoAcceso: '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [comunidadVerificada, setComunidadVerificada] = useState('');

  // Si no hay usuario autenticado, redirigir al login
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'codigoAcceso') setComunidadVerificada('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleComprobarCodigo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const community = await verifyCommunityAccessCode(formData.codigoAcceso);
      setFormData((previous) => ({ ...previous, codigoAcceso: community.code }));
      setComunidadVerificada(community.nombreComunidad);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'El código de su comunidad no es correcto');
    } finally { setGuardando(false); }
  };

  const handleGuardarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    if (!formData.nombre || !formData.portal || !formData.piso || !formData.codigoAcceso) {
      setError('Completa el código de acceso, tu nombre y los datos de la vivienda.');
      setGuardando(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Tu sesión ha terminado. Inicia sesión y vuelve a solicitar la inscripción.');
      await submitMembershipRequest({
        code: formData.codigoAcceso,
        role: formData.rol as 'propietario' | 'inquilino',
        home: { portal: formData.portal, piso: formData.piso, letra: formData.letra },
        resident: {
          uid: user.uid,
          email: user.email || '',
          rol: formData.rol,
          datosPersonales: {
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            dni: formData.dni,
            telefono: formData.telefono,
          },
        },
      });
      if (onComplete) onComplete();
      else navigate('/validacion', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Solicita tu inscripción</h2>
        <p className="mb-6 text-center text-sm text-gray-600">Necesitas el código de acceso de la comunidad. La administración revisará la solicitud antes de darte acceso.</p>
        <form onSubmit={comunidadVerificada ? handleGuardarDatos : handleComprobarCodigo} className="space-y-4">
          <label className="block text-sm font-semibold">Ingresar su Código de Comunidad<input type="text" name="codigoAcceso" placeholder="8 caracteres" value={formData.codigoAcceso} onChange={(event) => setFormData((previous) => ({ ...previous, codigoAcceso: event.target.value.replace(/[^a-zA-Z0-9]/g, '') }))} required minLength={8} maxLength={8} autoCapitalize="none" autoComplete="off" className="mt-1 w-full p-2 border rounded tracking-widest" /></label>
          {!comunidadVerificada && <button type="submit" disabled={guardando || formData.codigoAcceso.length !== 8} className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:bg-gray-400">{guardando ? 'Comprobando…' : 'Comprobar'}</button>}
          {comunidadVerificada && <p role="status" className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">Comunidad encontrada: <strong>{comunidadVerificada}</strong>. Completa tus datos para enviar la solicitud.</p>}
          {comunidadVerificada && <>
          {/* Campos del formulario */}
          <input type="text" name="nombre" placeholder="Nombre*" value={formData.nombre} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} className="w-full p-2 border rounded" />
          
          {/* --- ¡CAMPO CORREGIDO! --- */}
          <input type="tel" name="telefono" placeholder="Móvil" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded" />
          
          {/* --- CAMPOS DE VIVIENDA SEPARADOS --- */}
          <div className="flex space-x-2">
            <input type="text" name="portal" placeholder="Portal*" value={formData.portal} onChange={handleChange} required className="flex-1 p-2 border rounded" />
            <input type="text" name="piso" placeholder="Piso*" value={formData.piso} onChange={handleChange} required className="flex-1 p-2 border rounded" />
            <input type="text" name="letra" placeholder="Letra" value={formData.letra} onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>

          <select name="rol" value={formData.rol} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="propietario">Propietario</option>
            <option value="inquilino">Inquilino</option>
          </select>
          </>}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {comunidadVerificada && <button type="submit" disabled={guardando} className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:bg-gray-400">
            {guardando ? 'Enviando solicitud…' : 'Solicitar inscripción'}
          </button>}
        </form>
      </div>
    </div>
  );
}

export default RegistroDatos;
