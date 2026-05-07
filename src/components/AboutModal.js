// src/components/AboutModal.js
import React from 'react';

export default function AboutModal({ isOpen, onClose, darkMode }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for modal
          zIndex: 1001, // Higher than sidebar overlay
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClose} // Close modal when clicking outside
      />

      {/* Modal Content */}
      <div
        style={{
          position: 'fixed',
          backgroundColor: darkMode ? '#333333' : '#3c4043', // Dark background as per image
          color: darkMode ? '#e0e0e0' : 'white', // Light text color
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          width: '90%',
          maxWidth: '450px',
          zIndex: 1002, // Highest z-index
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '15px',
          textAlign: 'left', // Align text to left
        }}
      >
        {/* Title / Header */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px',
            fontWeight: '600',
            color: 'white', // Header text is white
            marginBottom: '10px'
        }}>
            <img src="/campuscart_logo.png" alt="CampusCart Logo" style={{ width: '150px', height: '150px' }} /> {/* Placeholder logo */}
            <span style={{color: '#fff', fontSize: '20px'}}>CampusCart</span> {/* Adjusted color and size */}
        </div>
        
        {/* Developed By section */}
        <div style={{ color: '#e0e0e0', fontSize: '15px', lineHeight: '1.5' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Developed by:</p>
          <ul style={{ listStyleType: 'disc', marginLeft: '20px', padding: 0, margin: 0 }}>
            <li>Tuazon, Carl Dexter N.</li>
            <li>Bawiin, Eric Louie</li>
            <li>Gatus, Ivan Dion</li>
            <li>Villavicencio, Ian Cris</li>
          </ul>
        </div>

        {/* Note */}
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 0, 0.1)', // Light yellow background for note
            padding: '10px 15px',
            borderRadius: '8px',
            width: 'calc(100% - 30px)', // Adjust width for padding
            fontSize: '14px',
            color: '#e0e0e0', // Slightly lighter text for note
        }}>
            <span style={{ fontSize: '18px', lineHeight: '1', color: '#ffcc00' }}>⚠️</span>
            <span style={{ color: '#e0e0e0' }}>NOTE: This is just a PROTOTYPE version for demonstration.</span>
        </div>

        {/* OK Button */}
        <button
          onClick={onClose}
          style={{
            alignSelf: 'flex-end', // Align to bottom right
            backgroundColor: '#616161', // Grey button background
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginTop: '10px', // Space above button
            transition: 'background-color 0.2s ease',
          }}
        >
          OK
        </button>
      </div>
    </>
  );
}