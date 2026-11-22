// RUTA: ./src/App.jsx

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';

// Componentes comunes (no lazy)
import ProtectedRoute from './components/common/ProtectedRoute';
import Redirector from './components/common/Redirector';
import Documentos from './pages/Documentos';

// Auth pages (no lazy - necesarios inmediatamente)
import RegistroDatos from './pages/auth/RegistroDatos';
import StitchPage from './components/StitchPage';
import { auth } from './demo/demoAuth';
import { signOut } from './demo/demoAuth';
import type { VecinoOutletContext } from './types/domain';
import { hasAdministratorAccess, isBoardExecutive } from './utils/residentRoles';

// Lazy loading para páginas
const Perfil = lazy(() => import('./pages/Perfil'));
const Mensajes = lazy(() => import('./pages/Mensajes'));
const Incidencias = lazy(() => import('./pages/Incidencias'));
const Notificaciones = lazy(() => import('./pages/Notificaciones'));
const Reuniones = lazy(() => import('./pages/Reuniones'));
const Comunidad = lazy(() => import('./pages/Comunidad'));
const Profesionales = lazy(() => import('./pages/Profesionales'));
const EnConstruccion = lazy(() => import('./pages/EnConstruccion'));
const Vecinos = lazy(() => import('./pages/Vecinos'));
const Reservas = lazy(() => import('./pages/Reservas'));
const Votaciones = lazy(() => import('./pages/Votaciones'));
const Gastos = lazy(() => import('./pages/Gastos'));
const FichaVecino = lazy(() => import('./components/features/FichaVecino'));
const DeveloperConsole = lazy(() => import('./pages/developer/DeveloperConsole'));

// Admin pages
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const ValidarVecinos = lazy(() => import('./pages/admin/ValidarVecinos'));
const GestionIncidencias = lazy(() => import('./pages/admin/GestionIncidencias'));
const GestionReservasAdmin = lazy(() => import('./pages/Reservas'));

// Componente de Cargando para Suspense
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-xl text-gray-600">Cargando...</div>
    </div>
  );
}

function DashboardHome() {
  const [resident] = useOutletContext<VecinoOutletContext>();
  if (hasAdministratorAccess(resident) && !isBoardExecutive(resident)) return <AdminPanel />;
  return <StitchPage pageId="tablón" title="Inicio" workflowPages={{ reservas: Reservas, incidencias: Incidencias, votaciones: Votaciones, documentos: Documentos }} />;
}

function MembershipPending() {
  const email = auth.currentUser?.email;
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 text-slate-950 dark:bg-black dark:text-white">
    <section className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-lg dark:bg-zinc-950 sm:p-9">
      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Solicitud enviada</p>
      <h1 className="mt-2 text-2xl font-bold">La administración revisará tu inscripción</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-300">Hemos recibido la solicitud{email ? ` de ${email}` : ''}. Hasta que la aprueben, no tendrás acceso a la comunidad. Puedes cerrar sesión y volver más tarde.</p>
      <button type="button" onClick={() => void signOut(auth)} className="mt-6 min-h-11 rounded-lg bg-slate-950 px-4 font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-white dark:text-black">Cerrar sesión</button>
    </section>
  </main>;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rutas públicas y de estado inicial */}
          <Route path="/login" element={<StitchPage pageId="login" title="Iniciar sesión" />} />
          <Route path="/developer" element={<DeveloperConsole />} />
          <Route path="/registro-datos" element={<RegistroDatos />} />
          <Route path="/validacion" element={<MembershipPending />} />
          <Route path="/" element={<Redirector />} />

          {/* Rutas del Administrador */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="administrador" />}>
            <Route index element={<Navigate to="/admin/panel" replace />} />
            <Route path="panel" element={<AdminPanel />} />
            <Route path="vecinos" element={<StitchPage pageId="vecinos" title="Directorio de vecinos" workflowPages={{ vecinos: Vecinos }} />} />
            <Route path="vecinos/:vecinoId" element={<FichaVecino />} />
            <Route path="usuarios" element={<ValidarVecinos />} />
            <Route path="incidencias" element={<StitchPage pageId="admin-incidencias" title="Gestión de incidencias" workflowPages={{ 'admin-incidencias': GestionIncidencias }} />} />
            <Route path="documentos" element={<StitchPage pageId="admin-documentos" title="Gestión documental" workflowPages={{ 'admin-documentos': Documentos }} />} />
            <Route path="reservas" element={<GestionReservasAdmin />} />
            <Route path="gastos" element={<StitchPage pageId="gastos" title="Gastos y cuotas" workflowPages={{ gastos: Gastos }} />} />
            <Route path="estadisticas" element={<EnConstruccion />} />
            <Route path="configuracion" element={<EnConstruccion />} />
          </Route>

          {/* Rutas del Vecino */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<DashboardHome />} />
            <Route path="perfil" element={<StitchPage pageId="perfil" title="Mi perfil" workflowPages={{ perfil: Perfil }} />} />
            <Route path="mensajes" element={<Mensajes />} />
            <Route path="reuniones" element={<Reuniones />} />
            <Route path="comunidad" element={<Comunidad />} />
            <Route path="profesionales" element={<Profesionales />} />
            <Route path="incidencias" element={<StitchPage pageId="incidencias" title="Incidencias" workflowPages={{ incidencias: Incidencias }} />} />
            <Route path="notificaciones" element={<Notificaciones />} />
            <Route path="vecinos" element={<StitchPage pageId="vecinos" title="Directorio de vecinos" workflowPages={{ vecinos: Vecinos }} />} />
            <Route path="vecinos/:vecinoId" element={<FichaVecino />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="documentos" element={<StitchPage pageId="documentos" title="Repositorio documental" workflowPages={{ documentos: Documentos }} />} />
            <Route path="votaciones" element={<StitchPage pageId="votaciones" title="Votaciones" workflowPages={{ votaciones: Votaciones }} />} />
            <Route path="gastos" element={<StitchPage pageId="gastos" title="Gastos y cuotas" workflowPages={{ gastos: Gastos }} />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
