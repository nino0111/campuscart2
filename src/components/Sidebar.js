import React from "react";
import { 
  ShoppingBag, X, Bell, MessageSquare, Tag, 
  BookOpen, Tv, Lamp, Shirt, GraduationCap 
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, activeCategory, onCategoryClick, navigate }) => {
  
  const categories = [
    { name: "Textbooks", icon: <BookOpen size={18} /> },
    { name: "Electronics", icon: <Tv size={18} /> },
    { name: "Dorm Decor", icon: <Lamp size={18} /> },
    { name: "Clothing", icon: <Shirt size={18} /> },
    { name: "Supplies", icon: <GraduationCap size={18} /> },
  ];

  // Drawer Container Style
  const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "280px",
    background: "white",
    zIndex: 2000,
    transition: "0.3s ease-in-out",
    boxShadow: "10px 0 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
  };

  // Shared Item Style
  const itemStyle = (name) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.2s",
    marginBottom: "4px",
    background: activeCategory === name ? "#EEF2FF" : "transparent",
    color: activeCategory === name ? "#2D3494" : "#475569",
  });

  return (
    <>
      {/* Sidebar Drawer */}
      <aside style={sidebarStyle}>
        {/* Header */}
        <div style={{ padding: "20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "#2D3494", padding: "6px", borderRadius: "8px", display: "flex" }}>
              <ShoppingBag size={20} color="white" />
            </div>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#2D3494" }}>CampusCart</span>
          </div>
          <X size={22} onClick={onClose} style={{ cursor: "pointer", color: "#64748B" }} />
        </div>

        {/* Content */}
        <div style={{ padding: "20px" }}>
          <p style={labelStyle}>MARKETPLACE</p>
          
          <div style={itemStyle("All")} onClick={() => onCategoryClick("All")}>
            <Tag size={18} /> All Listings
          </div>
          
          <div style={itemStyle("Alerts")} onClick={() => navigate("/notifications")}>
            <Bell size={18} /> Alerts
          </div>
          
          <div style={itemStyle("Messages")} onClick={() => navigate("/chat-list")}>
            <MessageSquare size={18} /> Messages
          </div>

          <p style={{ ...labelStyle, marginTop: "30px" }}>CATEGORIES</p>
          
          {categories.map((cat, i) => (
            <div key={i} style={itemStyle(cat.name)} onClick={() => onCategoryClick(cat.name)}>
              {cat.icon} {cat.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Background Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            background: "rgba(0,0,0,0.4)", 
            zIndex: 1500 
          }} 
        />
      )}
    </>
  );
};

const labelStyle = { 
  fontSize: "11px", 
  fontWeight: "800", 
  color: "#94A3B8", 
  letterSpacing: "1px", 
  marginBottom: "15px", 
  textTransform: "uppercase" 
};

export default Sidebar;