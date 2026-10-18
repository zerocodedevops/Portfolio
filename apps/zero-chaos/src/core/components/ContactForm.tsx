import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CTAButton } from "./CTAButton";

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  telefono: z.string().min(9, "El teléfono no es válido"),
  tipoReforma: z.enum(["integral", "cocina", "baño", "otros"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [simulated, setSimulated] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Demo-only: deliberately do not log, persist, or transmit submitted values.
    reset();
    setSimulated(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-describedby="demo-form-notice"
      className="bg-white p-8 shadow-2xl border border-gray-100 max-w-lg w-full"
    >
      <p id="demo-form-notice" className="mb-5 border border-[#A8754F]/30 bg-[#A8754F]/5 p-3 text-sm text-gray-700">
        Demo interactiva: el envío es simulado. No introduzcas datos reales; la información no se guarda ni se envía a ningún sitio.
      </p>
      <h3 className="text-2xl font-bold text-[#2B302E] mb-6 uppercase tracking-tight">
        Solicita presupuesto en 24h
      </h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre completo
          </label>
          <input
            id="nombre"
            {...register("nombre")}
            type="text"
            autoComplete="off"
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#A8754F] focus:ring-1 focus:ring-[#A8754F] outline-none transition-all"
            placeholder="Tu nombre"
          />
          {errors.nombre && (
            <p id="nombre-error" className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teléfono de contacto
          </label>
          <input
            id="telefono"
            {...register("telefono")}
            type="tel"
            autoComplete="off"
            aria-invalid={Boolean(errors.telefono)}
            aria-describedby={errors.telefono ? "telefono-error" : undefined}
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#A8754F] focus:ring-1 focus:ring-[#A8754F] outline-none transition-all"
            placeholder="600 000 000"
          />
          {errors.telefono && (
            <p id="telefono-error" className="text-red-500 text-xs mt-1">
              {errors.telefono.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tipoReforma"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de reforma
          </label>
          <select
            id="tipoReforma"
            {...register("tipoReforma")}
            autoComplete="off"
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#A8754F] focus:ring-1 focus:ring-[#A8754F] outline-none transition-all bg-white"
          >
            <option value="integral">Reforma Integral</option>
            <option value="cocina">Reforma de Cocina</option>
            <option value="baño">Reforma de Baño</option>
            <option value="otros">Otros proyectos</option>
          </select>
        </div>

        <CTAButton
          text={isSubmitting ? "Enviando..." : "Solicitar presupuesto"}
          type="submit"
          className="w-full mt-4"
        />

        {simulated && (
          <p role="status" aria-live="polite" className="mt-4 text-sm text-[#2B302E]">
            Envío simulado. No se ha enviado ni almacenado ningún dato.
          </p>
        )}
        <p className="text-[10px] text-gray-500 text-center mt-4">
          No introduzcas datos reales. Este formulario de demostración no almacena ni transmite la información.
        </p>
      </div>
    </form>
  );
};
