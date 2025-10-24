// Servidor Socket.io para Lunari AI
require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
const server = createServer(app)

// Configurar CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}))

// Crear instancia de Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
})

// Manejar conexiones
io.on('connection', (socket) => {
  console.log(`📡 Socket.io: Usuario conectado - ${socket.id}`)

  // Unirse a una sala
  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`🔍 Servidor: Usuario ${socket.id} se unió a la sala ${roomId}`)
    
    // ✅ DEBUGGING: Verificar cuántos clientes hay en la sala después de unirse
    const room = io.sockets.adapter.rooms.get(roomId)
    const clientCount = room ? room.size : 0
    console.log(`🔍 Servidor: Sala ${roomId} ahora tiene ${clientCount} clientes`)
  })

  // Salir de una sala
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId)
    console.log(`📡 Socket.io: Usuario ${socket.id} salió de la sala ${roomId}`)
    
    // ✅ DEBUGGING: Verificar cuántos clientes quedan en la sala
    const room = io.sockets.adapter.rooms.get(roomId)
    const clientCount = room ? room.size : 0
    console.log(`📡 Socket.io: Sala ${roomId} ahora tiene ${clientCount} clientes`)
  })

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log(`📡 Socket.io: Usuario desconectado - ${socket.id}`)
  })
})

// Endpoint para enviar mensajes desde tu app
app.post('/send-message', express.json(), (req, res) => {
  const { roomId, event, data } = req.body

  if (!roomId || !event || !data) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  // ✅ DEBUGGING: Verificar cuántos clientes están en la sala
  const room = io.sockets.adapter.rooms.get(roomId)
  const clientCount = room ? room.size : 0
  console.log(`📡 Socket.io: Sala ${roomId} tiene ${clientCount} clientes conectados`)
  
  if (clientCount === 0) {
    console.log(`⚠️ Socket.io: No hay clientes en la sala ${roomId}!`)
  }

  io.to(roomId).emit(event, data)
  console.log(`📡 Socket.io: Mensaje enviado a sala ${roomId}, evento ${event}, datos:`, data)

  res.json({ success: true, message: 'Mensaje enviado', clientCount })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Iniciar servidor
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`📡 Socket.io: Servidor iniciado en puerto ${PORT}`)
  console.log(`📡 Socket.io: Orígenes permitidos: ${process.env.ALLOWED_ORIGINS}`)
})
