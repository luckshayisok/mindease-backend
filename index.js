//index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkinRoute from "./routes/checkinRoute.js"; 
import authRoute from "./routes/authRoute.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("MindEase Backend Running ✅");
});

// Use checkin route
app.use("/api/checkin", checkinRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
