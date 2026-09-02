import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import { errroHandler } from './utils/errorHandler.utils.js';




const app = express();

app.use(express.json())
app.use(cookieparser())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({urlencoded: "16kb", extended: true}))
app.use(express.json({limit: "16kb"}))
app.use(express.json({static: "Public"}))

app.use(errroHandler)
export default app