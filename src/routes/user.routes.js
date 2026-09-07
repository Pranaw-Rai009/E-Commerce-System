import { Router } from 'express'
import { userRegister, getAllSeller, getAllCustomer } from '../controllers/user.controller.js'

const router = Router()

router.post("/register", userRegister)
router.get("/allSellers/:role", getAllSeller)
router.get("/allCustomers/:role", getAllCustomer)
export default router