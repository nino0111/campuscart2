import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronLeft } from "lucide-react";

export default function SavedItems() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return navigate("/auth");

    const fetchSaved = async () => {
      try {
        // Retrieve from the 'saved' sub-collection of the current user
        const q = query(collection(db, "users", user.uid, "saved"), orderBy("savedAt", "desc"));
        const snap = await getDocs(q);
        setSavedItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user, navigate]);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", padding: "30px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
          <button onClick={() => navigate(-1)} style={backBtn}><ChevronLeft /></button>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Saved Items</h1>
        </header>

        {loading ? (
          <p>Loading your watchlist...</p>
        ) : savedItems.length > 0 ? (
          <div style={grid}>
            {savedItems.map(item => (
              <div key={item.id} onClick={() => navigate(`/detail/${item.originalId || item.id}`)} style={card}>
                <img src={item.images?.[0] || item.imageUrl} style={imgStyle} alt="" />
                <div style={{ padding: "15px" }}>
                  <div style={{ color: "#EF4444", fontWeight: "800", fontSize: "18px", display: "flex", justifyContent: "space-between" }}>
                    ₱{item.price} <Heart size={18} fill="#EF4444" />
                  </div>
                  <div style={{ fontWeight: "700", margin: "5px 0" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>{item.location}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyState}>
            <Heart size={50} color="#CBD5E1" />
            <p>Your watchlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// (Use the same styles as MyListings above)
const backBtn = { background: "white", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "8px", cursor: "pointer" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" };
const card = { background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E8F0", cursor: "pointer" };
const imgStyle = { width: "100%", height: "150px", objectFit: "cover" };
const emptyState = { textAlign: "center", marginTop: "100px", color: "#94A3B8" };