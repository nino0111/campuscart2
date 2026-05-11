import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShoppingBag, User as UserIcon, LogOut, Camera, Package, 
  Plus, ChevronRight, MessageCircle, Settings, CreditCard, 
  ShieldCheck, Star, History, CheckCircle2, TrendingUp
} from "lucide-react";
import '../styles/Home.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const navigate = useNavigate();

  const COLORS = {
    primary: '#2D3494',
    accent: '#4F46E5',
    textMain: '#1E293B',
    textMuted: '#64748B',
    priceGreen: '#059669',
    bgLight: '#F8FAFC'
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchMyItems(currentUser.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchMyItems = async (userId) => {
    try {
      const q = query(collection(db, "listings"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setMyItems(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) { console.error(error); }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageUpload(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageUpload || !user) return;
    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);
    uploadTask.on("state_changed", () => {}, (error) => { setUploading(false); }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateProfile(user, { photoURL: downloadURL });
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: downloadURL });
        setUser({ ...user, photoURL: downloadURL });
        setUploading(false);
        setImageUpload(null);
      }
    );
  };

  if (!user) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="home-container" style={{ background: COLORS.bgLight, minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: COLORS.primary, padding: 8, borderRadius: 10, display: 'flex' }}>
            <ShoppingBag size={22} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.primary }}>CampusCart</span>
        </div>
        <div className="nav-links">
          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/listings" className="nav-item">Marketplace</Link>
          <Link to="/profile" className="nav-item active">Profile</Link>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        
        {/* LEFT COLUMN */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* USER CARD */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {user.photoURL ? <img src={user.photoURL} alt="pfp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={40} color="#94A3B8" style={{ marginTop: 25 }} />}
              </div>
              <label htmlFor="fileInput" style={{ position: 'absolute', bottom: '0', right: '0', background: COLORS.primary, padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
                <Camera size={14} /><input type="file" id="fileInput" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{user.displayName || "Student"}</h2>
            <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: 15 }}>{user.email}</p>
            
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '12px', marginBottom: 20 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: 5 }}>
                 <span>Profile Strength</span>
                 <span>85%</span>
               </div>
               <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '10px' }}>
                 <div style={{ width: '85%', height: '100%', background: COLORS.priceGreen, borderRadius: '10px' }}></div>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={sidebarBtnStyle}><Settings size={16} /> Settings</button>
              <button style={sidebarBtnStyle}><CreditCard size={16} /> Wallet</button>
              <button onClick={handleLogout} style={{ ...sidebarBtnStyle, color: '#E11D48', background: '#FFF1F2', border: '1px solid #FECDD3' }}><LogOut size={16} /> Logout</button>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={statBoxStyle}><TrendingUp size={20} color={COLORS.primary} /><div style={statNumStyle}>{myItems.length}</div><div style={statLabelStyle}>Active</div></div>
            <div style={statBoxStyle}><CheckCircle2 size={20} color={COLORS.priceGreen} /><div style={statNumStyle}>12</div><div style={statLabelStyle}>Sold</div></div>
            <div style={statBoxStyle}><Star size={20} color="#F59E0B" /><div style={statNumStyle}>4.9</div><div style={statLabelStyle}>Rating</div></div>
          </div>

          {/* LISTINGS BOX */}
          <div style={sectionBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Manage Listings</h3>
              <Link to="/create-listing" style={{ color: COLORS.accent, fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>+ Add New</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myItems.map(item => (
                <div key={item.id} className="sidebar-item" style={itemRowStyle} onClick={() => navigate(`/detail/${item.id}`)}>
                  <img src={item.images?.[0] || "https://placehold.co/40x40"} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} alt="item" />
                  <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: 700 }}>{item.title}</div><div style={{ fontSize: '13px', color: COLORS.priceGreen, fontWeight: 700 }}>₱{Number(item.price).toLocaleString()}</div></div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div style={sectionBoxStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={20} /> Recent Transactions
            </h3>
            <div style={{ textAlign: 'center', padding: '20px', color: COLORS.textMuted, fontSize: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #E2E8F0' }}>
              No recent purchases to display.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// STYLE OBJECTS
const sidebarBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 15px',
  background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px',
  fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer', transition: '0.2s'
};

const statBoxStyle = {
  background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
};

const statNumStyle = { fontSize: '22px', fontWeight: 800, marginTop: '8px' };
const statLabelStyle = { fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' };

const sectionBoxStyle = {
  background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #E2E8F0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
};

const itemRowStyle = {
  display: 'flex', alignItems: 'center', gap: '15px', padding: '12px',
  background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer'
};