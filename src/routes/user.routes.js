import { Router } from 'express'
import { userRegister, getAllSeller, getAllCustomer, updateUser, updatePassword, updateProfilePic } from '../controllers/user.controller.js'
import { loginUser } from '../controllers/login.controller.js'
import { refreshAccessToken } from '../controllers/refreshAccessToken.controller.js'
import { authAccess } from '../middlewares/authAccess.middleare.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = Router()

router.post("/register", userRegister)
router.post("/login", loginUser)
router.post("/refreshAccessToken", refreshAccessToken)
router.post("/update", authAccess, updateUser)
router.post("/updatePassword", authAccess, updatePassword)
router.patch("/updateProfilePic", authAccess, upload.single("profilePic"), updateProfilePic)
router.get("/allSellers/:role", getAllSeller)
router.get("/allCustomers/:role", getAllCustomer)

export default router