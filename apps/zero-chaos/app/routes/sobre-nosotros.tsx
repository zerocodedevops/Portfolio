import type { MetaFunction } from "react-router";
import { AboutTemplate } from "../../src/templates/AboutTemplate";
import { config } from "../../src/clients/madrid-zerochaos/config";

export const meta: MetaFunction = () => {
  return [
    {
      title: `Nuestra filosofía | ${config.name}`,
    },
    {
      name: "description",
      content: `Conoce la mirada de ${config.name}: diseño, materiales y una planificación clara para reformas en Madrid.`,
    },
  ];
};

export default function SobreNosotros() {
  return <AboutTemplate />;
}
