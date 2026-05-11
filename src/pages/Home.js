import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  Search, ShoppingBag, MapPin, Plus, 
  Menu, X, MessageSquare, Tag,
  Loader2, Sparkles, Heart, Package, Settings, LogOut, BookOpen, Tv, Lamp, Shirt, PenTool, User
} from "lucide-react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // ✅ INJECTING ANIMATIONS
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes meshGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes goldenSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes floatAction {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }

      .animated-banner {
        background: linear-gradient(-45deg, #2D3494, #4F46E5, #1E293B, #2D3494);
        background-size: 400% 400% !important;
        animation: meshGradient 12s ease infinite !important;
      }

      .spinning-sparkle {
        display: inline-block;
        animation: goldenSpin 4s linear infinite !important;
      }

      .float-btn {
        animation: floatAction 3s ease-in-out infinite;
      }

      .hide-mobile {
        @media (max-width: 640px) {
          display: none;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const categories = [
    { name: "Textbooks", icon: <BookOpen size={18} />, color: "#E0E7FF" },
    { name: "Electronics", icon: <Tv size={18} />, color: "#FEF3C7" },
    { name: "Dorm Decor", icon: <Lamp size={18} />, color: "#D1FAE5" },
    { name: "Clothing", icon: <Shirt size={18} />, color: "#FCE7F3" },
    { name: "Supplies", icon: <PenTool size={18} />, color: "#FFEDD5" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          price: doc.data().price ?? 0,
          images: Array.isArray(doc.data().images) ? doc.data().images : (doc.data().imageUrl ? [doc.data().imageUrl] : [])
        }));
        setItems(data);
        setDisplayItems(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = items;
    if (activeCategory !== "All") filtered = filtered.filter(i => i.category === activeCategory);
    if (searchTerm) filtered = filtered.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setDisplayItems(filtered);
  }, [searchTerm, activeCategory, items]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={40} color="#2D3494" />
    </div>
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      
      {/* --- SIDEBAR --- */}
      <aside style={{ ...sidebarStyle, left: isSidebarOpen ? 0 : "-320px" }}>
        <div style={sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: "#2D3494", padding: "6px", borderRadius: "8px", display: "flex" }}>
              <ShoppingBag size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: "#2D3494" }}>CampusCart</span>
          </div>
          <X size={24} onClick={() => setIsSidebarOpen(false)} style={{ cursor: "pointer", color: "#94A3B8" }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={sidebarUserSection} onClick={() => navigate('/profile')}>
            <div style={sidebarAvatar}>{currentUser?.displayName?.charAt(0) || "U"}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>{currentUser?.displayName || "Campus User"}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>View Profile</div>
            </div>
          </div>

          <p style={sidebarLabel}>Marketplace</p>
          <div style={sidebarItemStyle(activeCategory === "All")} onClick={() => { setActiveCategory("All"); setIsSidebarOpen(false); }}>
            <Tag size={18} /> All Listings
          </div>
          <div style={sidebarItemStyle(false)} onClick={() => navigate('/chat')}><MessageSquare size={18} /> Messages</div>
          
          <p style={{ ...sidebarLabel, marginTop: "25px" }}>My Activity</p>
          <div style={sidebarItemStyle(false)} onClick={() => navigate('/my-listings')}><Package size={18} /> My Listings</div>
          <div style={sidebarItemStyle(false)} onClick={() => navigate('/saved')}><Heart size={18} /> Saved Items</div>

          <p style={{ ...sidebarLabel, marginTop: "25px" }}>Categories</p>
          {categories.map((cat, i) => (
            <div key={i} style={sidebarItemStyle(activeCategory === cat.name)} onClick={() => { setActiveCategory(cat.name); setIsSidebarOpen(false); }}>
              <div style={{ background: cat.color, padding: "5px", borderRadius: "6px", display: "flex" }}>{cat.icon}</div>
              {cat.name}
            </div>
          ))}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={() => navigate('/settings')} style={{ ...sidebarItemStyle(false), width: '100%', marginBottom: 10 }}><Settings size={18} /> Settings</button>
          <button onClick={handleLogout} style={logoutBtn}><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={overlayStyle} />}

      {/* --- NAVBAR --- */}
      <header style={navStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Menu size={26} onClick={() => setIsSidebarOpen(true)} style={{ cursor: "pointer", color: "#2D3494" }} />
          <span style={{ fontSize: 22, fontWeight: 800, color: "#2D3494" }} className="hide-mobile">CampusCart</span>
        </div>
        
        <div style={searchBarContainer}>
          <Search size={18} color="#94A3B8" />
          <input 
            style={searchField} 
            placeholder="Search PSAU Marketplace..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate('/create-listing')} style={sellBtn}>
            <Plus size={18} /> <span className="hide-mobile">Sell Item</span>
          </button>
          
          {/* ✅ ADDED PROFILE BUTTON */}
          <button 
            onClick={() => navigate('/profile')} 
            style={profileBtnStyle}
            title="Profile"
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              <User size={20} color="#2D3494" />
            )}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
        
        {/* ✅ ANIMATED BANNER */}
        <div className="animated-banner" style={bannerBaseStyle}>
          <div style={{ flex: 1, zIndex: 2 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 10 }}>
              {activeCategory === "All" ? "PSAU Marketplace" : activeCategory} 
              <span className="spinning-sparkle" style={{ marginLeft: 12 }}>
                <Sparkles size={28} color="#FFD700" fill="#FFD700" />
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 25 }}>Affordable campus essentials from fellow students.</p>
            <button className="float-btn" onClick={() => navigate('/listings')} style={bannerBtn}>
              Browse All
            </button>
          </div>
          <div style={{ fontSize: "100px", opacity: 0.1 }}>🎓</div>
        </div>

        {/* --- MAIN GRID --- */}
        <main>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", marginBottom: 20 }}>
            {searchTerm ? `Results for "${searchTerm}"` : activeCategory === "All" ? "Today's Picks" : activeCategory}
          </h2>
          <div style={gridStyle}>
            {displayItems.length > 0 ? (
              displayItems.map(item => (
                <div key={item.id} style={cardStyle} onClick={() => navigate(`/detail/${item.id}`)}>
                  <img src={item.images[0] || "https://placehold.co/400x300"} style={imgStyle} alt="" />
                  <div style={{ padding: "15px" }}>
                    <div style={{ color: "#059669", fontWeight: 800, fontSize: 18 }}>₱{Number(item.price).toLocaleString()}</div>
                    <div style={{ fontWeight: 700, fontSize: "15px", margin: "5px 0", color: "#1E293B" }}>{item.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748B", fontSize: 12, marginTop: 10 }}>
                      <MapPin size={12} /> {item.location || "PSAU Campus"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748B' }}>
                No items found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* --- STYLES --- */
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5%", background: "white", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 1000 };
const searchBarContainer = { display: "flex", alignItems: "center", gap: 10, background: "#F1F5F9", padding: "0 15px", borderRadius: 12, height: 42, width: "40%" };
const searchField = { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: 14 };
const sellBtn = { background: "#2D3494", color: "white", border: "none", padding: "10px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 };

const profileBtnStyle = { 
  width: "42px", 
  height: "42px", 
  borderRadius: "12px", 
  background: "#F1F5F9", 
  border: "1px solid #E2E8F0", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  cursor: "pointer",
  padding: 0,
  overflow: 'hidden'
};

const bannerBaseStyle = { borderRadius: 24, padding: "50px 40px", display: "flex", alignItems: "center", marginBottom: 40, position: "relative", overflow: "hidden" };
const bannerBtn = { background: "white", color: "#2D3494", border: "none", padding: "12px 28px", borderRadius: 12, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" };

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 25 };
const cardStyle = { background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #E2E8F0", cursor: "pointer", transition: "0.2s ease" };
const imgStyle = { width: "100%", height: "200px", objectFit: "cover" };

const sidebarStyle = { position: "fixed", top: 0, width: "300px", height: "100vh", background: "white", zIndex: 2000, transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "5px 0 25px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" };
const sidebarHeader = { padding: "25px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" };
const sidebarUserSection = { display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '20px', cursor: 'pointer' };
const sidebarAvatar = { width: '40px', height: '40px', borderRadius: '50%', background: '#2D3494', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' };
const sidebarLabel = { fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "1px", marginBottom: "12px", textTransform: "uppercase" };
const sidebarItemStyle = (isActive) => ({ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", color: isActive ? "#2D3494" : "#475569", background: isActive ? "#EEF2FF" : "transparent", cursor: "pointer", border: "none", textAlign: "left" });
const logoutBtn = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#FFF1F2', color: '#E11D48', border: 'none', fontWeight: '700', cursor: 'pointer' };
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 1500 };