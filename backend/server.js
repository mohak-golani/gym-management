const express = require("express");
const pool = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const studentsRoutes = require("./routes/students");
const app = express();
const paymentsRoutes = require("./routes/payments");
const batchesRoutes = require("./routes/batches");

//middleware
app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/students", studentsRoutes);
app.use("/payments", paymentsRoutes);
app.use("/batches", batchesRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
