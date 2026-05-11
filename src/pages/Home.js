import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { 
  Search, ShoppingBag, MapPin, User, Plus, 
  BookOpen, Tv, Lamp, Shirt, PenTool, Sparkles,
  Menu, X, Bell, MessageSquare, Tag,  
  Loader2, Heart, Package, Settings, LogOut, 
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

  const categories = [
    { name: "Textbooks", icon: <BookOpen size={20} />, color: "#E0E7FF" },
    { name: "Electronics", icon: <Tv size={20} />, color: "#FEF3C7" },
    { name: "Dorm Decor", icon: <Lamp size={20} />, color: "#D1FAE5" },
    { name: "Clothing", icon: <Shirt size={20} />, color: "#FCE7F3" },
    { name: "Supplies", icon: <PenTool size={20} />, color: "#FFEDD5" },
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
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = items;
    if (activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setDisplayItems(filtered);
  }, [searchTerm, activeCategory, items]);

  // ✅ Working Action Handlers
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCategoryClick = (catName) => {
    setActiveCategory(catName);
    setIsSidebarOpen(false);
    setSearchTerm("");
    // If you want categories to also go to a separate listings page, uncomment below:
    // navigate('/listings'); 
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <Loader2 className="animate-spin" size={40} color="#2D3494" />
    </div>
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingBottom: "50px", position: "relative", overflowX: "hidden" }}>
      
      {/* --- ENHANCED SIDEBAR --- */}
      <div style={{
        position: "fixed", top: 0, left: isSidebarOpen ? 0 : "-320px", width: "300px", height: "100vh",
        background: "white", zIndex: 2000, transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "4px 0 25px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column"
      }}>
        <div style={{ padding: '25px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: "#2D3494", padding: "6px", borderRadius: "8px", display: "flex" }}><ShoppingBag size={22} color="white" /></div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#2D3494" }}>CampusCart</span>
          </div>
          <X size={24} onClick={() => setIsSidebarOpen(false)} style={{ cursor: "pointer", color: "#94A3B8" }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          <div style={sidebarUserSection} onClick={() => { navigate('/profile'); setIsSidebarOpen(false); }}>
            <div style={sidebarAvatar}>{currentUser?.displayName?.charAt(0) || "U"}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>{currentUser?.displayName || "Campus User"}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>View Profile</div>
            </div>
          </div>

          <p style={sidebarLabelStyle}>Marketplace</p>
          <div style={sidebarItemStyle(activeCategory === "All")} onClick={() => handleCategoryClick("All")}>
            <Tag size={18} /> All Listings
          </div>
          <div style={sidebarItemStyle(false)} onClick={() => { navigate('/chat'); setIsSidebarOpen(false); }}><MessageSquare size={18} /> Messages</div>
          <div style={sidebarItemStyle(false)} onClick={() => { navigate('/alerts'); setIsSidebarOpen(false); }}><Bell size={18} /> Alerts</div>

          <p style={{ ...sidebarLabelStyle, marginTop: "25px" }}>My Activity</p>
          {/* ✅ Buttons below now work */}
          <div style={sidebarItemStyle(false)} onClick={() => { navigate('/my-listings'); setIsSidebarOpen(false); }}><Package size={18} /> My Listings</div>
          <div style={sidebarItemStyle(false)} onClick={() => { navigate('/saved'); setIsSidebarOpen(false); }}><Heart size={18} /> Saved Items</div>

          <p style={{ ...sidebarLabelStyle, marginTop: "25px" }}>Categories</p>
          {categories.map((cat, i) => (
            <div key={i} style={sidebarItemStyle(activeCategory === cat.name)} onClick={() => handleCategoryClick(cat.name)}>
              <div style={{ background: cat.color, padding: "5px", borderRadius: "6px", display: "flex" }}>
                {React.cloneElement(cat.icon, { size: 14 })}
              </div>
              {cat.name}
            </div>
          ))}

          <p style={{ ...sidebarLabelStyle, marginTop: "25px" }}>Others</p>
          <div style={sidebarItemStyle(false)} onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }}><Settings size={18} /> Settings</div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={handleLogout} style={logoutBtnStyle}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={overlayStyle} />}

      {/* NAVBAR */}
      <header style={navStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Menu size={26} onClick={() => setIsSidebarOpen(true)} style={{ cursor: "pointer", color: "#2D3494" }} />
          <span style={{ fontSize: "22px", fontWeight: "800", color: "#2D3494" }}>CampusCart</span>
        </div>
        
        <div style={searchBarContainer}>
          <Search size={18} color="#94A3B8" />
          <input 
            style={searchInput} 
            placeholder="Search essentials..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Link to="/profile" style={iconBtnStyle}><User size={20} /></Link>
          <button onClick={() => navigate("/create-listing")} style={sellBtnStyle}>
            <Plus size={18} /> <span className="hide-mobile">Sell Item</span>
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={bannerStyle}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "white", marginBottom: "10px" }}>
              {activeCategory === "All" ? "PSAU Marketplace" : activeCategory} <Sparkles size={24} />
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "20px" }}>Shop safely from fellow students.</p>
            <button onClick={() => navigate("/listings")} style={bannerBtnStyle}>Browse All</button>
          </div>
          <div style={{ fontSize: "80px", opacity: 0.2 }}>🎓</div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1E293B", marginBottom: "20px" }}>
            {searchTerm ? "Results" : activeCategory === "All" ? "Today's Picks" : activeCategory}
          </h2>
          <div style={mainGrid}>
            {displayItems.map(item => (
              <div key={item.id} onClick={() => navigate(`/detail/${item.id}`)} style={listingCard}>
                <img src={item.images[0] || "https://placehold.co/400x300"} style={listingImg} alt="" />
                <div style={{ padding: "15px" }}>
                  <div style={{ color: "#2D3494", fontWeight: "800", fontSize: "18px" }}>₱{item.price.toLocaleString()}</div>
                  <div style={{ fontWeight: "700", fontSize: "16px", color: "#1E293B" }}>{item.title}</div>
                  <div style={locationTag}><MapPin size={12} /> {item.location || "PSAU Campus"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- STYLES --- */
const sidebarUserSection = { display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '25px', cursor: 'pointer' };
const sidebarAvatar = { width: '40px', height: '40px', borderRadius: '50%', background: '#2D3494', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' };
const logoutBtnStyle = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#FFF1F2', color: '#E11D48', border: 'none', fontWeight: '700', cursor: 'pointer' };
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", background: "white", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 1000 };
const searchBarContainer = { display: "flex", alignItems: "center", gap: "10px", background: "#F1F5F9", padding: "10px 20px", borderRadius: "12px", flex: 0.5 };
const searchInput = { border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px" };
const sellBtnStyle = { background: "#2D3494", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" };
const iconBtnStyle = { background: "#F1F5F9", padding: "10px", borderRadius: "10px", color: "#475569", display: "flex" };
const bannerStyle = { background: "linear-gradient(135deg, #2D3494 0%, #4F46E5 100%)", borderRadius: "24px", padding: "40px", display: "flex", alignItems: "center", marginBottom: "40px" };
const bannerBtnStyle = { background: "white", color: "#2D3494", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "800", cursor: "pointer" };
const mainGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" };
const listingCard = { background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #E2E8F0", cursor: "pointer" };
const listingImg = { width: "100%", height: "200px", objectFit: "cover" };
const locationTag = { display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#64748B", marginTop: "10px" };
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 1500 };
const sidebarLabelStyle = { fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "1px", marginBottom: "15px", textTransform: "uppercase" };
const sidebarItemStyle = (isActive) => ({ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", color: isActive ? "#2D3494" : "#475569", background: isActive ? "#EEF2FF" : "transparent", cursor: "pointer", transition: "0.2s" });