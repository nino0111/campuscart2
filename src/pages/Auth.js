import { useState } from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [studentId, setStudentId] = useState(""); // This is your Student Number
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/home";
      } else {
        // Validation check for Sign Up
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long!");
        }

        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // ✅ SETTING DISPLAY NAME (Fixes the Chat Name issue)
        await updateProfile(user, { displayName: fullName });

        // ✅ SAVING TO FIRESTORE (Matches your login.js requirements)
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: email,
          fullName: fullName,
          phoneNumber: phoneNumber,
          address: address,
          studentId: studentId, // Student Number
          createdAt: new Date()
        });

        setSuccess("✅ Account created! Redirecting...");
        setTimeout(() => { window.location.href = "/home"; }, 1500);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/home";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      {/* INJECT ANIMATIONS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* LEFT SIDE - BRANDING (Matches Login.js) */}
      <div style={leftSideStyle}>
        <div style={logoAnimStyle}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={brandTitleStyle}>CampusCart</h1>
        <p style={brandSubtitleStyle}>Buy & Sell School Items Safely</p>
        <div style={overlayPatternStyle}></div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div style={rightSideStyle}>
        <div style={cardStyle}>
          <div style={tabContainerStyle}>
            <button onClick={() => setIsLogin(true)} style={isLogin ? activeTabStyle : inactiveTabStyle}>Login</button>
            <button onClick={() => setIsLogin(false)} style={!isLogin ? activeTabStyle : inactiveTabStyle}>Sign Up</button>
          </div>

          {error && <div style={errorBoxStyle}>{error}</div>}
          {success && <div style={successBoxStyle}>{success}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} type="text" placeholder="Juan Dela Cruz" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} type="tel" placeholder="09123456789" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Address / Campus</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Angeles City" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Student ID Number</label>
                  {/* ✅ Student Number is now REQUIRED */}
                  <input style={inputStyle} type="text" placeholder="202X-XXXXX" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                </div>
              </>
            )}

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
            </button>
          </form>

          {isLogin && <p onClick={() => setError("Check your email for reset instructions!")} style={forgotPassStyle}>Forgot password?</p>}

          <div style={dividerStyle}><span>OR CONTINUE WITH</span></div>

          <div style={socialRowStyle}>
            <button onClick={handleGoogleLogin} style={socialBtnStyle}>Google</button>
            <button onClick={() => alert("Facebook coming soon!")} style={{...socialBtnStyle, background: '#1877F2', color: 'white', border: 'none'}}>Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- STYLES (EXACT MATCH FOR LOGIN.JS) --- */
const containerStyle = { display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0, fontFamily: "'Segoe UI', Roboto, sans-serif", overflow: 'hidden' };
const leftSideStyle = { flex: 1, background: 'linear-gradient(135deg, #0065FF 0%, #0047B2 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', position: 'relative' };
const brandTitleStyle = { fontSize: '48px', fontWeight: '800', margin: 0, animation: 'fadeInUp 1s ease-out' };
const brandSubtitleStyle = { fontSize: '18px', opacity: 0.9, marginTop: '10px', animation: 'fadeInUp 1.2s ease-out' };
const logoAnimStyle = { animation: 'float 3s ease-in-out infinite', marginBottom: '30px' };
const overlayPatternStyle = { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0 };

const rightSideStyle = { flex: 1, background: '#F5F7FA', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' };
const cardStyle = { width: '100%', maxWidth: '420px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '35px 30px', maxHeight: '95vh', overflowY: 'auto' };
const tabContainerStyle = { display: 'flex', marginBottom: '25px', borderBottom: '2px solid #eee' };
const activeTabStyle = { flex: 1, padding: '12px', border: 'none', background: 'transparent', fontSize: '16px', fontWeight: '600', color: '#0065FF', borderBottom: '3px solid #0065FF', cursor: 'pointer' };
const inactiveTabStyle = { flex: 1, padding: '12px', border: 'none', background: 'transparent', fontSize: '16px', fontWeight: '600', color: '#999', cursor: 'pointer' };

const inputGroupStyle = { marginBottom: '18px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' };
const submitBtnStyle = { width: '100%', padding: '14px', background: '#0065FF', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', marginTop: '10px' };
const forgotPassStyle = { marginTop: '20px', color: '#0065FF', fontSize: '13px', cursor: 'pointer', textAlign: 'right' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '24px 0', gap: '10px', fontSize: '11px', color: '#999', fontWeight: '700' };
const socialRowStyle = { display: 'flex', gap: '12px' };
const socialBtnStyle = { flex: 1, padding: '12px', border: '1px solid #ddd', background: 'white', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' };
const errorBoxStyle = { color: '#e41e3f', background: '#ffebee', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' };
const successBoxStyle = { color: '#2e7d32', background: '#e8f5e9', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' };