import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ChatList({ darkMode }) {
  const [chats, setChats] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto',
      background: darkMode ? '#1a1a1a' : 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h2 style={{ color: darkMode ? 'white' : 'black' }}>My Chats</h2>
      
      {chats.length === 0 && <p style={{color: darkMode ? '#aaa' : '#666'}}>No conversations yet</p>}

      {chats.map(chat => (
        <div 
          key={chat.id}
          onClick={() => navigate(`/chat-room/${chat.id}`)}
          style={{
            padding: '15px',
            borderRadius: '10px',
            background: darkMode ? '#2c2c2c' : '#f8f9fa',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
        >
          <h4 style={{margin: 0, color: darkMode ? 'white' : 'black'}}>{chat.itemName}</h4>
          <p style={{margin: 5, fontSize: 14, color: darkMode ? '#ccc' : '#555'}}>
            {chat.lastMessage}
          </p>
        </div>
      ))}
    </div>
  );
}