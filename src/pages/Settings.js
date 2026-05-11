import React, { useState } from "react";
import { auth } from "../firebase";
import { updateProfile, updatePassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  User, Bell, Moon, Trash2, 
  ChevronLeft, Save, Lock, Smartphone 
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  
  // States for form inputs
  const [name, setName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Update Display Name Logic
  const handleUpdateProfile = async () => {
    if (!name.trim()) return;
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      alert("Profile name updated successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Update Password Logic
  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      alert("For security, this action requires a recent login. Please log out and back in, then try again.");
    }
  };

  // ✅ Delete Account Logic
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "WARNING: This will permanently delete your CampusCart account and all your listings. This cannot be undone. Proceed?"
    );
    if (confirmDelete) {
      try {
        await deleteUser(auth.currentUser);
        navigate("/auth");
      } catch (err) {
        alert("Please re-authenticate (log out and in) before deleting your account.");
      }
    }
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
          <button onClick={() => navigate(-1)} style={backBtnStyle}>
            <ChevronLeft size={20} color="#1E293B" />
          </button>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1E293B", margin: 0 }}>Settings</h1>
        </header>

        {/* --- PROFILE SECTION --- */}
        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}><User size={18} /> Account Profile</h3>
          <p style={descStyle}>Change how your name appears to other students on the marketplace.</p>
          <div style={inputGroup}>
            <input 
              style={inputStyle} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Full Name"
            />
            <button onClick={handleUpdateProfile} style={actionBtnStyle} disabled={isUpdating}>
              {isUpdating ? "..." : <Save size={18} />} <span>Save</span>
            </button>
          </div>
        </section>

        {/* --- SECURITY SECTION --- */}
        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}><Lock size={18} /> Security</h3>
          <p style={descStyle}>Update your password to keep your account safe.</p>
          <div style={inputGroup}>
            <input 
              type="password"
              style={inputStyle} 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="New Password"
            />
            <button onClick={handleUpdatePassword} style={actionBtnStyle}>
              Update
            </button>
          </div>
        </section>

        {/* --- PREFERENCES SECTION --- */}
        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}><Bell size={18} /> Notifications</h3>
          <div style={toggleRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Smartphone size={16} color="#64748B" />
              <span>In-App Notifications</span>
            </div>
            <input type="checkbox" defaultChecked style={checkboxStyle} />
          </div>
          <div style={{ ...toggleRow, border: "none" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Moon size={16} color="#64748B" />
              <span>Dark Mode (Coming Soon)</span>
            </div>
            <input type="checkbox" disabled style={checkboxStyle} />
          </div>
        </section>

        {/* --- DANGER ZONE --- */}
        <section style={{ ...cardStyle, borderColor: "#FEE2E2", marginTop: "40px" }}>
          <h3 style={{ ...sectionTitleStyle, color: "#EF4444" }}><Trash2 size={18} /> Danger Zone</h3>
          <p style={descStyle}>Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={handleDeleteAccount} style={deleteBtnStyle}>
            Delete Account Permanently
          </button>
        </section>

      </div>
    </div>
  );
}

/* --- STYLES --- */
const backBtnStyle = { 
  background: "white", 
  border: "1px solid #E2E8F0", 
  borderRadius: "12px", 
  padding: "10px", 
  cursor: "pointer", 
  display: "flex",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
};

const cardStyle = { 
  background: "white", 
  borderRadius: "20px", 
  padding: "24px", 
  border: "1px solid #E2E8F0", 
  marginBottom: "20px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
};

const sectionTitleStyle = { 
  display: "flex", 
  alignItems: "center", 
  gap: "10px", 
  fontSize: "17px", 
  fontWeight: "700", 
  marginBottom: "15px", 
  color: "#1E293B" 
};

const descStyle = { 
  fontSize: "13px", 
  color: "#64748B", 
  marginBottom: "20px",
  lineHeight: "1.5" 
};

const inputGroup = { display: "flex", gap: "10px" };

const inputStyle = { 
  flex: 1, 
  padding: "14px", 
  borderRadius: "12px", 
  border: "1px solid #E2E8F0", 
  background: "#F8FAFC", 
  outline: "none",
  fontSize: "15px"
};

const actionBtnStyle = { 
  background: "#2D3494", 
  color: "white", 
  border: "none", 
  borderRadius: "12px", 
  padding: "0 20px", 
  fontWeight: "600", 
  cursor: "pointer", 
  display: "flex", 
  alignItems: "center", 
  gap: "8px",
  transition: "0.2s"
};

const toggleRow = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  padding: "15px 0", 
  borderBottom: "1px solid #F1F5F9", 
  fontSize: "15px", 
  fontWeight: "500",
  color: "#334155"
};

const checkboxStyle = {
  width: "18px",
  height: "18px",
  cursor: "pointer"
};

const deleteBtnStyle = { 
  background: "#FEF2F2", 
  color: "#EF4444", 
  border: "1px solid #FEE2E2", 
  borderRadius: "12px", 
  width: "100%", 
  padding: "14px", 
  fontWeight: "700", 
  cursor: "pointer", 
  marginTop: "10px",
  transition: "0.2s"
};