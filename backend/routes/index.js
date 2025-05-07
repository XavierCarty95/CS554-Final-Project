import authRoutes from "./auth_routes.js";
import forumRoutes from "./forum_routes.js";
import universityRoutes from "./university_routes.js";
import contactRoutes from "./contact_routes.js";
// <<<<<<< Updated upstream
// =======
import user_routes from "./user_routes.js";
import professorRoutes from "./professors.js";
import reviewsRoutes from "./reviews.js";
import coursesRoutes from "./courses.js";
// >>>>>>> Stashed changes
import dotenv from "dotenv";
dotenv.config();

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/universities", universityRoutes);
  app.use("/university/:universityId/forums", forumRoutes);
  app.use("/contact", contactRoutes);
  // <<<<<<< Updated upstream
  // =======
  app.use("/users", user_routes);
  app.use("/professors", professorRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/courses", coursesRoutes);
  // >>>>>>> Stashed changes
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
