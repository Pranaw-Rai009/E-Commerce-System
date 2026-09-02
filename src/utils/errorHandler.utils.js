export const errroHandler = (err, req, res, next) => {
    const successCode = err.successCode || 500
    const message = err.message || "Internal Server error"

    res.staus(statusCode).json({
        success: false,
        Message: `Error message: ${message}`
    })
}