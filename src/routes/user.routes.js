import { Router } from 'express'
import { userRegister, getAllSeller, getAllCustomer } from '../controllers/user.controller.js'
import { loginUser } from '../controllers/login.controller.js'
import { refreshAccessToken } from '../controllers/refreshAccessToken.controller.js'
const router = Router()

router.post("/register", userRegister)
router.post("/login", loginUser)
router.post("/refreshAccessToken", refreshAccessToken)
router.get("/allSellers/:role", getAllSeller)
router.get("/allCustomers/:role", getAllCustomer)

export default router