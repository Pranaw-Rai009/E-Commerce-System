import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import { createCartItem } from './cartItem.controller.js'

export const createMyCart = async(id) => {
    const userId = id
    return await prisma.Cart.create({
        data: {
            userId: id
        }
    })
}

export const openMyCart = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const myCart = await prisma.Cart.findUnique({
        where: {
            userId: userId
        }
    })
    res.status(200).json({MyCart: myCart})
})

export const addToCart = asyncHandler(async(req, res) => {
    const productId = req.params.id
    if(!productId) throw new ApiError(400, "Invalid add to cart request!")
    
    const {productQuantity = 1} = req.query
    const userId = req.user.id
    const userCart = await prisma.cart.findUnique({
        where: {
            userId
        }
    })
    if(!userCart) throw new ApiError(404, "Cart not found for the user!")
    const addInCart = await createCartItem(parseInt(productQuantity), parseInt(productId), userCart.id)
    
    if(!addInCart) throw new ApiError(500, "Failed adding item to  cart!")
    res.status(200).json({Cart: addInCart})
})