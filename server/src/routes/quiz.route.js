import express from "express";
import { submitQuizAndRecommend, getRecommendations } from "../controllers/quiz.controller.js";
import { authUserMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/recommend", authUserMiddleware, submitQuizAndRecommend);
router.get("/recommendations", authUserMiddleware, getRecommendations);

export default router;