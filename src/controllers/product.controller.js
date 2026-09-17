import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js"
import fs from 'fs'
import { prisma } from "../db/dbConnect.js";
import { error } from "console";
import app from "../app.js";
// import { throwDeprecation, title } from "process";

export const uploadProduct = asyncHandler(async (req, res) => {
    const { title, description, stock, categoryId, price } = req.body
    if (!title) throw new ApiError(400, "Product Title is missing!")
    if (!description) throw new ApiError(400, "Product description is missing!")
    if (!stock) throw new ApiError(400, "Product stock is missing!")
    if (!categoryId) throw new ApiError(400, "Product categoryId is missing!")
    if (!price) throw new ApiError(400, "Product price is missing!")

    const userId = req.user.id
    if (!req.files || req.files.length === 0) throw new ApiError(400, "At least one product image is required!")

    const uploadedImages = []
    for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path)
        if (result) uploadedImages.push(result.secure_url)
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
    if (!upload) throw new ApiError(500, "Failed to upload Product!")
    res.status(201).json({ message: "Product Uploaded", upload })
})

export const updateProduct = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const productId = req.params.productId
    if (!productId) throw new ApiError(400, "Product Id is missing [Required for product update process!]")

    const { title, description, stock, price } = req.body

    const existProduct = await prisma.product.findFirst({
        where: {
            id: parseInt(productId)
        }
    })
    if (!existProduct) throw new ApiError(400, "Product doesn't exist! [Update not possible]")

    if (existProduct.sellerId !== userId) throw new ApiError(403, "You are not authorized to update this product!")

    // add to existing stock, but only if stock was actually provided
    const newStock = stock !== undefined ? existProduct.stock + stock : existProduct.stock
    const updateProductData = await prisma.product.update({
        where: {
            id: parseInt(productId),
            // sellerId: userId
        },
        data: {
            title,
            description,
            stock: newStock,
            price
        }
    })
    if (!updateProductData) throw new ApiError(500, "Couldn't update the product!")

    res.status(200).json({ message: "Product Updated", product: updateProductData })
})

export const replaceAllProductImages = asyncHandler(async (req, res) => {
    const { productId } = req.params

    if (!req.files || req.files.length === 0) throw new ApiError(400, "No images uploaded!")

    const newImageUrls = []
    for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path)
        if (result) newImageUrls.push(result.secure_url)
    }

    const updatedProduct = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
            prodImages: newImageUrls   // no spread, no existing images — just overwrite entirely
        }
    })

    res.status(200).json({ message: "Product images replaced", product: updatedProduct })
})

export const addProductImage = asyncHandler(async (req, res) => {
    const productId = req.params.productId
    const userId = req.user.id
    if (!req.files || req.files.length === 0) throw new ApiError(400, "No image uploaded!")
    const localFilePath = req.file.path

    const existProduct = await prisma.product.findFirst({
        where: {
            id: parseInt(productId)
        }
    })

    const newImageUrls = []
    for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path)
        if (result) newImageUrls.push(result.secure_url)
    }

    const updateImageOfProduct = await prisma.product.update({

        where: {
            id: parseInt(productId),
        },
        data: {
            prodImages: [...existProduct.prodImages, ...newImageUrls]
        }
    })
    if (!updateImageOfProduct) throw new ApiError(500, "Failed upload new images")
    res.status(200).json({ message: "Product Images updated successfully", product: updateImageOfProduct })
})

// to update specific image
/*
export const replaceOneProductImage = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { oldImageUrl } = req.body   // client tells you WHICH image to replace

    if (!req.file) throw new ApiError(400, "No image uploaded!")

    const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
    })
    if (!existingProduct) throw new ApiError(404, "Product not found")

    const uploadResult = await uploadOnCloudinary(req.file.path)
    if (!uploadResult) throw new ApiError(500, "Upload failed")

    const updatedImages = existingProduct.prodImages.map((url) =>
        url === oldImageUrl ? uploadResult.secure_url : url
    )

    const updatedProduct = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { prodImages: updatedImages }
    })

    res.status(200).json({ message: "Image replaced", product: updatedProduct })
})
*/


export const getMyProducts = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const allProducts = await prisma.Product.findMany({
        where: {
            sellerId: userId,
        }
    })
    if (!allProducts) throw new ApiError(204, "No products listed")
    res.status(200).json({ AllProducts: allProducts })
})

export const getProducts = asyncHandler(async (req, res) => {
    const userId = req.params.id
    if (!userId) throw new ApiError(401, "User id missing")

    const isSeller = await prisma.User.findUnique({
        where: {
            id: parseInt(userId)
        }
    })
    if (isSeller.role != "Seller") throw new ApiError(400, "Not a seller")

    const allProducts = await prisma.Product.findMany({
        where: {
            sellerId: parseInt(userId)
        }
    })
    res.status(200).json({ AllProducts: allProducts })
})


export const seeProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id
    if (!productId) throw new ApiError(404, "Product id not found!")

    const product = await prisma.Product.findUnique({
        where: {
            id: parseInt(productId)
        }
    })
    res.status(200).json({ Product: product })
})

export const searchProduct = asyncHandler(async (req, res) => {
    const searchInput = req.query
    if (!searchInput) throw new ApiError(400, "No input to search!")

    const searchResult = await prisma.Product.findMany({
        where: {
            title: searchInput,
            mode: 'insensitive' //makes search case insensitive!
        }
    })

    res.status(200).json({ Result: searchResult })
})

export const listProductsByCategory = asyncHandler(async (req, res) => {
    const incomingCategoryId = req.params.categoryId
    if (!incomingCategoryId) throw new ApiError(400, "No Categoryid to list Products")

    const result = await prisma.Product.findMan({
        where: {
            categoryId: incomingCategoryId
        }
    })

    res.status(200).json({ result })
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId
    const userId = req.user.id

    const deleteProduct = await prisma.product.delete({
        where: {
            id: req.isOwner.id,
            sellerId: req.isOwner.sellerId
        }
    })
    if (!deleteProduct) throw new ApiError(500, "Couldn't delete the product")
    res.status(204).json({ message: "Product Deleted" })
})

