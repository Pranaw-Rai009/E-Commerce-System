import { Router } from "express";
import { createCategory, getAllCategory, deleteCategory } from '../controllers/category.controller.js'
import { authAccess } from '../middlewares/authAccess.middleware.js'
import { isSeller } from "../middlewares/isSeller.middleware.js";
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
const router = Router()

router.post("/create", authAccess, isAdmin, createCategory)
router.get("/allCategory", getAllCategory)
router.delete("/delete/:categoryId", authAccess, isAdmin, deleteCategory)

export default router