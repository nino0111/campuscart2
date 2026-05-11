import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { 
  collection, query, where, onSnapshot, 
  orderBy, addDoc, serverTimestamp, updateDoc, doc 
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { 
  Search, Send, ShoppingBag, 
  MessageCircle, Home, User 
} from "lucide-react";
import '../styles/Chat.css';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();
  const navigate = useNavigate();
  const user = auth.currentUser;

  // FETCH CHAT LIST
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setChats(list);
    });
    return () => unsubscribe();
  }, [user]);

  // FETCH MESSAGES
  useEffect(() => {
    if (!activeChat) return;
    const msgQuery = query(collection(db, "chats", activeChat.id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [activeChat]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    try {
      await addDoc(collection(db, "chats", activeChat.id, "messages"), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || "Student",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "chats", activeChat.id), {
        lastMessage: newMessage,
        updatedAt: serverTimestamp()
      });
      setNewMessage("");
    } catch (err) { console.error(err); }
  };

  const handleStalk = () => {
    const otherId = activeChat?.participants.find(id => id !== user.uid);
    if (otherId) navigate(`/user-profile/${otherId}`);
  };

  return (
    <div className="chat-container">
      {/* TOP NAVBAR */}
      <nav className="chat-nav">
        <Link to="/home" className="chat-logo">
          <div className="logo-sq"><ShoppingBag size={18} color="white" /></div>
          <span>CampusCart</span>
        </Link>
        <div className="nav-actions">
          <button onClick={() => navigate('/home')} className="circle-btn"><Home size={18} /></button>
          <img src={user?.photoURL || "https://placehold.co/32x32"} className="user-avatar" alt="me" />
        </div>
      </nav>

      <div className="chat-body">
        {/* SIDEBAR */}
        <aside className="chat-sidebar">
          <div className="sidebar-top">
            <h2>Chats</h2>
            <div className="circle-btn"><Search size={18} /></div>
          </div>
          <div className="chat-list">
            {chats.map(chat => (
              <div key={chat.id} className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`} onClick={() => setActiveChat(chat)}>
                <div className="chat-pfp">{chat.itemName?.charAt(0)}</div>
                <div className="chat-info">
                  <div className="chat-name">{chat.sellerName || chat.itemName}</div>
                  <div className="chat-last">{chat.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* WINDOW */}
        <main className="chat-window">
          {activeChat ? (
            <>
              <header className="window-header">
                <div className="header-user">
                  <div className="pfp-sm">{activeChat.itemName?.charAt(0)}</div>
                  <span className="header-title">{activeChat.sellerName || activeChat.itemName}</span>
                </div>
                <button className="stalk-btn" onClick={handleStalk}><User size={14} /> Profile</button>
              </header>

              <div className="messages-area">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === user.uid;
                  const isFirst = index === 0 || messages[index - 1].senderId !== msg.senderId;
                  return (
                    <div key={msg.id} className={`msg-row ${isMe ? 'me' : 'them'}`}>
                      {!isMe && isFirst && <div className="pfp-tiny">{activeChat.itemName?.charAt(0)}</div>}
                      {!isMe && !isFirst && <div className="spacer-tiny" />}
                      <div className="bubble-set">
                        {!isMe && isFirst && <span className="sender-name">{msg.senderName}</span>}
                        <div className="bubble">{msg.text}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <footer className="input-footer">
                <form onSubmit={handleSendMessage} className="input-box">
                  <input placeholder="Aa" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <button type="submit" className="send-btn"><Send size={18} /></button>
                </form>
              </footer>
            </>
          ) : (
            <div className="empty-state">
              <MessageCircle size={60} color="#e4e6eb" />
              <p>Select a chat to begin</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}