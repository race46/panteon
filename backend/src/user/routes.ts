import { Router } from "express";
import ctrl from "./controller";

const router = Router();

router.get("/", ctrl.getUsers);
router.post("/", ctrl.createUser);

export default router;
