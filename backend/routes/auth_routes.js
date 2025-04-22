import express from "express";
import * as usersData from "../data/users.js";
import { getAuth, signOut } from "firebase/auth";
const router = express.Router();

const ensureAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next(); // This should be outside the if block
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await usersData.loginUser(email, password);

    if (user.signInCompleted === false) {
      return res
        .status(400)
        .json({ error: "Either the userId or password is invalid" });
    } else {
      req.session.user = {
        email: user.email,
        _id: user._id,
        role: user.role,
        universityId: user.universityId,
      };
    }

    return res.status(200).send({
      email: user.email,
      name: user.name,
      _id: user._id,
      role: user.role,
      universityId: user.universityId,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, name, password, role, universityId } = req.body;
    let users = await usersData.createUser(
      email,
      password,
      name,
      role,
      universityId
    );
    req.session.user = {
      email: users.email,
      _id: users._id,
      role: users.role,
      universityId: users.universityId,
    };

    return res.status(200).send(users);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: "User is not logged in" });
  }
  const auth = getAuth();
  signOut(auth).catch((error) => {
    console.error("Error signing out from Firebase:", error);
  });
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ error: "Error logging out" });
    }
    return res.status(200).json({ message: "User has been logged out" });
  });
});

export default router;
