import { Router } from "express";
import { uploadProduct, getMyProducts, getProducts, seeProduct, searchProduct, listProductsByCategory, updateProduct } from "../controllers/product.controller.js";
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isSeller } from "../middlewares/isSeller.middleware.js"
const router = Router()

router.post("/upload", authAccess, isSeller, upload.array("prodImages", 3), uploadProduct)
router.patch("/update/:productId", authAccess, isSeller, updateProduct)
router.get("/getMy", authAccess, isSeller, getMyProducts)
router.get("/getSellerProducts/:id", getProducts)
router.get("/seeProduct/:id", seeProduct)
router.get("/search", searchProduct)
router.get("/searchCategory/:categoryId", listProductsByCategory)

export default router