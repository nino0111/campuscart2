import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch messages
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      name: user.displayName || "Anonymous",
      photoURL: user.photoURL || ""
    });

    setNewMessage("");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{
              display: 'flex',
              justifyContent: msg.uid === user.uid ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div style={{
              background: msg.uid === user.uid ? '#1877f2' : '#e5e5ea',
              color: msg.uid === user.uid ? 'white' : 'black',
              padding: '10px 15px',
              borderRadius: '20px',
              maxWidth: '70%'
            }}>
              <p style={{ margin: 0 }}>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '20px', borderTop: '1px solid #eee' }}>
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '15px',
            borderRadius: '30px',
            border: '1px solid #ddd',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          marginLeft: '10px',
          padding: '15px 25px',
          borderRadius: '30px',
          background: '#1877f2',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </form>
    </div>
  );
}