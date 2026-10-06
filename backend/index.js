const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const { Pool } = require("pg");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password123",
  database: process.env.DB_NAME || "test_db",
});

app.use(cors());
app.use(express.json());

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);
  const res = await pool.query("SELECT COUNT(*) FROM items");
  if (Number.parseInt(res.rows[0].count, 10) === 0) {
    await pool.query(
      "INSERT INTO items (name) VALUES ('Starter Item A'), ('Starter Item B')"
    );
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/items", async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM items ORDER BY id ASC");
    res.json(result.rows);
  } catch (_err) {
    res.status(500).json({ error: "Failed to load items." });
  }
});

app.post("/api/items", async (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Item name is required." });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (name) VALUES ($1) RETURNING id, name",
      [name.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (_err) {
    res.status(500).json({ error: "Failed to add item." });
  }
});

async function start() {
  await initDb();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on port ${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend", err);
  process.exit(1);
});
