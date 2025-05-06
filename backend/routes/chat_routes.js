import express from "express";
import * as usersData from "../data/users.js";
import { strCheck } from "../helpers.js";
import { requestChats } from "../data/chats.js";
const router = express.Router();

const ensureAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

router.post("/requestChat", ensureAuthenticated, async (req, res) => {
  let { message } = req.body;
  const { receipentId } = req.body;
  const { senderId } = req.body;

  try {
    const chatRequest = await requestChats(message, receipentId, senderId);
    return res.status(200).json(chatRequest);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
