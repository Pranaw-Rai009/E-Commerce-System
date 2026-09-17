import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";

export const isSeller = asyncHandler(async(req, res) => {
    const role = req.user.role
    if(role !== "Seller") throw new ApiError(403, "Not a Seller, UnAuthenticated")
    next()
})