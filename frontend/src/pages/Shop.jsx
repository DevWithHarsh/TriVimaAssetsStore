import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';
import SearchBar from '../components/SearchBar';

function Shop() {
  const { products, search, showSearch } = useContext(ShopContext);
  const [Products, setProducts] = useState([]);

  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  };

  useEffect(() => {
      let filtered = products;
  
      if (showSearch && search) {
        filtered = filtered.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }
  
      setProducts(filtered); // Only top 10
    }, [products, search, showSearch]);
  
  useEffect(() => {
    applyFilter();
  }, [search, showSearch, products]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      
      {/* RIGHT SIDE - PRODUCT LISTING */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <p className='font-bold'>ALL PRODUCT</p>
        </div>

        {/* PRODUCT GRID */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            Products.map((item, index) => (
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

export default Shop;
