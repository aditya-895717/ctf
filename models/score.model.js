// models/User.js
import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  submissionTime: { type: Date }, // Time of the correct submission
  phase: {type:String,required: true },
  timeTaken: { type: Number },
}, { timestamps: true });

const Score = mongoose.model("Score", scoreSchema);

export default Score;
