import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const createOrderItem = async (cartItemIds, cartId, userId, orderId) => {
    if (cartItemsIds.length === 0 || !cartItemsIds) throw new ApiError(400, "No items id's to create cartItems [Creating order items!]")

    const allItems = cartItemIds.map(async(itemId) => {
        return await prisma.cartItems.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId
                }
            },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        sellerId: true,
                        price: true
                    }
                }
            }
        })
    })

    const result = await Promise.all(allItems)
    if(!result) throw new ApiError(500, "Error occured while extracting cartItems detail to create orderItems")

    // Creating the snapshot of the items

    const newOrderItems = result.map(async(item) => {
        // const totalPrice = item.quantity * item.product.price

        return await prisma.orderItems.create({
            data: {
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
                orderId
            }
        })
    })

    const newOrders = await Promise.all(newOrderItems)
    if(!newOrders) throw new ApiError(500, "Error occured while creating order items")
    return { newOrders }
    
}
