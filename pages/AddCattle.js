// src/pages/AddCattle.jsx
import React from "react";
import "../styles/pages.css";

export default function AddCattle() {
  return (
    <div className="add-cattle">
      <h2>Add New Cattle</h2>
      <form>
        <label>Name: <input type="text" /></label><br />
        <label>Breed: <input type="text" /></label><br />
        <label>Age: <input type="number" /></label><br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
