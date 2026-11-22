import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardRoute } from "../utils/navigation";
import ProtectedRoute from "./ProtectedRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Layouts del ERP
const AdminLayout = lazy(() => import("../components/admin/layout_components/AdminLayout"));
const ClientLayout = lazy(() => import("../components/client/ClientLayout"));
const EmployeeLayout = lazy(() => import("../components/employee/EmployeeLayout"));

// Auth Pages
const Login = lazy(() => import("../components/auth/Login"));
const AppLogin = lazy(() => import("../components/auth/AppLogin"));

// Admin Pages (17 rutas completas)
const DashboardMain = lazy(() => import("../components/admin/dashboard/DashboardMain"));
const ClientsList = lazy(() => import("../components/admin/clients/ClientsList"));
const ClientDetail = lazy(() => import("../components/admin/clients/ClientDetail"));
const EmployeesList = lazy(() => import("../components/admin/employees/EmployeesList"));
const EmployeeDetail = lazy(() => import("../components/admin/employees/EmployeeDetail"));
const RoutesPlanner = lazy(() => import("../components/admin/routes/RoutesPlanner"));
const Inventory = lazy(() => import("../components/admin/inventory/Inventory"));
const Accounting = lazy(() => import("../components/admin/accounting/Accounting"));
const Documents = lazy(() => import("../components/admin/documents/Documents"));
const Cms = lazy(() => import("../components/admin/cms/Cms"));
const ComplaintsList = lazy(() => import("../components/admin/complaints/ComplaintsList"));
const ExtraJobsList = lazy(() => import("../components/admin/extras/ExtraJobsList"));
const ObservationsList = lazy(() => import("../components/admin/observations/ObservationsList"));
const RatingsStats = lazy(() => import("../components/admin/ratings/RatingsStats"));
const AdminCalendar = lazy(() => import("../components/admin/calendar/AdminCalendar"));
const ProfileSettings = lazy(() => import("../components/admin/ProfileSettings"));

// Client Pages (7 rutas completas)
const ClientDashboard = lazy(() => import("../components/client/ClientDashboard"));
const ClientCalendar = lazy(() => import("../components/client/ClientCalendar"));
const ClientRequests = lazy(() => import("../components/client/ClientRequests"));
const ClientExtraJobs = lazy(() => import("../components/client/ClientExtraJobs"));
const ClientDocuments = lazy(() => import("../components/client/ClientDocuments"));
const ClientCompletedJobs = lazy(() => import("../components/client/ClientCompletedJobs"));
const ClientSettings = lazy(() => import("../components/client/ClientSettings"));

// Employee Pages (7 rutas completas)
const EmployeeDashboard = lazy(() => import("../components/employee/EmployeeDashboard"));
const EmployeeSchedulePage = lazy(() => import("../components/employee/EmployeeSchedulePage"));
const EmployeeTaskDetail = lazy(() => import("../components/employee/EmployeeTaskDetail"));
const EmployeeInventory = lazy(() => import("../components/employee/EmployeeInventory"));
const EmployeeDocuments = lazy(() => import("../components/employee/EmployeeDocuments"));
const MyRatings = lazy(() => import("../components/employee/MyRatings"));
const EmployeeSettings = lazy(() => import("../components/employee/EmployeeSettings"));

// Common Pages
const AccessDenied = lazy(() => import("../components/common/AccessDenied"));

function AppRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Raíz del ERP Demo -> Redirige a Login o al Dashboard del perfil activo */}
        <Route
          path="/"
          element={
            user && userRole ? (
              <Navigate to={getDashboardRoute(userRole)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            user && userRole ? (
              <Navigate to={getDashboardRoute(userRole)} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* App Login */}
        <Route
          path="/app-login"
          element={
            user && userRole ? (
              <Navigate to={getDashboardRoute(userRole)} replace />
            ) : (
              <AppLogin />
            )
          }
        />

        {/* Rutas Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardMain />} />
          <Route path="clients" element={<ClientsList />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="employees" element={<EmployeesList />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="routes" element={<RoutesPlanner />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="documents" element={<Documents />} />
          <Route path="cms" element={<Cms />} />
          <Route
            path="complaints"
            element={
              <ComplaintsList
                title="Gestión de Quejas e Incidencias"
                allowedTypes={[
                  "incidencia",
                  "averia",
                  "limpieza",
                  "sugerencia",
                  "administrativo",
                  "otro",
                ]}
              />
            }
          />
          <Route path="extra-jobs" element={<ExtraJobsList />} />
          <Route path="observations" element={<ObservationsList />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="ratings" element={<RatingsStats />} />
        </Route>

        {/* Rutas Cliente */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="calendar" element={<ClientCalendar />} />
          <Route path="requests" element={<ClientRequests />} />
          <Route path="extra-jobs" element={<ClientExtraJobs />} />
          <Route path="documents" element={<ClientDocuments />} />
          <Route path="history" element={<ClientCompletedJobs />} />
          <Route path="settings" element={<ClientSettings />} />
        </Route>

        {/* Rutas Empleado */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["empleado"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="route" element={<EmployeeSchedulePage />} />
          <Route path="task/:id" element={<EmployeeTaskDetail />} />
          <Route path="inventory" element={<EmployeeInventory />} />
          <Route path="documents" element={<EmployeeDocuments />} />
          <Route path="ratings" element={<MyRatings />} />
          <Route path="settings" element={<EmployeeSettings />} />
        </Route>

        {/* Acceso Denegado */}
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Fallback 404 -> Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
