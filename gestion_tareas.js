import express from 'express'

// Creacion servidor express
const server = express()

// Deshabilitando cabezera que muestra la información del framework utilizado
server.disable('x-powered-by')

server.get('/', (req, res) => {
    res.send('Prueba de servidor')
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