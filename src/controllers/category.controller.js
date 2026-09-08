import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const createCategory = asyncHandler(async(req, res) => {
    const { title } = req.body
    if(!title) throw new ApiError(400, "Category title is required!")
    
    const newCategory = await prisma.Category.create({
        data: { title }
    })

    if(!newCategory) throw new ApiError(500, "Category creation failed!")
    res.status(201).json({message: "Category created successfully", NewCategory: newCategory})
})

export const getAllCategory = asyncHandler(async(req, res) => {
    const allCategory = await prisma.Category.findMany()
    if(!allCategory) throw new ApiError(500, "Error in finding category")
    res.status(200).json({AllCategory: allCategory})
})

