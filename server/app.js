const express = require('express')
const app = express()
const cors = require('cors')
const env = require('./config/env')()

// Basic CORS config
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true
  })
)

const server = app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`)
})

const io = require('socket.io')(server)
const connections = []
const users = []
const messages = []

io.on('connection', socket => {
  // Connected
  connections.push(socket)
  console.log('Connected: %s socket connected', connections.length)

  // Set initial messages
  io.emit('set initial messages', messages)

  // Disconnected
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1)
    users.splice(users.indexOf(socket), 1)
    console.log('Disconnect: %s socket connected', connections.length)
  })

  // Join new users
  socket.on('join user', user => {
    socket.username = user
    users.push(socket.username)
  })

  // Recive & send new message
  socket.on('send message', data => {
    messages.push({ username: socket.username, message: data })
    io.emit('new message', messages)
  })
})
