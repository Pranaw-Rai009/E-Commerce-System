import { prisma } from "../db/dbConnect.js";

const cleanup = async () => {
    const deletedItems = await prisma.orderItems.deleteMany({})
    console.log(`Deleted ${deletedItems.count} order items`)

    const deletedOrders = await prisma.order.deleteMany({})
    console.log(`Deleted ${deletedOrders.count} orders`)

    process.exit(0)
}

cleanup()