// RUTA: ./src/components/layouts/Header.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, getDemoRoleMode, switchDemoRole } from '../../demo/demoAuth';
import { db } from '../../demo/demoStore';
import { signOut } from '../../demo/demoAuth';
import { doc, onSnapshot } from '../../demo/demoStore';
import CampanaNotificaciones from '../CampanaNotificaciones';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearch } from '../common/GlobalSearch';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import type { VecinoData } from '../../types/domain';
import { useEffect, useState } from 'react';
import { isProfilePhotoReference, resolveProfilePhotoUrl } from '../../services/profilePhotoStorage';
import { unlockMessageSound } from '../../services/notificationSound';
import { DEFAULT_NOTIFICATION_PREFERENCES, isNotificationCategoryVisible, subscribeNotificationPreferences, subscribeNotifications, type NotificationPreferences } from '../../services/notificacionesService';
import type { NotificacionData } from '../../types/domain';
import { subscribeMemberships, switchActiveCommunity, type CommunityMembership } from '../../services/membershipService';

function displayName(datosVecino: VecinoData | null) {
  const user = auth.currentUser;
  const name = [datosVecino?.datosPersonales?.nombre || datosVecino?.nombre || user?.displayName?.split(/\s+/)[0], datosVecino?.datosPersonales?.apellidos || datosVecino?.apellidos || user?.displayName?.split(/\s+/).slice(1).join(' ')].filter(Boolean).join(' ').trim();
  return name || user?.email || 'Usuario';
}

function roleName(datosVecino: VecinoData | null) {
  const role = datosVecino?.rol?.toLowerCase();
  if (role === 'administrador') return 'Administración';
  if (role === 'propietario') return 'Propietario';
  if (role === 'inquilino') return 'Inquilino';
  return 'Vecino';
}

