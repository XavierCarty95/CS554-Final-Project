import {
  users,
  chats,
  universities,
  groups,
} from "../config/mongoCollections.js";
import { strCheck, isValidId } from "../helpers.js";
import { ObjectId } from "mongodb";

export const createGroup = async (
  groupName,
  universityId,
  userId,
  description
) => {
  groupName = strCheck(groupName, "Group name");
  isValidId(universityId, "University ID");
  isValidId(userId, "User ID");
  description = strCheck(description, "Description");
  const groupCollection = await groups();
  let newGroup = {
    groupName: groupName,
    universityId: new ObjectId(universityId),
    members: [new ObjectId(userId)],
    description: description,
    createdAt: new Date(),
    createdBy: new ObjectId(userId),
  };
  const insertInfo = await groupCollection.insertOne(newGroup);
  if (insertInfo.insertedCount === 0) {
    throw new Error("Could not add group");
  }
  const chatsCollection = await chats();
  let chat = {
    type: "group",
    members: [new ObjectId(userId)],
    messages: [],
    createdAt: new Date(),
    name: groupName,
    groupId: insertInfo.insertedId,
    createdBy: new ObjectId(userId),
    groupId: insertInfo.insertedId,
  };
  const chatInsertInfo = await chatsCollection.insertOne(chat);
  if (chatInsertInfo.insertedCount === 0) {
    throw new Error("Could not create chat");
  }
  const insertedGroup = await groupCollection.findOne({
    _id: insertInfo.insertedId,
  });

  return insertedGroup;
};

export const getGroups = async (universityId) => {
  isValidId(universityId, "University ID");
  const groupCollection = await groups();
  const groupList = await groupCollection
    .find({ universityId: new ObjectId(universityId) })
    .toArray();
  if (!groupList) {
    throw new Error("No groups found");
  }
  const populatedGroups = await Promise.all(
    groupList.map(async (group) => {
      const userCollection = await users();
      const members = await userCollection
        .find({ _id: { $in: group.members } })
        .toArray();
      const createdBy = await userCollection.findOne({
        _id: group.createdBy,
      });
      return {
        ...group,
        members: members,
        createdBy: createdBy,
      };
    })
  );
  return populatedGroups;
};

export const joinGroup = async (groupId, userId) => {
  isValidId(groupId, "Group ID");
  isValidId(userId, "User ID");
  const groupCollection = await groups();
  const group = await groupCollection.findOne({
    _id: new ObjectId(groupId),
  });
  if (!group) {
    throw new Error("Group not found");
  }
  if (group.members.includes(new ObjectId(userId))) {
    throw new Error("User already in group");
  }
  const updatedGroup = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(groupId) },
    { $addToSet: { members: new ObjectId(userId) } },
    { returnDocument: "after" }
  );
  if (!updatedGroup) {
    throw new Error("Could not update group");
  }
  const chatsCollection = await chats();
  const chat = await chatsCollection.findOneAndUpdate(
    { groupId: new ObjectId(groupId) },
    { $addToSet: { members: new ObjectId(userId) } },
    { returnDocument: "after" }
  );
  return updatedGroup;
};

export const getGroupById = async (groupId) => {
  isValidId(groupId, "Group ID");
  const groupCollection = await groups();
  const group = await groupCollection.findOne({
    _id: new ObjectId(groupId),
  });
  if (!group) {
    throw new Error("Group not found");
  }
  const userCollection = await users();
  const members = await userCollection
    .find({ _id: { $in: group.members } })
    .toArray();
  const createdBy = await userCollection.findOne({
    _id: group.createdBy,
  });
  return {
    ...group,
    members: members,
    createdBy: createdBy,
  };
};

export const leaveGroup = async (groupId, userId) => {
  isValidId(groupId, "Group ID");
  isValidId(userId, "User ID");
  const groupCollection = await groups();
  const group = await groupCollection.findOneAndUpdate(
    {
      _id: new ObjectId(groupId),
    },
    { $pull: { members: new ObjectId(userId) } },
    { returnDocument: "after" }
  );
  if (!group) {
    throw new Error("Group not found");
  }

  const chatsCollection = await chats();
  const chat = await chatsCollection.findOneAndUpdate(
    {
      groupId: new ObjectId(groupId),
    },
    { $pull: { members: new ObjectId(userId) } },
    { returnDocument: "after" }
  );
  if (!chat) {
    throw new Error("Chat not found");
  }
  if (group.createdBy.equals(new ObjectId(userId))) {
    const groupCollection = await groups();
    const deleteInfo = await groupCollection.deleteOne({
      _id: new ObjectId(groupId),
    });
    if (deleteInfo.deletedCount === 0) {
      throw new Error("Could not delete group");
    }
    const chatsCollection = await chats();
    const deleteChatInfo = await chatsCollection.deleteOne({
      groupId: new ObjectId(groupId),
    });
    if (deleteChatInfo.deletedCount === 0) {
      throw new Error("Could not delete chat");
    }
  }
  return group;
};
