import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import '../styles/Home.css';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const data = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "No Title",
          price: d.price ?? 0,
          type: d.type || "fixed",
          images: Array.isArray(d.images) ? d.images : []
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
    <div className="home-container" style={{ 
      background: darkMode ? '#1a1a1a' : '#f0f2f5',
      color: darkMode ? 'white' : '#1c1e21',
      transition: 'all 0.3s ease',
      minHeight: '100vh',
      position: 'relative'
    }}>
      
      <nav className="navbar" style={{ 
        background: darkMode ? '#2c2c2c' : 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: darkMode ? 'white' : '#1c1e21',
              padding: '5px 10px',
              marginRight: '15px'
            }}
          >
            ☰
          </button>

          <Link to="/home" style={{ color: darkMode ? 'white' : '#1c1e21', textDecoration: 'none' }}>Home</Link>
          <Link to="/listings" style={{ color: darkMode ? 'white' : '#1c1e21', textDecoration: 'none', margin: '0 15px' }}>Listings</Link>
          <Link to="/profile" style={{ color: darkMode ? 'white' : '#1c1e21', textDecoration: 'none', marginRight: '15px' }}>Profile</Link>
          <Link to="/cart" style={{ color: darkMode ? 'white' : '#1c1e21', textDecoration: 'none' }}>Cart</Link>
        </div>

        <div className="profile-icon">
          <img src="https://placehold.co/40x40" alt="Profile" />
        </div>
      </nav>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="content">
        <h1 className="logo-text">CampusCart</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search textbooks, backpacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ color: darkMode ? 'white' : '#1c1e21' }}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="create-listing-btn">
          <Link to="/create-listing" className="create-link">+ Create Listing</Link>
        </div>

        <div className="grid">
          {filteredItems.length === 0 ? (
            <p className="empty-text">No listings yet</p>
          ) : (
            filteredItems.map(item => (
              <Link to={`/detail/${item.id}`} key={item.id} className="card-link">
                <div className="card" style={{ background: darkMode ? '#2c2c2c' : 'white' }}>
                  <div className="img-box">
                    <img
                      src={
                        item.images.length > 0
                          ? item.images[0]
                          : "https://placehold.co/200x200/EEEEEE/333333?text=No+Image"
                      }
                      alt="product"
                    />
                  </div>
                  <div className="info">
                    <h3>{item.title}</h3>
                    <p className="price">₱{item.price}</p>
                    <p className="type">
                      {item.type === "bid" ? "Open for Bid" : "Fixed Price"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {showChat && <ChatBox onClose={() => setShowChat(false)} darkMode={darkMode} />}

      <div 
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          background: darkMode ? '#1877f2' : '#2c3e50',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
          transition: 'transform 0.2s, background 0.2s'
        }}
        onClick={() => setShowChat(!showChat)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.background = darkMode ? '#1461c0' : '#1e2a38';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = darkMode ? '#1877f2' : '#2c3e50';
        }}
      >
        <span style={{ color: 'white', fontSize: 24 }}>💬</span>
      </div>
    </div>
  );
}