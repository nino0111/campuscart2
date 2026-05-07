import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // LOGIN
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/home";
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    } else {
      // SIGN UP
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: fullName });
        await setDoc(doc(db, "users", user.uid), { fullName, studentNumber, email: user.email });

        alert("Account created!");
        window.location.href = "/home";
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  // ✅ FORGOT PASSWORD FUNCTION
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ✅ REAL GOOGLE LOGIN FUNCTION
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/home";
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#eef2f5', fontFamily: 'Segoe UI, Roboto, Arial', margin: 0, padding: 0 }}>
      <div style={{ background: '#ffffff', padding: '45px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '35px', fontSize: '28px', fontWeight: '600', color: '#1a1a1a' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          
          {/* ✅ NAME AND STUDENT NUMBER - SHOWS ONLY WHEN SIGNING UP */}
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
                style={{ width: '100%', padding: '16px 20px', margin: '0 0 16px 0', border: '1px solid #d0d5dd', borderRadius: '50px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
                onBlur={(e) => e.target.style.borderColor = '#d0d5dd'}
              />

              <input 
                type="text" 
                placeholder="Student Number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required 
                style={{ width: '100%', padding: '16px 20px', margin: '0 0 16px 0', border: '1px solid #d0d5dd', borderRadius: '50px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
                onBlur={(e) => e.target.style.borderColor = '#d0d5dd'}
              />
            </>
          )}

          <input 
            type="email" 
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ width: '100%', padding: '16px 20px', margin: '0 0 16px 0', border: '1px solid #d0d5dd', borderRadius: '50px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
            onBlur={(e) => e.target.style.borderColor = '#d0d5dd'}
          />

          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '100%', padding: '16px 20px', margin: '0 0 24px 0', border: '1px solid #d0d5dd', borderRadius: '50px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
            onBlur={(e) => e.target.style.borderColor = '#d0d5dd'}
          />

          {/* ✅ MAIN ACTION BUTTON - CLEAN AND PROFESSIONAL */}
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: '#2c3e50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50px', 
              fontSize: '16px', 
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e2a38'}
            onMouseOut={(e) => e.target.style.background = '#2c3e50'}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          {/* ✅ TOGGLE BUTTONS - CLEAN DESIGN */}
          <div style={{ display: 'flex', marginTop: '20px', borderRadius: '50px', background: '#f2f4f7', padding: '4px' }}>
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              style={{ 
                flex: 1, 
                padding: '10px', 
                background: isLogin ? '#ffffff' : 'transparent', 
                color: isLogin ? '#2c3e50' : '#667085', 
                border: 'none', 
                borderRadius: '40px',
                fontSize: '15px', 
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: isLogin ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Login
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              style={{ 
                flex: 1, 
                padding: '10px', 
                background: !isLogin ? '#ffffff' : 'transparent', 
                color: !isLogin ? '#2c3e50' : '#667085', 
                border: 'none', 
                borderRadius: '40px',
                fontSize: '15px', 
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: !isLogin ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Sign Up
            </button>
          </div>
          
        </form>

        {/* ✅ FORGOT PASSWORD - CLEAN STYLE */}
        <p 
          onClick={handleForgotPassword}
          style={{ marginTop: '20px', color: '#667085', fontSize: '14px', cursor: 'pointer' }}
        >
          Forgot password?
        </p>

        {/* ✅ GOOGLE AND FACEBOOK BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            style={{ flex: 1, padding: '12px', border: '1px solid #d0d5dd', background: 'white', borderRadius: '50px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            Google
          </button>
          <button 
            type="button" 
            onClick={() => alert("Facebook login coming soon!")}
            style={{ flex: 1, padding: '12px', border: '1px solid #d0d5dd', background: 'white', borderRadius: '50px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}