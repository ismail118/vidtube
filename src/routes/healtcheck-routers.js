import { Router } from "express";
import { healtcheck } from "../controllers/healtcheck-controller.js";

const router = Router()

router.route("/").get(healtcheck)

export default router