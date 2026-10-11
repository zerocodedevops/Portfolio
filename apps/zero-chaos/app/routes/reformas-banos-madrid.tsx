import type { MetaFunction } from "react-router";
import { ServiceTemplate } from "../../src/templates/ServiceTemplate";
import { servicios } from "../../src/clients/madrid-zerochaos/servicios";
import { config } from "../../src/clients/madrid-zerochaos/config";

const service = servicios.find((s) => s.id === "banos")!;

export const meta: MetaFunction = () => {
  return [
    { title: `${service.name} en Madrid | ${config.name}` },
    {
      name: "description",
      content: `${service.shortDescription} Conoce cómo se define el alcance y la propuesta para reformar un baño.`,
    },
  ];
};

export default function Banos() {
  return <ServiceTemplate service={service} />;
}
