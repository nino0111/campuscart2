import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Package, ChevronLeft, MapPin, Plus } from "lucide-react";

export default function MyListings() {
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
  // Use onAuthStateChanged to wait for the user to be fully loaded
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      const fetchMyListings = async () => {
        try {
          const q = query(
            collection(db, "listings"),
            where("userId", "==", user.uid)
            // Removed orderBy temporarily to check if it's an index issue
          );
          const snap = await getDocs(q);
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Sort manually in Javascript to avoid needing a Firestore Index
          const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
          setMyItems(sortedData);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMyListings();
    } else {
      setLoading(false);
      navigate("/auth");
    }
  });

  return () => unsubscribe();
}, [navigate]);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", padding: "30px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={() => navigate(-1)} style={backBtn}><ChevronLeft /></button>
            <h1 style={{ fontSize: "28px", fontWeight: 800 }}>My Listings</h1>
          </div>
          <button onClick={() => navigate("/create-listing")} style={addBtn}>
            <Plus size={18} /> Create New
          </button>
        </header>

        {loading ? (
          <p>Loading your items...</p>
        ) : myItems.length > 0 ? (
          <div style={grid}>
            {myItems.map(item => (
              <div key={item.id} onClick={() => navigate(`/detail/${item.id}`)} style={card}>
                <img src={item.images?.[0] || item.imageUrl} style={imgStyle} alt="" />
                <div style={{ padding: "15px" }}>
                  <div style={{ color: "#2D3494", fontWeight: "800", fontSize: "18px" }}>₱{item.price}</div>
                  <div style={{ fontWeight: "700", margin: "5px 0" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} /> {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyState}>
            <Package size={50} color="#CBD5E1" />
            <p>You haven't posted any items yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const backBtn = { background: "white", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "8px", cursor: "pointer" };
const addBtn = { background: "#2D3494", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" };
const card = { background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E8F0", cursor: "pointer" };
const imgStyle = { width: "100%", height: "150px", objectFit: "cover" };
const emptyState = { textAlign: "center", marginTop: "100px", color: "#94A3B8" };