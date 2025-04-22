import authRoutes from "./auth_routes.js";
import forumRoutes from "./forum_routes.js";
import universityRoutes from "./university_routes.js";

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/universities", universityRoutes);
  app.use("/university/:universityId/forums", forumRoutes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
