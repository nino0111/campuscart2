import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import '../styles/Home.css';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

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
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "listings", id));
      navigate("/home");
    }
  };

  const startChat = async () => {
    if (!user) {
      alert("Please login first!");
      navigate("/");
      return;
    }
    if (item.userId === user.uid) {
      alert("This is your own item!");
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
        const chatId = querySnapshot.docs[0].id;
        navigate(`/chat-room/${chatId}`);
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

  const viewSellerProfile = () => {
    navigate(`/user-profile/${item.userId}`);
  };

  if (!item) return <div className="content"><p>Loading...</p></div>;

  return (
    <div className="home-container" style={{ background: '#ffffff', minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/listings">Listings</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="profile-icon">
          <img src={user?.photoURL || "https://placehold.co/40x40"} alt="Profile" />
        </div>
      </nav>

      <div className="content" style={{ maxWidth: '900px', margin: '0 auto', padding: '0' }}>
        
        <div style={{ background: 'white', width: '100%' }}>

          {/* ✅ FIXED IMAGE SIZE - NOT TOO BIG */}
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            width: '100%',
            background: '#fff'
          }}>
            {item.images && item.images.map((url, i) => (
              <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}>
                <img 
                  src={url} 
                  alt="product" 
                  style={{
                    width: '100%',
                    height: '350px', // ✅ REDUCED HEIGHT
                    objectFit: 'contain' // ✅ SO IT FITS NICELY
                  }} 
                />
              </div>
            ))}
          </div>

          <div style={{ padding: '20px' }}>
            {/* TITLE & PRICE */}
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', margin: '0 0 10px 0' }}>
              {item.title}
            </h2>

            <p style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#000',
              margin: '0 0 15px 0'
            }}>
              ₱{item.price}
            </p>

            <p style={{
              display: 'inline-block',
              background: '#f0f2f5',
              color: '#000',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px'
            }}>
              {item.type === "bid" ? "Open for Bid" : "Fixed Price"}
            </p>

            {/* MESSAGE SELLER BAR */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f0f2f5',
              borderRadius: '50px',
              padding: '12px 15px',
              marginBottom: '25px'
            }}>
              <span style={{ fontSize: '20px', marginRight: '10px', color: '#1877f2' }}>💬</span>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#000' }}>Message seller</span>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#444' }}>🔔</div>
                <span style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Alerts</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#444' }}>🤝</div>
                <span style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Send offer</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#444' }}>↗️</div>
                <span style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Share</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#444' }}>📌</div>
                <span style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Save</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>Description</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#444',
                whiteSpace: 'pre-line'
              }}>
                {item.description}
              </p>
            </div>

            {/* MAIN BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button 
                onClick={viewSellerProfile}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#1877f2',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                👤 View Seller Profile
              </button>

              <button 
                onClick={startChat}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#25d366',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                💬 Chat with Seller
              </button>
            </div>

            {user && item.userId === user.uid && (
              <button 
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#e41e3f',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                🗑️ Mark as Sold / Delete
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}