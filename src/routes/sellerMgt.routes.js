import { Router } from "express";
import { getMeAllMyOrders, updateOrderStatus, updatePaymentStatus } from '../controllers/seller.controller.js'
import { getMyCart } from "../controllers/cart.controller.js";
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { isSeller } from "../middlewares/isSeller.middleware.js";

const router = Router()
router.get("/newOrder", authAccess, isSeller, getMeAllMyOrders)
router.patch("/updateStatus/:orderId", authAccess, isSeller, updateOrderStatus)
router.patch("/upadtePayStatus/:orderId", authAccess, isSeller, updatePaymentStatus)


export default router