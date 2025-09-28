import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';
import SearchBar from '../components/SearchBar';

function Collection() {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  // Dynamic Subcategories based on Category
  const subcategoryMap = {
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


  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    const sorted = [...filterProducts];
    switch (sortType) {
      case 'low-high':
        setFilterProducts(sorted.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(sorted.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* FILTERS */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="dropdown" />
        </p>

        {/* CATEGORY FILTER */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {Object.keys(subcategoryMap).map((cat, i) => (
              <label key={i} className='flex gap-2'>
                <input className='w-3' type="checkbox" value={cat} onChange={toggleCategory} />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* SUBCATEGORY FILTER */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {category.length === 0
              ? Object.values(subcategoryMap).flat().map((sub, i) => (
                  <label key={i} className='flex gap-2'>
                    <input className='w-3' type="checkbox" value={sub} onChange={toggleSubCategory} />
                    {sub}
                  </label>
                ))
              : category
                  .map(cat => subcategoryMap[cat] || [])
                  .flat()
                  .map((sub, i) => (
                    <label key={i} className='flex gap-2'>
                      <input className='w-3' type="checkbox" value={sub} onChange={toggleSubCategory} />
                      {sub}
                    </label>
                  ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - PRODUCT LISTING */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <p className='font-bold'>ALL COLLECTIONS</p>
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={Array.isArray(item.image) ? item.image[0] : item.image}
                stock={item.stock}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Collection;
