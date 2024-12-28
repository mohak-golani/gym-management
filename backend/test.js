const { pool } = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("error executing", err.stack);
  } else {
    console.log("Database connected. Server time is:", res.rows[0].now);
  }
  pool.end();
});
