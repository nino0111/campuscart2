import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Search, 
  MessageCircle, 
  Gavel, 
  Clock, 
  Package, 
  Plus
} from "lucide-react";
import '../styles/Home.css';

export default function Listings() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ NEW: Custom Alert State
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const COLORS = {
    primary: '#2D3494',
    accent: '#4F46E5',
    textMain: '#1E293B',
    textMuted: '#64748B',
    priceGreen: '#059669',
    bidRed: '#E11D48',
    bgLight: '#F8FAFC'
  };

  useEffect(() => {
    const fetchItems = async () => {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const itemList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title && data.title.trim() !== "") {
          itemList.push({ id: doc.id, ...data });
        }
      });
      setItems(itemList);
    };
    fetchItems();
  }, []);

  const timeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const now = new Date();
    const postedTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((now - postedTime) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
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
      // ✅ Replaced alert
      setAlertMsg(`Min bid: ₱${currentMax + 1}`);
      setShowAlert(true);
      return;
    }

    try {
      await updateDoc(doc(db, "listings", item.id), { highestBid: numericBid });
      setItems(items.map(i => i.id === item.id ? { ...i, highestBid: numericBid } : i));
      // ✅ Replaced alert
      setAlertMsg(`Success! Current highest: ₱${numericBid}`);
      setShowAlert(true);
    } catch (error) {
      // ✅ Replaced alert
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
            <p style={{ color: COLORS.textMuted }}>Be the first to list something!</p>
          </div>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="card">
                <div className="img-box" onClick={() => navigate(`/detail/${item.id}`)}>
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <Package size={40} color="#CBD5E1" />
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>No Image</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {timeAgo(item.createdAt)}
                  </div>
                </div>

                <div className="info">
                  <h3 onClick={() => navigate(`/detail/${item.id}`)} style={{ cursor: 'pointer' }}>{item.title}</h3>
                  
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #F1F5F9' }}>
                    {item.type === "bid" ? (
                      <div>
                        <div style={{ fontSize: '12px', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Highest Bid</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: COLORS.bidRed }}>₱{(item.highestBid || item.price).toLocaleString()}</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '12px', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fixed Price</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: COLORS.primary }}>₱{item.price.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {item.type === "bid" ? (
                    <button 
                      className="submit-btn" 
                      onClick={() => placeBid(item)}
                      style={{ background: COLORS.bidRed, width: '100%', gap: 8 }}
                    >
                      <Gavel size={18} /> Place Bid
                    </button>
                  ) : (
                    <button 
                      className="submit-btn" 
                      onClick={() => navigate(`/detail/${item.id}`)}
                      style={{ background: COLORS.primary, width: '100%', gap: 8 }}
                    >
                      <MessageCircle size={18} /> Contact Seller
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOATING CHAT BUTTON */}
      <button 
        style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px',
          background: COLORS.primary, borderRadius: '50%', border: 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 8px 24px rgba(45, 52, 148, 0.3)', cursor: 'pointer'
        }}
        onClick={() => navigate('/messages')}
      >
        <MessageCircle color="white" size={28} />
      </button>

      {/* ✅ CUSTOM ALERT MODAL */}
      {showAlert && (
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
            }}>{alertMsg}</p>
            <button
              onClick={() => setShowAlert(false)}
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
      )}

    </div>
  );
}