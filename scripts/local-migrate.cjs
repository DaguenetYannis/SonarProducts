/* eslint-disable @typescript-eslint/no-require-imports */
const { mkdirSync, readFileSync, rmSync } = require("node:fs");
const { dirname, join } = require("node:path");
const Database = require("better-sqlite3");

const reset = process.argv.includes("--reset");
const dbPath = join(process.cwd(), "prisma", "dev.db");
const migrationPath = join(process.cwd(), "prisma", "migrations", "20260724000000_initial", "migration.sql");

if (reset) {
  rmSync(dbPath, { force: true });
  rmSync(`${dbPath}-journal`, { force: true });
}

mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.exec("CREATE TABLE IF NOT EXISTS _prisma_migrations (id TEXT NOT NULL PRIMARY KEY, migration_name TEXT NOT NULL, finished_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)");

const migrationName = "20260724000000_initial";
const alreadyApplied = db.prepare("SELECT id FROM _prisma_migrations WHERE migration_name = ?").get(migrationName);

if (!alreadyApplied) {
  const sql = readFileSync(migrationPath, "utf8");
  db.transaction(() => {
    db.exec(sql);
    db.prepare("INSERT INTO _prisma_migrations (id, migration_name) VALUES (?, ?)").run(migrationName, migrationName);
  })();
  console.log(`Applied migration ${migrationName}.`);
} else {
  console.log("No pending migrations.");
}

db.close();
