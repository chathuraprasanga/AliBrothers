import type Database from 'better-sqlite3'
import migration001 from './migrations/001_initial_schema.sql?raw'
import migration002 from './migrations/002_seed_product_types.sql?raw'

const MIGRATIONS: Array<{ version: number; sql: string }> = [
  { version: 1, sql: migration001 },
  { version: 2, sql: migration002 }
]

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  const appliedVersions = new Set(
    db.prepare('SELECT version FROM schema_migrations').all().map((row) => (row as { version: number }).version)
  )

  for (const migration of MIGRATIONS) {
    if (appliedVersions.has(migration.version)) continue

    const applyMigration = db.transaction(() => {
      db.exec(migration.sql)
      db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(migration.version)
    })
    applyMigration()
  }
}
