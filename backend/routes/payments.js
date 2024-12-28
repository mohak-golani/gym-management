const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Add a payment (student registers for a batch)
router.post("/", async (req, res) => {
  const { name, email, batch_id, amount_paid, address = "" } = req.body;

  if (!email || !name || !batch_id || !amount_paid) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    // Check if the student is already registered for a batch this month
    const existingStudent = await pool.query(
      `SELECT * FROM students
       WHERE email = $1
     `,
      [email]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({
        error: "Student is already registered for a batch this month.",
      });
    }

    // Create Student
    const studentRes = await pool.query(
      "INSERT INTO students (name, email, address) VALUES ($1, $2, $3) RETURNING *",
      [name, email, address]
    );

    const student = studentRes.rows[0];
    console.log("student", student, studentRes);

    // Register the student and create the payment record
    const result = await pool.query(
      "INSERT INTO payments (student_id, batch_id, amount_paid) VALUES ($1, $2, $3) RETURNING *",
      [student.student_id, batch_id, amount_paid]
    );

    // Successfully added payment and registration
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error processing payment");
  }
});

// Get payment history for a specific student
router.get("/:student_id", async (req, res) => {
  const { student_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM payments WHERE student_id = $1",
      [student_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No payments found" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error retrieving payments");
  }
});

// Allow batch change after a month (new route)
router.put("/change-batch", async (req, res) => {
  const { student_id, new_batch_id } = req.body;

  if (!student_id || !new_batch_id) {
    return res
      .status(400)
      .json({ error: "Student ID and new batch ID are required." });
  }

  try {
    // Check if the student has already registered in the current month
    const registration = await pool.query(
      "SELECT * FROM payments WHERE student_id = $1 AND DATE(payment_date) >= DATE_TRUNC('month', CURRENT_DATE)",
      [student_id]
    );

    if (registration.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "No active registration found for this student." });
    }

    // Allow batch change only if it's after the current month
    const lastRegistrationDate = registration.rows[0].payment_date;

    if (new Date(lastRegistrationDate).getMonth() === new Date().getMonth()) {
      return res.status(400).json({
        error: "You can only change your batch after this month.",
      });
    }

    // Update the batch for the student
    const updateBatch = await pool.query(
      "UPDATE payments SET batch_id = $1 WHERE student_id = $2 RETURNING *",
      [new_batch_id, student_id]
    );

    if (updateBatch.rows.length === 0) {
      return res.status(404).json({ error: "Student payment not found." });
    }

    res.json({
      message: "Batch successfully changed.",
      updatedPayment: updateBatch.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error processing batch change");
  }
});

module.exports = router;
