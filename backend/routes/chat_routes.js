import express from "express";
import * as usersData from "../data/users.js";
import { strCheck } from "../helpers.js";
import {
  requestChats,
  getChatRequests,
  acceptChatRequest,
  rejectChatRequest,
  listPersonalChats,
} from "../data/chats.js";
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

router.get("/getChatRequests", ensureAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  try {
    const chatRequests = await getChatRequests(userId);
    return res.status(200).json(chatRequests);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/acceptChatRequest", ensureAuthenticated, async (req, res) => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await acceptChatRequest(requestId);
    return res.status(200).json(updatedRequest);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/rejectChatRequest", ensureAuthenticated, async (req, res) => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await rejectChatRequest(requestId);
    return res.status(200).json(updatedRequest);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/listPersonalChats", ensureAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  try {
    const personalChats = await listPersonalChats(userId);
    return res.status(200).json(personalChats);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
