import type { MetaFunction } from "react-router";
import { ContactTemplate } from "../../src/templates/ContactTemplate";
import { config } from "../../src/clients/madrid-zerochaos/config";

export const meta: MetaFunction = () => {
  return [
    { title: `Pide Presupuesto de Reforma | Contacto | ${config.name}` },
    {
      name: "description",
      content: "Cuéntanos qué espacio quieres transformar y qué necesitas. Hablemos de tu proyecto de reforma en Madrid.",
    },
  ];
};

export default function Contacto() {
  return <ContactTemplate />;
}
