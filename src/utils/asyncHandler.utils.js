export function asyncHandler(fn) {
    function wrapper(req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next) // .catch(err => next(err))
    }
    return wrapper
}