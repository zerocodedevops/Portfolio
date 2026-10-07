import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/ui/PageLoader";

// Pages
const Landing = lazy(() => import("@zerovanity/pages/Landing"));

// Admin demo console (no authentication or database connection)
const DemoAdminPage = lazy(() => import("@zerovanity/pages/DemoAdminPage"));

export default function SalonRoutes() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-white flex justify-center">
          <PageLoader text="Loading Salon..." />
        </div>
      }
    >
      <div className="theme-salon min-h-screen bg-background text-foreground font-sans">
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<Landing />} />

          {/* Admin demo console. It uses local mock data only. */}
          <Route path="/admin/*" element={<DemoAdminPage />} />

          {/* Redirect unknown salon paths to landing */}
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </div>
    </Suspense>
  );
}
