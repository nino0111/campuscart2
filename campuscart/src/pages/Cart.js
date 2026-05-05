import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
  }, []);

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f2f5', 
      padding: '20px',
      fontFamily: "'Segoe UI', Roboto, sans-serif"
    }}>
      {/* NAVBAR */}
      <nav style={{ 
        background: 'white', 
        padding: '15px 30px', 
        borderRadius: '15px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '30px',
        display: 'flex',
        gap: '30px',
        alignItems: 'center'
      }}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Home</Link>
        <Link to="/listings" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Listings</Link>
        <Link to="/profile" style={{ textDecoration: 'none', color: '#1c1e21', fontSize: '17px', fontWeight: '500' }}>Profile</Link>
        <Link to="/cart" style={{ textDecoration: 'none', color: '#1877f2', fontSize: '17px', fontWeight: '600', borderBottom: '2px solid #1877f2', paddingBottom: '3px' }}>Cart</Link>
      </nav>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          color: '#1c1e21', 
          marginBottom: '30px',
          fontWeight: '700'
        }}>
          🛒 My Cart
        </h2>

        {cartItems.length === 0 ? (
          // EMPTY CART
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: '80px', color: '#ccd0d5', marginBottom: '20px' }}>
              🛒
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '22px', color: '#1c1e21' }}>
              Your cart is empty
            </h3>
            <p style={{ margin: '0 0 25px', fontSize: '16px', color: '#65676b' }}>
              Looks like you haven't added anything yet
            </p>
            <Link to="/listings" style={{
              background: '#1877f2',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          // CART ITEMS
          <div>
            {cartItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '15px',
                background: '#f7f8fa',
                marginBottom: '15px',
                gap: '20px'
              }}>
                {/* ITEM IMAGE */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#e9ebee',
                  flexShrink: 0
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#8a8d91' }}>
                      📦
                    </div>
                  )}
                </div>

                {/* ITEM INFO */}
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 5px', fontSize: '18px', color: '#1c1e21' }}>
                    {item.title || "Product Name"}
                  </h4>
                  <p style={{ margin: '0', fontSize: '16px', color: '#1877f2', fontWeight: '600' }}>
                    ₱{item.price || "0.00"}
                  </p>
                </div>

                {/* REMOVE BUTTON */}
                <button 
                  onClick={() => handleRemove(index)}
                  style={{
                    background: '#e41e3f',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#d41b39'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#e41e3f'}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* CHECKOUT BUTTON */}
            <div style={{ 
              marginTop: '30px', 
              paddingTop: '25px', 
              borderTop: '1px solid #dadde1',
              textAlign: 'right'
            }}>
              <button style={{
                background: '#42b72a',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(66, 183, 42, 0.2)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#36a420'}
              onMouseOut={(e) => e.currentTarget.style.background = '#42b72a'}
              >
                ✅ Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING CHAT BUTTON */}
      <div 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: '#2c3e50',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
          transition: 'transform 0.2s, background 0.2s'
        }}
        onClick={() => navigate('/chat')}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.background = '#1e2a38';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = '#2c3e50';
        }}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
      </div>
    </div>
  );
}