import { Router } from "express";
import ctrl from "./controller"

const router = Router();

router.get("/", ctrl.getUsers);
router.get("/:id", ctrl.getUserLeaderboard);
router.get("/:id/country", ctrl.getLeaderboardCountries)


export default router;
