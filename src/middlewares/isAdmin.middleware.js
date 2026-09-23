import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";

export const isAdmin = asyncHandler(async(req, res, next) => {
    const userRole = req.user.role
    if(userRole !== "Admin") throw new ApiError(400, "Access Denied, [ NOT ADMIN ]")

    next()
})