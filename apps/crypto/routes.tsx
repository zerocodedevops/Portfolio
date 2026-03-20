import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const CryptoDashboard = lazy(() =>
  import("./pages/CryptoDashboard").then((m) => ({
    default: m.CryptoDashboard,
  })),
);

export default function CryptoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CryptoDashboard />} />
    </Routes>
  );
}
