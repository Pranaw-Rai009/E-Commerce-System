import { Router } from "express";
import { createCategory, getAllCategory } from '../controllers/category.controller.js'
import { authAccess } from '../middlewares/authAccess.middleware.js'
const router = Router()

router.post("/create", authAccess, createCategory)
router.get("/allCategory", getAllCategory)

export default router