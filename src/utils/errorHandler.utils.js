export const errroHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server error"

    res.status(statusCode).json({
        success: false,
        Message: `Error message: ${message}`
    })
}