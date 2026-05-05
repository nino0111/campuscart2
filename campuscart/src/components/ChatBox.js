import { useNavigate } from "react-router-dom";

export default function ChatBox({ onClose, darkMode }) {
  const navigate = useNavigate();

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 100,
        right: 30,
        width: 320,
        height: 400,
        background: darkMode ? '#2c2c2c' : 'white',
        borderRadius: 20,
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        background: darkMode ? '#1877f2' : '#2c3e50', 
        color: 'white', 
        padding: 15, 
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        My Chats
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, padding: 10, overflowY: 'auto' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: 15, 
            borderRadius: 10, 
            background: darkMode ? '#3a3a3a' : '#f8f9fa', 
            marginBottom: 10,
            cursor: 'pointer'
          }}
          onClick={() => {
            navigate('/chat');
            onClose();
          }}
        >
          <img src="https://placehold.co/40x40" style={{ borderRadius: '50%', marginRight: 10 }} alt="user" />
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', color: darkMode ? 'white' : '#1c1e21' }}>Open Messages</p>
            <p style={{ margin: 0, fontSize: 12, color: darkMode ? '#aaa' : '#666' }}>Click here to view all chats</p>
          </div>
        </div>
      </div>
    </div>
  );
}