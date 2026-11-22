import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { loginAsDemoRole } from "../../demo/demoAuth";
import { resetDemoEnvironment } from "../../demo/demoStore";
import type { DemoRoleMode } from "../../demo/demoTypes";
import { getDashboardRoute } from "../../utils/navigation";

export default function DemoHeaderToolbar() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitchProfile = (role: DemoRoleMode) => {
    loginAsDemoRole(role);
    navigate(getDashboardRoute(role), { replace: true });
    toast.success(
      `Perfil activo: ${
        role === "admin"
          ? "Administrador Empresa"
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

  return (
    <aside
      role="region"
      aria-label="Control de entorno de demostración"
      data-testid="demo-floating-toolbar"
      className="inline-flex items-center gap-1.5 sm:gap-2.5 rounded-full border border-slate-700/60 bg-slate-900/95 px-3 py-1 text-xs text-slate-100 shadow-md backdrop-blur-md"
    >
      <a
        href="/#projects"
        className="font-medium text-amber-300 underline underline-offset-2 transition-colors hover:text-white"
      >
        ← Portfolio
      </a>

      <span className="text-slate-600 hidden sm:inline" aria-hidden="true">
        |
      </span>

      <span className="font-medium text-slate-300 hidden md:inline">
        Vista:
      </span>

      <div className="flex items-center gap-1" role="group" aria-label="Cambiar perfil demo">
        <button
          type="button"
          data-testid="demo-switch-admin"
          onClick={() => handleSwitchProfile("admin")}
          className={`px-2 py-0.5 rounded-full font-semibold transition-all text-[11px] sm:text-xs ${
            user && userRole === "admin"
              ? "bg-amber-400 text-slate-950 shadow-xs"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          data-testid="demo-switch-cliente"
          onClick={() => handleSwitchProfile("cliente")}
          className={`px-2 py-0.5 rounded-full font-semibold transition-all text-[11px] sm:text-xs ${
            user && userRole === "cliente"
              ? "bg-amber-400 text-slate-950 shadow-xs"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          Cliente
        </button>
        <button
          type="button"
          data-testid="demo-switch-empleado"
          onClick={() => handleSwitchProfile("empleado")}
          className={`px-2 py-0.5 rounded-full font-semibold transition-all text-[11px] sm:text-xs ${
            user && userRole === "empleado"
              ? "bg-amber-400 text-slate-950 shadow-xs"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          Empleado
        </button>
      </div>

      <span className="text-slate-600" aria-hidden="true">
        |
      </span>

      <button
        type="button"
        data-testid="demo-reset-button"
        onClick={handleResetDemo}
        className="rounded-full bg-red-950/60 border border-red-800/40 px-2 py-0.5 font-medium text-red-200 hover:bg-red-900/80 hover:text-white transition-colors text-[11px] sm:text-xs"
        title="Restaurar todos los datos, cuentas y sesión al estado inicial"
      >
        ↺ Reiniciar Demo
      </button>
    </aside>
  );
}
