import * as z from "zod";

const baseSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    cif: z.string().regex(
        /^([a-zA-Z]-?\d{8}|\d{8}[a-zA-Z])$/,
        "Formato CIF/NIF inválido (Ej: H-12345678 o 12345678Z)",
    ),
    direccion: z.string().min(5, "La dirección es muy corta"),
    codigoPostal: z.string().regex(
        /^\d{5}$/,
        "El Código Postal debe tener 5 dígitos",
    ),
    ciudad: z.string().min(2, "La ciudad es obligatoria"),
    password: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    }),
    idUsuario: z.string().optional(),
    cuotaMensual: z.number().optional().default(0),
    // Contract
    diasContrato: z.array(z.coerce.number()).optional(),
    empleadoAsignadoId: z.string().optional(),
});

export const getClientSchema = (isEditing: boolean) => {
    return baseSchema.extend({
        nombreContacto: isEditing
            ? z.string().min(2, "El nombre de contacto es obligatorio").optional().or(z.literal(''))
            : z.string().min(2, "El nombre de contacto es obligatorio"),
        telefono: isEditing
            ? z.string().regex(/^\d{9,}$/, "El teléfono debe tener al menos 9 dígitos").optional().or(z.literal(''))
            : z.string().regex(/^\d{9,}$/, "El teléfono debe tener al menos 9 dígitos"),
        email: isEditing
            ? z.string().regex(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, "Email inválido").optional().or(z.literal(''))
            : z.string().regex(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, "Email inválido"),
    });
};

export const clientSchema = getClientSchema(false);
export type ClientFormValues = z.infer<typeof clientSchema>;
