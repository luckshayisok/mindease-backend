//models/Checkin.js
import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // later link with User model
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String, // e.g., happy, sad, angry
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Checkin = mongoose.model("Checkin", checkinSchema);

export default Checkin;
