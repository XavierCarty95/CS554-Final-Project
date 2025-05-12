import express from "express";
import {
  createGroup,
  getGroups,
  joinGroup,
  getGroupById,
} from "../data/groups.js";
const router = express.Router({ mergeParams: true });

const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

router.get("/isStudent", ensureAuthenticated, (req, res) => {
  let { universityId } = req.params;
  const user = req.session.user;
  if (user.role === "student" && user.universityId === universityId) {
    return res.status(200).json({ isStudent: true });
  }
  return res.status(200).json({ isStudent: false });
});

router.post("/createGroup", ensureAuthenticated, async (req, res) => {
  const { groupName, universityId, description } = req.body;
  const userId = req.session.user._id;

  if (!groupName || !universityId || !userId || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newGroup = await createGroup(
      groupName,
      universityId,
      userId,
      description
    );
    return res.status(201).json(newGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/getGroups", ensureAuthenticated, async (req, res) => {
  const { universityId } = req.params;
  const userId = req.session.user._id;

  if (!universityId || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const groupList = await getGroups(universityId);
    return res.status(200).json(groupList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/joinGroup", ensureAuthenticated, async (req, res) => {
  const { groupId } = req.body;
  const userId = req.session.user._id;

  if (!groupId || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedGroup = await joinGroup(groupId, userId);
    return res.status(200).json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/getGroupById", ensureAuthenticated, async (req, res) => {
  const { groupId } = req.query;

  if (!groupId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const group = await getGroupById(groupId);
    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
