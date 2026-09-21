import { Router } from "express";
import { createNewOrder, getMyOrder, cancelOrder} from '../controllers/order.controller.js'
import { authAccess } from '../middlewares/authAccess.middleware.js'

const router = Router()


router.post("/place", authAccess, createNewOrder)
router.get("/getMy", authAccess, getMyOrder)
router.patch("/cancel/:orderId", authAccess, cancelOrder)



export default router

