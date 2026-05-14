import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Camera, 
  Loader2, 
  Megaphone, 
  CreditCard, 
  Wallet, 
  Smartphone,
  Check
} from "lucide-react";

export default function CreateAd() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Put back the description state
  const [image, setImage] = useState(null);
  const [fee, setFee] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Your Cloudinary Credentials
  const CLOUD_NAME = "YOUR_CLOUD_NAME"; 
  const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/auth");
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image) return alert("Please provide a title and image.");

    setLoading(true);

    try {
      // 1. Cloudinary Upload
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (!data.secure_url) throw new Error("Cloudinary upload failed.");

      // 2. Save all details to Firestore
      await addDoc(collection(db, "advertisements"), {
        title: title.trim(),
        description: description.trim(), // Saving description
        imageUrl: data.secure_url,
        feeAmount: fee,
        paymentMethod: paymentMethod,
        paymentStatus: "Completed",
        createdBy: auth.currentUser?.uid,
        businessName: auth.currentUser?.displayName || "Campus Vendor",
        createdAt: serverTimestamp(),
        active: true
      });

      alert(`Success! Ad for "${title}" is now live.`);
      navigate("/home");
      
    } catch (err) {
      console.error(err);
      alert("Transaction Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div style={centerStyle}><Loader2 className="animate-spin" size={40} color="#2D3494" /></div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        <ChevronLeft size={20}/> Back
      </button>
      
      <div style={headerStyle}>
        <Megaphone size={30} color="white" />
        <h2 style={{ color: "white", margin: "10px 0 0", fontSize: "22px", fontWeight: "800" }}>Promote Listing</h2>
      </div>

      <form onSubmit={handleUpload} style={formStyle}>
        {/* Title Field */}
        <div style={inputGroup}>
          <label style={labelStyle}>Business/Product Name</label>
          <input 
            style={inputStyle} 
            placeholder="e.g. Canteen Buy 1 Take 1"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        {/* Description Field (Restored) */}
        <div style={inputGroup}>
          <label style={labelStyle}>Promotion Details</label>
          <textarea 
            style={{ ...inputStyle, height: "80px", resize: "none" }} 
            placeholder="Tell students more about your offer..."
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        {/* Plan Selection */}
        <div style={inputGroup}>
          <label style={labelStyle}>Promotion Plan</label>
          <div style={grid2}>
            <div style={fee === 50 ? activePlan : planCard} onClick={() => setFee(50)}>
              <span style={priceTxt}>₱50</span>
              <span style={subTxt}>24 Hours</span>
            </div>
            <div style={fee === 120 ? activePlan : planCard} onClick={() => setFee(120)}>
              <span style={priceTxt}>₱120</span>
              <span style={subTxt}>3 Days</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={inputGroup}>
          <label style={labelStyle}>Payment Method</label>
          <div style={paymentList}>
            <div style={paymentMethod === 'gcash' ? activeMethod : methodCard} onClick={() => setPaymentMethod('gcash')}>
              <div style={methodContent}><Smartphone size={18} color="#007dfe" /> GCash</div>
              {paymentMethod === 'gcash' && <Check size={16} />}
            </div>
            
            <div style={paymentMethod === 'paymaya' ? activeMethod : methodCard} onClick={() => setPaymentMethod('paymaya')}>
              <div style={methodContent}><Wallet size={18} color="#64bc44" /> PayMaya</div>
              {paymentMethod === 'paymaya' && <Check size={16} />}
            </div>

            <div style={paymentMethod === 'card' ? activeMethod : methodCard} onClick={() => setPaymentMethod('card')}>
              <div style={methodContent}><CreditCard size={18} color="#1e293b" /> Credit / Debit Card</div>
              {paymentMethod === 'card' && <Check size={16} />}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div style={inputGroup}>
          <label style={labelStyle}>Banner Image</label>
          <div style={uploadBox}>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} id="img-ad" />
            <label htmlFor="img-ad" style={uploadLabel}>
              <Camera size={24} color="#94a3b8" />
              <p style={{ fontSize: '13px', margin: '8px 0 0', color: '#64748b' }}>
                {image ? image.name : "Select Ad Banner"}
              </p>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} style={payBtn}>
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            `Pay ₱${fee} & Promote Now`
          )}
        </button>
      </form>
    </div>
  );
}

/* --- REFINED STYLES --- */
const containerStyle = { maxWidth: "480px", margin: "20px auto", padding: "20px", background: "white", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" };
const headerStyle = { background: "#2D3494", padding: "30px", borderRadius: "20px", textAlign: "center", marginBottom: "25px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontWeight: "800", fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" };
const inputStyle = { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", background: "#f8fafc" };
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };
const planCard = { padding: '15px', borderRadius: '15px', border: '2px solid #f1f5f9', cursor: 'pointer', textAlign: 'center', transition: '0.2s' };
const activePlan = { ...planCard, borderColor: '#2D3494', background: '#eef2ff' };
const priceTxt = { display: 'block', fontWeight: '900', fontSize: '18px', color: '#1e293b' };
const subTxt = { fontSize: '12px', color: '#64748b', fontWeight: '500' };
const paymentList = { display: 'flex', flexDirection: 'column', gap: '10px' };
const methodCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '600', fontSize: '15px', background: 'white' };
const activeMethod = { ...methodCard, borderColor: '#2D3494', background: '#f8fafc', color: '#2d3494' };
const methodContent = { display: 'flex', alignItems: 'center', gap: '12px' };
const uploadBox = { border: "2px dashed #e2e8f0", padding: "25px", borderRadius: "15px", background: "#f8fafc", transition: '0.2s' };
const uploadLabel = { cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const payBtn = { background: "#2D3494", color: "white", padding: "18px", borderRadius: "16px", border: "none", fontWeight: "800", cursor: "pointer", display: 'flex', justifyContent: 'center', fontSize: '16px', marginTop: '10px', boxShadow: '0 4px 15px rgba(45, 52, 148, 0.3)' };
const backBtn = { border: "none", background: "none", color: "#64748b", marginBottom: "15px", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: "700", gap: "5px" };
const centerStyle = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };