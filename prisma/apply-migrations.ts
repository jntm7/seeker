import { createClient } from "@libsql/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const url = process.env["DATABASE_URL"];
const authToken = process.env["DATABASE_AUTH_TOKEN"];

if (!url) {
  console.warn("DATABASE_URL is not set. Skipping migration application.");
  process.exit(0);
}

const db = createClient({ url, authToken });

async function applyMigrations() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS _prisma_migrations (
      id VARCHAR(36) PRIMARY KEY,
      checksum VARCHAR(64) NOT NULL,
      finished_at BIGINT,
      migration_name VARCHAR(255) NOT NULL,
      logs TEXT,
      rolled_back_at BIGINT,
      started_at BIGINT NOT NULL,
      applied_steps_count INTEGER NOT NULL
    );
  `);

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.log("No migrations directory found. Nothing to apply.");
    return;
  }

  const folders = fs
    .readdirSync(migrationsDir)
    .filter((name) => fs.statSync(path.join(migrationsDir, name)).isDirectory())
    .sort();

  for (const folder of folders) {
    const sqlPath = path.join(migrationsDir, folder, "migration.sql");
    if (!fs.existsSync(sqlPath)) continue;

    const already = await db.execute({
      sql: "SELECT migration_name FROM _prisma_migrations WHERE migration_name = ?",
      args: [folder],
    });
    if (already.rows.length > 0) {
      console.log(`↳ ${folder} already applied, skipping.`);
      continue;
    }

    const sql = fs.readFileSync(sqlPath, "utf8");
    const checksum = crypto.createHash("sha256").update(sql).digest("hex");
    const startedAt = Date.now();

    console.log(`Applying ${folder}...`);
    const tx = await db.transaction("write");
    try {
      await tx.executeMultiple(sql);
      await tx.execute({
        sql: `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
              VALUES (?, ?, ?, ?, NULL, NULL, ?, 1)`,
        args: [crypto.randomUUID(), checksum, Date.now(), folder, startedAt],
      });
      await tx.commit();
      console.log(`✓ Applied ${folder}`);
    } catch (err) {
      await tx.rollback();
      console.error(`✗ Failed to apply ${folder}`, err);
      throw err;
    }
  }

  console.log("Migrations are up to date.");
}

applyMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
