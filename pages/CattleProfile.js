// src/pages/CattleProfile.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

export default function CattleProfile() {
  const { id } = useParams();
  return (
    <div className="cattle-profile">
      <h2>Cattle Profile - #{id}</h2>
      <nav>
        <Link to={`/cattle/${id}/qr`}>View QR Code</Link>
        {/* Other tabs can be added */}
      </nav>
      <p>Details, medical, feeding and financial records go here.</p>
    </div>
  );
}
