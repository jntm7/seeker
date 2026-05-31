import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrisma() {
  const url = process.env["DATABASE_URL"]
  if (!url) {
    throw new Error("DATABASE_URL is required")
  }
  const adapter = new PrismaLibSql({ url, authToken: process.env["DATABASE_AUTH_TOKEN"] })
  return new PrismaClient({ adapter })
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrisma()
  }
  return globalForPrisma.prisma
}
