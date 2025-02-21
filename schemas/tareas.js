import { z } from 'zod';

const tareaSchema = z.object({
    "titulo": z.string({
        required_error: "El titulo de la tarea es obligatorio"
    }).min(5, { message: "El titulo de la tarea debe contener almenos 5 caracteres"}),
    "descripcion": z.string(),
    "completada": z.boolean({invalid_type_error: "Formato invalido, solo se aceptan valores true o false"}),
    "fecha_creacion": z.string().datetime({ local: true }, {invalid_type_error: "Formato invalido, solo se admiten formatos DateTime."})
})

export const validateTarea = (tarea) => tareaSchema.safeParse(tarea)
