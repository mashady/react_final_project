const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jsphykfdufkfrpnztkvb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcHh5a2ZkdWZrZnJwbnp0a3ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODIxMDI2MSwiZXhwIjoyMDYzNzg2MjYxfQ.VOXyzJeGmQe36W-Ik3N-4mDegm6leda67AiM-plDBTU';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  // Keep track of all connected sockets and their rooms
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id);
    
    socket.on('private_message', async ({ to, from, message }) => {
      console.log('\n📨 Message Event:');
      console.log('- From:', from);
      console.log('- To:', to);
      console.log('- Message:', message);
      console.log('- Socket rooms:', Array.from(socket.rooms));
      console.log('- Connected users:', Array.from(connectedUsers.entries()));

      if (!to || !from || !message) {
        console.log('❌ Invalid message format');
        return;
      }

      // Save message to Supabase
      try {
        await supabase.from('messages').insert([
          {
            sender_id: Number(from),
            receiver_id: Number(to),
            message,
            is_read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        console.log('✅ Message saved to Supabase');
      } catch (err) {
        console.error('❌ Error saving message to Supabase:', err);
      }

      // Send to recipient
      console.log(`📤 Broadcasting to room ${to}`);
      io.to(to).emit('private_message', { from, message });
      
      // Send confirmation to sender
      console.log(`📤 Sending confirmation to ${from}`);
      io.to(from).emit('message_sent_confirmation', { from, message });
    });

    socket.on('join', (userId) => {
      console.log('\n🔵 Join Event:');
      console.log('- User ID:', userId);
      console.log('- Socket ID:', socket.id);
      
      // Leave previous room if any
      if (connectedUsers.has(socket.id)) {
        const oldRoom = connectedUsers.get(socket.id);
        console.log(`- Leaving old room: ${oldRoom}`);
        socket.leave(oldRoom);
      }
      
      // Join new room
      console.log(`- Joining new room: ${userId}`);
      socket.join(userId);
      connectedUsers.set(socket.id, userId);
      
      console.log('- Current rooms:', Array.from(socket.rooms));
      console.log('- Connected users:', Array.from(connectedUsers.entries()));
    });

    socket.on('leave_room', () => {
      console.log('\n🔴 Leave Room Event:');
      console.log('- Socket ID:', socket.id);
      if (connectedUsers.has(socket.id)) {
        const room = connectedUsers.get(socket.id);
        console.log(`- Leaving room: ${room}`);
        socket.leave(room);
        connectedUsers.delete(socket.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('\n⛔ Client disconnected:');
      console.log('- Socket ID:', socket.id);
      if (connectedUsers.has(socket.id)) {
        const room = connectedUsers.get(socket.id);
        console.log(`- Leaving room: ${room}`);
        socket.leave(room);
        connectedUsers.delete(socket.id);
      }
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
