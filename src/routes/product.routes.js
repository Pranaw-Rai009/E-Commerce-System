import { Router } from "express";
import { uploadProduct, getMyProducts, getSellerProducts, seeProduct, searchProduct, listProductsByCategory, updateProduct, replaceAllProductImages, deleteProductImage, addProductImage, deleteProduct } from "../controllers/product.controller.js";
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isSeller } from "../middlewares/isSeller.middleware.js"
import { isProductOwner } from "../middlewares/isProductOwner.middleware.js"
const router = Router()

router.post("/upload", authAccess, isSeller, upload.array("prodImages", 3), uploadProduct)
router.patch("/update/:productId", authAccess, isSeller, updateProduct)
router.get("/getMy", authAccess, isSeller, getMyProducts)
router.put("/replaceAllImages/:productId", authAccess, isSeller, isProductOwner, upload.array("prodImages", 3), replaceAllProductImages)
router.patch("/addImage/:productId", authAccess, isSeller, isProductOwner, upload.array("prodImages", 3), addProductImage)
router.delete("/deleteImage/:productId", authAccess, isSeller, isProductOwner, deleteProductImage)
router.get("/getSellerProducts/:id", getSellerProducts)
router.get("/seeProduct/:id", seeProduct)
router.get("/search", searchProduct)
router.get("/searchCategory/:categoryId", listProductsByCategory)
router.delete("/delete/:productId", authAccess, isSeller, isProductOwner, deleteProduct)

export default router