import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import CreateListing from "./pages/CreateListing";
import ItemDetail from './pages/ItemDetails';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Listings from './pages/Listings';
import ChatList from "./components/ChatList";      
import ChatRoom from "./components/ChatRoom";      

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/detail/:id" element={<ItemDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
        <Route path="/" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/chat-list" element={<ChatList />} />
        <Route path="/chat-room/:chatId" element={<ChatRoom />} />


      </Routes>
    </Router>
  );
}

export default App;