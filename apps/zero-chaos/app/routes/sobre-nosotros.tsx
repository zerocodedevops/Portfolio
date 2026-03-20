import type { MetaFunction } from "react-router";
import { AboutTemplate } from "../../src/templates/AboutTemplate";
import { config } from "../../src/clients/madrid-zerochaos/config";

export const meta: MetaFunction = () => {
  return [
    {
      title: `Sobre Nosotros | ${config.name} | Expertos en Reformas en Madrid`,
    },
    {
      name: "description",
      content: `Conoce a ${config.name}. Nuestra misi├│n es eliminar el caos de las reformas en Madrid a trav├®s de la t├®cnica, la planificaci├│n y la transparencia.`,
    },
  ];
};

export default function SobreNosotros() {
  return <AboutTemplate />;
}
