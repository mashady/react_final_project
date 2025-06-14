const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

// Polyfill fetch for Node.js if needed
if (!globalThis.fetch) {
  globalThis.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const SUPABASE_URL = 'https://jspxykfdufkfrpnztkvb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcHh5a2ZkdWZrZnJwbnp0a3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTAyNjEsImV4cCI6MjA2Mzc4NjI2MX0.JI4eok76n1nKbcKJc-JaqHH56Xoz9dLwMvPBqMVBlR8';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
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

      if (!to || !from || !message) {
        console.log('❌ Invalid message format');
        socket.emit('error', { message: 'Invalid message format' });
        return;
      }

      // Create message object with timestamp
      const timestamp = new Date().toISOString();
      const messageObj = {
        from,
        to,
        message,
        timestamp
      };

      // Send to recipient immediately for real-time experience
      console.log(`📤 Broadcasting to room ${to}`);
      io.to(to).emit('private_message', messageObj);
      
      // Send confirmation to sender immediately
      console.log(`📤 Sending confirmation to ${from}`);
      socket.emit('message_sent_confirmation', messageObj);

      // Handle database operations asynchronously (don't block real-time)
      setImmediate(async () => {
        try {
          // Validate and convert user IDs to bigint
          const senderId = parseInt(from);
          const receiverId = parseInt(to);
          
          if (isNaN(senderId) || isNaN(receiverId)) {
            console.log('❌ Invalid user IDs');
            return;
          }

          // Save message to database
          const messageData = {
            sender_id: senderId,
            receiver_id: receiverId,
            message: message.toString().trim(),
            is_read: false,
            created_at: timestamp.replace('T', ' ').substring(0, 19),
            updated_at: timestamp.replace('T', ' ').substring(0, 19),
          };

          const { error: insertError } = await supabase
            .from('messages')
            .insert([messageData]);

          if (insertError) {
            console.error('❌ Database insert error:', insertError);
            // Emit error to sender only (don't disrupt real-time for others)
            socket.emit('database_error', { 
              message: 'Failed to save message to database', 
              error: insertError.message 
            });
          } else {
            console.log('✅ Message saved to database');
          }

        } catch (error) {
          console.error('❌ Database error:', error);
          socket.emit('database_error', { 
            message: 'Database error occurred', 
            error: error.message 
          });
        }
      });
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

  // API endpoint to fetch messages between two users
  app.get('/api/messages', async (req, res) => {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Missing user1 or user2 query parameter' });
    }
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
        .order('created_at', { ascending: true });
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json({ messages: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.use((req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(console.error);