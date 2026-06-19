import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env["DATABASE_URL"];
const isVercel = process.env["VERCEL"] === "1";
const bypassOverride = process.env["PRISMA_REMOTE"] === "true";

let prismaUrl = dbUrl;
if (!prismaUrl) {
  prismaUrl = "file:./dev.db";
} else if (!bypassOverride && !isVercel && prismaUrl.startsWith("libsql://")) {
  prismaUrl = "file:./dev.db";
}

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
