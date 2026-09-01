import { error } from "node:console";
import { stat } from "node:fs";

class ApiError extends error {
    constructor(statusCode, message, errors = []) {
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.errors = errors
        this.success = false
        this.data = null
    }
}

export default ApiError