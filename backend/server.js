const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

// Polyfill fetch for Node.js if needed
if (!globalThis.fetch) {
  globalThis.fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
}

const SUPABASE_URL = "https://jspxykfdufkfrpnztkvb.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcHh5a2ZkdWZrZnJwbnp0a3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTAyNjEsImV4cCI6MjA2Mzc4NjI2MX0.JI4eok76n1nKbcKJc-JaqHH56Xoz9dLwMvPBqMVBlR8";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(cors());
app.use(express.json()); // Add this to parse JSON bodies
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const connectedUsers = new Map();

// Helper function to get user info with caching
const userCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getUserInfo(userId) {
  try {
    // Check cache first
    const cacheKey = `user_${userId}`;
    const cached = userCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      return null;
    }

    // Cache the result
    userCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error(`❌ Error fetching user ${userId}:`, error);
    return null;
  }
}

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("private_message", async ({ to, from, message }) => {
    console.log("\n📨 Message Event:");
    console.log("- From:", from);
    console.log("- To:", to);
    console.log("- Message:", message);

    if (!to || !from || !message) {
      console.log("❌ Invalid message format");
      socket.emit("error", { message: "Invalid message format" });
      return;
    }

    // Fetch user information for sender and receiver
    const [senderInfo, receiverInfo] = await Promise.all([
      getUserInfo(from),
      getUserInfo(to),
    ]);

    // Create message object with timestamp and user info
    const timestamp = new Date().toISOString();
    const messageObj = {
      from,
      to,
      message,
      timestamp,
      sender_name: senderInfo?.name || `User ${from}`,
      sender_email: senderInfo?.email || null,
      sender_avatar: null,
      receiver_name: receiverInfo?.name || `User ${to}`,
      receiver_email: receiverInfo?.email || null,
      receiver_avatar: null,
    };

    // Send to recipient immediately for real-time experience
    console.log(`📤 Broadcasting to room ${to}`);
    io.to(to).emit("private_message", messageObj);

    // Send confirmation to sender immediately
    console.log(`📤 Sending confirmation to ${from}`);
    socket.emit("message_sent_confirmation", messageObj);

    // Handle database operations asynchronously
    setImmediate(async () => {
      try {
        const senderId = parseInt(from);
        const receiverId = parseInt(to);

        if (isNaN(senderId) || isNaN(receiverId)) {
          console.log("❌ Invalid user IDs");
          return;
        }

        const messageData = {
          sender_id: senderId,
          receiver_id: receiverId,
          message: message.toString().trim(),
          is_read: false,
          created_at: timestamp.replace("T", " ").substring(0, 19),
          updated_at: timestamp.replace("T", " ").substring(0, 19),
        };

        const { error: insertError } = await supabase
          .from("messages")
          .insert([messageData]);

        if (insertError) {
          console.error("❌ Database insert error:", insertError);
          socket.emit("database_error", {
            message: "Failed to save message to database",
            error: insertError.message,
          });
        } else {
          console.log("✅ Message saved to database");
        }
      } catch (error) {
        console.error("❌ Database error:", error);
        socket.emit("database_error", {
          message: "Database error occurred",
          error: error.message,
        });
      }
    });
  });

  socket.on("join", (userId) => {
    console.log("\n🔵 Join Event:");
    console.log("- User ID:", userId);
    console.log("- Socket ID:", socket.id);

    if (connectedUsers.has(socket.id)) {
      const oldRoom = connectedUsers.get(socket.id);
      console.log(`- Leaving old room: ${oldRoom}`);
      socket.leave(oldRoom);
    }

    console.log(`- Joining new room: ${userId}`);
    socket.join(userId);
    connectedUsers.set(socket.id, userId);

    console.log("- Current rooms:", Array.from(socket.rooms));
    console.log("- Connected users:", Array.from(connectedUsers.entries()));
  });

  socket.on("leave_room", () => {
    console.log("\n🔴 Leave Room Event:");
    console.log("- Socket ID:", socket.id);
    if (connectedUsers.has(socket.id)) {
      const room = connectedUsers.get(socket.id);
      console.log(`- Leaving room: ${room}`);
      socket.leave(room);
      connectedUsers.delete(socket.id);
    }
  });

  socket.on("disconnect", () => {
    console.log("\n⛔ Client disconnected:");
    console.log("- Socket ID:", socket.id);
    if (connectedUsers.has(socket.id)) {
      const room = connectedUsers.get(socket.id);
      console.log(`- Leaving room: ${room}`);
      socket.leave(room);
      connectedUsers.delete(socket.id);
    }
  });
});

// API endpoint to fetch messages between two users with user names
app.get("/api/messages", async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return res
      .status(400)
      .json({ error: "Missing user1 or user2 query parameter" });
  }
  try {
    // Get messages with user information using joins
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_foreign(id, name, email),
        receiver:users!messages_receiver_id_foreign(id, name, email)
      `
      )
      .or(
        `and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Messages API error:", error);
      return res.status(500).json({ error: error.message });
    }

    // Enhanced messages with user info
    const enhancedMessages = (data || []).map((msg) => ({
      ...msg,
      sender_name: msg.sender?.name || null,
      sender_email: msg.sender?.email || null,
      receiver_name: msg.receiver?.name || null,
      receiver_email: msg.receiver?.email || null,
    }));

    return res.json({ messages: enhancedMessages });
  } catch (err) {
    console.error("Messages API error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// API endpoint to fetch inbox (latest message per conversation for a user)
app.get("/api/messages/inbox", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    // Get messages with user information using joins
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_foreign(id, name, email),
        receiver:users!messages_receiver_id_foreign(id, name, email)
      `
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (messagesError) {
      console.error("Inbox query error:", messagesError);
      return res.status(500).json({ error: messagesError.message });
    }

    console.log("Raw messages data with joins:", messagesData?.slice(0, 2)); // Debug log

    // Enhanced messages with user info - keep null values instead of fallback
    const enhancedMessages = (messagesData || []).map((msg) => ({
      ...msg,
      sender_name: msg.sender?.name || null,
      sender_email: msg.sender?.email || null,
      sender_avatar: null,
      receiver_name: msg.receiver?.name || null,
      receiver_email: msg.receiver?.email || null,
      receiver_avatar: null,
    }));

    console.log("Enhanced messages:", enhancedMessages.slice(0, 2)); // Debug log

    return res.status(200).json(enhancedMessages);
  } catch (err) {
    console.error("Inbox API error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// API endpoint to get user info by ID
app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    const userInfo = await getUserInfo(userId);
    if (!userInfo) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(userInfo);
  } catch (err) {
    console.error("User API error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Backend ready on http://localhost:${port}`);
  console.log(`📡 Socket.IO server running`);
  console.log(`🔗 Supabase connected`);
});
