import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="min-h-screen px-6 py-10 font-sans text-[#6a4432]">
      {/* Outer container aligned like About Us */}
      <div className="max-w-5xl px-10 mx-auto">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-[#a24e3c] mb-6">Contact Us</h1>

        {/* Image + Info Block */}
        <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
          
          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src={assets.contact_img}
              alt="Contact Desk"
              className="w-full rounded-xl shadow-md object-cover"
            />
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2">
            <p className="text-base mb-6">
              Email: <a href="mailto:admin@forever.com" className="underline">Info@dharmadristi.com</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
