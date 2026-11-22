import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { buildLocalAvatarSvg } from "../../demo/demoConstants";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Notificacion } from "../../types";

function HeaderClient() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const logoSrc = `${import.meta.env.BASE_URL}logo-light.webp`;
  const notifications: Notificacion[] = [];
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-brand-blue text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/client" className="shrink-0 relative z-50">
          <img
            className="h-12 w-auto"
            src={logoSrc}
            alt="J.Barranco Logo"
            width={160}
            height={40}
          />
        </Link>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium hidden md:inline-block">
            {user?.nombre || user?.displayName || "Cliente"}
          </span>
          <img
            className="h-9 w-9 rounded-full border-2 border-white/20"
            src={
              user?.urlImagenPerfil ||
              buildLocalAvatarSvg(user?.nombre || "Cliente", "#ffffff", "#0D47A1")
            }
            alt="Avatar"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
              title="Ver notificaciones"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 flex justify-between items-center border-b border-gray-700">
                    <h3 className="text-white text-sm font-medium">Notificaciones</h3>
                    <button type="button" onClick={() => setIsNotificationOpen(false)}>
                      <XMarkIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <p className="px-4 py-3 text-sm text-gray-400">
                      No tienes notificaciones nuevas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/client/settings")}
            className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
            title="Configuración"
          >
            <span className="sr-only">Configuración</span>
            <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            data-testid="header-logout-btn"
            className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
            title="Cerrar sesión"
          >
            <span className="sr-only">Cerrar sesión</span>
            <ArrowRightStartOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderClient;
