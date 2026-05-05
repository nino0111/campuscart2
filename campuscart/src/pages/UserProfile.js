import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import '../styles/Home.css';

export default function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      // Get user info
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      // Get user items
      const q = query(collection(db, "listings"), where("userId", "==", userId));
      const itemsSnap = await getDocs(q);
      setUserItems(itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, [userId]);

  if (!userData) return <div className="content"><p>Loading...</p></div>;

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/listings">Listings</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="profile-icon">
          <img src={currentUser?.photoURL || "https://placehold.co/40x40"} alt="Profile" />
        </div>
      </nav>

      <div className="content">
        <div className="profile-card">
          <img 
            src="https://placehold.co/100x100" 
            alt="User" 
            className="big-profile-img" 
          />
          <h2>{userData.fullName}</h2>
          <p className="profile-email">{userData.email}</p>
          <p className="student-id">Student ID: {userData.studentNumber}</p>
        </div>

        <h3 style={{ marginTop: '40px', textAlign: 'left' }}>Listed Items</h3>
        <div className="grid">
          {userItems.length === 0 ? (
            <p>No items listed yet</p>
          ) : (
            userItems.map(item => (
              <div key={item.id} className="card">
                <div className="img-box">
                  <img 
                    src={item.images?.length > 0 ? item.images[0] : "https://placehold.co/200x200"} 
                    alt={item.title} 
                  />
                </div>
                <div className="info">
                  <h4>{item.title}</h4>
                  <p className="price">₱{item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}