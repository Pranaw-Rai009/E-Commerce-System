import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from '../db/dbConnect.js'

export const getMeAllMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.userId
    const newOrders = await prisma.orderItems.findMany({
        where: {
            product: {
                sellerId: userId
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                }
            },
            order: {
                select: {
                    id: true,
                    userId: true,
                    createdAt: true,
                    status: true
                }
            }
        }
    })
    if (!newOrders) throw new ApiError(500, "Error occured while fetching my new orders!")
    res.status(200).json({ message: "My orders", orders: newOrders })
})

export const updateOrderStatus = asyncHandler(async(req, res) => {
    const orderId = req.params.orderId
    if(!orderId) throw new ApiError(400, "Order Id is missing!")
    
    const { newStatus } = req.body
    if(!newStatus) throw new ApiError(401, "New Status is required!")
    
    const isMyOrder = await prisma.order.findMany({
        where: {
            id: orderId,
            orderItems: {
                product: {
                    sellerId: req.user.id
                }
            }
        }
    })
    if(!isMyOrder || isMyOrder.length === 0) throw new ApiError(404, "Order not found!")
    
    const updatingOrder = await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status: newStatus
        }
    })
    if(!updatingOrder) throw new ApiError(500, "Error occured while updating the order")
    
    res.status(200).json({message: "Order Status Updated", updatingOrder})
})

// export const 