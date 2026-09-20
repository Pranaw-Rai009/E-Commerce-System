import { Router } from "express";
import { openMyCart, addToCart, removeItemsFromCart, getMyCart } from '../controllers/cart.controller.js'
import { authAccess } from "../middlewares/authAccess.middleware.js";
const router = Router()

router.get("/openMy", authAccess, openMyCart)
router.get("/getMy", authAccess, getMyCart)
router.post("/addToCart/:productId", authAccess, addToCart)
router.delete("/remove", authAccess, removeItemsFromCart)

export default router;