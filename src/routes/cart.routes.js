import { Router } from "express";
import { openMyCart, addToCart, removeItemsFromCart, getMyCart } from '../controllers/cart.controller.js'
import { authAccess } from "../middlewares/authAccess.middleware.js";
const router = Router()

router.get("/myCart", authAccess, openMyCart)
router.post("/addToCart/:productId", authAccess, addToCart)
router.delete("/remove", authAccess, removeItemsFromCart)
router.get("/getMyCart", authAccess, getMyCart)

export default router;