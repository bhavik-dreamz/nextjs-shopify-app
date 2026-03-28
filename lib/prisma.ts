import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set in environment to initialize Prisma");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient({ adapter } as any);
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
