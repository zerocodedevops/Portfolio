import type { MetaFunction } from "react-router";
import { HomeTemplate } from "../../src/templates/HomeTemplate";
import { config } from "../../src/clients/madrid-zerochaos/config";

export const meta: MetaFunction = () => {
  return [
    {
      title: `Reformas integrales en Madrid con diseño cuidado | ${config.name}`,
    },
    {
      name: "description",
      content:
        "Reformas integrales, cocinas y baños en Madrid. Diseñamos cada proyecto con atención al espacio, los materiales y cada etapa de la obra.",
    },
    {
      property: "og:title",
      content: `Reformas con diseño y atención al detalle | ${config.name}`,
    },
    {
      property: "og:description",
      content: "Diseño y reformas de viviendas en Madrid.",
    },
    { name: "theme-color", content: "#252824" },
  ];
};

export default function Home() {
  return <HomeTemplate />;
}
