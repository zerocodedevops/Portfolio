import { Link, useLocation } from "react-router-dom";
import DemoHeaderToolbar from "../common/DemoHeaderToolbar";

function SubHeaderEmployee() {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === "/employee" || pathname === "/employee/") return "";
    if (pathname.includes("/route")) return "Mi Ruta";
    if (pathname.includes("/inventory")) return "Solicitar Material";
    if (pathname.includes("/documents")) return "Documentos";
    if (pathname.includes("/settings")) return "Perfil";
    return "Panel de Empleado";
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Mobile Title (Right/Center) */}
        {title && (
          <h1 className="text-lg font-semibold text-gray-800 lg:hidden pl-24 mr-auto">
            {title}
          </h1>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 pl-28">
          <Link
            to="/employee"
            className={`text-sm font-medium hover:text-brand-blue ${
              location.pathname === "/employee"
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-gray-500"
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/employee/route"
            className={`text-sm font-medium hover:text-brand-blue ${
              location.pathname.includes("/route")
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-gray-500"
            }`}
          >
            Mi Ruta
          </Link>
          <Link
            to="/employee/inventory"
            className={`text-sm font-medium hover:text-brand-blue ${
              location.pathname.includes("/inventory")
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-gray-500"
            }`}
          >
            Inventario
          </Link>
          <Link
            to="/employee/documents"
            className={`text-sm font-medium hover:text-brand-blue ${
              location.pathname.includes("/documents")
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-gray-500"
            }`}
          >
            Documentos
          </Link>
          <Link
            to="/employee/settings"
            className={`text-sm font-medium hover:text-brand-blue ${
              location.pathname.includes("/settings")
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-gray-500"
            }`}
          >
            Perfil
          </Link>
        </nav>

        <div className="flex items-center justify-center mx-auto lg:mx-0">
          <DemoHeaderToolbar />
        </div>
      </div>
    </div>
  );
}

export default SubHeaderEmployee;
