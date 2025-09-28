import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ManageStock = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (err) {
      toast.error("Error fetching products");
    }
  };

  // Load product list on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const prod = products.find((p) => p._id === selectedProductId);
    setSelectedProduct(prod);
  }, [selectedProductId]);

  const updateStock = async (type) => {
    if (!selectedProductId || !quantity || isNaN(quantity)) {
      toast.error("Please select a product and enter a valid quantity");
      return;
    }

    const endpoint =
      type === "add"
        ? `${backendUrl}/api/product/add-stock`
        : `${backendUrl}/api/product/remove-stock`;

    try {
      const response = await axios.post(
        endpoint,
        { id: selectedProductId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setQuantity("");
        fetchProducts(); // refresh updated stock
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Stock update failed");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6">Manage Product Stock</h2>

      {/* Product Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Select Product
        </label>
        <select
          className="w-full border px-4 py-2 rounded"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Stock */}
      {selectedProduct && (
        <p className="mb-4 text-gray-700">
          Current Stock:{" "}
          <span className="font-bold">{selectedProduct.stock}</span>
        </p>
      )}

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Quantity to Add / Remove
        </label>
        <input
          type="number"
          className="w-full border px-4 py-2 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 10"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => updateStock("add")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Add Stock
        </button>
        <button
          onClick={() => updateStock("remove")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
        >
          Remove Stock
        </button>
      </div>
    </div>
  );
};

export default ManageStock;
