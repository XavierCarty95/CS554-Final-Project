// routes/contact.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const { ADMIN_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
console.log("SMTP settings:", {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS && "••••••••",
});

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    await transporter.sendMail({
      from: `"Student Bridge" <no-reply@yourdomain.com>`,
      to: ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      text: message,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
