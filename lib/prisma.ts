import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set in environment to initialize Prisma");
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter } as any);
}

/**
 * Lazy singleton — the Prisma client is only created on the first DB access,
 * not at module import time. This prevents module-level throws (which cause
 * Vercel serverless functions to fail to register the route and return 404)
 * when DATABASE_URL is missing at cold-start.
 */
function getPrisma(): PrismaClient {
  if (!global.prisma) {
    global.prisma = createClient();
  }
  return global.prisma;
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

export default prisma;
