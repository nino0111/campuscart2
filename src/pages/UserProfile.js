import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ShoppingBag, ArrowLeft, Mail, IdCard, Package, MapPin } from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. Get User Details
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        // 2. Get User's Listings (CHANGED sellerId to userId to match your database)
        const itemsQ = query(
          collection(db, "listings"), 
          where("userId", "==", userId)
        );
        const itemsSnap = await getDocs(itemsQ);
        setUserItems(itemsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (error) {
        console.error("Error stalking user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Profile...</div>;
  if (!userData) return <div style={{ padding: '50px', textAlign: 'center' }}>User not found.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER */}
      <button onClick={() => navigate(-1)} style={backBtnStyle}>
        <ArrowLeft size={18} /> Back to Chat
      </button>

      <div style={profileCardStyle}>
        <div style={avatarLargeStyle}>
          {userData.fullName?.charAt(0) || "U"}
        </div>
        <h1 style={{ margin: '15px 0 5px 0', fontSize: '28px', color: '#1E293B', fontWeight: '800' }}>
          {userData.fullName}
        </h1>
        
        <div style={infoGridStyle}>
          <div style={infoRowStyle}><Mail size={16} /> {userData.email}</div>
          <div style={infoRowStyle}><IdCard size={16} /> ID: {userData.studentId || "N/A"}</div>
          <div style={infoRowStyle}><MapPin size={16} /> {userData.address || "Pampanga State Agricultural University"}</div>
          <div style={infoRowStyle}><Package size={16} /> {userItems.length} Active Listings</div>
        </div>
      </div>

      <h2 style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '15px', marginTop: '40px', fontWeight: '700' }}>
        Items for Sale
      </h2>

      {userItems.length > 0 ? (
        <div style={gridStyle}>
          {userItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/detail/${item.id}`)} 
              style={cardStyle}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* ✅ UPDATED IMAGE LOGIC: Handles single imageUrl or images array */}
              <img 
                src={Array.isArray(item.images) ? item.images[0] : (item.imageUrl || "https://placehold.co/400x300?text=No+Image")} 
                alt={item.title} 
                style={imgStyle} 
              />
              <div style={{ padding: '15px' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E293B' }}>{item.title}</div>
                <div style={{ color: '#2D3494', fontWeight: '800', marginTop: '5px', fontSize: '18px' }}>₱{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748B' }}>
          <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p>This seller currently has no active listings.</p>
        </div>
      )}
    </div>
  );
}

/* --- STYLES --- */
const backBtnStyle = { 
  display: 'flex', alignItems: 'center', gap: '8px', border: 'none', 
  background: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '20px', 
  fontWeight: '700', padding: '10px 0' 
};

const profileCardStyle = { 
  background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', 
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' 
};

const avatarLargeStyle = { 
  width: '100px', height: '100px', background: '#2D3494', color: 'white', 
  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
  fontSize: '40px', fontWeight: '800', margin: '0 auto', boxShadow: '0 4px 12px rgba(45, 52, 148, 0.2)' 
};

const infoGridStyle = { 
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', 
  marginTop: '20px', maxWidth: '600px', margin: '20px auto 0 auto' 
};

const infoRowStyle = { 
  display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', 
  fontSize: '14px', fontWeight: '500' 
};

const gridStyle = { 
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
  gap: '25px', marginTop: '20px' 
};

const cardStyle = { 
  background: 'white', borderRadius: '16px', overflow: 'hidden', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', 
  transition: 'all 0.3s ease', border: '1px solid #F1F5F9' 
};

const imgStyle = { width: '100%', height: '180px', objectFit: 'cover' };