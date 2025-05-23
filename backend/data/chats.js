import {
  chatRequests,
  users,
  chats,
  universities,
} from "../config/mongoCollections.js";
import { strCheck, isValidId } from "../helpers.js";
import { ObjectId } from "mongodb";
export const requestChats = async (message, receipentId, senderId) => {
  message = strCheck(message, "message");
  isValidId(receipentId, "receipentId");
  isValidId(senderId, "senderId");
  const chatRequestCollection = await chatRequests();

  let existingRequest = await chatRequestCollection.findOne({
    senderId: senderId,
    receipentId: receipentId,
    status: "pending",
  });
  if (existingRequest) {
    throw new Error("Chat request already exists");
  }

  const newRequest = {
    message: message,
    senderId: senderId,
    receipentId: receipentId,
    status: "pending",
    createdAt: new Date(),
  };
  const insertInfo = await chatRequestCollection.insertOne(newRequest);
  if (insertInfo.insertedCount === 0) {
    throw new Error("Could not create chat request");
  }
  const insertedDocument = await chatRequestCollection.findOne({
    _id: insertInfo.insertedId,
  });
  return insertedDocument;
};

export const getChatRequests = async (userId) => {
  isValidId(userId, "userId");
  const chatRequestCollection = await chatRequests();
  const userCollection = await users();
  const chatRequestsList = await chatRequestCollection
    .find({ receipentId: userId, status: "pending" })
    .toArray();
  if (!chatRequestsList) {
    throw new Error("No chat requests found");
  }
  const populatedRequests = await Promise.all(
    chatRequestsList.map(async (request) => {
      const sender = await userCollection.findOne({
        _id: new ObjectId(request.senderId),
      });
      return { ...request, sender };
    })
  );
  return populatedRequests;
};

export const acceptChatRequest = async (requestId) => {
  isValidId(requestId, "requestId");
  const chatRequestCollection = await chatRequests();
  const updateInfo = await chatRequestCollection.findOneAndUpdate(
    { _id: new ObjectId(requestId) },
    { $set: { status: "accepted" } },
    { returnDocument: "after" }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error("Could not accept chat request");
  }
  let chat = {
    type: "personal",
    members: [updateInfo.senderId, updateInfo.receipentId],
    messages: [],
    createdAt: new Date(),
    name: "",
  };

  const chatCollection = await chats();
  const chatsData = await chatCollection.insertOne(chat);
  if (chatsData.insertedCount === 0) {
    throw new Error("Could not create chat");
  }
  return true;
};

export const rejectChatRequest = async (requestId) => {
  isValidId(requestId, "requestId");
  const chatRequestCollection = await chatRequests();
  const updateInfo = await chatRequestCollection.updateOne(
    { _id: new ObjectId(requestId) },
    { $set: { status: "rejected" } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw new Error("Could not reject chat request");
  }
  return true;
};

export const listPersonalChats = async (userId) => {
  isValidId(userId, "userId");
  const chatCollection = await chats();
  let chatList = await chatCollection
    .find({ members: { $in: [userId] } })
    .toArray();
  if (!chatList) {
    throw new Error("No personal chats found");
  }
  const userCollection = await users();
  chatList = await Promise.all(
    chatList.map(async (chat) => {
      const populatedMembers = await Promise.all(
        chat.members.map(async (memberId) => {
          const member = await userCollection.findOne({
            _id: new ObjectId(memberId),
          });
          if (memberId !== userId) {
            chat.name = member.name;
          }
          if (memberId === userId) {
            chat.senderName = member.name;
          }
          return member;
        })
      );
      return { ...chat, members: populatedMembers };
    })
  );
  return chatList;
};

export const getPublicChat = async (universityId) => {
  isValidId(universityId, "universityId");
  const chatCollection = await chats();
  let chatCol = await chatCollection.findOne({
    universityId: universityId,
    type: "public",
  });
  if (!chatCol) {
    var chat = {
      type: "public",
      members: [],
      messages: [],
      universityId: universityId,
      createdAt: new Date(),
      name: "",
    };
    const universityCollection = await universities();
    const university = await universityCollection.findOne({
      _id: new ObjectId(universityId),
    });
    if (!university) {
      throw new Error("University not found");
    }
    chat.name = university.name;
    await chatCollection.insertOne(chat);
    chatCol = await chatCollection.findOne({
      universityId: universityId,
      type: "public",
    });
    return chatCol;
  }
  return chatCol;
};

export const isChatExists = async (senderId, receipentId) => {
  isValidId(senderId, "senderId");
  isValidId(receipentId, "receipentId");
  let ids = [senderId, receipentId];
  const chatCollection = await chats();
  const chat = await chatCollection.findOne({
    members: { $all: ids },
    type: "personal",
  });

  if (!chat) {
    return false;
  }
  return true;
};

export const fetchGroupChat = async (userId) => {
  isValidId(userId, "userId");
  const chatCollection = await chats();
  let chatList = await chatCollection
    .find({ members: { $in: [new ObjectId(userId)] }, type: "group" })
    .toArray();
  if (!chatList) {
    throw new Error("No group chats found");
  }
  const userCollection = await users();
  chatList = await Promise.all(
    chatList.map(async (chat) => {
      const populatedMembers = await Promise.all(
        chat.members.map(async (memberId) => {
          const member = await userCollection.findOne({
            _id: new ObjectId(memberId),
          });
          if (memberId.toString() === userId) {
            chat.senderName = member.name;
            chat.senderId = memberId;
          }
          return member;
        })
      );
      return { ...chat, members: populatedMembers };
    })
  );
  return chatList;
};
