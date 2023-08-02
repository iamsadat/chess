const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(dbConfig);

pool.on("connect", () => {
  console.log("Connected to the db");
});

pool.on("error", (err) => {
  console.log("Error", err);
  process.exit(-1);
});

const app = express();

app.get("/api/games", async (req, res) => {
  try {
    const client = await pool.connect();

    const result = await client.query("SELECT * FROM games");

    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "An error occurred", message: err.message });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
