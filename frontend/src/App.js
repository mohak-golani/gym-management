import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Batches from "./components/Batches";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Gym Registration System</h1>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/batches" element={<Batches />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
