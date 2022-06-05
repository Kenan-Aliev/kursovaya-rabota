import express from "express";
const router = express.Router();
import { getReportForPeriod } from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/:dates", getReportForPeriod);

export default router;
