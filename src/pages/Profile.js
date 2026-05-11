import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; 
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShoppingBag, User as UserIcon, LogOut, Camera,
  ChevronRight, Settings,  
  Star, CheckCircle2, TrendingUp, Loader2, MapPin, Check, X
} from "lucide-react";
import '../styles/Home.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");
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
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        setUser({ ...currentUser, ...userData });
        setNewLocation(userData?.address || "");
        fetchMyItems(currentUser.uid);
      } else {
        navigate('/auth');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchMyItems = async (userId) => {
    try {
      const q = query(collection(db, "listings"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyItems(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // ✅ NEW: Update Location Logic
  const handleUpdateLocation = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { address: newLocation });
      setUser(prev => ({ ...prev, address: newLocation }));
      setIsEditingLocation(false);
      alert("Location updated successfully!");
    } catch (error) {
      alert("Error updating location: " + error.message);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_preset_name"); 

      const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", { 
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.secure_url;

      await updateProfile(auth.currentUser, { photoURL: imageUrl });
      await updateDoc(doc(db, "users", user.uid), { photoURL: imageUrl });
      
      setUser(prev => ({ ...prev, photoURL: imageUrl }));
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/auth');
    } catch (error) { console.error(error); }
  };

  if (!user) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="home-container" style={{ background: COLORS.bgLight, minHeight: '100vh' }}>
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
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isUploading ? <Loader2 className="animate-spin" size={30} color={COLORS.primary} /> : user.photoURL ? <img src={user.photoURL} alt="pfp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={40} color="#94A3B8" />}
              </div>
              <label htmlFor="fileInput" style={{ position: 'absolute', bottom: '0', right: '0', background: COLORS.primary, padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
                <Camera size={14} /><input type="file" id="fileInput" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{user.fullName || "Student"}</h2>
            <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: 15 }}>{user.email}</p>

            {/* ✅ LOCATION SECTION WITH EDIT LOGIC */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: COLORS.textMuted, textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Location</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <MapPin size={14} color={COLORS.primary} />
                {isEditingLocation ? (
                  <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                    <input 
                      style={{ border: 'none', background: 'transparent', fontSize: '12px', flex: 1, outline: 'none' }}
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      autoFocus
                    />
                    <Check size={14} color={COLORS.priceGreen} style={{ cursor: 'pointer' }} onClick={handleUpdateLocation} />
                    <X size={14} color="#E11D48" style={{ cursor: 'pointer' }} onClick={() => setIsEditingLocation(false)} />
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', flex: 1, color: COLORS.textMain }}>{user.address || "Add location..."}</span>
                )}
                {!isEditingLocation && <Settings size={12} style={{ cursor: 'pointer', color: COLORS.textMuted }} onClick={() => setIsEditingLocation(true)} />}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 15px', color: '#E11D48', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={statBoxStyle}><TrendingUp size={20} color={COLORS.primary} /><div style={statNumStyle}>{myItems.length}</div><div style={statLabelStyle}>Active</div></div>
            <div style={statBoxStyle}><CheckCircle2 size={20} color={COLORS.priceGreen} /><div style={statNumStyle}>0</div><div style={statLabelStyle}>Sold</div></div>
            <div style={statBoxStyle}><Star size={20} color="#F59E0B" /><div style={statNumStyle}>5.0</div><div style={statLabelStyle}>Rating</div></div>
          </div>

          <div style={sectionBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Manage Listings</h3>
              <Link to="/create-listing" style={{ color: COLORS.accent, fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>+ Add New</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myItems.map(item => (
                <div key={item.id} style={itemRowStyle} onClick={() => navigate(`/detail/${item.id}`)}>
                  <img src={item.imageUrl || (item.images && item.images[0]) || "https://placehold.co/45x45"} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} alt="item" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: COLORS.priceGreen, fontWeight: 700 }}>₱{Number(item.price).toLocaleString()}</div>
                  </div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const statBoxStyle = { background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };
const statNumStyle = { fontSize: '22px', fontWeight: 800, marginTop: '8px' };
const statLabelStyle = { fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' };
const sectionBoxStyle = { background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' };
const itemRowStyle = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer' };