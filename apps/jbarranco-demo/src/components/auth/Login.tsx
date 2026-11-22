import { type MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { DEMO_PRIMARY_CREDENTIALS, loginAsDemoRole } from "../../demo/demoAuth";
import type { DemoRoleMode } from "../../demo/demoTypes";
import { getDashboardRoute } from "../../utils/navigation";

const ROLE_META: Record<
  DemoRoleMode,
  {
    badge: string;
    badgeClasses: string;
    iconBg: string;
    borderHover: string;
    Icon: typeof ShieldCheckIcon;
  }
> = {
  admin: {
    badge: "Administración",
    badgeClasses: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
    iconBg: "bg-brand-blue text-white",
    borderHover: "hover:border-brand-blue/60 hover:shadow-brand-blue/10",
    Icon: ShieldCheckIcon,
  },
  cliente: {
    badge: "Comunidad",
    badgeClasses: "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-600 text-white",
    borderHover: "hover:border-blue-500/60 hover:shadow-blue-500/10",
    Icon: BuildingOffice2Icon,
  },
  empleado: {
    badge: "Operativa",
    badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-600 text-white",
    borderHover: "hover:border-emerald-500/60 hover:shadow-emerald-500/10",
    Icon: UserIcon,
  },
};

function Login() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const logoSrc = `${import.meta.env.BASE_URL}logo-light.webp`;

  useEffect(() => {
    if (user && userRole) {
      navigate(getDashboardRoute(userRole), { replace: true });
    }
  }, [user, userRole, navigate]);

  const handleQuickRoleAccess = (role: DemoRoleMode) => {
    loginAsDemoRole(role);
    navigate(getDashboardRoute(role), { replace: true });
  };

  const handleLogoMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 16, y: x * 18 });
  };

  const handleLogoMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Subtle architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-220 rounded-full bg-brand-blue/8 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Interactive 3D Logo Stage */}
        <div
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={handleLogoMouseLeave}
          className="mx-auto mb-6 flex w-fit cursor-pointer flex-col items-center justify-center rounded-3xl p-4"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
                tilt.x !== 0 || tilt.y !== 0 ? 1.04 : 1
              })`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Ambient glow behind logo */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-110 rounded-full bg-brand-blue/15 blur-2xl animate-pulse"
            />
            <img
              src={logoSrc}
              alt="J.Barranco Logo"
              width={400}
              height={160}
              className="h-32 sm:h-36 w-auto drop-shadow-[0_14px_24px_rgba(0,51,102,0.18)]"
            />
          </div>
        </div>

        <div className="text-center mb-7">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/15 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-blue shadow-2xs">
            Entorno Interactivo
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            ERP de Gestión Integral
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Selecciona un perfil para acceder directamente al panel correspondiente
          </p>
        </div>

        {/* 3 Profile Access Cards */}
        <div
          className="space-y-3"
          role="region"
          aria-label="Acceso directo a perfiles"
        >
          {(["admin", "cliente", "empleado"] as DemoRoleMode[]).map((role) => {
            const info = DEMO_PRIMARY_CREDENTIALS[role];
            const meta = ROLE_META[role];
            const Icon = meta.Icon;

            return (
              <button
                key={role}
                type="button"
                onClick={() => handleQuickRoleAccess(role)}
                data-testid={`quick-login-${role}`}
                className={`group w-full text-left flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${meta.borderHover}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 ${meta.iconBg}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                        {info.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.badgeClasses}`}
                      >
                        {meta.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 truncate">
                      {info.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-brand-blue group-hover:text-white group-hover:translate-x-0.5">
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-7 text-center">
          <a
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-blue transition-colors"
          >
            ← Volver al Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
