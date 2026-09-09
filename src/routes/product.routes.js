import { Router } from "express";
import { uploadProduct, getMyProducts, getProducts, seeProduct } from "../controllers/product.controller.js";
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.post("/upload", authAccess, upload.array("prodImages", 3), uploadProduct)
router.get("/getMy", authAccess, getMyProducts)
router.get("/getSellerProducts/:id", getProducts)
router.get("/seeProduct/:id", seeProduct)
export default router