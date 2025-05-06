import authRoutes from "./auth_routes.js";
import forumRoutes from "./forum_routes.js";
import universityRoutes from "./university_routes.js";
import contactRoutes from "./contact_routes.js";
import user_routes from "./user_routes.js";
import chat_routes from "./chat_routes.js";
import dotenv from "dotenv";
dotenv.config();

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/universities", universityRoutes);
  app.use("/university/:universityId/forums", forumRoutes);
  app.use("/contact", contactRoutes);
  app.use("/users", user_routes);
  app.use("/chat", chat_routes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
