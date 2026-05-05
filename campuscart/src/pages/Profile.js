import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [myItems, setMyItems] = useState([]); // ✅ NEW
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // ✅ FETCH MY ITEMS
        await fetchMyItems(currentUser.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ FUNCTION TO FETCH MY ITEMS
  const fetchMyItems = async (userId) => {
    try {
      const q = query(
        collection(db, "listings"),
        where("userId", "==", userId) // Only get my items
      );
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageUpload || !user) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);

    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        await updateProfile(user, { photoURL: downloadURL });
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: downloadURL });

        setUser({ ...user, photoURL: downloadURL });
        localStorage.setItem('user', JSON.stringify({ ...user, photoURL: downloadURL }));

        setUploading(false);
        setImageUpload(null);
        alert("Profile picture updated!");
      }
    );
  };

  if (!user) return <div style={{ padding: '50px', fontSize: '20px' }}>Loading...</div>;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f2f5', 
      padding: '20px',
      fontFamily: "'Segoe UI', Roboto, sans-serif"
    }}>
      <nav style={{ 
        background: 'white', 
        padding: '15px 30px', 
        borderRadius: '15px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '30px',
        display: 'flex',
        gap: '30px',
        alignItems: 'center'
      }}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Home</Link>
        <Link to="/listings" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Marketplace</Link>
        <Link to="/profile" style={{ textDecoration: 'none', color: '#1877f2', fontSize: '17px', fontWeight: '600', borderBottom: '2px solid #1877f2', paddingBottom: '3px' }}>Profile</Link>
      </nav>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '140px', 
            height: '140px', 
            margin: '0 auto 15px',
            borderRadius: '50%',
            background: '#e9ebee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '5px solid white',
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
          }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '60px', color: '#8a8d91' }}>👤</span>
            )}
          </div>
          
          <div>
            <input 
              type="file" 
              id="fileInput" 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
              accept="image/*"
            />
            <button 
              onClick={() => document.getElementById('fileInput').click()}
              style={{
                background: '#1877f2',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '10px'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#166fe5'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1877f2'}
            >
              Choose Photo
            </button>

            {imageUpload && (
              <button 
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  background: '#42b72a',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {uploading ? 'Uploading...' : 'Save Photo'}
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            margin: '0 0 8px', 
            fontSize: '28px', 
            color: '#1c1e21',
            fontWeight: '700'
          }}>
            {user.displayName || "User Name"}
          </h2>
          <p style={{ 
            margin: '0', 
            fontSize: '17px', 
            color: '#65676b'
          }}>
            {user.email}
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button 
            onClick={handleLogout}
            style={{
              background: '#e41e3f',
              color: 'white',
              border: 'none',
              padding: '12px 35px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 3px 8px rgba(228, 30, 63, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#d41b39'}
            onMouseOut={(e) => e.currentTarget.style.background = '#e41e3f'}
          >
            🚪 Logout
          </button>
        </div>

        {/* ✅ MY LISTINGS SECTION */}
        <div style={{ 
          borderTop: '1px solid #dadde1', 
          paddingTop: '30px'
        }}>
          <h3 style={{ 
            fontSize: '22px', 
            color: '#1c1e21', 
            margin: '0 0 15px',
            fontWeight: '600'
          }}>
            📦 My Listings
          </h3>
          
          {myItems.length === 0 ? (
            <div style={{ 
              background: '#f0f2f5', 
              borderRadius: '12px', 
              padding: '30px',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: '0 0 15px', 
                fontSize: '16px', 
                color: '#65676b'
              }}>
                You haven't posted anything yet
              </p>
              <Link to="/create-listing" style={{
                background: '#1877f2',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 25px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                + Create First Listing
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {myItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  borderRadius: '12px',
                  background: '#f7f8fa',
                  gap: '15px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#e9ebee',
                    flexShrink: 0
                  }}>
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📦</div>
                    )}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: '0 0 5px', fontSize: '16px', color: '#1c1e21' }}>{item.title}</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#1877f2', fontWeight: '600' }}>₱{item.price}</p>
                  </div>
                  <div style={{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    background: item.bidding === "yes" || item.bidding === true ? '#fff3cd' : '#d1e7dd',
                    color: item.bidding === "yes" || item.bidding === true ? '#856404' : '#0f5132',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {item.bidding === "yes" || item.bidding === true ? 'Bidding' : 'Fixed Price'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: '#2c3e50',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
        onClick={() => navigate('/chat')}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
      </div>
    </div>
  );
}