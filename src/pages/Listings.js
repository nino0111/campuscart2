import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Listings() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const q = query(
        collection(db, "listings"),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const itemList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title && data.title.trim() !== "") {
          itemList.push({ 
            id: doc.id, 
            ...data 
          });
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
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return `1 year ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return `1 month ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return `1 day ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return `1 hour ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} mins ago`;
    if (interval === 1) return `1 min ago`;

    return `Just now`;
  };

  const placeBid = async (item) => {
    const bidAmount = prompt(`Enter your bid amount (Current highest: ₱${item.highestBid || item.price})`);
    
    if (!bidAmount || isNaN(bidAmount)) {
      alert("Please enter a valid number!");
      return;
    }

    const numericBid = parseFloat(bidAmount);
    const currentPrice = parseFloat(item.highestBid || item.price || 0);

    if (numericBid <= currentPrice) {
      alert(`Bid must be higher than current price! Minimum bid is ₱${currentPrice + 1}`);
      return;
    }

    try {
      const itemRef = doc(db, "listings", item.id);
      await updateDoc(itemRef, {
        highestBid: numericBid
      });

      setItems(items.map(i => 
        i.id === item.id ? { ...i, highestBid: numericBid } : i
      ));

      alert(`✅ Bid successful! You are now the highest bidder at ₱${numericBid}`);
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Try again.");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f2f5', 
      padding: '20px',
      fontFamily: "'Segoe UI', Roboto, sans-serif"
    }}>
      <nav style={{ 
        background: 'white', 
        padding: '15px 30px', 
        borderRadius: '15px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '30px',
        display: 'flex',
        gap: '30px',
        alignItems: 'center'
      }}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Home</Link>
        <Link to="/listings" style={{ textDecoration: 'none', color: '#1877f2', fontSize: '17px', fontWeight: '600', borderBottom: '2px solid #1877f2', paddingBottom: '3px' }}>Marketplace</Link>
        <Link to="/profile" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Profile</Link>
      </nav>

      <h2 style={{ fontSize: '28px', color: '#1c1e21', marginBottom: '25px', fontWeight: '700' }}>
        📢 Items for Sale
      </h2>

      {items.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          background: 'white',
          borderRadius: '15px'
        }}>
          <p style={{ fontSize: '18px', color: '#65676b' }}>No items yet. Be the first to post!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                height: '200px', 
                background: '#e9ebee',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.images && item.images.length > 0 && item.images[0] ? (
                  <img 
                    src={item.images[0]} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <span style={{ fontSize: '60px', color: '#8a8d91' }}>📦</span>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1c1e21' }}>
                  {item.title}
                </h3>
                <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#65676b' }}>
                  {item.description}
                </p>

                <div style={{ 
                  background: '#f0f2f5', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  marginBottom: '15px'
                }}>
                  {/* ✅ NOW CHECKING FOR item.type === "bid" */}
                  {item.type === "bid" ? (
                    <>
                      <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#65676b' }}>
                        Starting Price: <strong>₱{item.price}</strong>
                      </p>
                      <p style={{ margin: '0 0 5px', fontSize: '16px', color: '#e41e3f', fontWeight: '700' }}>
                        💰 Highest Bid: ₱{item.highestBid || item.price}
                      </p>
                    </>
                  ) : (
                    <p style={{ margin: '0', fontSize: '16px', color: '#1877f2', fontWeight: '700' }}>
                      🏷️ Fixed Price: ₱{item.price}
                    </p>
                  )}
                  
                  <p style={{ margin: '0', fontSize: '13px', color: '#65676b', fontStyle: 'italic' }}>
                    🕒 {timeAgo(item.createdAt)}
                  </p>
                </div>

                {/* ✅ NOW CHECKING FOR item.type === "bid" */}
                {item.type === "bid" ? (
                  <button 
                    onClick={() => placeBid(item)}
                    style={{
                      width: '100%',
                      background: '#e41e3f',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#d41b39'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#e41e3f'}
                  >
                    ⚡ Place Your Bid
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/chat')}
                    style={{
                      width: '100%',
                      background: '#1877f2',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#166fe5'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#1877f2'}
                  >
                    💬 Chat Seller
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: '#2c3e50',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
        onClick={() => navigate('/chat')}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
      </div>
    </div>
  );
}