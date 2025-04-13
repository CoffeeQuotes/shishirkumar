// lib/prisma.ts
import { PrismaClient, Prisma } from '../prisma/.prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
    // allow global `var` declarations
    // eslint-disable-next-line no-var
    var prisma: ReturnType<typeof PrismaClient.prototype.$extends> | PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma =
    global.prisma ||
    new PrismaClient({
        // Optional: Log Prisma queries in development
        // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
    }).$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;