import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { 
  doc, getDoc, deleteDoc, collection, addDoc, getDocs, 
  query, where, serverTimestamp, setDoc 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { 
  ArrowLeft, ShoppingBag, MessageCircle,
  Share2, Heart, ChevronLeft, ChevronRight 
} from "lucide-react";
import '../styles/Home.css';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const COLORS = {
    primary: '#2D3494',
    accent: '#4F46E5',
    textMain: '#1E293B',
    textMuted: '#64748B',
    priceGreen: '#059669',
    bgLight: '#F1F5F9',
    heartRed: '#EF4444'
  };

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "listings", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setItem(snap.data());
      }

      if (user) {
        const savedRef = doc(db, "users", user.uid, "saved", id);
        const savedSnap = await getDoc(savedRef);
        setIsSaved(savedSnap.exists());
      }
    };
    fetchItem();
  }, [id, user]);

  const toggleSave = async () => {
    if (!user) {
      setAlertMsg("Please login to save items!");
      setShowAlert(true);
      return;
    }

    const savedRef = doc(db, "users", user.uid, "saved", id);
    try {
      if (isSaved) {
        await deleteDoc(savedRef);
        setIsSaved(false);
      } else {
        await setDoc(savedRef, { 
          ...item, 
          savedAt: serverTimestamp(),
          originalId: id 
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ FIXED CHAT LOGIC
  const startChat = async () => {
    if (!user) {
      setAlertMsg("Please login first!");
      setShowAlert(true);
      return;
    }
    if (item.userId === user.uid) {
      setAlertMsg("This is your own item!");
      setShowAlert(true);
      return;
    }

    try {
      // 1. Check for existing chat between these users for this item
      const chatQuery = query(
        collection(db, "chats"),
        where("itemId", "==", id),
        where("participants", "array-contains", user.uid)
      );
      const querySnapshot = await getDocs(chatQuery);

      let existingChatId = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().participants.includes(item.userId)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        // ✅ Navigate to existing chat (Matches App.js route)
        navigate(`/chat-room/${existingChatId}`);
      } else {
        // 2. Create new chat if none exists
        const newChatRef = await addDoc(collection(db, "chats"), {
          itemId: id,
          itemName: item.title,
          participants: [user.uid, item.userId],
          lastMessage: "Hi, is this available?",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          sellerName: item.sellerName || "Campus Seller",
          buyerName: user.displayName || "Student Buyer"
        });
        // ✅ Navigate to new chat
        navigate(`/chat-room/${newChatRef.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      setAlertMsg("Failed to connect to seller. Please try again.");
      setShowAlert(true);
    }
  };

  if (!item) return <div style={{ padding: "100px", textAlign: "center" }}><p>Loading Item...</p></div>;

  return (
    <div className="home-container" style={{ background: COLORS.bgLight }}>
      
      {/* NAVBAR */}
      <header className="navbar" style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={backBtnStyle}>
            <ArrowLeft size={20} color={COLORS.textMain} />
          </button>
          <div style={{ background: COLORS.primary, padding: 8, borderRadius: 10, display: 'flex' }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>CampusCart</span>
        </div>
      </header>

      <main style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        
        {/* LEFT SIDE: GALLERY */}
        <div style={galleryPane}>
          {item.images && item.images.length > 0 ? (
            <>
              <img 
                src={item.images[currentImgIndex]} 
                alt="product" 
                style={mainImgStyle} 
              />
              {item.images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImgIndex(prev => (prev > 0 ? prev - 1 : item.images.length - 1))} style={prevBtn}><ChevronLeft color="white" size={30} /></button>
                  <button onClick={() => setCurrentImgIndex(prev => (prev < item.images.length - 1 ? prev + 1 : 0))} style={nextBtn}><ChevronRight color="white" size={30} /></button>
                </>
              )}
            </>
          ) : (
            <div style={{ color: 'white' }}>No Images Available</div>
          )}
        </div>

        {/* RIGHT SIDE: DETAILS */}
        <aside style={detailsSidebar}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.textMain, marginBottom: 8 }}>{item.title}</h1>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.priceGreen, marginBottom: 4 }}>
            ₱{Number(item.price).toLocaleString()}
          </div>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
            Listed in {item.location || "Campus Area"}
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 25 }}>
            <button onClick={startChat} style={chatActionBtn}>
              <MessageCircle size={20} /> Message Seller
            </button>
            
            <button 
              onClick={toggleSave}
              style={{ ...iconActionBtn, background: isSaved ? '#FEF2F2' : '#F1F5F9' }}
            >
              <Heart 
                size={22} 
                fill={isSaved ? COLORS.heartRed : "none"} 
                color={isSaved ? COLORS.heartRed : COLORS.textMain} 
              />
            </button>
            
            <button style={iconActionBtn}><Share2 size={20} color={COLORS.textMain} /></button>
          </div>

          <hr style={divider} />

          <section>
            <h3 style={sectionTitle}>Description</h3>
            <p style={descriptionText}>{item.description}</p>
          </section>

          <hr style={divider} />

          <section>
            <h3 style={sectionTitle}>Seller</h3>
            <div style={sellerCard} onClick={() => navigate(`/user-profile/${item.userId}`)}>
              <div style={sellerAvatar}>{item.sellerName?.charAt(0) || "S"}</div>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.textMain }}>{item.sellerName || "Campus Seller"}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>View Profile</div>
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* ALERT MODAL */}
      {showAlert && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={modalTitle}>CampusCart</h3>
            <p style={modalText}>{alertMsg}</p>
            <button onClick={() => setShowAlert(false)} style={modalBtn}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

const navStyle = { padding: "15px 40px", background: "white", borderBottom: "1px solid #E2E8F0" };
const backBtnStyle = { border: 'none', background: 'transparent', cursor: 'pointer', padding: 8 };
const galleryPane = { flex: 1.5, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const mainImgStyle = { maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' };
const detailsSidebar = { width: '450px', background: 'white', padding: '35px', overflowY: 'auto', borderLeft: '1px solid #E2E8F0' };
const chatActionBtn = { flex: 1, height: 50, background: '#2D3494', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 };
const iconActionBtn = { width: 50, height: 50, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' };
const divider = { border: 'none', borderTop: '1px solid #F1F5F9', margin: '25px 0' };
const sectionTitle = { fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#1E293B' };
const descriptionText = { fontSize: 15, lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-wrap' };
const sellerCard = { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px', borderRadius: '12px', background: '#F8FAFC' };
const sellerAvatar = { width: 45, height: 45, borderRadius: '50%', background: '#2D3494', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const prevBtn = { position: 'absolute', left: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 10, cursor: 'pointer' };
const nextBtn = { position: 'absolute', right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 10, cursor: 'pointer' };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const modalBox = { background: "white", borderRadius: "20px", padding: "30px", width: "90%", maxWidth: "380px", textAlign: 'center' };
const modalTitle = { fontSize: "20px", fontWeight: 800, color: "#2D3494", marginBottom: "10px" };
const modalText = { fontSize: "15px", color: "#475569", marginBottom: "25px" };
const modalBtn = { width: "100%", padding: "12px", background: "#2D3494", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" };