import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from '../db/dbConnect.js'
import { application } from "express";
import { parse } from "dotenv";

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
                    status: true,
                    paymentStatus: true
                }
            }
        }
    })
    if (!newOrders) throw new ApiError(500, "Error occured while fetching my new orders!")
    res.status(200).json({ message: "My orders", orders: newOrders })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId
    if (!orderId) throw new ApiError(400, "Order Id is missing!")

    const { newStatus } = req.body
    if (!newStatus) throw new ApiError(401, "New Status is required!")
    const isMyOrder = await prisma.order.findFirst({
        where: {
            id: parseInt(orderId),
            // orderItems is an array(an order contains cmany order items),we cant jsut fiter the many item directl as we do for single realtion, so we use some for that
            orderItems: {
                some: {
                    product: {
                        sellerId: req.user.id
                    }
                }
            }
        }
    })
    console.log("HI")
    if (!isMyOrder || isMyOrder.length === 0) throw new ApiError(404, "Order not found!")

    const updatingOrder = await prisma.order.update({
        where: {
            id: parseInt(orderId)
        },
        data: {
            status: newStatus
        }
    })
    if (!updatingOrder) throw new ApiError(500, "Error occured while updating the order")

    res.status(200).json({ message: "Order Status Updated", updatingOrder })
})

export const updatePaymentStatus = asyncHandler(async(req, res) => {
    const orderId = req.params.orderId
    if(!orderId) throw new ApiError(400, "Order Id missing!")
    
    const { newPayStatus } = req.body
    if(!newPayStatus) throw new ApiError(400, "New Payment status is missing!")

    const userId = req.user.id
    const orderExistAndPayed = await prisma.order.findFirst({
        where: {
            id: parseInt(orderId),
            orderItems: {
                some: {
                    product: {
                        sellerId: userId
                    }
                }
            }
        },
       
    })

    if(!orderExistAndPayed) throw new ApiError(401, "Order doesn't exist!")
    if(orderExistAndPayed.status === newPayStatus) throw new ApiError(409, `Payment is already in ${orderExistAndPayed.status} state`)

    const updatePaymentStatus = await prisma.order.update({
        where: {
            id: parseInt(orderId)
        },
        data: {
            paymentStatus: newPayStatus
        }
    })
    if(!updatePaymentStatus) throw new ApiError(500, "Error occured while updating the payment status!")

    res.status(200).json({message: "Order payement status updated", updated_order:  updatePaymentStatus})
})