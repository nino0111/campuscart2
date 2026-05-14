import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, ShieldCheck, Zap, Loader2 } from "lucide-react";

export default function PromotePage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const promoPlans = [
    { id: 'basic', price: 20, duration: 3, label: "Starter Boost", desc: "3 days of high visibility" },
    { id: 'pro', price: 50, duration: 7, label: "Pro Seller", desc: "7 days + Featured Badge" }
  ];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", itemId));
        if (snap.exists()) setItem(snap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handlePromote = async () => {
    if (!selectedPlan) return;
    setPromoting(true);

    try {
      // Logic from image_1febd7.jpg: Featured Listings/Promotions
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + selectedPlan.duration);

      await updateDoc(doc(db, "listings", itemId), {
        isFeatured: true,
        promoType: selectedPlan.label,
        featuredUntil: expirationDate,
        updatedAt: serverTimestamp()
      });

      alert(`Successfully promoted ${item.title}!`);
      navigate(`/detail/${itemId}`);
    } catch (err) {
      console.error(err);
      alert("Promotion failed. Try again.");
    } finally {
      setPromoting(false);
    }
  };

  if (loading) return <div style={centerStyle}><Loader2 className="animate-spin" size={40} color="#2D3494" /></div>;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <header style={headerStyle}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <span style={{ fontWeight: 800 }}>Promote Listing</span>
      </header>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={previewCard}>
          <img src={item?.images?.[0] || item?.imageUrl} alt="" style={prevImg} />
          <div style={{ padding: "15px" }}>
            <p style={{ fontSize: "12px", color: "#64748B" }}>Promoting:</p>
            <h3 style={{ margin: 0, fontSize: "18px" }}>{item?.title}</h3>
          </div>
        </div>

        <h2 style={{ fontSize: "22px", fontWeight: "800", marginTop: "30px" }}>Choose a Plan</h2>
        <p style={{ color: "#64748B", marginBottom: "20px" }}>Boost visibility as seen in CampusCart Revenue Streams.</p>

        {promoPlans.map((plan) => (
          <div 
            key={plan.id} 
            onClick={() => setSelectedPlan(plan)}
            style={{
              ...planCard,
              borderColor: selectedPlan?.id === plan.id ? "#2D3494" : "#E2E8F0",
              background: selectedPlan?.id === plan.id ? "#F0F4FF" : "white"
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "18px" }}>{plan.label}</div>
              <div style={{ fontSize: "14px", color: "#64748B" }}>{plan.desc}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#2D3494" }}>₱{plan.price}</div>
              <div style={{ fontSize: "12px" }}>{plan.duration} Days</div>
            </div>
          </div>
        ))}

        <button 
          disabled={!selectedPlan || promoting} 
          onClick={handlePromote}
          style={{
            ...promoteBtn,
            opacity: (!selectedPlan || promoting) ? 0.6 : 1
          }}
        >
          {promoting ? "Processing..." : `Promote Now • ₱${selectedPlan?.price || 0}`}
        </button>

        <div style={benefitSection}>
          <div style={benefit}><Zap size={16} color="#059669" /> 5x more clicks</div>
          <div style={benefit}><ShieldCheck size={16} color="#059669" /> Verified Badge</div>
        </div>
      </div>
    </div>
  );
}

/* --- STYLES --- */
const headerStyle = { padding: "20px 5%", display: "flex", alignItems: "center", gap: "15px", background: "white", borderBottom: "1px solid #E2E8F0" };
const centerStyle = { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" };
const previewCard = { background: "white", borderRadius: "16px", overflow: "hidden", display: "flex", alignItems: "center", border: "1px solid #E2E8F0" };
const prevImg = { width: "80px", height: "80px", objectFit: "cover" };
const planCard = { display: "flex", alignItems: "center", padding: "20px", borderRadius: "16px", border: "2px solid", marginBottom: "15px", cursor: "pointer", transition: "0.2s" };
const promoteBtn = { width: "100%", marginTop: "20px", padding: "16px", borderRadius: "12px", background: "#2D3494", color: "white", border: "none", fontWeight: "800", fontSize: "16px", cursor: "pointer" };
const benefitSection = { marginTop: "30px", display: "flex", justifyContent: "center", gap: "20px" };
const benefit = { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569", fontWeight: "600" };