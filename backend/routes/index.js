import authRoutes from "./auth_routes.js";
import forumRoutes from "./forum_routes.js";
import universityRoutes from "./university_routes.js";
import contactRoutes from "./contact_routes.js";
import user_routes from "./user_routes.js";
import professorRoutes from "./professors.js";
import reviewsRoutes from "./reviews.js";
import coursesRoutes from "./courses.js";
import chat_routes from "./chat_routes.js";
import courseSchedulerRoutes from "./courseScheduler.js";
import dotenv from "dotenv";
import group_routes from "./group_routes.js";
import meeting_routes from "./meeting_routes.js";

dotenv.config();

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/universities", universityRoutes);
  app.use("/university/:universityId/forums", forumRoutes);
  app.use("/contact", contactRoutes);
  app.use("/users", user_routes);
  app.use("/professors", professorRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/courses", coursesRoutes);
  app.use("/chat", chat_routes);
  app.use("/api/scheduler", courseSchedulerRoutes);
  app.use("/university/:universityId/professors", professorRoutes);
  app.use("/university/:universityId/groups", group_routes);
  app.use("/api", meeting_routes);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
