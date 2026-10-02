//routes/checkinRoute.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js"; 
import Checkin from "../models/Checkin.js"; // 👈 model import

dotenv.config();
const router = express.Router();

const HF_API_URL =
  "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";

// ✅ Authenticated check-in
router.post("/", authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Call Hugging Face API
    const response = await axios.post(
      HF_API_URL,
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const emotion = response.data?.[0]?.[0]?.label || "unknown";

    // Save check-in in DB
    const newCheckin = new Checkin({
      userId: req.user.id, // from token
      message,
      sentiment: emotion,
    });

    await newCheckin.save();

    res.json({
      input: message,
      sentiment: emotion,
      result: response.data,
    });
  } catch (error) {
    console.error(
      "Hugging Face API Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch sentiment analysis" });
  }
});

// ✅ Get all check-ins of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(checkins);
  } catch (error) {
    console.error("Error fetching checkins:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
