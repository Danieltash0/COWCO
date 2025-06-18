// src/pages/EditCattle.jsx
import React from "react";
import { useParams } from "react-router-dom";
import "../styles/pages.css";

export default function EditCattle() {
  const { id } = useParams();
  return (
    <div className="edit-cattle">
      <h2>Edit Cattle #{id}</h2>
      <form>
        <label>Name: <input type="text" /></label><br />
        <label>Breed: <input type="text" /></label><br />
        <label>Age: <input type="number" /></label><br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}