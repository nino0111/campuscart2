import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar({ isOpen, onClose, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999
        }}
        onClick={onClose}
      />

      <div style={{
        position: 'fixed',
        top: 0,
        right: '0',
        width: '300px',
        height: '100vh',
        background: darkMode ? '#2c2c2c' : 'white',
        boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
        transition: 'right 0.3s ease',
        zIndex: 1000,
        padding: '30px',
        overflowY: 'auto'
      }}>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: darkMode ? 'white' : '#1c1e21'
          }}
        >
          ×
        </button>

        <div style={{ marginTop: '60px' }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px',
            borderRadius: '10px',
            background: darkMode ? '#3a3a3a' : '#f0f2f5',
            marginBottom: '10px'
          }}
          onClick={toggleDarkMode}
          >
            <span style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? 'white' : '#1c1e21' }}>
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
            <div style={{
              width: '45px',
              height: '25px',
              background: darkMode ? '#1877f2' : '#ccc',
              borderRadius: '25px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '3px',
                left: darkMode ? '26px' : '3px',
                width: '19px',
                height: '19px',
                background: 'white',
                borderRadius: '50%'
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderRadius: '10px',
            background: darkMode ? '#3a3a3a' : '#f0f2f5',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          onClick={() => { alert("Notifications"); onClose(); }}
          >
            <span style={{ fontSize: '18px', marginRight: '15px' }}>🔔</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? 'white' : '#1c1e21' }}>Notifications</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderRadius: '10px',
            background: darkMode ? '#3a3a3a' : '#f0f2f5',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          onClick={() => { alert("Settings"); onClose(); }}
          >
            <span style={{ fontSize: '18px', marginRight: '15px' }}>⚙️</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? 'white' : '#1c1e21' }}>Settings</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderRadius: '10px',
            background: darkMode ? '#3a3a3a' : '#f0f2f5',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          onClick={() => { alert("Help & Support"); onClose(); }}
          >
            <span style={{ fontSize: '18px', marginRight: '15px' }}>❓</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? 'white' : '#1c1e21' }}>Help & Support</span>
          </div>

          {/* ✅ UPDATED ABOUT SECTION */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderRadius: '10px',
            background: darkMode ? '#3a3a3a' : '#f0f2f5',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          onClick={() => {
            alert(
              "📚 CampusCart\n\n" +
              "Developed by:\n" +
              "• Member 1\n" +
              "• Member 2\n" +
              "• Member 3\n" +
              "• Member 4\n\n" +
              "⚠️ NOTE: This is just a PROTOTYPE version for demonstration."
            );
            onClose();
          }}
          >
            <span style={{ fontSize: '18px', marginRight: '15px' }}>ℹ️</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? 'white' : '#1c1e21' }}>About</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderRadius: '10px',
            background: '#e41e3f',
            marginTop: '20px',
            cursor: 'pointer'
          }}
          onClick={handleLogout}
          >
            <span style={{ fontSize: '18px', marginRight: '15px', color: 'white' }}>🚪</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: 'white' }}>Logout</span>
          </div>

        </div>
      </div>
    </>
  );
}