export default function Project() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h2 className="text-2xl font-semibold text-brand.primary">
        Plataforma Empresarial Fullstack con IA
      </h2>
      <p className="mt-2">
        Demo de una plataforma para mostrar flujos de administración, calendario
        y gestión de servicios. Los datos son de ejemplo y no se guardan ni se
        envían a servicios externos.
      </p>
      <ul className="mt-4 list-disc pl-6">
        <li>Rutas protegidas por rol y carga perezosa de vistas.</li>
        <li>Gestión de datos con React Query y actualizaciones optimistas.</li>
        <li>
          Formularios con React Hook Form + Zod, subida de ficheros a la nube.
        </li>
        <li>Tailwind + modo claro/oscuro + accesibilidad básica.</li>
        <li>Tests con Vitest + React Testing Library.</li>
      </ul>
    </main>
  );
}
