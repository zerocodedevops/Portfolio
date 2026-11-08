import type { Product } from "../services/productsApi";

export const mockProducts: Product[] = [
  {
    id: 1,
    title: "Mochila Urbana Impermeable - Eco Canvas",
    price: 89.95,
    description:
      "Tu compañera perfecta para el día a día. Fabricada con loneta impermeable reciclada, ofrece compartimento acolchado para portátil (hasta 15 pulgadas) y acabados en piel vegana.",
    category: "accesorios",
    image: "/assets/projects/ecommerce/backpack.webp",
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: "Camiseta Básica Premium - Algodón Orgánico",
    price: 24.0,
    description:
      "Camiseta de algodón 100% orgánico con tacto sedoso y corte regular. Una prenda esencial para cualquier ocasión, resistente y con tintes ecológicos.",
    category: "ropa",
    image: "/assets/projects/ecommerce/tshirt.webp",
    rating: { rate: 4.7, count: 259 },
  },
  {
    id: 3,
    title: "Chaqueta Bomber Ligera",
    price: 68.0,
    description:
      "Perfecta para entretiempo. Diseño versátil con forro transpirable y bolsillos interiores seguros.",
    category: "ropa",
    image: "/assets/projects/ecommerce/jacket.webp",
    rating: { rate: 4.8, count: 500 },
  },
  {
    id: 4,
    title: "Pulsera de Piedra Volcánica y Plata",
    price: 19.9,
    description:
      "Pieza artesanal elaborada con cuentas de piedra natural y cierre ajustable de plata de ley 925.",
    category: "joyeria",
    image: "/assets/projects/ecommerce/bracelet.webp",
    rating: { rate: 4.4, count: 430 },
  },
  {
    id: 5,
    title: "Anillo Minimalista en Plata de Ley",
    price: 34.0,
    description:
      "Diseño sobrio y elegante con acabado pulido satinado. Hecho a mano por maestros orfebres locales.",
    category: "joyeria",
    image: "/assets/projects/ecommerce/ring.webp",
    rating: { rate: 4.9, count: 400 },
  },
  {
    id: 6,
    title: "Vela Aromática Artesanal de Soja - Lavanda & Cedro",
    price: 18.5,
    description:
      "Vela vegetal vertida a mano en cera de soja 100% natural. Mecha de algodón ecológico, combustión limpia de más de 45 horas y fragancia suave libre de tóxicos.",
    category: "hogar",
    image: "/assets/projects/ecommerce/candle.webp",
    rating: { rate: 4.8, count: 160 },
  },
  {
    id: 7,
    title: "Café de Especialidad en Grano - Origen Etiopía 250g",
    price: 12.9,
    description:
      "Tueste artesanal medio con notas florales a bergamota y jazmín. Cultivo de comercio justo y recolección manual a más de 1.900m de altitud.",
    category: "gourmet",
    image: "/assets/projects/ecommerce/coffee.webp",
    rating: { rate: 4.9, count: 250 },
  },
  {
    id: 8,
    title: "Chaqueta Biker en Piel Vegana",
    price: 79.95,
    description:
      "Corte ajustado contemporáneo con forro suave y cremalleras metálicas resistentes. Estilo atemporal.",
    category: "ropa",
    image: "/assets/projects/ecommerce/biker_jacket.webp",
    rating: { rate: 4.7, count: 340 },
  },
  {
    id: 15,
    title: "Chaqueta Térmica Acolchada",
    price: 89.99,
    description:
      "Aislamiento térmico ultraligero y repelente al agua. Máximo confort para los días más fríos.",
    category: "ropa",
    image: "/assets/projects/ecommerce/winter_jacket.webp",
    rating: { rate: 4.8, count: 235 },
  },
  {
    id: 17,
    title: "Gabardina Clásica Beige",
    price: 95.0,
    description:
      "Un básico de fondo de armario con doble botonadura y cinturón ajustable.",
    category: "ropa",
    image: "/assets/projects/ecommerce/trench_coat.webp",
    rating: { rate: 4.6, count: 679 },
  },
  {
    id: 18,
    title: "Reloj Analógico de Diseño Nórdico",
    price: 119.0,
    description:
      "Caja de acero inoxidable cepillado con correa de cuero intercambiable y maquinaria de cuarzo de alta precisión.",
    category: "accesorios",
    image: "/assets/projects/ecommerce/smartwatch.webp",
    rating: { rate: 4.9, count: 120 },
  },
  {
    id: 19,
    title: "Cuaderno de Notas en Cuero Reciclado",
    price: 24.5,
    description:
      "Encuadernación artesanal con papel de 120g libre de ácido. Perfecto para bocetos, bullet journal o anotaciones de proyectos.",
    category: "papeleria",
    image: "/assets/projects/ecommerce/notebook.webp",
    rating: { rate: 4.8, count: 180 },
  },
  {
    id: 20,
    title: "Sudadera Orgánica Unisex - Algodón Peinado",
    price: 42.0,
    description:
      "Sudadera minimalista de tacto ultrasuave con certificado GOTS. Corte relajado, colores neutros y acabados reforzados en cuello y puños.",
    category: "ropa",
    image: "/assets/projects/ecommerce/hoodie_debug.webp",
    rating: { rate: 4.6, count: 85 },
  },
  {
    id: 21,
    title: "Auriculares Inalámbricos SoundPro",
    price: 69.0,
    description:
      "Sonido balanceado de alta fidelidad, cancelación pasiva de ruido y hasta 24 horas de autonomía con estuche de carga.",
    category: "accesorios",
    image: "/assets/projects/ecommerce/headphones.webp",
    rating: { rate: 4.8, count: 520 },
  },
  {
    id: 22,
    title: "Mochila Antirrobo CityPack",
    price: 49.0,
    description:
      "Diseño ergonómico y estilizado, cremalleras ocultas y bolsillo antirrobo en la espalda. Ideal para viajes diarios.",
    category: "accesorios",
    image: "/assets/projects/ecommerce/backpack_tech.webp",
    rating: { rate: 4.7, count: 210 },
  },
];
