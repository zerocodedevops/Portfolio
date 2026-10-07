import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sileo";
import "sileo/styles.css";
import DemoAdminPage from "./pages/DemoAdminPage";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/proyectos/zerovanity/" replace />} />
        <Route path="/proyectos/zerovanity/" element={<Landing />} />
        <Route path="/proyectos/zerovanity/admin/*" element={<DemoAdminPage />} />
        <Route path="*" element={<Navigate to="/proyectos/zerovanity/" replace />} />
      </Routes>
      <Toaster position="bottom-right" theme="dark" />
    </Router>
  );
}
