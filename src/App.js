import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ Existing Imports
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
import Settings from "./pages/Settings";
import MyListings from "./pages/MyListings";
import SavedItems from "./pages/SavedItems";

// ✅ NEW IMPORT
import PromotePage from "./pages/PromotePage";
import Advertise from "./pages/Advertise";
import CreateAd from "./pages/CreateAd";
function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Core Features */}
        <Route path="/home" element={<Home />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/detail/:id" element={<ItemDetail />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/create-ad" element={<CreateAd />} />
        
        {/* Profile & Social */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/saved" element={<SavedItems />} />
        
        {/* Messaging & Notifications */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat-list" element={<ChatList />} />
        <Route path="/chat-room/:chatId" element={<ChatRoom />} />
        <Route path="/alerts" element={<Alerts />} />
        
        {/* Settings & Revenue Features */}
        <Route path="/settings" element={<Settings />} />
        {/* ✅ FIXED THE PROMOTE ROUTE SYNTAX */}
        <Route path="/promote/:itemId" element={<PromotePage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;