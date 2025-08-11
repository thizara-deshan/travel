import { Router } from "express";
import {
  getRevenueOverview,
  getRevenueByPackage,
  getRevenueByMonth,
} from "../controllers/revenueController";

const router = Router();

router.get("/revenue/overview", getRevenueOverview);
router.get("/revenue/packages", getRevenueByPackage);
router.get("/revenue/month", getRevenueByMonth);
export default router;
