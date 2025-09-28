import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import ManageStock from "./pages/ManageStock";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import AddCoupon from "./pages/AddCoupon";
import ListCoupons from "./pages/ListCoupons";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹'

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full px-4 md:px-8 my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Navigate to="/list" />} />{" "}
                {/* ✅ Add this */}
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/manage-stock" element={<ManageStock token={token} />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/add-coupon" element={<AddCoupon token={token} />} />
                <Route path="/list-coupons" element={<ListCoupons token={token} />} />

              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
