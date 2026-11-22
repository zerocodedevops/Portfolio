import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildLocalAvatarSvg } from "../../demo/demoConstants";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

function HeaderEmployee() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const logoSrc = `${import.meta.env.BASE_URL}logo-light.webp`;

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
        <div className="flex items-center w-1/3">
          <Link to="/employee" className="shrink-0 relative z-50">
            <img
              className="h-25 w-auto translate-y-7.25 cursor-pointer"
              src={logoSrc}
              alt="J.Barranco Logo"
              width={160}
              height={40}
            />
          </Link>
        </div>

        <div className="flex items-center justify-center w-1/3">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden md:inline-block">
              {user?.nombre || user?.displayName || "Empleado"}
            </span>
            <img
              className="h-9 w-9 rounded-full border-2 border-white/20"
              src={
                user?.urlImagenPerfil ||
                user?.photoURL ||
                buildLocalAvatarSvg(user?.nombre || "Empleado", "#ffffff", "#0D47A1")
              }
              alt="Perfil"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 w-1/3">
          <button
            type="button"
            onClick={handleLogout}
            data-testid="header-logout-btn"
            className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none"
            title="Cerrar sesión"
          >
            <span className="sr-only">Cerrar sesión</span>
            <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderEmployee;
