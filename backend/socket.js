import { Server } from "socket.io";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user_join", (name) => {
      console.log("A user joined their name is " + name);
      socket.broadcast.emit("user_join", name);
    });

    socket.on("chatMessage", (data) => {
      console.log("Message received:", data);
      io.emit("chatMessage", data);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};
