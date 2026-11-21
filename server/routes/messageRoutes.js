import express from "express";
import {
  startConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  toggleStarConversation,
  getUnreadMessageCount,
} from "../controllers/messageController.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/conversation/start", isAuthenticated, startConversation);

router.get("/conversations", isAuthenticated, getMyConversations);
router.get("/unread-count", isAuthenticated, getUnreadMessageCount);
router.get("/conversation/:conversationId", isAuthenticated, getMessages);
router.put(
  "/conversation/:conversationId/star",
  isAuthenticated,
  toggleStarConversation,
);
router.post(
  "/send/:conversationId",
  isAuthenticated,
  upload.array("attachments", 5),
  sendMessage,
);

export default router;
