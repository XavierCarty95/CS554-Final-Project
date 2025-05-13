import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import { ObjectId } from "mongodb";
import { groups } from "../config/mongoCollections.js";
import { isValidId } from "../helpers.js";

router.post("/schedule-meeting", async (req, res) => {
  const { date, emails, meetingLink, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // let testAccount = await nodemailer.createTestAccount();
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   auth: {
  //     user: testAccount.user,
  //     pass: testAccount.pass,
  //   },
  // });

  transporter.verify(function (error, success) {
    if (error) {
      console.error("SMTP connection error:", error);
      return res.status(500).json({ error: "SMTP connection failed" });
    }
  });
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: Array.isArray(emails) ? emails.join(",") : emails,
    subject: "Meeting Invitation",
    text: `You are invited to a meeting for group ${
      req.body.groupId
    } on ${date}.\n\nJoin: ${meetingLink}\n\n${message || ""}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    const groupCollection = await groups();
    const groupId = req.body.groupId;
    let storeMeet = {
      date: date,
      meetingLink: meetingLink,
      message: message,
      createdAt: new Date(),
    };
    let addMeeting = await groupCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $push: { meetings: storeMeet } }
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to send invites" });
  }
  res.json({ success: true });
});

export default router;
