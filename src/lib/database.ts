import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client instance for development hot-reload support.
 * 
 * In development, Next.js/Vite hot-reload can cause multiple PrismaClient instances
 * to be created, which exhausts database connections. This singleton pattern ensures
 * only one instance exists across hot-reloads by storing it on the global object.
 * 
 * In production, a new instance is created for each deployment, which is the desired behavior.
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Configured Prisma Client instance with environment-specific logging.
 * 
 * Logging configuration:
 * - Development: Logs queries, errors, and warnings for debugging
 * - Production: Only logs errors to minimize performance impact
 * 
 * Connection pooling is handled automatically by Prisma based on DATABASE_URL
 * connection string parameters (e.g., connection_limit, pool_timeout).
 * 
 * @example
 * ```typescript
 * import { prisma } from './lib/database';
 * 
 * const users = await prisma.user.findMany();
 * const question = await prisma.question.findUnique({ where: { id: '123' } });
 * ```
 */
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

/**
 * Store the Prisma Client instance globally in non-production environments
 * to prevent multiple instances during hot-reload.
 */
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * Default export for convenience.
 * Allows both named and default imports:
 * - import { prisma } from './lib/database'
 * - import prisma from './lib/database'
 */
export default prisma;