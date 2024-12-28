import React, { useState, useEffect } from "react";

function Register() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [message, setMessage] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch batches from the backend
  useEffect(() => {
    fetch("http://localhost:5001/batches")
      .then((res) => res.json())
      .then((data) => setBatches(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form submission to register and pay
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBatch || !amountPaid) {
      setMessage("Please select a batch and provide the payment amount.");
      return;
    }

    const studentId = 1; // example student ID, should be dynamic (e.g., from logged-in user)
    const batchId = selectedBatch;

    try {
      const response = await fetch("http://localhost:5001/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          batch_id: batchId,
          amount_paid: amountPaid,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPaymentSuccess(true);
        setMessage(
          `Payment successful! You are registered for the batch: ${data.batch_id}`
        );
      } else {
        const error = await response.json();
        setIsPaymentSuccess(false);
        setMessage(error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsPaymentSuccess(false);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register for Gym Batch</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Select Batch:</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            required
          >
            <option value="">Select a batch</option>
            {batches.map((batch) => (
              <option key={batch.batch_id} value={batch.batch_id}>
                {batch.batch_name} - {batch.timing}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Amount Paid:</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            required
            min="0"
          />
        </div>

        <button type="submit">Register & Pay</button>
      </form>

      {message && (
        <div className={isPaymentSuccess ? "success-message" : "error-message"}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Register;
