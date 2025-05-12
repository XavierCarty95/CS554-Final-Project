import dotenv from "dotenv";
dotenv.config();

export const mongoConfig = {
  serverUrl: "mongodb://localhost:27017/",
  database: "StudentBridge",
  imgBucket: "uploads",
};
export const sessionSecret =
  process.env.SESSION_SECRET || "your_session_secret_here";
("");
