import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrisma() {
  const url = process.env["DATABASE_URL"]
  if (!url) {
    if (process.env.DEMO_MODE === "true") return undefined as unknown as PrismaClient
    throw new Error("DATABASE_URL is required")
  }
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
