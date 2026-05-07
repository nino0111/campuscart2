// src/components/Sidebar.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for internal navigation
import { getAuth, signOut } from "firebase/auth";
import AboutModal from "./AboutModal"; // Assume AboutModal is already in src/components

// Optional: Import icons if you're using an icon library like FontAwesome, Material Icons, etc.
// For now, I'll use emojis/unicode characters for simplicity.

export default function Sidebar({ isOpen, onClose, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const auth = getAuth(); // Firebase auth for logout

  const [showAboutModal, setShowAboutModal] = useState(false);

  // Dummy user data - replace with actual user data from your context/auth
  const currentUser = {
    displayName: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/150/b0b0b0?text=JD", // Placeholder avatar
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
      onClose(); // Close sidebar after logout
    }).catch((error) => {
      console.error("Logout error:", error);
      // Optionally show an error message
    });
  };

  // If sidebar is not open, don't render anything
  if (!isOpen) return null;

  // --- Styling variables for clarity ---
  const textColor = darkMode ? '#e0e0e0' : '#333';
  const iconColor = darkMode ? '#a0a0a0' : '#666';
  const itemBgHover = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const sectionHeaderColor = darkMode ? '#888' : '#777';

  // Define iconStyle globally within the component's scope so it's accessible everywhere
  const globalIconStyle = {
    marginRight: '15px',
    fontSize: '20px',
    color: iconColor, // Default icon color
    width: '24px', // Fixed width for consistent alignment
    textAlign: 'center'
  };

  // Helper component for a clickable item in the sidebar
  const SidebarItem = ({ icon, text, onClick, isLink, to, bold = false }) => {
    const itemStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 15px',
      borderRadius: '8px',
      marginBottom: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      color: textColor, // Inherit color
      textDecoration: 'none', // For Link components
      fontWeight: bold ? 'bold' : 'normal',
      fontSize: '15px'
    };

    // Use globalIconStyle here
    const currentIconStyle = { ...globalIconStyle }; // Create a copy if specific overrides needed

    const handleHover = (e, enter) => {
      e.currentTarget.style.backgroundColor = enter ? itemBgHover : 'transparent';
    };

    if (isLink && to) {
      return (
        <Link 
          to={to} 
          style={itemStyle} 
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={onClose} // Close sidebar when a link is clicked
        >
          <span style={currentIconStyle}>{icon}</span>
          <span>{text}</span>
        </Link>
      );
    }

    return (
      <div 
        style={itemStyle}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
        onClick={onClick}
      >
        <span style={currentIconStyle}>{icon}</span>
        <span>{text}</span>
      </div>
    );
  };

  // --- JSX for the Sidebar ---
  return (
    <>
      {/* Overlay backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Actual Sidebar Content Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? '0' : '-350px', // Slide in/out effect
        width: '300px', // Fixed width for the sidebar
        height: '100vh',
        background: darkMode ? '#1e1e1e' : '#fff', // Darker background for dark mode sidebar
        boxShadow: '-5px 0 20px rgba(0,0,0,0.3)',
        transition: 'right 0.3s ease',
        zIndex: 1000,
        padding: '20px 0', // Padding top/bottom, inner padding for items
        overflowY: 'auto', // Scrollable content
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: darkMode ? '#e0e0e0' : '#333'
          }}
        >
          ×
        </button>

        {/* User Profile Section */}
        <div style={{
            padding: '10px 20px 20px',
            borderBottom: darkMode ? '1px solid #333' : '1px solid #eee',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}>
            <img 
                src={currentUser.avatar} 
                alt="User Avatar" 
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: darkMode ? '2px solid #555' : '2px solid #ccc'
                }} 
            />
            <div>
                <h3 style={{ margin: '0', fontSize: '18px', color: textColor }}>{currentUser.displayName}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: iconColor }}>{currentUser.email}</p>
            </div>
        </div>

        {/* Main Navigation Links */}
        <div style={{ padding: '0 10px', marginBottom: '20px' }}>
            <h4 style={{ color: sectionHeaderColor, fontSize: '12px', textTransform: 'uppercase', paddingLeft: '15px', marginBottom: '10px' }}>Navigation</h4>
            <SidebarItem icon="🏠" text="Home" isLink to="/home" bold />
            <SidebarItem icon="📦" text="Listings" isLink to="/listings" />
            <SidebarItem icon="👤" text="Profile" isLink to="/profile" />
            <SidebarItem icon="🛒" text="Cart" isLink to="/cart" />
        </div>

        {/* General Options */}
        <div style={{ padding: '0 10px', marginBottom: '20px' }}>
            <h4 style={{ color: sectionHeaderColor, fontSize: '12px', textTransform: 'uppercase', paddingLeft: '15px', marginBottom: '10px' }}>General</h4>
            <SidebarItem icon="🔔" text="Notifications" onClick={() => console.log("Notifications clicked")} />
            <SidebarItem icon="⚙️" text="Settings" onClick={() => console.log("Settings clicked")} />
            <SidebarItem icon="❓" text="Help & Support" onClick={() => console.log("Help & Support clicked")} />
        </div>
        
        {/* App Information & Theme Toggle */}
        <div style={{ padding: '0 10px', marginBottom: '20px' }}>
            <h4 style={{ color: sectionHeaderColor, fontSize: '12px', textTransform: 'uppercase', paddingLeft: '15px', marginBottom: '10px' }}>App & Theme</h4>
            <SidebarItem icon="ℹ️" text="About" onClick={() => setShowAboutModal(true)} />
            
            {/* Dark Mode Toggle - Integrated as a regular item with a switch */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 15px',
                borderRadius: '8px',
                marginBottom: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                color: textColor,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = itemBgHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={toggleDarkMode} // Toggle dark mode when clicked
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={globalIconStyle}>{darkMode ? '☀️' : '🌙'}</span> {/* Use globalIconStyle here */}
                    <span>Dark Mode</span>
                </div>
                {/* Custom Toggle Switch */}
                <div style={{
                    width: '45px',
                    height: '25px',
                    backgroundColor: darkMode ? '#007bff' : '#ccc', // Blue for ON, Grey for OFF
                    borderRadius: '25px',
                    position: 'relative',
                    transition: 'background-color 0.3s'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: darkMode ? '26px' : '3px',
                        width: '19px',
                        height: '19px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.3s'
                    }} />
                </div>
            </div>
        </div>

        {/* Logout Button (Sticky at bottom or just last item) */}
        <div style={{ 
            padding: '10px 10px 20px', 
            marginTop: 'auto', // Pushes it to the bottom
            borderTop: darkMode ? '1px solid #333' : '1px solid #eee',
            paddingTop: '20px'
        }}>
            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'calc(100% - 20px)', // Adjust for padding
                    marginLeft: '10px', // Align with other items
                    backgroundColor: '#dc3545', // Red for danger/logout
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
                <span style={{ marginRight: '10px', fontSize: '20px' }}>🚪</span>
                <span>Logout</span>
            </button>
        </div>

      </div>

      {/* About Modal - Renders conditionally */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        darkMode={darkMode}
      />
    </>
  );
}