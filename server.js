const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('private_message', ({ to, from, message }) => {
      // Send to recipient
      io.to(to).emit('private_message', { from, message });
      // Send back to sender
      io.to(from).emit('private_message', { from, message });
    });

    socket.on('join', (userId) => {
      console.log(`User ${userId} joined`);
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  app.use((req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(console.error);
