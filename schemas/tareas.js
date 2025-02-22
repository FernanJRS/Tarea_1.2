import { z } from 'zod';

const tareaSchema = z.object({
    "titulo": z.string({
        required_error: "El titulo de la tarea es obligatorio"
    }).trim().min(5, { message: "El titulo de la tarea debe contener almenos 5 caracteres"}),
    "descripcion": z.string().trim().min(20, { message: "La descripcion debe tener al menos 20 caracteres."}),
    "completada": z.boolean({invalid_type_error: "Formato invalido, solo se aceptan valores booleanos (true o false)"}),
})

export const validateTarea = (tarea) => { 
    return tareaSchema.safeParse(tarea)
}
