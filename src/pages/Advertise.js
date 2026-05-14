import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  ChevronLeft, 
  Store, 
  Coffee, 
  TrendingUp, 
  ArrowRight,
  Utensils,
  Zap
} from 'lucide-react';

export default function Advertise() {
  const navigate = useNavigate();

  // Definition of different promotion types
  const promoTypes = [
    {
      title: "Cafe & Canteen Specials",
      desc: "Promote meals, coffee deals, or daily specials to the student body.",
      icon: <Coffee size={24} color="#D97706" />,
      bg: "#FFFBEB",
      path: "/create-ad" // Points to your specialized ad creation page
    },
    {
      title: "Sidebar Banner Ads",
      desc: "Get a dedicated spot on the main navigation sidebar for high visibility.",
      icon: <Store size={24} color="#2D3494" />,
      bg: "#EEF2FF",
      path: "/create-ad"
    },
    {
      title: "Featured Search Boost",
      desc: "Keep your products at the very top when students search for items.",
      icon: <TrendingUp size={24} color="#059669" />,
      bg: "#ECFDF5",
      path: "/create-ad"
    }
  ];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* --- NAVIGATION --- */}
        <button 
          onClick={() => navigate('/home')}
          style={backBtnStyle}
        >
          <ChevronLeft size={20} /> Back to Home
        </button>

        {/* --- HEADER --- */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={iconBadgeStyle}>
            <Megaphone size={32} color="#2D3494" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1E293B', marginBottom: '10px' }}>
            Advertise on CampusCart
          </h1>
          <p style={{ color: '#64748B', fontSize: '18px' }}>
            Empower your business and reach thousands of PSAU students instantly.
          </p>
        </div>

        {/* --- OPTIONS GRID --- */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {promoTypes.map((promo, index) => (
            <div 
              key={index} 
              style={cardStyle} 
              onClick={() => navigate(promo.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.borderColor = "#2D3494";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ ...iconBoxStyle, background: promo.bg }}>
                {promo.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>
                  {promo.title}
                </h3>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: '1.5' }}>
                  {promo.desc}
                </p>
              </div>
              <ArrowRight size={20} color="#CBD5E1" />
            </div>
          ))}
        </div>

        {/* --- CTA FOOTER --- */}
        <div style={footerCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={footerIconStyle}>
              <Zap size={20} color="#4F46E5" fill="#4F46E5" />
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'white', fontSize: '16px' }}>Ready to boost your sales?</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                Join the "Campus Choice" list today.
              </p>
            </div>
          </div>
          <button 
            style={promoBtnStyle}
            onClick={() => navigate('/create-ad')}
          >
            Get Started
          </button>
        </div>

        {/* --- VENDOR NOTE --- */}
        <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Utensils size={14} color="#94A3B8" />
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>
                PSAU Accredited Canteen Vendors get 15% off featured slots.
            </span>
        </div>

      </div>
    </div>
  );
}

/* --- STYLES --- */
const backBtnStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  border: 'none', 
  background: 'none', 
  cursor: 'pointer', 
  color: '#64748B', 
  marginBottom: '30px',
  fontWeight: '600',
  fontSize: '15px'
};

const iconBadgeStyle = { 
  background: 'white', 
  width: '72px', 
  height: '72px', 
  borderRadius: '22px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  margin: '0 auto 24px',
  boxShadow: '0 12px 24px -6px rgba(0,0,0,0.08)',
  border: '1px solid #E2E8F0'
};

const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  padding: '24px',
  borderRadius: '24px',
  border: '1px solid #E2E8F0',
  background: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const iconBoxStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const footerCardStyle = {
  marginTop: '40px',
  background: '#1E293B',
  padding: '28px',
  borderRadius: '28px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};

const footerIconStyle = {
    background: 'rgba(255,255,255,0.1)',
    padding: '10px',
    borderRadius: '12px'
};

const promoBtnStyle = {
  padding: '12px 28px',
  borderRadius: '14px',
  background: 'white',
  color: '#1E293B',
  border: 'none',
  fontWeight: '800',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'transform 0.2s ease'
};