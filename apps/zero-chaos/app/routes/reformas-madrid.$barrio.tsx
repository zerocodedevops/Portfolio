import { useParams, Navigate } from "react-router-dom";
import { BarrioTemplate } from "../../src/templates/BarrioTemplate";
import { barrios } from "../../src/clients/madrid-zerochaos/barrios";
import { useZeroChaosPath } from "../../src/core/hooks/useZeroChaosPath";

export default function Barrio() {
  const zcPath = useZeroChaosPath();
  const { barrio: barrioSlug } = useParams<{ barrio: string }>();
  const barrio = barrios.find((b) => b.slug === barrioSlug);

  if (!barrio) {
    return <Navigate to={zcPath("/")} replace />;
  }

  return <BarrioTemplate barrio={barrio} />;
}
