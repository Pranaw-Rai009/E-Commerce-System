import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import createOrderItem from "../controllers/cartItem.controller.js"

export const createNewOrder = asyncHandler(async (req, res) => {

    const cartItemsIds = req.body  //receiving the cartItems inthe form or array
    if (cartItemsIds.length === 0 || !cartItemsIds) throw new ApiError(400, "No items selected")

    const userData = await prisma.user.findFirst({
        where: {
            io: req.user.id
        }
    })

    const orderDetailsPromises = cartItemsIds.map(async (itemId) => {
        return await prisma.cartItems.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: req.user.id
                }
            },
            include: {
                product: {
                    select: {
                        price: true
                    }
                }
            }
        })
    })
    const orderDetail = await Promise.all(orderDetailsPromises)

    const forEachOrder = orderDetails.map(async (order1) => {
        const subTotalPrice = order1.quantity * order1.product.price
        const deliveryCharge = subTotalPrice >= 10000 ? 0 : 130
        return { subTotalPrice, deliveryCharge }
    })

    let subTotal = 0
    let deliveryCharge = 0
    for (const item of forEachOrder) {
        subTotal += item.subTotalPrice
        deliveryCharge += item.deliveryCharge
    }
    const totalAmount = subtotal + deliveryCharge

    const newOrder = await prisma.order.create({
        data: {
            userId: req.user.id,
            deliveryCharge,
            subTotal,
            totalAmount,
            shippingAddress: userData.shippingAddress,
        }
    })
    if(!newOrder) throw new ApiError(500, "Error occured while creating product!")
    res.status(201).json(newOrder)
})