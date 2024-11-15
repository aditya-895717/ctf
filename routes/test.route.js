// routes/userRoutes.js
import { Router } from "express";

import { checkTestSettings, GetRemainingTime, TestController } from "../Controllers/TestController.js";


const testControlRoutes = Router();

testControlRoutes.post("/enabletest", TestController);

testControlRoutes.get("/getstatus", checkTestSettings);
testControlRoutes.get("/getRemainingTime", GetRemainingTime);


export default testControlRoutes;
