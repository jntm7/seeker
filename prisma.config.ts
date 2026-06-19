import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env["DATABASE_URL"];
const isVercel = process.env["VERCEL"] === "1";
const bypassOverride = process.env["PRISMA_REMOTE"] === "true";
const prismaUrl = !bypassOverride && !isVercel && dbUrl?.startsWith("libsql://") ? "file:./dev.db" : dbUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: prismaUrl,
  },
});
