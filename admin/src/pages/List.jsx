import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <p className="text-3xl font-bold mb-6 text-gray-800">All Products List</p>

      <div className="flex flex-col gap-4 w-full">
        {/* Header Row (Hidden on Mobile) */}
        <div className="hidden md:grid w-full grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-3 px-5 border rounded-lg bg-gray-100 text-sm text-gray-700 font-semibold shadow-sm">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>


        {/* Product Rows */}
        {list.map((item, index) => (
          <div
            key={index}
            className="w-full grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4 py-4 px-5 border rounded-xl bg-white shadow-sm text-sm text-gray-800 hover:shadow-md transition-all duration-200"
          >
            <img
              className="w-14 h-14 object-cover rounded-md border"
              src={item.image[0]}
              alt={item.name}
            />
            <p className="truncate font-medium">{item.name}</p>
            <p className="hidden md:block text-gray-600">{item.category}</p>
            <p className="hidden md:block text-gray-600">{item.stock}</p>
            <p className="hidden md:block text-gray-600 font-semibold whitespace-nowrap">
              {currency}
              {item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center text-red-500 hover:text-red-600 cursor-pointer text-xl font-bold"
              title="Delete"
            >
              ×
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
