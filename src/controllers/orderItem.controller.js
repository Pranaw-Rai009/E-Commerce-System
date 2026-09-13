import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const createOrderItem = async (cartItemIds, cartId, orderId) => {
    if (cartItemsIds.length === 0 || !cartItemsIds) throw new ApiError(400, "No items id's to create cartItems [Creating order items!]")

    const resutl = await Promise.all(
        // since have async on map it returns promises and doesnt wait for all to resolve so, insted we use prosmie.all to collect all promise and resolve if all map resutl resolves or else thro error
        cartItemIds.map(async (cartItemId) => {
            const item = await prisma.cartItems.findFirst({
                where: {
                    cartId,
                    id: cartItemId
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            sellerId: true,
                            prodImages: true,
                            price: true
                        }
                    }
                }
            })
        })
    )
    const productId = item.product.id
    const totalQuantity = item.quantity
    const totalPrice = item.quantity * item.product.price
    return await prisma.orderItems.create({
        data: {
            productId,
            quantity: totalQuantity,
            price: totalPrice,
            orderId
        }
    })
}
