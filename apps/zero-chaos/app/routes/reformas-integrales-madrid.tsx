import type { MetaFunction } from "react-router";
import { ServiceTemplate } from "../../src/templates/ServiceTemplate";
import { servicios } from "../../src/clients/madrid-zerochaos/servicios";
import { config } from "../../src/clients/madrid-zerochaos/config";

const service = servicios.find((s) => s.id === "integrales")!;

export const meta: MetaFunction = () => {
  return [
    { title: `${service.name} en Madrid | ${config.name}` },
    {
      name: "description",
      content: `${service.shortDescription} Conoce cómo se define el alcance y la propuesta de cada reforma integral.`,
    },
  ];
};

export default function Integrales() {
  return <ServiceTemplate service={service} />;
}
