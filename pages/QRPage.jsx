// src/pages/QRPage.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function QRPage() {
  const { id } = useParams();
  return (
    <div className="qr-page">
      <h2>QR Code for Cattle #{id}</h2>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?data=Cattle-${id}&size=150x150`} alt="QR Code" />
    </div>
  );
}
