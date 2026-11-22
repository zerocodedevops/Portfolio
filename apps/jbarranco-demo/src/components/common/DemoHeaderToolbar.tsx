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
      className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 sm:gap-2.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-xs"
    >
      <a
        href="/#projects"
        className="font-medium text-gray-500 transition-colors hover:text-brand-blue"
      >
        ← Portfolio
      </a>

      <span className="text-gray-300 hidden sm:inline" aria-hidden="true">
        |
      </span>

      <span className="font-medium text-gray-400 hidden md:inline">
        Vista:
      </span>

      <div className="flex items-center gap-1" role="group" aria-label="Cambiar perfil demo">
        <button
          type="button"
          data-testid="demo-switch-admin"
          onClick={() => handleSwitchProfile("admin")}
          className={`px-2.5 py-0.5 rounded-full font-medium transition-all text-[11px] sm:text-xs ${
            user && userRole === "admin"
              ? "bg-brand-blue text-white font-semibold shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          data-testid="demo-switch-cliente"
          onClick={() => handleSwitchProfile("cliente")}
          className={`px-2.5 py-0.5 rounded-full font-medium transition-all text-[11px] sm:text-xs ${
            user && userRole === "cliente"
              ? "bg-brand-blue text-white font-semibold shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Cliente
        </button>
        <button
          type="button"
          data-testid="demo-switch-empleado"
          onClick={() => handleSwitchProfile("empleado")}
          className={`px-2.5 py-0.5 rounded-full font-medium transition-all text-[11px] sm:text-xs ${
            user && userRole === "empleado"
              ? "bg-brand-blue text-white font-semibold shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Empleado
        </button>
      </div>

      <span className="text-gray-300" aria-hidden="true">
        |
      </span>

      <button
        type="button"
        data-testid="demo-reset-button"
        onClick={handleResetDemo}
        className="rounded-full px-2 py-0.5 font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-[11px] sm:text-xs"
        title="Restaurar todos los datos, cuentas y sesión al estado inicial"
      >
        ↺ Reiniciar Demo
      </button>
    </aside>
  );
}
