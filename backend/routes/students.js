const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Add a student
router.post("/", async (req, res) => {
  const { name, email, address } = req.body;

  if (!name || !email || !address) {
    return res
      .status(400)
      .json({ error: "Please provide the required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO students (name, email, address) VALUES ($1, $2, $3) RETURNING *",
      [name, email, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error adding student");
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error retrieving students");
  }
});

// Get student by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error retrieving data");
  }
});

module.exports = router;
