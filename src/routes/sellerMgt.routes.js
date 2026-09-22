import { Router } from "express";
import { getMeAllMyOrders } from '../controllers/seller.controller.js'
import { getMyCart } from "../controllers/cart.controller.js";
import { authAccess } from "../middlewares/authAccess.middleware.js";

const router = Router()
router.get("/newOrder", authAccess, getMeAllMyOrders)


export default router