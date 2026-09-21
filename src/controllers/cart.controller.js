import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import { createCartItem } from './cartItem.controller.js'
import { title } from "node:process";

export const createMyCart = async (id) => {
    const userId = id
    return await prisma.Cart.create({
        data: {
            userId: id
        }
    })
}

// Function to just get my cart
export const getMyCart = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const myCart = await prisma.cart.findUnique({
        where: {
            userId: userId
        }
    })
    res.status(200).json({ MyCart: myCart })
})

export const addToCart = asyncHandler(async (req, res) => {
    const productId = req.params.productId
    if (!productId) throw new ApiError(400, "Invalid add to cart request!")

    const { productQuantity = 1 } = req.query
    const userId = req.user.id
    const userCart = await prisma.cart.findUnique({
        where: {
            userId
        }
    })
    
    // test code line
    // console.log(req.user)

    if (!userCart) throw new ApiError(404, "Cart not found for the user!")
    const addInCart = await createCartItem(parseInt(productQuantity), parseInt(productId), userCart.id)

    if (!addInCart) throw new ApiError(500, "Failed adding item to  cart!")
    res.status(200).json({ Cart: addInCart })
})

export const removeItemsFromCart = asyncHandler(async (req, res) => {
    // we will receive items ids from req.body in form or array : [int1, int2, ...]
    const { cartItemIds } = req.body
    if (!cartItemIds || cartItemIds.length === 0) throw new ApiError(400, "No products selected to remove!")
    const userCart = await prisma.cart.findUnique({
        where: {
            userId: req.user.id
        }
    })

    await prisma.cartItems.deleteMany({
        where: {
            id: { in: cartItemIds },
            cartId: parseInt(userCart.id)
        }
    })
    res.status(200).json({ message: "Removed from cart" })
})

export const openMyCart = asyncHandler(async (req, res) => {
    const myId = req.user.id

    const showProduct = await prisma.cart.findUnique({
        where: { userId: myId },
        include: {
            cartItem: {
                select: {
                    id: true,
                    quantity: true,
                    product: {
                        select: {
                            id: true,
                            sellerId: true,
                            title: true,
                            prodImages: true,
                            price: true,
                        }
                    }
                }
            }
        }
    })
    if(!showProduct) throw new ApiError(404, "Cart not found")
    res.status(200).json(showProduct)
})

// Works on Order!
export const removeItemFromCartOnOrder = async(cartItemIds, userId) => {

    if(!cartItemIds) throw new ApiError(400, "No ordered items cartItem id provided")
    
    const myCart = await prisma.cart.findUnique({
        where: {
            userId: userId
        }
    })
    if(!myCart) throw new ApiError(500, "Cart doesn't exist!")
    
    const deleteCartItems = await prisma.cartItems.deleteMany({
        where: {
            cartId: myCart.id,
            id: {in: cartItemIds}
        }
    })
    return { message: "Items removed after order creation "}
}