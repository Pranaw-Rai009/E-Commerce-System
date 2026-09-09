import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js"
import fs from 'fs'
import { prisma } from "../db/dbConnect.js";
import { error } from "console";
import app from "../app.js";

export const uploadProduct = asyncHandler(async(req, res) => {
    const { title, description, stock, categoryId, price } = req.body
    if(!title) throw new ApiError(400, "Product Title is missing!")
    if(!description) throw new ApiError(400, "Product description is missing!")
    if(!stock) throw new ApiError(400, "Product stock is missing!")
    if(!categoryId) throw new ApiError(400, "Product categoryId is missing!")
    if(!price) throw new ApiError(400, "Product price is missing!")
    
    const userId = req.user.id
    if(!req.files || req.files.length === 0) throw new ApiError(400, "At least one product image is required!")
    
    const uploadedImages = []
    for(const file of req.files) {
        const result = await uploadOnCloudinary(file.path)
        if(result) uploadedImages.push(result.secure_url)
    }

    const upload = await prisma.Product.create({
        data: {
            title,
            prodImages: uploadedImages,
            description,
            // form-data ALWAYS sends text fields as PLAIN STRINGS, even for NUMBERS — unlike JSON, which preserves TYPES. Prisma expects price to be a REAL number (Float), so you MUST manually convert these STRING values before passing them to Prisma, or you'll get a TYPE error.
            stock: parseInt(stock),
            price: parseFloat(price),
            categoryId: parseInt(categoryId),
            sellerId: userId,

        }
    })
    if(!upload) throw new ApiError(500, "Failed to upload Product!")
    res.status(201).json({message: "Product Uploaded", upload})
})

export const getMyProducts = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const userRole = req.user.role
    if(userRole != "Seller") throw new ApiError(403, "You are not a seller!")
    
    const allProducts = await prisma.Product.findMany({
        where: {
            sellerId: userId,
        }
    })
    if(!allProducts) throw new ApiError(204, "No products listed")
    res.status(200).json({AllProducts: allProducts})
})

export const getProducts = asyncHandler(async(req, res) => {
    const userId = req.params.id
    if(!userId) throw new ApiError(401, "User id missing")
    
    const isSeller = await prisma.User.findUnique({
        where: {
            id: parseInt(userId)
        }
    })
    if(isSeller.role != "Seller") throw new ApiError(400, "Not a seller")
    
    const allProducts = await prisma.Product.findMany({
        where: {
            sellerId: parseInt(userId)
        }
    })
    res.status(200).json({AllProducts: allProducts})
})

