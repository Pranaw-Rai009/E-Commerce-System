import dotenv from 'dotenv'
import { PrismaClient } from '../generated/prisma/client.ts' //Prisma Client is an auto-generated, type-safe query builder for Node.js, Bun, and Deno applications that lets you talk to your database using ordinary code
// it makes its OWN, SEPARATE connection to Postgres, at RUNTIME, using the SAME DATABASE_URL — but through YOUR APPLICATION code directly

import {PrismaPg} from '@prisma/adapter-pg' //A driver adapter = in Prisma it is a small TypeScript package that acts as a translator between Prisma Client and a JavaScript database driver

dotenv.config({
    path: './.env'
})

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({adapter})