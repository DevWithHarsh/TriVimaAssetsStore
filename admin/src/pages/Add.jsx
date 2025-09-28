import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // ZIP file states
  const [zipFile, setZipFile] = useState(null);
  const [zipFileType, setZipFileType] = useState('upload');
  const [driveLink, setDriveLink] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('Antique & Spiritual Collection');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  
  // ✅ Add tag state
  const [tag, setTag] = useState('hotNew');

  const subCategories = {
    "Antique & Spiritual Collection": [
      "Radha Krishna Idols & Frames",
      "Buddha Statues",
      "Golden/Brass Idols",
      "Tribal Musician Statues",
      "Angel & Divine Figures",
      "Couple & Family Figurines"
    ],
    "Showpieces & Décor": [
      "Horse & Elephant Figurines",
      "Globe & Antique Models",
      "Swan Pair & Love Figurines",
      "Hourglass & Vintage Items",
      "Evil Eye (Nazar Suraksha) Décor",
      "Miniature Stools/Tables"
    ],
    "Wall & Home Decoration": [
      "Wall Paintings & Frames (Tree of Life, Modern, Spiritual)",
      "Wall Clocks",
      "Designer Wall Panels & Wallpapers",
      "Hanging Lights & Ceiling Lamps",
      "Quote Frames & Motivational Décor"
    ],
    "Soft Furnishings": [
      "Cushion Covers",
      "Table Cloths",
      "Curtains",
      "Sofa Throws & Mats (future add-ons possible)"
    ],
    "Artificial Flowers & Plants": [
      "Sunflowers",
      "Roses & Mixed Flowers",
      "Decorative Flower Bunches",
      "Potted Artificial Plants",
      "Fancy Flower Vases"
    ],
    "Festive & Pooja Décor": [
      "Hanging Garlands (Phool Mala, Toran)",
      "Decorative Diyas & Candle Holders",
      "Pooja Thalis & Temple Décor Items",
      "Religious Wall Hangings"
    ],
    "Interior Designing Services": [
      "Home Interior Designing",
      "Office/Shop Designing",
      "Customized Decoration Solutions"
    ]
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('cost', cost);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('zipFileType', zipFileType);
      formData.append('tag', tag); // ✅ Add tag to form data

      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      // Handle ZIP file based on type
      if (zipFileType === 'upload' && zipFile) {
        formData.append('zipFile', zipFile);
      } else if (zipFileType === 'drive_link' && driveLink) {
        formData.append('driveLink', driveLink);
      }

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setCost('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setBestseller(false);
        setSubCategory('');
        setZipFile(null);
        setDriveLink('');
        setZipFileType('upload');
        setTag('hotNew'); // Reset tag
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add Product Error:', error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((img, index) => (
            <label htmlFor={`image${index + 1}`} key={index}>
              <img
                className="w-20 h-20 object-cover border cursor-pointer"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                type="file"
                hidden
                id={`image${index + 1}`}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (index === 0) setImage1(file);
                  if (index === 1) setImage2(file);
                  if (index === 2) setImage3(file);
                  if (index === 3) setImage4(file);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* 3D Asset File Upload Section */}
      <div className="w-full border p-4 rounded bg-gray-50">
        <h3 className="text-lg font-medium mb-3">3D Asset File</h3>
        
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="upload"
              checked={zipFileType === 'upload'}
              onChange={(e) => setZipFileType(e.target.value)}
            />
            Upload ZIP File
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="drive_link"
              checked={zipFileType === 'drive_link'}
              onChange={(e) => setZipFileType(e.target.value)}
            />
            Google Drive Link
          </label>
        </div>

        {zipFileType === 'upload' ? (
          <div>
            <p className="mb-2">Upload 3D Model ZIP File</p>
            <input
              type="file"
              accept=".zip,.rar,.7z"
              onChange={(e) => setZipFile(e.target.files[0])}
              className="w-full border px-3 py-2"
            />
            {zipFile && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-2">Google Drive Shareable Link</p>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full border px-3 py-2"
            />
          </div>
        )}
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category + Subcategory + Price + Cost */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory('');
            }}
            value={category}
            className="px-3 py-2 border"
          >
            {Object.keys(subCategories).map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="px-3 py-2 border"
          >
            <option value="">Select Subcategory</option>
            {subCategories[category].map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="px-3 py-2 border w-[120px]"
            type="number"
            placeholder="25"
            required
          />
        </div>

        <div>
          <p className="mb-2">Product Cost</p>
          <input
            onChange={(e) => setCost(e.target.value)}
            value={cost}
            className="px-3 py-2 border w-[120px]"
            type="number"
            placeholder="15"
            required
          />
        </div>
      </div>

      {/* ✅ Featured Tag Selection */}
      <div className="w-full">
        <p className="mb-2">Featured Category Tag</p>
        <select
          onChange={(e) => setTag(e.target.value)}
          value={tag}
          className="px-3 py-2 border"
        >
          <option value="hotNew">🔥 Hot & New</option>
          <option value="mostPopular">💖 Most Popular</option>
          <option value="topBundles">📦 Top Bundles</option>
          <option value="startHere">👍 Start Here</option>
        </select>
      </div>

      {/* Bestseller */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to bestseller
        </label>
      </div>

      {/* Submit */}
      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white rounded">
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;