import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "../../../hooks/useNotifications";
import { useAuth } from "../../../context/AuthContext";
import { buildLocalAvatarSvg } from "../../../demo/demoConstants";
import NotificationDropdown from "../notifications/NotificationDropdown";

interface HeaderAdminProps {
  onMenuClick?: () => void;
}

function HeaderAdmin({ onMenuClick }: Readonly<HeaderAdminProps>) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const logoSrc = `${import.meta.env.BASE_URL}logo-light.webp`;

  const { notifications, dismissNotification, clearAll } = useNotifications();
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
    <header className="bg-brand-blue text-white shadow-md relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/admin" className="relative z-50 shrink-0">
            <img
              className="h-20 w-auto translate-y-8 cursor-pointer drop-shadow-md"
              src={logoSrc}
              alt="J.Barranco Logo"
              width={160}
              height={80}
            />
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-base font-medium hidden md:block">
            {user?.nombre || "Administrador"}
          </span>
          <img
            className="h-8 w-8 rounded-full bg-white object-cover"
            src={
              user?.urlImagenPerfil ||
              buildLocalAvatarSvg(user?.nombre || "Admin", "#ffffff", "#0D47A1")
            }
            alt="Avatar"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              data-testid="admin-notifications-bell"
              className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
              title="Ver notificaciones"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  data-testid="admin-notifications-badge"
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-brand-blue"
                >
                  {unreadCount > 9 ? "+9" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <NotificationDropdown
                notifications={notifications}
                onClose={() => setIsNotificationOpen(false)}
                onRead={(notif) => dismissNotification(notif.id)}
                onClearAll={clearAll}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
            className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
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

          <div className="flex md:hidden">
            <button
              type="button"
              onClick={onMenuClick}
              className="bg-brand-blue inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderAdmin;