function Header({ datosVecino }: { datosVecino: VecinoData | null }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [firebaseOnline, setFirebaseOnline] = useState(true);
  const name = displayName(datosVecino);
  const role = roleName(datosVecino);
  const uid = auth.currentUser?.uid || datosVecino?.uid;
  const communityId = datosVecino?.idComunidad;
  const photoReference = datosVecino?.datosPersonales?.fotoPerfil || datosVecino?.datosPersonales?.photoURL || datosVecino?.fotoPerfil || auth.currentUser?.photoURL || '';
  const [photo, setPhoto] = useState('');
  const [notifications, setNotifications] = useState<NotificacionData[]>([]);
  const [notificationError, setNotificationError] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [communityName, setCommunityName] = useState('Comunidad');
  const [memberships, setMemberships] = useState<CommunityMembership[]>([]);
  const [switchingCommunity, setSwitchingCommunity] = useState(false);
  const [communitySwitchError, setCommunitySwitchError] = useState('');

  useEffect(() => {
    if (!uid) { setMemberships([]); return undefined; }
    return subscribeMemberships(uid, setMemberships, (error) => console.error('No se pudieron cargar las comunidades de la cuenta:', error));
  }, [uid]);

  const handleCommunityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const membership = memberships.find((entry) => entry.idComunidad === event.target.value);
    if (!membership || event.target.value === communityId) return;
    setSwitchingCommunity(true);
    setCommunitySwitchError('');
    try {
      await switchActiveCommunity(membership);
      navigate('/dashboard', { replace: true });
      window.location.reload();
    } catch (error) {
      setCommunitySwitchError(error instanceof Error ? error.message : 'No se pudo cambiar de comunidad.');
      setSwitchingCommunity(false);
    }
  };

  useEffect(() => {
    if (!communityId) { setCommunityName('Comunidad'); return undefined; }
    return onSnapshot(doc(db, 'comunidades', communityId), (snapshot) => setCommunityName(String(snapshot.get('nombre') || communityId)), () => setCommunityName(communityId));
  }, [communityId]);

  useEffect(() => {
    let active = true;
    if (!photoReference) { setPhoto(''); return () => { active = false; }; }
    if (!isProfilePhotoReference(photoReference)) { setPhoto(photoReference); return () => { active = false; }; }
    void resolveProfilePhotoUrl(photoReference).then((url) => {
      if (active) setPhoto(url);
    }).catch((error) => {
      console.error('No se pudo cargar la foto de perfil desde demoStorage:', error);
      if (active) setPhoto(auth.currentUser?.photoURL || '');
    });
    return () => { active = false; };
  }, [photoReference]);

  useEffect(() => {
    const handleOnline = () => setFirebaseOnline(true);
    const handleOffline = () => setFirebaseOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setFirebaseOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unlockAudio = () => unlockMessageSound();
    document.addEventListener('pointerdown', unlockAudio, { passive: true });
    document.addEventListener('keydown', unlockAudio);
    return () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    setNotifications([]);
    setNotificationError('');
    if (!uid || !communityId) return undefined;
    return subscribeNotifications(uid, communityId, setNotifications, (error) => {
      console.error('No se pudieron cargar las notificaciones:', error);
      setNotificationError('No se pudieron cargar las notificaciones.');
    });
  }, [uid, communityId]);

  useEffect(() => {
    if (!uid || !communityId) { setNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES); return undefined; }
    return subscribeNotificationPreferences(uid, communityId, setNotificationPreferences);
  }, [uid, communityId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSwitchRole = (targetRole: 'propietario' | 'admin') => {
    const currentMode = getDemoRoleMode();
    if (currentMode === targetRole) return;
    if (targetRole === 'propietario') {
      const nextRoute = pathname.startsWith('/admin') ? '/dashboard' : pathname;
      navigate(nextRoute, { replace: true });
      queueMicrotask(() => switchDemoRole('propietario'));
    } else {
      const nextRoute = pathname.startsWith('/admin') ? pathname : '/admin/panel';
      switchDemoRole('admin');
      navigate(nextRoute, { replace: true });
    }
  };

  return (
    <header className="app-header relative z-40 flex min-h-16 items-center justify-between gap-4 border-b border-slate-700 bg-slate-950 px-6 text-white shadow-md transition-colors duration-300">
      <div className="hidden min-w-0 items-center gap-2.5 sm:flex">
        <img src="/neighnetz-app-icon.png" alt="" className="h-9 w-9 shrink-0 rounded-full object-contain" />
          <span className="flex min-w-0 flex-col">
          {memberships.some((entry) => entry.idComunidad !== communityId) ? <label className="flex min-w-0 items-center gap-1 text-sm font-semibold" title="Cambiar comunidad activa"><span className="shrink-0">NeighNetZ ·</span><select aria-label="Comunidad activa" value={communityId || ''} onChange={(event) => void handleCommunityChange(event)} disabled={switchingCommunity} className="min-w-0 max-w-64 cursor-pointer truncate border-0 bg-transparent p-0 font-semibold text-white focus:outline-none focus:ring-1 focus:ring-white/60 disabled:opacity-60"><option value={communityId}>{communityName}</option>{memberships.filter((entry) => entry.idComunidad !== communityId).map((entry) => <option key={entry.id} value={entry.idComunidad} className="text-slate-950">{entry.nombreComunidad || entry.idComunidad}</option>)}</select>{switchingCommunity && <span className="text-xs text-slate-300">Cambiando…</span>}</label> : <span className="truncate text-sm font-semibold">NeighNetZ · {communityName}</span>}
          <span className="text-xs text-slate-300">Bienvenido, {name}</span>
          {communitySwitchError && <span role="alert" className="max-w-72 text-xs text-rose-300">{communitySwitchError}</span>}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        {/* Selector discreto de perfil DEMO */}
        <div
          role="group"
          aria-label="Cambiar perfil Demo"
          className="hidden items-center rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs md:flex"
        >
          <button
            type="button"
            onClick={() => handleSwitchRole('propietario')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${getDemoRoleMode() !== 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            Propietario
          </button>
          <button
            type="button"
            onClick={() => handleSwitchRole('admin')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${getDemoRoleMode() === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            Administrador
          </button>
        </div>

        {/* Global Search */}
        <GlobalSearch />

        
        {/* Notificaciones */}
        <span className={`hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-medium sm:flex ${firebaseOnline ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
          <span className={`h-2 w-2 rounded-full ${firebaseOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {firebaseOnline ? 'Modo Demo' : 'Sin conexión'}
        </span>

        <CampanaNotificaciones notificaciones={notifications.filter((item) => isNotificationCategoryVisible(item.tipo, notificationPreferences))} error={notificationError} />

        <div className="hidden items-center gap-2 border-l border-current/15 pl-3 md:flex">
          {photo ? <img src={photo} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-gray-700 dark:text-white">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>}
          <span className="flex max-w-40 flex-col text-left">
            <span className="truncate text-sm font-semibold">{name}</span>
            <span className="text-xs text-slate-300">{role}</span>
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          title={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <ArrowRightOnRectangleIcon aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}

export default Header;
