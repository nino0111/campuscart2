import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { MessageCircle, ArrowLeft, Mail, IdCard, Package, MapPin, ShoppingBag } from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const itemsQ = query(
          collection(db, "listings"), 
          where("userId", "==", userId)
        );
        const itemsSnap = await getDocs(itemsQ);
        setUserItems(itemsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // ✅ Function to start a chat directly from the profile
  const handleStartChat = async () => {
    if (!currentUser) return navigate("/auth");
    if (currentUser.uid === userId) return alert("You cannot message yourself!");

    try {
      // Check if chat already exists
      const chatQ = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid)
      );
      const chatSnap = await getDocs(chatQ);
      const existingChat = chatSnap.docs.find(doc => doc.data().participants.includes(userId));

      if (existingChat) {
        navigate(`/chat/${existingChat.id}`);
      } else {
        const newChat = await addDoc(collection(db, "chats"), {
          participants: [currentUser.uid, userId],
          buyerName: currentUser.displayName,
          sellerName: userData.fullName,
          updatedAt: serverTimestamp(),
          lastMessage: "Started a chat from profile"
        });
        navigate(`/chat/${newChat.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Profile...</div>;
  if (!userData) return <div style={{ padding: '50px', textAlign: 'center' }}>User not found.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={backBtnStyle}>
        <ArrowLeft size={18} /> Back
      </button>

      <div style={profileCardStyle}>
        <div style={avatarLargeStyle}>
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            userData.fullName?.charAt(0) || "U"
          )}
        </div>

        <h1 style={{ margin: '15px 0 5px 0', fontSize: '28px', color: '#1E293B', fontWeight: '800' }}>
          {userData.fullName}
        </h1>
        
        <div style={infoGridStyle}>
          <div style={infoRowStyle}><Mail size={16} /> {userData.email}</div>
          <div style={infoRowStyle}><IdCard size={16} /> ID: {userData.studentId || "N/A"}</div>
          <div style={infoRowStyle}><MapPin size={16} /> {userData.address || "No location set"}</div>
          <div style={infoRowStyle}><Package size={16} /> {userItems.length} Active Listings</div>
        </div>

        {/* ✅ NEW MESSAGE BUTTON */}
        {currentUser?.uid !== userId && (
          <button onClick={handleStartChat} style={messageBtnStyle}>
            <MessageCircle size={18} /> Message {userData.fullName.split(' ')[0]}
          </button>
        )}
      </div>

      <h2 style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '15px', marginTop: '40px', fontWeight: '700' }}>
        Items for Sale
      </h2>

      {userItems.length > 0 ? (
        <div style={gridStyle}>
          {userItems.map(item => (
            <div key={item.id} onClick={() => navigate(`/detail/${item.id}`)} style={cardStyle}>
              <img 
                src={Array.isArray(item.images) ? item.images[0] : (item.imageUrl || "https://placehold.co/400x300")} 
                alt={item.title} 
                style={imgStyle} 
              />
              <div style={{ padding: '15px' }}>
                <div style={{ fontWeight: '700', fontSize: '16px' }}>{item.title}</div>
                <div style={{ color: '#2D3494', fontWeight: '800', marginTop: '5px' }}>₱{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748B' }}>
          <ShoppingBag size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
          <p>No active listings.</p>
        </div>
      )}
    </div>
  );
}

const backBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '20px', fontWeight: '700' };
const profileCardStyle = { background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' };
const avatarLargeStyle = { width: '120px', height: '120px', background: '#2D3494', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '800', margin: '0 auto', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const infoGridStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' };
const infoRowStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' };
const messageBtnStyle = { marginTop: '25px', padding: '12px 25px', background: '#2D3494', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '25px auto 0 auto', transition: '0.2s' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', marginTop: '20px' };
const cardStyle = { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer' };
const imgStyle = { width: '100%', height: '180px', objectFit: 'cover' };