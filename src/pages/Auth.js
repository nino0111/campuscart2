import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

// You might need to import your background image if it's in the src folder
// import campusBackground from './campus-background.png'; // Example if your image is in the same folder

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/home";
      } catch (err) {
        showNotification("Login failed: " + err.message, 'error');
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: fullName });
        await setDoc(doc(db, "users", user.uid), { fullName, studentNumber, email: user.email });

        showNotification("Account created successfully!", 'success');
        setTimeout(() => {
            window.location.href = "/home";
        }, 1000);
      } catch (err) {
        showNotification("Error: " + err.message, 'error');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showNotification("Please enter your email first!", 'error');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showNotification("Password reset email sent! Check your inbox.", 'success');
    } catch (err) {
      showNotification("Error: " + err.message, 'error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/home";
    } catch (err) {
      showNotification("Google login failed: " + err.message, 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#eef2f5', // Base background color
      // --- START: Background Image Styling ---
      backgroundImage: 'url("/campus-background.png")', // Path to your background image
      backgroundRepeat: 'repeat', // Or 'no-repeat' if it's a single large image
      backgroundSize: 'auto', // Or 'cover', 'contain', or specific dimensions
      backgroundPosition: 'center center', // Centers the background image
      // --- END: Background Image Styling ---
      fontFamily: 'Segoe UI, Roboto, Arial',
      margin: 0,
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>

      {notification.visible && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: notification.type === 'error' ? '#dc3545' : '#28a745',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
          opacity: notification.visible ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          textAlign: 'center',
          minWidth: '250px',
          maxWidth: '90%'
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ background: '#ffffff', padding: '45px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', width: '100%', maxWidth: '380px', textAlign: 'center', zIndex: 1 }}> {/* Added zIndex to keep form above background */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.472L20 8.875V15.125L12 19.528L4 15.125V8.875L12 4.472ZM12 11.5L16 9.5V13.5L12 15.5L8 13.5V9.5L12 11.5Z" fill="#1ABC9C"/>
            <path d="M12 11.5L16 9.5V13.5L12 15.5L8 13.5V9.5L12 11.5Z" fill="#3498DB"/>
          </svg>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>CampusCart</span>
        </div>

        <h2 style={{ marginBottom: '35px', fontSize: '28px', fontWeight: '600', color: '#1a1a1a' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>

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

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: '#20C997',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1ABC9C'}
            onMouseOut={(e) => e.target.style.background = '#20C997'}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

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

        <p
          onClick={handleForgotPassword}
          style={{ marginTop: '20px', color: '#667085', fontSize: '14px', cursor: 'pointer' }}
        >
          Forgot password?
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{ flex: 1, padding: '12px', border: 'none', background: '#EA4335', color: 'white', borderRadius: '50px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#d93025'}
            onMouseOut={(e) => e.target.style.background = '#EA4335'}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => showNotification("Facebook login coming soon!", 'info')}
            style={{ flex: 1, padding: '12px', border: 'none', background: '#1877F2', color: 'white', borderRadius: '50px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#166fe5'}
            onMouseOut={(e) => e.target.style.background = '#1877F2'}
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}