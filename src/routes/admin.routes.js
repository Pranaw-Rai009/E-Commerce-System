import { Router } from "express";
import {userRegister, getAdminData} from '../controllers/user.controller.js'
import {loginUser} from '../controllers/login.controller.js'
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
const router = Router()

router.post("/register", userRegister)
router.post("/login", loginUser)
router.post("/refresh", authAccess, refreshAccessToken)
router.get("/getData", authAccess, isAdmin, getAdminData)


export default router