import { Router } from "express";
import { logout, registerUser } from "../controllers/user-controller.js";
import { upload } from "../middlewares/mutler-middlewares.js";
import { verifyJWT } from "../middlewares/auth-middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
        
    ]),
    registerUser
)

//secured routes

router.route("/logout").post(verifyJWT, logout)
export default router