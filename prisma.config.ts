import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env["DATABASE_URL"];
const prismaUrl = dbUrl?.startsWith("libsql://") ? "file:./dev.db" : dbUrl;

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
