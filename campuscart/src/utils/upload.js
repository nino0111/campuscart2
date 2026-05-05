import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "campus_cart_upload");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/drlzujtqq/image/upload",
    formData
  );

  return res.data.secure_url;
};