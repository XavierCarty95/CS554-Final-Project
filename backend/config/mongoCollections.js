import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn("users");
export const forums = getCollectionFn("forums");
export const universities = getCollectionFn("universities");
export const posts = getCollectionFn("posts");
export const chatRequests = getCollectionFn("chatRequests");

export const professorReviews = getCollectionFn("professorReviews");
export const professors = getCollectionFn("professors");
export const reviews = getCollectionFn("reviews");
export const courses = getCollectionFn("courses");
export const chats = getCollectionFn("chats");
export const groups = getCollectionFn("groups");
