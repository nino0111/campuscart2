import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  getDoc 
} from "firebase/firestore";
// ✅ FIX: Removed unused UserIcon
import { 
  ArrowLeft, 
  Send, 
  ShoppingBag, 
  MessageCircle
} from "lucide-react";
import '../styles/Home.css';

export default function ChatRoom() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const scrollRef = useRef();

  const user = auth.currentUser;

  const COLORS = {
    primary: '#2D3494',
    accent: '#4F46E5',
    bgLight: '#F8FAFC',
    textMain: '#1E293B'
  };

  useEffect(() => {
    if (!chatId) return;

    const fetchChatInfo = async () => {
      try {
        const chatDoc = await getDoc(doc(db, "chats", chatId));
        if (chatDoc.exists()) {
          setChatInfo(chatDoc.data());
        }
      } catch (err) {
        console.error("Error fetching chat info:", err);
      }
    };
    fetchChatInfo();

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || "Student",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-page-wrapper" style={{ background: COLORS.bgLight, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* CHAT HEADER */}
      <header className="chat-header">
        <div className="chat-nav-inner">
          <button onClick={() => navigate(-1)} className="chat-back-btn">
            <ArrowLeft size={20} />
          </button>
          
          <div className="chat-user-info">
            <div className="chat-avatar">
              <ShoppingBag size={18} color="white" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{chatInfo?.itemName || "Item Inquiry"}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Messaging about this listing</p>
            </div>
          </div>
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <MessageCircle size={40} color="#CBD5E1" />
            <p>Start your conversation about the item.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-bubble-wrapper ${msg.senderId === user.uid ? "sent" : "received"}`}
            >
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <footer className="chat-input-area">
        <form onSubmit={handleSendMessage} className="chat-form-inner">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}