import { useLocation } from "react-router-dom";

/** Builds links for both the portfolio-embedded demo and the standalone app. */
export const useZeroChaosPath = () => {
  const { pathname } = useLocation();
  const base = pathname.startsWith("/proyectos/zero-chaos")
    ? "/proyectos/zero-chaos"
    : "/reformas";

  return (path: string) => {
    if (path.startsWith("#")) return `${base}/${path}`;
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  };
};
