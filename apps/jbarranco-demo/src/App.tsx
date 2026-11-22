import { ReactNode, useEffect, useState } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppRoutes from "./router/routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { queryClient } from "./config/queryClient";
import { loginAsDemoRole } from "./demo/demoAuth";
import { onDemoEnvironmentReset, resetDemoEnvironment } from "./demo/demoStore";
import type { DemoRoleMode } from "./demo/demoTypes";
import { getDashboardRoute } from "./utils/navigation";

function DemoFloatingToolbar() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleSwitchProfile = (role: DemoRoleMode) => {
    loginAsDemoRole(role);
    navigate(getDashboardRoute(role), { replace: true });
    toast.success(
      `Perfil activo: ${
        role === "admin"
          ? "Administrador"
          : role === "cliente"
            ? "Cliente (C.P. Monteclaro)"
            : "Empleado (Laura Gómez)"
      }`,
    );
  };

  const handleResetDemo = () => {
    resetDemoEnvironment();
    navigate("/login", { replace: true });
    toast.success("Entorno de demostración restaurado al estado inicial");
  };

  if (!isVisible) {
    return (
      <div
        className="fixed bottom-20 left-3 lg:bottom-4 lg:left-4"
        style={{ zIndex: 9999 }}
      >
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          data-testid="demo-toolbar-expand"
          className="rounded-full border border-amber-500/40 bg-slate-950/90 px-3 py-1.5 text-xs font-semibold text-amber-300 shadow-lg backdrop-blur-md hover:bg-slate-900"
        >
          ⚡ Panel Demo
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-20 left-3 lg:bottom-4 lg:left-4 flex max-w-[calc(100vw-1.5rem)] justify-start"
      style={{ zIndex: 9999 }}
      role="region"
      aria-label="Control de entorno de demostración"
      data-testid="demo-floating-toolbar"
    >
      <aside className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/35 bg-slate-950/95 px-3.5 py-2 text-xs text-amber-50 shadow-xl backdrop-blur-md">
        <a
          href="/#projects"
          className="font-semibold text-amber-300 underline underline-offset-2 transition-colors hover:text-white"
        >
          ← Portfolio
        </a>
        <span className="text-amber-500/50" aria-hidden="true">
          |
        </span>
        <span className="font-medium text-amber-200/90 hidden sm:inline">
          ERP DEMO (Datos ficticios):
        </span>

        <div className="flex items-center gap-1" role="group" aria-label="Cambiar perfil demo">
          <button
            type="button"
            data-testid="demo-switch-admin"
            onClick={() => handleSwitchProfile("admin")}
            className={`px-2 py-1 rounded font-semibold transition-colors ${
              user && userRole === "admin"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            data-testid="demo-switch-cliente"
            onClick={() => handleSwitchProfile("cliente")}
            className={`px-2 py-1 rounded font-semibold transition-colors ${
              user && userRole === "cliente"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            Cliente
          </button>
          <button
            type="button"
            data-testid="demo-switch-empleado"
            onClick={() => handleSwitchProfile("empleado")}
            className={`px-2 py-1 rounded font-semibold transition-colors ${
              user && userRole === "empleado"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            Empleado
          </button>
        </div>

        <span className="text-amber-500/50" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          data-testid="demo-reset-button"
          onClick={handleResetDemo}
          className="rounded bg-red-900/70 px-2 py-1 font-semibold text-red-100 hover:bg-red-800 transition-colors"
          title="Restaurar todos los datos, cuentas y sesión al estado inicial"
        >
          ↺ Reiniciar Demo
        </button>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Ocultar barra de demostración"
          className="ml-1 rounded px-1.5 py-0.5 text-amber-200/80 hover:bg-amber-500/20 hover:text-white"
        >
          ✕
        </button>
      </aside>
    </div>
  );
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App(): ReactNode {
  const [resetGeneration, setResetGeneration] = useState(0);

  useEffect(() => {
    return onDemoEnvironmentReset(() => {
      queryClient.clear();
      setResetGeneration((prev) => prev + 1);
    });
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter basename={routerBasename}>
          <div key={resetGeneration} className="min-h-screen flex flex-col">
            <AppRoutes />
            <DemoFloatingToolbar />
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
