const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// adding a batch
router.post("/", async (req, res) => {
  const { batch_name, timing } = req.body;

  if (!batch_name || !timing) {
    return res.status(400).json({ error: "provide batch name and timing" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO batches (batch_name, timing) VALUES ($1, $2) RETURNING *",
      [batch_name, timing]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("error adding batch");
  }
});

// all batches
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM batches");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("error retrieving batches");
  }
});

//updating a batch
router.put(":/id", async (req, res) => {
  const { id } = req.params;
  const { batch_name, timing } = req.body;

  try {
    const result = await pool.query(
      "UPDATE batches SET batch_name = $1, timing = $2 WHERE batch_id = $3 RETURNING *",
      [batch_name, timing, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "batch not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("error updating batch");
  }
});

//deleting a batch
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM batches WHERE batch_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "batch not found" });
    }
    res.json({ message: "batch deleted", batch: result.rows[0] });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("error deleting batch");
  }
});

module.exports = router;
