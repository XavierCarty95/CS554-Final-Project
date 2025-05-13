import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();


const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

console.log("Environment variables check:", {
  ADMIN_EMAIL: ADMIN_EMAIL || "NOT SET",
  SMTP_USER: SMTP_USER || "NOT SET",
  SMTP_PASS: SMTP_PASS ? "SET" : "NOT SET",
});


const FALLBACK_EMAIL = "jenishkhunt002@gmail.com"; 

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP verification error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

router.post("/", async (req, res) => {
  const { message, name, email, subject } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const recipientEmail = ADMIN_EMAIL || req.body.toEmail || FALLBACK_EMAIL;

  if (!recipientEmail) {
    console.error("No recipient email available");
    return res
      .status(500)
      .json({
        error: "Server configuration error: No recipient email defined",
      });
  }

  const emailBody = `
Contact Form Submission

From: ${name || "Not provided"} 
Email: ${email || "Not provided"}
Subject: ${subject || "No subject"}

Message:
${message}
  `;

  try {
    const senderEmail = SMTP_USER || "noreply@example.com";

    const info = await transporter.sendMail({
      from: {
        name: "Student Bridge",
        address: senderEmail,
      },
      to: recipientEmail,
      subject: subject
        ? `Contact Form: ${subject}`
        : "New Contact Form Submission",
      text: emailBody,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Sent to: %s", recipientEmail);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Email send error:", err.message);
    console.error("Error details:", err);
    console.error("Attempted to send to:", recipientEmail);
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
});

export default router;
