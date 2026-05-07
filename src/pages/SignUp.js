import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      await setDoc(doc(db, "users", user.uid), { fullName, studentNumber, email: user.email });

      alert("Account created!");
      navigate("/home");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial', margin: 0, padding: 0 }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '28px', color: '#222' }}>Sign Up</h2>
        
        <form onSubmit={handleSignUp} style={{ width: '100%' }}>
          <input 
            type="text" 
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required 
            style={{ width: '100%', padding: '15px 20px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '30px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />

          <input 
            type="text" 
            placeholder="Student Number"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required 
            style={{ width: '100%', padding: '15px 20px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '30px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />

          <input 
            type="email" 
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ width: '100%', padding: '15px 20px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '30px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />

          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '100%', padding: '15px 20px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '30px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', marginTop: '25px', borderRadius: '30px', overflow: 'hidden' }}>
            <Link to="/" style={{ flex: 1, padding: '15px', background: '#ddd', color: 'black', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
              Login
            </Link>
            <button type="submit" style={{ flex: 1, padding: '15px', background: '#2c3e50', color: 'white', border: 'none', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
              Sign Up
            </button>
          </div>
        </form>

        <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>Forgot password?</p>

        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
          <button type="button" style={{ flex: 1, padding: '12px', border: '1px solid #ddd', background: 'white', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>
            Google
          </button>
          <button type="button" style={{ flex: 1, padding: '12px', border: '1px solid #ddd', background: 'white', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}