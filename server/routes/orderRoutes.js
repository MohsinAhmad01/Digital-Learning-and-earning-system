import express from "express";
import {
  createOrder,
  getOrders,
   getSingleOrder,
  requestMilestonePayment,
  confirmMilestonePaid,
  deliverOrder,
  approveOrder,
} from "../controllers/orderController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, createOrder);
router.get("/", isAuthenticated, getOrders);

router.post("/milestone/request", isAuthenticated, requestMilestonePayment);
router.put("/milestone/confirm-paid", isAuthenticated, confirmMilestonePaid);

router.post("/deliver", isAuthenticated, deliverOrder);
router.post("/approve", isAuthenticated, approveOrder);
router.get("/:orderId", isAuthenticated, getSingleOrder);
export default router;