import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ Import Auth (This is your main Login/SignUp now)
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import CreateListing from "./pages/CreateListing";
import ItemDetail from './pages/ItemDetails';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';
import Cart from './pages/Cart';
import Listings from './pages/Listings';
import ChatList from "./components/ChatList";       
import ChatRoom from "./components/ChatRoom"; 
import Alerts from './pages/Alerts'; 

// ❌ REMOVED: import Login from './pages/Login'; (File was deleted)

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Default route now goes to Auth */}
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* ✅ Redirect old /login path to /auth to prevent errors */}
        <Route path="/login" element={<Auth />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/detail/:id" element={<ItemDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/chat-list" element={<ChatList />} />
        <Route path="/chat-room/:chatId" element={<ChatRoom />} />

        {/* ✅ Catch-all: If user types a wrong URL, go back to Auth */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;