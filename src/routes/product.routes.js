import { Router } from "express";
import { uploadProduct } from "../controllers/product.controller.js";
import { authAccess } from "../middlewares/authAccess.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.post("/upload", authAccess, upload.array("prodImages", 3),uploadProduct)

export default router