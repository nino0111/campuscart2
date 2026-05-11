import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
// Professional Icon Library - CLEANED UP
import { 
  Search, Home as HomeIcon, User, ShoppingBag, 
  Plus, Bell, MessageSquare, Tag, Book, 
  Laptop, Armchair, Shirt, GraduationCap, MapPin 
} from "lucide-react";
import '../styles/Home.css';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Colors Constants
  const COLORS = {
    primary: '#2D3494', // Campus Deep Blue
    background: '#F8FAFC',
    card: '#FFFFFF',
    textMain: '#1E293B',
    textMuted: '#64748B',
    accent: '#4F46E5',
    price: '#059669'
  };

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "Untitled Item",
          price: d.price ?? 0,
          images: Array.isArray(d.images) ? d.images : [],
          location: d.location || "Campus Area",
        };
      });
      setItems(data);
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: COLORS.background, color: COLORS.textMain, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ✅ MODERN NAVBAR */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: 70,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: COLORS.primary, padding: 8, borderRadius: 10 }}>
            <ShoppingBag size={24} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.primary, letterSpacing: '-0.5px' }}>
            Campus<span style={{ color: COLORS.accent }}>Cart</span>
          </span>
        </div>

        {/* SEARCH BAR */}
        <div style={{
          background: '#F1F5F9',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          height: 44,
          width: 400,
          border: '1px solid #E2E8F0'
        }}>
          <Search size={18} color={COLORS.textMuted} />
          <input
            type="text"
            placeholder="Search for textbooks, electronics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: 12, fontSize: 14, width: '100%' }}
          />
        </div>

        {/* NAV ACTIONS */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/home" style={navLinkStyle}><HomeIcon size={22} /></Link>
          <Link to="/profile" style={navLinkStyle}><User size={22} /></Link>
          <button 
            onClick={() => navigate('/create-listing')}
            style={{
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Sell Item
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', maxWidth: 1300, margin: '0 auto', padding: '40px 20px' }}>
        
        {/* ✅ SIDEBAR - NOW WORKING LINKS */}
        <aside style={{ width: 280, paddingRight: 40 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 20 }}>Marketplace</h2>
          
          <Link to="/listings" style={sidebarItemStyle}>
            <Tag size={18} /> <span>All Listings</span>
          </Link>
          
          <Link to="/alerts" style={sidebarItemStyle}>
            <Bell size={18} /> <span>Alerts</span>
          </Link>
          
          <Link to="/chat" style={sidebarItemStyle}>
            <MessageSquare size={18} /> <span>Messages</span>
          </Link>

          <h2 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', marginTop: 32, marginBottom: 20 }}>Categories</h2>
          
          <div style={sidebarItemStyle}><Book size={18} /> <span>Textbooks</span></div>
          <div style={sidebarItemStyle}><Laptop size={18} /> <span>Electronics</span></div>
          <div style={sidebarItemStyle}><Armchair size={18} /> <span>Dorm Decor</span></div>
          <div style={sidebarItemStyle}><Shirt size={18} /> <span>Clothing</span></div>
          <div style={sidebarItemStyle}><GraduationCap size={18} /> <span>School Supplies</span></div>
        </aside>

        {/* ✅ MAIN FEED */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.textMain, margin: 0 }}>Today's Picks</h1>
              <p style={{ color: COLORS.textMuted, marginTop: 4 }}>Featured items near Angeles City</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.accent, fontWeight: 600, fontSize: 14 }}>
              <MapPin size={16} /> Change Location
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24
          }}>
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                style={cardStyle}
                onClick={() => navigate(`/detail/${item.id}`)}
              >
                <div style={imageContainerStyle}>
                  <img 
                    src={item.images.length > 0 ? item.images[0] : "https://placehold.co/400x400/f1f5f9/cbd5e1?text=No+Image"} 
                    alt={item.title}
                    style={imageStyle}
                  />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ color: COLORS.price, fontWeight: 800, fontSize: 18 }}>
                    ₱{item.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textMain, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>
                    <MapPin size={12} /> {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- STYLES ---

const navLinkStyle = {
  color: '#64748B',
  textDecoration: 'none',
  padding: '8px',
  borderRadius: '8px',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center'
};

const sidebarItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px',
  borderRadius: '10px',
  cursor: 'pointer',
  marginBottom: 4,
  fontSize: 15,
  fontWeight: 500,
  color: '#475569',
  transition: 'background 0.2s',
  textDecoration: 'none' // Important for Link
};

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
};

const imageContainerStyle = {
  width: '100%',
  aspectRatio: '1/1',
  position: 'relative',
  overflow: 'hidden',
  background: '#F8FAFC'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};