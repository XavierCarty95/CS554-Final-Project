import { Server } from "socket.io";
import { chats } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("user_join", (name) => {
      socket.broadcast.emit("user_join", name);
    });

    socket.on("chatMessage", async (data) => {
      console.log(data);
      const chatCol = await chats();
      await chatCol.findOneAndUpdate(
        { _id: new ObjectId(data.chatId) },
        {
          $push: {
            messages: {
              name: data.name,
              message: data.message,
              createdAt: new Date(),
            },
          },
        }
      );
      io.emit("chatMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};
