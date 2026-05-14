import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";

export default function AdSidebar() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    // Fetch latest 2 active ads
    const q = query(
      collection(db, "advertisements"), 
      orderBy("createdAt", "desc"), 
      limit(2)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {ads.map(ad => (
        <div key={ad.id} style={adCard}>
          <img src={ad.imageUrl} alt={ad.title} style={adImage} />
          <div style={{ padding: "10px" }}>
            <span style={badge}>SPONSORED</span>
            <h4 style={{ margin: "5px 0", fontSize: "14px" }}>{ad.title}</h4>
            <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>{ad.businessName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const adCard = { background: "#F1F5F9", borderRadius: "12px", overflow: "hidden", border: "1px solid #E2E8F0" };
const adImage = { width: "100%", height: "100px", objectFit: "cover" };
const badge = { fontSize: "9px", fontWeight: "900", color: "#2D3494", background: "#EEF2FF", padding: "2px 6px", borderRadius: "4px" };