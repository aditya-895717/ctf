import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  totalTime: { type: Number, required: true }, // Best time across all phases
  finalRank: { type: Number, required: true }, // Final rank
  ranks: { // Individual ranks per phase
    phase1: { type: Number },
    phase2: { type: Number },
    phase3: { type: Number },
  },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
