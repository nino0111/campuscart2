import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  X, 
  ShoppingBag, 
  ChevronRight, 
  MapPin,
  Info
} from "lucide-react";
import '../styles/Home.css';

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("fixed");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];
    const uploadedUrls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "campus_cart_upload");
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/drlzujtqq/image/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error(err);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first");
    setLoading(true);
    
    const urls = await uploadImages();

    try {
      await addDoc(collection(db, "listings"), {
        title,
        description,
        price: Number(price),
        type,
        images: urls,
        createdAt: Timestamp.now(),
        userId: user.uid,
        location: "Angeles City, Pampanga" // Default
      });

      alert("Listing created successfully!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error creating listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container" style={{ background: '#F0F2F5' }}>
      {/* Navbar */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/home" className="nav-item" style={{ background: '#F1F5F9', borderRadius: '50%', padding: '8px' }}>
            <X size={20} />
          </Link>
          <div style={{ background: '#2D3494', padding: 6, borderRadius: 8, display: 'flex' }}>
            <ShoppingBag size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#2D3494' }}>CampusCart</span>
        </div>
        <div className="nav-links">
           <span style={{ color: '#64748B', fontSize: 14 }}>Drafts saved automatically</span>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        
        {/* LEFT SIDE: INPUT FORM */}
        <aside style={{ 
          width: '400px', 
          background: 'white', 
          padding: '24px', 
          boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
          overflowY: 'auto',
          height: 'calc(100vh - 70px)',
          position: 'sticky',
          top: '70px'
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Item for sale</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
             <img src={user?.photoURL || "https://placehold.co/40x40"} style={{ borderRadius: '50%', width: 36 }} alt="user" />
             <div>
               <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.displayName || "Campus User"}</div>
               <div style={{ fontSize: 12, color: '#65676B' }}>Listing to Marketplace</div>
             </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Image Upload Area */}
            <div 
              className="file-upload-zone"
              style={{
                border: '2px dashed #E4E6EB',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div style={{ background: '#F0F2F5', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <ImageIcon size={20} />
              </div>
              <div style={{ fontWeight: 600 }}>Add Photos</div>
              <div style={{ fontSize: 12, color: '#65676B' }}>or drag and drop</div>
              <input id="file-input" type="file" multiple onChange={handleImageChange} hidden />
            </div>

            {/* Preview Thumbnails */}
            <div className="image-preview-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {previews.map((src, index) => (
                <div key={index} className="preview-box" style={{ width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" className="delete-btn" onClick={() => removeImage(index)} style={{ top: -5, right: -5 }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: 15 }}>
              <input className="modern-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 15 }}>
              <input className="modern-input" type="number" placeholder="Price (₱)" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 15 }}>
              <select className="modern-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="fixed">Fixed Price</option>
                <option value="bid">Open for Bid</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <textarea className="modern-input" style={{ height: '120px', padding: '12px' }} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', borderRadius: '8px' }}>
              {loading ? "Publishing..." : "Post Listing"}
            </button>
          </form>
        </aside>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <main style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ width: '100%', maxWidth: '900px', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', display: 'flex' }}>
            
            {/* Preview Image Area */}
            <div style={{ flex: 1.5, background: '#F0F2F5', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {previews.length > 0 ? (
                <img src={previews[0]} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Main preview" />
              ) : (
                <div style={{ textAlign: 'center', color: '#65676B' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>Your listing preview</div>
                  <p>As you create your listing, you can preview how it will appear to others.</p>
                </div>
              )}
            </div>

            {/* Preview Info Area */}
            <div style={{ flex: 1, padding: '24px', borderLeft: '1px solid #E4E6EB' }}>
               <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>{title || "Title"}</h2>
               <div style={{ fontSize: 18, fontWeight: 600, color: '#059669' }}>₱{price ? Number(price).toLocaleString() : "Price"}</div>
               <div style={{ fontSize: 13, color: '#65676B', margin: '8px 0 20px' }}>Listed just now in Angeles City</div>
               
               <hr style={{ border: 'none', borderTop: '1px solid #E4E6EB', margin: '20px 0' }} />
               
               <div style={{ fontWeight: 600, marginBottom: 8 }}>Details</div>
               <div style={{ fontSize: 14, color: '#1C1E21', whiteSpace: 'pre-wrap', minHeight: '100px' }}>
                 {description || "Description will appear here."}
               </div>

               <hr style={{ border: 'none', borderTop: '1px solid #E4E6EB', margin: '20px 0' }} />
               
               <div style={{ fontWeight: 600, marginBottom: 12 }}>Seller information</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <img src={user?.photoURL || "https://placehold.co/40x40"} style={{ borderRadius: '50%', width: 40 }} alt="seller" />
                 <div style={{ fontWeight: 600 }}>{user?.displayName || "Campus User"}</div>
               </div>

               <button style={{ width: '100%', marginTop: '30px', padding: '12px', borderRadius: '8px', border: 'none', background: '#E4E6EB', color: '#bcc0c4', fontWeight: 600, cursor: 'not-allowed' }}>
                 Message
               </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}