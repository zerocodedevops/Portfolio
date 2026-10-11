import type { ServiceConfig } from "../../core/types";

export const servicios: ServiceConfig[] = [
  {
    id: "integrales",
    name: "Reformas integrales",
    slug: "reformas-integrales-madrid",
    shortDescription:
      "Una mirada completa a la vivienda: distribución, materiales, iluminación y coordinación de las distintas fases.",
    fullContent:
      "Cada reforma integral comienza conociendo el espacio y escuchando cómo quieres vivirlo. A partir de ahí se puede desarrollar una propuesta que conecte distribución, acabados y necesidades cotidianas. El alcance, las decisiones y la planificación se concretan para cada proyecto antes de iniciar los trabajos.",
    faqs: [
      {
        question: "¿Qué se considera una reforma integral?",
        answer:
          "Suele implicar la renovación coordinada de varias estancias o sistemas de la vivienda. El alcance concreto depende del estado del inmueble y de lo que quieras cambiar.",
      },
      {
        question: "¿Cómo se define el presupuesto?",
        answer:
          "Se prepara a partir de una visita, el alcance acordado, las mediciones y los materiales seleccionados. La propuesta detallada se revisa antes de decidir cómo continuar.",
      },
    ],
  },
  {
    id: "cocinas",
    name: "Reformas de cocinas",
    slug: "reformas-cocinas-madrid",
    shortDescription:
      "Una cocina diseñada alrededor de la luz, el movimiento y los momentos que ocurren en ella.",
    fullContent:
      "La reforma de una cocina permite repensar la distribución, el almacenamiento, las superficies y la iluminación. Las decisiones se estudian juntas para que el resultado tenga coherencia visual y responda al uso real del espacio.",
    faqs: [
      {
        question: "¿Se puede reformar una cocina sin cambiar toda la distribución?",
        answer:
          "Sí. El planteamiento puede conservar la distribución actual o estudiar cambios, según las instalaciones, las medidas y tus prioridades.",
      },
      {
        question: "¿Cuándo se eligen los acabados?",
        answer:
          "Los materiales y acabados se concretan durante la definición del proyecto, antes de cerrar el alcance y la planificación.",
      },
    ],
  },
  {
    id: "banos",
    name: "Reformas de baños",
    slug: "reformas-banos-madrid",
    shortDescription:
      "Un espacio más cómodo y sereno, pensado en cada detalle y adaptado a sus dimensiones.",
    fullContent:
      "En un baño, la distribución y la elección de superficies tienen un papel esencial. Se pueden estudiar soluciones de almacenamiento, iluminación, sanitarios y revestimientos en función del espacio, las instalaciones existentes y el presupuesto previsto.",
    faqs: [
      {
        question: "¿Puede actualizarse un baño pequeño?",
        answer:
          "Sí. La propuesta puede centrarse en mejorar la distribución, la iluminación y el aprovechamiento del espacio disponible.",
      },
      {
        question: "¿Hay que cambiar todas las instalaciones?",
        answer:
          "No necesariamente. Se revisa su estado y se define qué conviene renovar según el alcance del proyecto.",
      },
    ],
  },
];
