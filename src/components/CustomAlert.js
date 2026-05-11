import { useState, useEffect } from "react";

export default function CustomAlert({ message, isOpen, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        border: "1px solid #E2E8F0"
      }}>
        <h3 style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#2D3494",
          margin: "0 0 12px 0"
        }}>CampusCart</h3>
        <p style={{
          fontSize: "15px",
          color: "#1E293B",
          margin: "0 0 20px 0",
          lineHeight: 1.5
        }}>{message}</p>
        <button
          onClick={() => { setVisible(false); onClose(); }}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2D3494",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}