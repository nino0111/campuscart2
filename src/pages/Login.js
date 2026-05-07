import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <div className="btn-group">
            <button type="submit" className="btn active">Login</button>
            <Link to="/signup" className="btn">Sign Up</Link>
          </div>
        </form>

        <p className="forgot">Forgot password?</p>

        <div className="social">
          <button onClick={() => alert("Google login coming soon")}>
            Google
          </button>
          <button onClick={() => alert("Facebook login coming soon")}>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}