import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ Import Auth
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

// ✅ NEW IMPORTS for My Listings and Saved Items
import MyListings from "./pages/MyListings";
import SavedItems from "./pages/SavedItems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
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
        <Route path="/settings" element={<Settings />} />

        {/* ✅ NEW ROUTES ADDED HERE */}
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/saved" element={<SavedItems />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;