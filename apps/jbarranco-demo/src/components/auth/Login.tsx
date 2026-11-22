import { useEffect, useState } from "react";
import {
  DEMO_PRIMARY_CREDENTIALS,
  loginAsDemoRole,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "../../demo/demoAuth";
import type { DemoRoleMode } from "../../demo/demoTypes";
import { auth } from "../../firebase/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardRoute } from "../../utils/navigation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const logoSrc = `${import.meta.env.BASE_URL}logo-light.webp`;

  useEffect(() => {
    if (user && userRole) {
      navigate(getDashboardRoute(userRole), { replace: true });
    }
  }, [user, userRole, navigate]);

  const handleQuickRoleAccess = (role: DemoRoleMode) => {
    setError("");
    loginAsDemoRole(role);
    navigate(getDashboardRoute(role), { replace: true });
  };

  const handleFillCredentials = (role: DemoRoleMode) => {
    const creds = DEMO_PRIMARY_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Usuario o contraseña incorrectos. Utiliza las credenciales ficticias de la demo.");
      console.error(err);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Indica tu email para continuar.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Simulación Demo: Enlace de recuperación validado en memoria.");
      setIsResetting(false);
    } catch (err) {
      console.error(err);
      if ((err as { code?: string }).code === "auth/user-not-found") {
        setError("Email no registrado en el entorno demo.");
      } else {
        setError("Error al procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <img
          src={logoSrc}
          alt="J.Barranco Logo"
          width={320}
          height={80}
          className="h-20 w-auto mx-auto mb-3"
        />
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-300">
          ENTORNO DE DEMOSTRACIÓN · DATOS 100% FICTICIOS EN MEMORIA
        </span>
        <h2 className="mt-3 text-center text-3xl font-bold text-brand-blue">
          {isResetting ? "Recuperar Contraseña (Demo)" : "ERP de Gestión — Acceso Multi-Perfil"}
        </h2>
        <p className="mt-1.5 text-center text-sm text-gray-600">
          {isResetting
            ? "Introduce un correo ficticio registrado en la demo."
            : "Selecciona un perfil para entrar en 1 clic o utiliza las credenciales ficticias en el formulario."}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-7 px-4 shadow-xl rounded-xl sm:px-8 border border-gray-100 space-y-6">
          {!isResetting && (
            <div className="space-y-3" aria-label="Acceso rápido de 1 clic">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Acceso Directo en 1 Clic (Perfiles Demo)
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {(["admin", "cliente", "empleado"] as DemoRoleMode[]).map((role) => {
                  const info = DEMO_PRIMARY_CREDENTIALS[role];
                  const badgeColor =
                    role === "admin"
                      ? "bg-brand-blue text-white"
                      : role === "cliente"
                        ? "bg-blue-600 text-white"
                        : "bg-emerald-700 text-white";
                  return (
                    <div
                      key={role}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50/70 p-3 hover:border-brand-blue transition-colors"
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${badgeColor}`}>
                            {role}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{info.label}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-600">{info.subtitle}</p>
                        <p className="mt-0.5 text-[11px] font-mono text-gray-500">
                          {info.email} · Clave: {info.password}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleFillCredentials(role)}
                          data-testid={`fill-role-${role}`}
                          className="px-2.5 py-1.5 rounded border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Rellenar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickRoleAccess(role)}
                          data-testid={`quick-login-${role}`}
                          className="px-3 py-1.5 rounded bg-brand-blue text-xs font-semibold text-white hover:bg-blue-800 shadow-sm"
                        >
                          Entrar ahora →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isResetting && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  O validación mediante formulario con credenciales ficticias
                </span>
              </div>
            </div>
          )}

          {isResetting ? (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="whitespace-pre-line text-sm text-red-700">{error}</p>
                </div>
              )}
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email Ficticio
                </label>
                <div className="mt-1">
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    data-testid="reset-email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    placeholder="admin@jbarranco-demo.local"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 transition-colors"
                >
                  {loading ? "Validando..." : "Simular envío de enlace"}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetting(false);
                    setError("");
                  }}
                  className="text-sm font-medium text-brand-blue hover:text-blue-500"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4" data-testid="login-error">
                  <p className="whitespace-pre-line text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    data-testid="login-email"
                    placeholder="admin@jbarranco-demo.local"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    data-testid="login-password"
                    placeholder="DemoAdmin2026!"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetting(true);
                      setError("");
                    }}
                    className="font-medium text-brand-blue hover:text-blue-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="login-submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 transition-colors"
              >
                {loading ? "Iniciando Sesión..." : "Iniciar Sesión con Credenciales"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
