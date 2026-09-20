import { Router } from "express";
import { createNewOrder, getMyOrder, cancelOrder} from '../controllers/order.controller'
import {authacces} from '../middlewares/authAccess.middleware'

const router = Router()


router.post("/place", authacces, createNewOrder)
router.get("/getMy", authacces, getMyOrder)
router.cancelOrder("/cancel/:orderId", authacces, cancelOrder)


export default router