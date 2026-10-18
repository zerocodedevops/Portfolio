import { useLocation } from "react-router-dom";

/** Builds links for both the portfolio-embedded demo and the standalone app. */
export const useZeroChaosPath = () => {
  const { pathname } = useLocation();
  const isPortfolioEmbed = pathname.startsWith("/proyectos/zero-chaos");
  const base = isPortfolioEmbed ? "/proyectos/zero-chaos" : "";

  return (path: string) => {
    if (path.startsWith("#")) {
      return `${isPortfolioEmbed ? base : "/reformas"}/${path}`;
    }
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  };
};
