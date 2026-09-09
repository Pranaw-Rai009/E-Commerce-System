import { Router } from "express";
import { openMyCart } from '../controllers/cart.controller.js'
import { authAccess } from "../middlewares/authAccess.middleware.js";
const router = Router()

router.get("/myCart", authAccess, openMyCart)

export default router;