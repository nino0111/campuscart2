import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ IMPORTANT
import { Link } from "react-router-dom";
import '../styles/Home.css';

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("fixed");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const auth = getAuth();
  const user = auth.currentUser; // ✅ Get current user

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
    const urls = await uploadImages();

    try {
      await addDoc(collection(db, "listings"), {
        title,
        description,
        price: Number(price),
        type,
        images: urls,
        createdAt: Timestamp.now(),
        userId: user.uid // ✅ SAVE USER ID SO YOU CAN DELETE IT
      });

      alert("Listing created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setType("fixed");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      alert("Error creating listing");
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/listings">Listings</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="profile-icon">
          <img src="https://placehold.co/40x40" alt="Profile" />
        </div>
      </nav>

      <div className="content">
        <h2 className="logo-text">Create Listing</h2>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            
            <label>Product Images</label>
            <div className="file-upload">
              <label htmlFor="file-input" className="file-label">Choose Files</label>
              <input id="file-input" type="file" multiple onChange={handleImageChange} />
            </div>

            <div className="image-preview-container">
              {previews.map((src, index) => (
                <div key={index} className="preview-box">
                  <img src={src} alt={`preview ${index}`} />
                  <button type="button" className="delete-btn" onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>

            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label>Price (₱)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="fixed">Fixed Price</option>
              <option value="bid">Open for Bid</option>
            </select>

            <button type="submit" className="submit-btn">Post Listing</button>
          </form>
        </div>
      </div>
    </div>
  );
}