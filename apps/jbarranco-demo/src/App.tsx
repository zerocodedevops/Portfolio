import { type ReactNode, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./router/routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { queryClient } from "./config/queryClient";
import { onDemoEnvironmentReset } from "./demo/demoStore";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App(): ReactNode {
  const [resetGeneration, setResetGeneration] = useState(0);

  useEffect(() => {
    return onDemoEnvironmentReset(() => {
      queryClient.clear();
      setResetGeneration((prev) => prev + 1);
    });
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter basename={routerBasename}>
          <div key={resetGeneration} className="min-h-screen flex flex-col">
            <AppRoutes />
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
