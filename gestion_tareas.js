import express from 'express'
import tareas from './local_db/tareas.json' with { type: 'json' }
import crypto from 'node:crypto'
import { validateTarea } from './schemas/tareas.js'

// Creacion servidor express
const server = express()

// Deshabilitando cabezera que muestra la información del framework utilizado
server.disable('x-powered-by')

// Utilizando middleware que permite recibir datos en formato json en el body de la solicitud
server.use(express.json())

// Ruta por defecto
server.get('/', (req, res) => {
    res.send('Página principal para la gestión de sus tareas.')
})

// Ruta para obtener todas las tareas disponibles en memoria
server.get('/tareas', (req, res) => {
    const response = {
        success: true,
        data: tareas
    }

    res.json(response)
})

// Ruta para obtener las tareas por un id especificado
server.get('/tareas/:id', (req, res) => {
    const { id } = req.params

    const tarea = tareas.find( (tarea) => tarea.id === id)

    if( !tarea ){
        return res.status(204).json({
            success: false,
            data: null
        })
    }

    const response = {
        success: true,
        data: tarea ?? null
    }

    res.status(200).send(response)
})

// Ruta para crear una nueva tarea
server.post('/tareas', (req, res) => {
    const result = validateTarea(req.body)

    if( !result.success ){
        return res.status(400).json({
            success: false,
            message: result.error.errors.map( error => ({
                message: error.message,
                path: error.path[0]
            }) )
        })
    }

    const resultConId = {
        id: crypto.randomUUID(),
        ...result.data, 
        fecha_creacion: new Date().toUTCString()
    }

    tareas.push(resultConId)

    res.status(201).json({
        success: true,
        data: resultConId
    })
})

//Ruta para actualizar una tarea existente
server.put('/tareas/:id', (req, res) => {
    const { id } = req.params
    
    const tareaIndex = tareas.findIndex((tarea) => tarea.id === id)
    
    if ( tareaIndex == -1 ){
        return res.status(404).json({
            success: false,
            message: "No existe una tarea con el id enviado"
        })
    }

    const result = validateTarea(req.body)

    if( !result.success ){
        return res.status(400).json({
            success: false,
            message: result.error.errors.map( error => ({
                message: error.message,
                path: error.path[0]
            }) )
        })
    }

    const resultConId = {
        id: tareas[tareaIndex].id,
        ...result.data, 
        fecha_creacion: tareas[tareaIndex].fecha_creacion
    }

    tareas[tareaIndex] = resultConId

    res.status(200).json({
        success: true,
        data: resultConId
    })

})

// Eliminar una tarea por su id
server.delete('/tareas/:id', (req, res) => {
    const { id } = req.params

    const findIndex = tareas.findIndex( (tarea) => tarea.id === id)

    if(findIndex == -1){
        return res.status(404).json({
            success: false,
            message: "No existe una tarea con el id buscado"
        })
    }

    tareas.splice(findIndex, 1)

    res.status(202).json({
        success: true,
        message: "El contenido ha sido eliminado"
    })

})

// Accion en caso de buscar un recurso no existente
server.use((req, res) => {
    res.status(404).send({
        success: false,
        data: 'Recurso no encontrado'
    })
})

// Puerto en el que será escuchado el servidor
const port = process.env.port || 3000

// Servidor listo para recibir conexiones
server.listen(port, () => {
    console.log(`Servidor escuchado en el puerto http://localhost:${port}`)
})