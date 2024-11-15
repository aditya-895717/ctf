import Leaderboard from "../models/leaderboard.model.js";
import Score from "../models/score.model.js";
import TestSettings from "../models/TestControl.model.js";

export const submitPasswordPhase1 = async (req, res) => {
  const correctPassword = "india";
  try {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    
    const timeSetting = await TestSettings.findOne({});
    const startTime = timeSetting?.startTime; 
    const isTestEnabled = timeSetting?.isTestEnabled; 
    console.log(startTime)
   
    if (!isTestEnabled) {
      return res.status(400).json({ message: "Test is not currently enabled." });
    }

    if (!startTime) {
      return res.status(400).json({ message: "Test has not started yet." });
    }

    // Calculate the time taken (in milliseconds)
    const currentTime = new Date();
    const timeTaken = currentTime - new Date(startTime); // Ensure startTime is a Date object

    // Check if the user has already submitted a score
    const existingScore = await Score.findOne({ email, phase: "phase1" });
    if (existingScore) {
      return res.status(400).json({
        message: "You have already submitted the password for this phase. Move to=>",
        score: existingScore.score, // Return their existing score
      });
    }

    // Check if the password is correct
    if (password === correctPassword) {
      const newScore = new Score({
        name,
        email,
        score: 1, // You can increment the score if needed
        submissionTime: new Date(),
        phase: "phase1", // Include phase or challenge identifier
        timeTaken, // Store the time taken if needed
      });

      await newScore.save();
      return res.status(200).json({
        message: "Password correct!",
        score: newScore.score, // Return the updated score
        timeTaken, // Optionally return the time taken
      });
    } else {
      return res.status(400).json({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error in password submission:", error); // Log error for debugging
    return res.status(500).json({ error: "Server error." });
  }
};

export const submitPasswordPhase2 = async (req, res) => {
  const correctPassword = "image";
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the test is enabled
    const timeSetting = await TestSettings.findOne({});
    const startTime = timeSetting?.startTime; 
   

    if (!startTime) {
      return res.status(400).json({ message: "Test start time is not set." });
    }

    // Check if the user has already submitted a score for phase 2
    const existingScore = await Score.findOne({ email, phase: "phase2" });
    if (existingScore) {
      return res.status(400).json({
        message: "You have already submitted the password for this phase. Move to=>",
        score: existingScore.score, // Return their existing score
      });
    }

    // Calculate the time taken for Phase 2
    const currentTime = new Date();
    const timeTakenPhase2 = currentTime - new Date(startTime); // Time taken in milliseconds

    // Check if the password is correct
    if (password === correctPassword) {
      const newScore = new Score({
        name,
        email,
        score: 1, // You can increment the score if needed
        submissionTime: currentTime, // Save current submission time
        phase: "phase2", // Include phase or challenge identifier
        timeTaken: timeTakenPhase2, // Store the time taken for Phase 2
      });

      await newScore.save();
      return res.status(200).json({
        message: "Password correct!",
        score: newScore.score, // Return the updated score
        timeTaken: timeTakenPhase2, // Optionally return the time taken for Phase 2
      });
    } else {
      return res.status(400).json({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error in password submission:", error); // Log error for debugging
    return res.status(500).json({ error: "Server error." });
  }
};



export const submitPasswordPhase3 = async (req, res) => {
  const correctPassword = "website";
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the test is enabled
    const timeSetting = await TestSettings.findOne({});
    const startTime = timeSetting?.startTime; 
    const isTestEnabled = timeSetting?.isTestEnabled; 

    if (!isTestEnabled) {
      return res.status(400).json({ message: "The test is not currently enabled." });
    }
    if (!startTime) {
      return res.status(400).json({ message: "Test start time is not set." });
    }

    // Check if the user has already submitted a score for phase 3
    const existingScore = await Score.findOne({ email, phase: "phase3" });
    if (existingScore) {
      return res.status(400).json({
        message: "You have already submitted the password for this phase.",
        score: existingScore.score, // Return their existing score
      });
    }

    // Calculate the time taken for Phase 3
    const currentTime = new Date();
    const timeTakenPhase3 = currentTime - new Date(startTime); // Time taken in milliseconds

    // Check if the password is correct
    if (password === correctPassword) {
      const newScore = new Score({
        name,
        email,
        score: 1, // You can increment the score if needed
        submissionTime: currentTime, // Save current submission time
        phase: "phase3", // Include phase or challenge identifier
        timeTaken: timeTakenPhase3, // Store the time taken for Phase 3
      });

      await newScore.save();
      return res.status(200).json({
        message: "Password correct!",
        score: newScore.score, // Return the updated score
        timeTaken: timeTakenPhase3, // Optionally return the time taken for Phase 3
      });
    } else {
      return res.status(400).json({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error in password submission:", error); // Log error for debugging
    return res.status(500).json({ error: "Server error." });
  }
};


  


export const generateLeaderboard = async (req, res) => {
  try {
    const phases = ['phase1', 'phase2', 'phase3'];
    const phaseRanks = {};

    // Calculate ranks for each phase
    for (const phase of phases) {
      const scores = await Score.find({ phase }).sort({ timeTaken: 1 });
      const rankedScores = scores.map((score, index) => ({
        ...score.toObject(),
        rank: index + 1,
      }));

      phaseRanks[phase] = rankedScores;
    }

    // Combine scores for final ranking
    const finalScores = {};

    for (const phase of phases) {
      for (const score of phaseRanks[phase]) {
        if (!finalScores[score.email]) {
          finalScores[score.email] = {
            name: score.name,
            totalTime: 0,
            ranks: {},
          };
        }
        finalScores[score.email].ranks[phase] = score.rank;

        // Ensure timeTaken is a number before comparing
        const timeTaken = Number(score.timeTaken);
        if (finalScores[score.email].totalTime === 0 || timeTaken < finalScores[score.email].totalTime) {
          finalScores[score.email].totalTime = timeTaken;
        }
      }
    }

    const finalLeaderboard = Object.keys(finalScores).map(email => ({
      email,
      name: finalScores[email].name,
      totalTime: finalScores[email].totalTime,
      ranks: finalScores[email].ranks,
    }));

    finalLeaderboard.sort((a, b) => a.totalTime - b.totalTime);

    const finalRankedLeaderboard = finalLeaderboard.map((score, index) => ({
      ...score,
      finalRank: index + 1,
    }));

    // Optional: Clear existing leaderboard before saving
    await Leaderboard.deleteMany({});
    
    // Insert new leaderboard data
    await Leaderboard.insertMany(finalRankedLeaderboard.map(({ email, name, totalTime, finalRank, ranks }) => ({
      email,
      name,
      totalTime,
      finalRank,
      ranks,
    })));

    return res.status(200).json({
      message: "Leaderboard generated and saved successfully!",
    });
  } catch (error) {
    console.error("Error generating leaderboard:", error.message);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};


// Get the leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    // Fetch all leaderboard entries
    const leaderboard = await Leaderboard.find({}, 'email name totalTime finalRank ranks');

    // Check if leaderboard data is found
    if (!leaderboard.length) {
      return res.status(404).json({ message: 'No leaderboard data found.' });
    }

    // Return leaderboard data
    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Server error while fetching leaderboard.' });
  }
};
