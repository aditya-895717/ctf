// routes/userRoutes.js
import { Router } from "express";
import { generateLeaderboard, getLeaderboard,submitPasswordPhase1, submitPasswordPhase2, submitPasswordPhase3 } from "../Controllers/scoreController.js";


const scoreRoutes = Router();

scoreRoutes.post("/submit-password-phase1", submitPasswordPhase1);
scoreRoutes.post("/submit-password-phase2", submitPasswordPhase2);
scoreRoutes.post("/submit-password-phase3", submitPasswordPhase3);
scoreRoutes.get("/getleaderboard", getLeaderboard);
scoreRoutes.post("/generateleaderboard", generateLeaderboard);


export default scoreRoutes;
