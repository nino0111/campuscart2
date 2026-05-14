import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Added auth
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Search, 
  MessageCircle, 
  Gavel, 
  Clock, 
  Package, 
  Plus,
  Zap, // For Promote icon
  Crown // For Featured icon
} from "lucide-react";
import '../styles/Home.css';

export default function Listings() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const COLORS = {
    primary: '#2D3494',
    accent: '#4F46E5',
    textMain: '#1E293B',
    textMuted: '#64748B',
    priceGreen: '#059669',
    bidRed: '#E11D48',
    bgLight: '#F8FAFC',
    gold: '#F59E0B' // For Featured Badge
  };

  useEffect(() => {
    const fetchItems = async () => {
      // Sort by creation, but we will re-sort locally to put Featured items first
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const itemList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title && data.title.trim() !== "") {
          itemList.push({ id: doc.id, ...data });
        }
      });

      // ✅ REVENUE LOGIC: Sort so Featured items appear first
      const sortedItems = itemList.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      setItems(sortedItems);
    };
    fetchItems();
  }, []);

  const timeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const now = new Date();
    const postedTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((now - postedTime) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    return `Just now`;
  };

  const placeBid = async (item) => {
    const currentMax = parseFloat(item.highestBid || item.price || 0);
    const bidAmount = prompt(`Enter bid higher than ₱${currentMax}`);
    
    if (!bidAmount || isNaN(bidAmount)) return;
    const numericBid = parseFloat(bidAmount);

    if (numericBid <= currentMax) {
      setAlertMsg(`Min bid: ₱${currentMax + 1}`);
      setShowAlert(true);
      return;
    }

    try {
      await updateDoc(doc(db, "listings", item.id), { highestBid: numericBid });
      setItems(items.map(i => i.id === item.id ? { ...i, highestBid: numericBid } : i));
      setAlertMsg(`Success! Current highest: ₱${numericBid}`);
      setShowAlert(true);
    } catch (error) {
      setAlertMsg("Error placing bid.");
      setShowAlert(true);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container" style={{ background: COLORS.bgLight, minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: COLORS.primary, padding: 8, borderRadius: 10, display: 'flex' }}>
            <ShoppingBag size={22} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.primary }}>CampusCart</span>
        </div>

        <div className="search-box" style={{ maxWidth: '400px' }}>
          <Search size={18} color={COLORS.textMuted} />
          <input 
            type="text" 
            placeholder="Search Marketplace..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-links">
          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/listings" className="nav-item active">Marketplace</Link>
          <button 
            className="submit-btn" 
            onClick={() => navigate('/create-listing')}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <Plus size={16} /> Post
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: COLORS.textMain, margin: 0 }}>Marketplace Feed</h2>
          <div style={{ color: COLORS.textMuted, fontSize: '14px' }}>{filteredItems.length} items available</div>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <Package size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: COLORS.textMain }}>No items found</h3>
          </div>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="card" 
                style={{ 
                  border: item.isFeatured ? `2px solid ${COLORS.gold}` : '1px solid #E2E8F0',
                  position: 'relative'
                }}
              >
                {/* FEATURED BADGE */}
                {item.isFeatured && (
                  <div style={{
                    position: 'absolute', top: -10, left: 10, background: COLORS.gold,
                    color: 'white', padding: '4px 10px', borderRadius: '20px',
                    fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4, zIndex: 10
                  }}>
                    <Crown size={12} /> FEATURED
                  </div>
                )}

                <div className="img-box" onClick={() => navigate(`/detail/${item.id}`)}>
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <Package size={40} color="#CBD5E1" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {timeAgo(item.createdAt)}
                  </div>
                </div>

                <div className="info">
                  <h3 onClick={() => navigate(`/detail/${item.id}`)} style={{ cursor: 'pointer' }}>{item.title}</h3>
                  
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '10px', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{item.type === "bid" ? "Highest Bid" : "Fixed Price"}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: item.type === "bid" ? COLORS.bidRed : COLORS.primary }}>
                      ₱{(item.highestBid || item.price).toLocaleString()}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.type === "bid" ? (
                      <button className="submit-btn" onClick={() => placeBid(item)} style={{ background: COLORS.bidRed, width: '100%' }}>
                        <Gavel size={18} /> Place Bid
                      </button>
                    ) : (
                      <button className="submit-btn" onClick={() => navigate(`/detail/${item.id}`)} style={{ background: COLORS.primary, width: '100%' }}>
                        <MessageCircle size={18} /> Contact Seller
                      </button>
                    )}

                    {/* ✅ PROMOTE BUTTON (Only shows for owner of the item) */}
                    {currentUser?.uid === item.userId && !item.isFeatured && (
                      <button 
                        onClick={() => navigate(`/promote/${item.id}`)}
                        style={{
                          background: 'white', color: COLORS.gold, border: `1px solid ${COLORS.gold}`,
                          borderRadius: '10px', padding: '8px', fontWeight: '700', fontSize: '13px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer'
                        }}
                      >
                        <Zap size={14} fill={COLORS.gold} /> Promote Listing
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOM ALERT MODAL (Your existing code) */}
      {showAlert && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ color: "#2D3494", margin: "0 0 12px 0" }}>CampusCart</h3>
            <p style={{ margin: "0 0 20px 0" }}>{alertMsg}</p>
            <button onClick={() => setShowAlert(false)} style={modalBtn}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const modalContent = { background: "white", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "400px", textAlign: 'center' };
const modalBtn = { width: "100%", padding: "10px", background: "#2D3494", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" };