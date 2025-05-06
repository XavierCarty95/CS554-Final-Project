import { chatRequests, users } from "../config/mongoCollections.js";
import { strCheck, isValidId } from "../helpers.js";
export const requestChats = async (message, receipentId, senderId) => {
  message = strCheck(message, "message");
  receipentId = isValidId(receipentId, "receipentId");
  senderId = isValidId(senderId, "senderId");
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
