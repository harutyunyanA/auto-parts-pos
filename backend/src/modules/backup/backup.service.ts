import path from "path";
import fs from "fs";
import mysql from "mysql2";
import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/db.ts";
import env from "../../config/env.ts";

const BACKUP_DIR = path.resolve(process.cwd(), "dbBackups");
const KEEP = 30;

export async function createBackup(): Promise<string> {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const tableRows = await sequelize.query<Record<string, string>>("SHOW TABLES", {
    type: QueryTypes.SELECT,
  });
  const tables = tableRows.map((row) => Object.values(row)[0]);

  const parts: string[] = [
    `-- Backup of ${env.DB_NAME} — ${new Date().toISOString()}`,
    "SET FOREIGN_KEY_CHECKS=0;",
    "",
  ];

  for (const table of tables) {
    const createRows = await sequelize.query<Record<string, string>>(
      `SHOW CREATE TABLE \`${table}\``,
      { type: QueryTypes.SELECT },
    );
    const createSql = createRows[0]["Create Table"] ?? createRows[0]["Create View"];
    parts.push(`DROP TABLE IF EXISTS \`${table}\`;`, `${createSql};`, "");

    const rows = await sequelize.query<Record<string, unknown>>(
      `SELECT * FROM \`${table}\``,
      { type: QueryTypes.SELECT },
    );
    if (rows.length > 0) {
      const columns = Object.keys(rows[0])
        .map((c) => `\`${c}\``)
        .join(", ");
      for (const row of rows) {
        const values = Object.values(row)
          .map((v) => mysql.escape(v))
          .join(", ");
        parts.push(`INSERT INTO \`${table}\` (${columns}) VALUES (${values});`);
      }
      parts.push("");
    }
  }

  parts.push("SET FOREIGN_KEY_CHECKS=1;");

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(BACKUP_DIR, `${env.DB_NAME}_${stamp}.sql`);
  fs.writeFileSync(file, parts.join("\n"), "utf8");

  rotateBackups();
  return file;
}

function rotateBackups(): void {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".sql"))
    .map((f) => ({ f, t: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  for (const { f } of files.slice(KEEP)) {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
  }
}
