import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Trash2, 
  Share2, 
  Bookmark, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import '../styles/Home.css';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  // ✅ NEW: For Custom Alert
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const COLORS = {
    primary: '#2D3494',
    accent: '#4F46E5',
    textMain: '#1E293B',
    textMuted: '#64748B',
    priceGreen: '#059669',
    bgLight: '#F1F5F9'
  };

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "listings", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setItem(snap.data());
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to mark this as sold/delete?")) {
      await deleteDoc(doc(db, "listings", id));
      navigate("/home");
    }
  };

  const startChat = async () => {
    if (!user) {
      // ✅ Replaced alert with custom modal
      setAlertMsg("Please login first!");
      setShowAlert(true);
      navigate("/");
      return;
    }
    if (item.userId === user.uid) {
      // ✅ Replaced alert with custom modal
      setAlertMsg("This is your own item!");
      setShowAlert(true);
      return;
    }

    try {
      const chatQuery = query(
        collection(db, "chats"),
        where("itemId", "==", id),
        where("participants", "array-contains", user.uid)
      );
      const querySnapshot = await getDocs(chatQuery);

      if (!querySnapshot.empty) {
        navigate(`/chat-room/${querySnapshot.docs[0].id}`);
      } else {
        const newChatRef = await addDoc(collection(db, "chats"), {
          itemId: id,
          itemName: item.title,
          participants: [user.uid, item.userId],
          lastMessage: "Hi, is this available?",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        navigate(`/chat-room/${newChatRef.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (!item) return <div style={{ padding: "100px", textAlign: "center" }}><p>Loading Item...</p></div>;

  return (
    <div className="home-container" style={{ background: COLORS.bgLight }}>
      
      {/* ✅ UNIFIED NAVBAR */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} className="back-btn" style={{ border: 'none', background: 'transparent' }}>
            <ArrowLeft size={20} color={COLORS.textMain} />
          </button>
          <div style={{ background: COLORS.primary, padding: 8, borderRadius: 10, display: 'flex' }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>CampusCart</span>
        </div>
        <div className="nav-links">
          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
        </div>
      </header>

      <main style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        
        {/* ✅ LEFT SIDE: IMAGE GALLERY (Facebook Style) */}
        <div style={{ flex: 1.5, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {item.images && item.images.length > 0 ? (
            <>
              <img 
                src={item.images[currentImgIndex]} 
                alt="product" 
                style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} 
              />
              {item.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImgIndex(prev => (prev > 0 ? prev - 1 : item.images.length - 1))}
                    style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', p: 10, cursor: 'pointer' }}
                  >
                    <ChevronLeft color="white" size={30} />
                  </button>
                  <button 
                    onClick={() => setCurrentImgIndex(prev => (prev < item.images.length - 1 ? prev + 1 : 0))}
                    style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', p: 10, cursor: 'pointer' }}
                  >
                    <ChevronRight color="white" size={30} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div style={{ color: 'white' }}>No Images Available</div>
          )}
        </div>

        {/* ✅ RIGHT SIDE: DETAILS SIDEBAR (Professional Layout) */}
        <aside style={{ width: '450px', background: 'white', padding: '30px', overflowY: 'auto', borderLeft: '1px solid #E2E8F0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.textMain, marginBottom: 8 }}>{item.title}</h1>
          <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.priceGreen, marginBottom: 4 }}>
            ₱{Number(item.price).toLocaleString()}
          </div>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
            Listed in {item.location || "Campus Area"}
          </p>

          <div style={{ display: 'flex', gap: 10, marginBottom: 25 }}>
            <button onClick={startChat} style={{ flex: 1, height: 45, background: COLORS.primary, color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <MessageCircle size={18} /> Message
            </button>
            <button style={{ width: 45, height: 45, background: '#F1F5F9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={18} color={COLORS.textMain} />
            </button>
            <button style={{ width: 45, height: 45, background: '#F1F5F9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={18} color={COLORS.textMain} />
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />

          <section>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Details</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <span style={{ color: COLORS.textMuted }}>Condition</span>
              <span style={{ fontWeight: 600 }}>New / Good</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: COLORS.textMain, whiteSpace: 'pre-wrap' }}>
              {item.description}
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />

          <section>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15 }}>Seller Information</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate(`/user-profile/${item.userId}`)}>
              <img 
                src={"https://placehold.co/45x45/2D3494/FFFFFF?text=S"} 
                style={{ borderRadius: '50%', width: 45, height: 45 }} 
                alt="seller" 
              />
              <div>
                <div style={{ fontWeight: 700, color: COLORS.textMain }}>Campus Seller</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>View Profile <ChevronRight size={12} /></div>
              </div>
            </div>
          </section>

          {/* OWNER ACTIONS */}
          {user && item.userId === user.uid && (
            <button 
              onClick={handleDelete}
              style={{ width: '100%', marginTop: 40, padding: '12px', background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              <Trash2 size={18} /> Mark as Sold / Delete
            </button>
          )}
        </aside>

      </main>

      {/* ✅ CUSTOM ALERT MODAL - BRANDED DESIGN */}
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