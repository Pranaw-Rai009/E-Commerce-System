import { Router } from "express";
import {userRegister, getAdminData, deleteAccount} from '../controllers/user.controller.js'
import {loginUser} from '../controllers/login.controller.js'
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
import { isAcOwner } from "../middlewares/isAccountOwner.middleware.js";
const router = Router()

router.post("/register", userRegister)
router.post("/login", loginUser)
router.post("/refresh", refreshAccessToken)

router.get("/getData", authAccess, isAdmin, getAdminData)

router.delete("/delete/:accountId", authAccess, isAcOwner, deleteAccount)
// router.post("/updateAcPassword".


export default router