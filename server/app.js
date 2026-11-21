import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import CourseRoute from "./routes/courseRoute.js";
import videoRoutes from "./routes/videoRoutes.js";
import StreamRoute from "./routes/StreamRoute.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import progressRoutes from "./routes/progressRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js"
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/JobApplicationRoute.js"
import GigRoutes from "./routes/GigRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import blogRoutes from "./routes/blogRoutes.js"
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import path from "path";
export const app = express();
config({ path: "./config.env" });
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/courses", CourseRoute);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/stream/video", StreamRoute);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/gigs", GigRoutes);
app.use("/api/v1/reviews", ReviewRoute);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/admin", adminDashboardRoutes);
removeUnverifiedAccounts();
connection();

app.use(errorMiddleware);
