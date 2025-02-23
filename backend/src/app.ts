import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./user/routes";
import leaderboardRoutes from "./leaderboard/router"
import Redis from "./connection/redis";
import Schedulers from "./periodic-workers/index"
import cors from "cors"

Schedulers()

Redis.on("connect", () => console.log("Connected to Redis"));
Redis.on("error", (err) => console.error("Redis Error:", err));

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

export default app;
