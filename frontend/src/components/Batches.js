import React, { useState, useEffect } from "react";

function Batches() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/batches")
      .then((res) => res.json())
      .then((data) => setBatches(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="batches-list">
      <h3>Available Batches</h3>
      {batches.length === 0 ? (
        <p>No batches available</p>
      ) : (
        <ul>
          {batches.map((batch) => (
            <li key={batch.batch_id}>
              {batch.batch_name} - {batch.timing}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Batches;
