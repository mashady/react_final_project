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
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const connectedUsers = new Map();

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
      // Include enriched user information
      sender_name:
        senderInfo?.name ||
        senderInfo?.username ||
        senderInfo?.email ||
        `User ${from}`,
      sender_username: senderInfo?.username || null,
      sender_email: senderInfo?.email || null,
      sender_avatar: senderInfo?.avatar || senderInfo?.picture || null,
      receiver_name:
        receiverInfo?.name ||
        receiverInfo?.username ||
        receiverInfo?.email ||
        `User ${to}`,
      receiver_username: receiverInfo?.username || null,
      receiver_email: receiverInfo?.email || null,
      receiver_avatar: receiverInfo?.avatar || receiverInfo?.picture || null,
    };

    // Send to recipient immediately for real-time experience
    console.log(`📤 Broadcasting to room ${to}`);
    io.to(to).emit("private_message", messageObj);

    // Send confirmation to sender immediately
    console.log(`📤 Sending confirmation to ${from}`);
    socket.emit("message_sent_confirmation", messageObj);

    // Handle database operations asynchronously (don't block real-time)
    setImmediate(async () => {
      try {
        // Validate and convert user IDs to bigint
        const senderId = parseInt(from);
        const receiverId = parseInt(to);

        if (isNaN(senderId) || isNaN(receiverId)) {
          console.log("❌ Invalid user IDs");
          return;
        }

        // Save message to database
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

  // Helper function to get user information
  async function getUserInfo(userId) {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("id, name, username, email, avatar, picture")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(`❌ Error fetching user ${userId}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      return null;
    }
  }

  socket.on("join", (userId) => {
    console.log("\n🔵 Join Event:");
    console.log("- User ID:", userId);
    console.log("- Socket ID:", socket.id);

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

// API endpoint to fetch messages between two users
app.get("/api/messages", async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return res
      .status(400)
      .json({ error: "Missing user1 or user2 query parameter" });
  }
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`
      )
      .order("created_at", { ascending: true });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ messages: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// API endpoint to fetch inbox (latest message per conversation for a user)
app.get("/api/messages/inbox", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }
  try {
    // Get all messages where user is sender or receiver, order by created_at desc
    // Also join user table to get names, usernames, emails, avatars for sender and receiver
    const { data, error } = await supabase
      .from("messages")
      .select(
        `*, sender:sender_id (id,  name, email), receiver:receiver_id (id, name, email)`
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Find all unique user IDs that are missing info
    const missingUserIds = new Set();
    (data || []).forEach((msg) => {
      if (!msg.sender?.name && !msg.sender?.username && !msg.sender?.email)
        missingUserIds.add(msg.sender_id);
      if (
        !msg.receiver?.name &&
        !msg.receiver?.username &&
        !msg.receiver?.email
      )
        missingUserIds.add(msg.receiver_id);
    });

    let userIdToInfo = {};
    if (missingUserIds.size > 0) {
      // Fetch missing user info in one query
      const { data: usersData, error: usersError } = await supabase
        .from("user")
        .select("id, name, username, email, avatar, picture")
        .in("id", Array.from(missingUserIds));
      if (!usersError && usersData) {
        usersData.forEach((u) => {
          userIdToInfo[u.id] = u;
        });
      }
    }

    // Attach sender/receiver info for easier frontend use
    const withNames = (data || []).map((msg) => {
      const senderInfo = msg.sender || userIdToInfo[msg.sender_id] || {};
      const receiverInfo = msg.receiver || userIdToInfo[msg.receiver_id] || {};
      return {
        ...msg,
        sender_name:
          senderInfo.name ||
          senderInfo.username ||
          senderInfo.email ||
          `User ${msg.sender_id}`,
        sender_username: senderInfo.username || null,
        sender_email: senderInfo.email || null,
        sender_avatar: senderInfo.avatar || senderInfo.picture || null,
        receiver_name:
          receiverInfo.name ||
          receiverInfo.username ||
          receiverInfo.email ||
          `User ${msg.receiver_id}`,
        receiver_username: receiverInfo.username || null,
        receiver_email: receiverInfo.email || null,
        receiver_avatar: receiverInfo.avatar || receiverInfo.picture || null,
      };
    });
    return res.status(200).json(withNames);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Backend ready on http://localhost:${port}`);
});
