import type { MetaFunction } from "react-router";
import { ProjectsTemplate } from "../../src/templates/ProjectsTemplate";

export const meta: MetaFunction = () => {
  return [
    { title: "Ideas e inspiración para reformas | ZeroChaos" },
    {
      name: "description",
      content:
        "Referencias visuales de materiales, luz y distribución para imaginar reformas integrales, cocinas y baños.",
    },
  ];
};

export default function Proyectos() {
  return <ProjectsTemplate />;
}
