import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";

// ✅ ADDED darkMode HERE!
export default function ChatRoom({ darkMode }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { chatId } = useParams();
  const auth = getAuth();
  const user = auth.currentUser;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!chatId) return;

    // Get all messages
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter only for this chat
      const chatMessages = allMessages.filter(msg => msg.chatId === chatId);
      
      setMessages(chatMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      // Add message
      await addDoc(collection(db, "messages"), {
        chatId: chatId,
        text: newMessage,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });

      // Update last message
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        lastMessage: newMessage,
        updatedAt: serverTimestamp()
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: darkMode ? '#1a1a1a' : 'white'
    }}>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.length === 0 && <p style={{textAlign: 'center', color: darkMode ? '#999' : '#999'}}>No messages yet</p>}

        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{
              display: 'flex',
              justifyContent: msg.senderId === user.uid ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div style={{
              background: msg.senderId === user.uid ? '#1877f2' : darkMode ? '#3a3a3a' : '#e5e5ea',
              color: msg.senderId === user.uid ? 'white' : darkMode ? 'white' : 'black',
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

      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '20px', borderTop: darkMode ? '1px solid #333' : '1px solid #eee' }}>
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '15px',
            borderRadius: '30px',
            border: darkMode ? '1px solid #444' : '1px solid #ddd',
            outline: 'none',
            background: darkMode ? '#2c2c2c' : 'white',
            color: darkMode ? 'white' : 'black'
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