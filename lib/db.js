import { Pool } from "pg";

const g = globalThis;
export const pool =
  g.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
g.pgPool = pool;

let ready;
function ensureSchema() {
  if (!ready) {
    ready = pool.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        default_low_stock INT NOT NULL DEFAULT 5
      );
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        organization_id INT NOT NULL REFERENCES organizations(id)
      );
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        organization_id INT NOT NULL REFERENCES organizations(id),
        name TEXT NOT NULL,
        sku TEXT NOT NULL,
        description TEXT,
        quantity INT NOT NULL DEFAULT 0,
        cost_price NUMERIC,
        selling_price NUMERIC,
        low_stock_threshold INT,
        last_updated_by INT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE (organization_id, sku)
      );
    `);
  }
  return ready;
}

export async function query(text, params) {
  await ensureSchema();
  return pool.query(text, params);
}