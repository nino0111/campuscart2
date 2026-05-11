import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { 
  doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp 
} from "firebase/firestore";
import { MessageSquare, Mail, MapPin, Package, Loader2, ArrowLeft, Hash } from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (userSnap.exists()) {
          setProfileUser(userSnap.data());
        }

        const q = query(collection(db, "listings"), where("userId", "==", userId));
        const listingsSnap = await getDocs(q);
        setUserListings(listingsSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })));
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleMessageUser = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    if (currentUser.uid === userId) return;

    try {
      const chatQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid)
      );
      
      const querySnapshot = await getDocs(chatQuery);
      let existingChatId = null;

      querySnapshot.forEach((doc) => {
        if (doc.data().participants.includes(userId)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        navigate(`/chat-room/${existingChatId}`);
      } else {
        const newChatRef = await addDoc(collection(db, "chats"), {
          participants: [currentUser.uid, userId],
          lastMessage: "Hi!",
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          sellerName: profileUser?.displayName || profileUser?.username || "Campus User",
          buyerName: currentUser.displayName || "Student",
          itemId: null 
        });
        navigate(`/chat-room/${newChatRef.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={40} color="#2D3494" />
    </div>
  );

  // ✅ NAME LOGIC
  const displayedName = profileUser?.displayName || profileUser?.username || profileUser?.fullName || "Campus User";
  
  // ✅ STUDENT ID LOGIC: Checks for various common field names
  const studentId = profileUser?.studentId || profileUser?.studentNumber || profileUser?.idNumber || "N/A";
  
  const userPhoto = profileUser?.photoURL || profileUser?.profilePic;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <header style={headerStyle}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <span style={{ fontWeight: 800, color: "#2D3494" }}>User Profile</span>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* PROFILE HEADER */}
        <div style={profileCardStyle}>
          <div style={avatarWrapper}>
            <div style={blueRing}>
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" style={avatarImgStyle} />
              ) : (
                <div style={avatarCircle}>
                  {displayedName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <h1 style={userNameStyle}>{displayedName}</h1>
          
          {/* ✅ ADDED STUDENT ID DISPLAY */}
          <div style={studentBadge}>
            <Hash size={14} /> ID: {studentId}
          </div>
          
          <div style={statsRow}>
            <div style={statItem}><Mail size={16} /> {profileUser?.email || "No email"}</div>
            <div style={statItem}><MapPin size={16} /> {profileUser?.location || "PSAU"}</div>
            <div style={statItem}><Package size={16} /> {userListings.length} Listings</div>
          </div>

          <button onClick={handleMessageUser} style={messageBtnStyle}>
            <MessageSquare size={18} /> Message {displayedName.split(' ')[0]}
          </button>
        </div>

        {/* LISTINGS */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1E293B", marginBottom: "20px" }}>Active Listings</h2>
          <div style={gridStyle}>
            {userListings.map(item => (
              <div key={item.id} onClick={() => navigate(`/detail/${item.id}`)} style={itemCard}>
                <img src={item.images?.[0] || item.imageUrl} alt="" style={itemImg} />
                <div style={{ padding: "12px" }}>
                  <div style={{ color: "#059669", fontWeight: "800" }}>₱{Number(item.price).toLocaleString()}</div>
                  <div style={{ fontWeight: "600", fontSize: "14px", marginTop: "4px" }}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- STYLES --- */
const headerStyle = { padding: "20px 5%", display: "flex", alignItems: "center", gap: "15px", background: "white", borderBottom: "1px solid #E2E8F0" };
const profileCardStyle = { background: "white", borderRadius: "24px", padding: "40px", textAlign: "center", border: "1px solid #E2E8F0" };

const avatarWrapper = { display: 'flex', justifyContent: 'center', marginBottom: '15px' };
const blueRing = {
  padding: "4px", 
  borderRadius: "50%",
  border: "1.5px solid #2D3494",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const avatarImgStyle = { width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" };
const avatarCircle = { width: "100px", height: "100px", borderRadius: "50%", background: "#2D3494", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "800" };

const userNameStyle = { fontSize: "28px", fontWeight: "800", color: "#1E293B", marginBottom: "5px" };

// ✅ NEW BADGE STYLE FOR STUDENT NUMBER
const studentBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  background: "#F1F5F9",
  color: "#64748B",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "20px"
};

const statsRow = { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", color: "#64748B", fontSize: "14px", marginBottom: "30px" };
const statItem = { display: "flex", alignItems: "center", gap: "6px" };
const messageBtnStyle = { background: "#2D3494", color: "white", border: "none", padding: "12px 30px", borderRadius: "12px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px" };
const itemCard = { background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E8F0", cursor: "pointer" };
const itemImg = { width: "100%", height: "140px", objectFit: "cover" };